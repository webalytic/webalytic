/* eslint-disable camelcase */

import { custom_definition } from '@webalytic/ms-tools/shared/configuration/custom_definition_service'
import AddHitInput, { addHitInputValidate } from '../inputs/AddHitInput'
import { Dependencies } from '../container'
import Parser from '../utils/Parser'
import SessionRepository from '../infra/SessionRepository'
import Session from '../entities/Session/Session'

import ConfigurationService from './ConfigurationService'

export default class Service {
  private parser: Parser

  private sessionRepository: SessionRepository

  private configurationService: ConfigurationService

  constructor(deps: Dependencies) {
    this.parser = deps.parser
    this.sessionRepository = deps.sessionRepository
    this.configurationService = deps.configurationService
  }

  async addHitToSession(data: AddHitInput):Promise<void> {
    addHitInputValidate(data)

    const trafficSource = this.parser.getTrafficSource(
      {
        campaignSource: data.campaignSource,
        campaignName: data.campaignName,
        campaignContent: data.campaignContent,
        campaignKeyword: data.campaignKeyword,
        campaignMedium: data.campaignMedium,
        campaignId: data.campaignId
      },
      data.documentLocation,
      data.documentReferrer
    )

    const {
      sessionControl, hit, resourceId, clientId
    } = data
    let session = await this.sessionRepository.get(resourceId, clientId)

    // ** Extend custom definition be settings
    const customDefinitionByScope = await this.configurationService.extendCustomDefinition(resourceId, hit)
    Object.assign(hit, customDefinitionByScope[custom_definition.CustomDefinitionScope.HIT])

    if (session && !session.shouldBeEnd(trafficSource, sessionControl, hit.type, hit.timestamp)) {
      // ** Update current session
      session.addHit(hit, customDefinitionByScope[custom_definition.CustomDefinitionScope.SESSION])
    } else {
      // ** Create new session
      session = Session.create({
        resourceId: data.resourceId,
        clientId: data.clientId,
        userId: data.userId,
        device: this.parser.getDevice(data.userAgent),
        geoNetwork: await this.parser.getGeoNetwork(data.ip),
        trafficSource,
        ...customDefinitionByScope[custom_definition.CustomDefinitionScope.SESSION]
      }, hit)
    }

    await this.sessionRepository.save(session)
  }
}
