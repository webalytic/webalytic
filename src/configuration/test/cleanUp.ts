import { Dependencies } from '../src/container'

export default async (deps: Dependencies): Promise<void> => {
  const {
    ResourceModel,
    CustomDefinitionModel
  } = deps

  const destroyOptions = { where: {} }

  await CustomDefinitionModel.destroy(destroyOptions)
  await ResourceModel.destroy(destroyOptions)
}
