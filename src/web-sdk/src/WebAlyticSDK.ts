/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
enum METHOD {
  create = 'create',
  send = 'send'
}

interface ConfigWebAlyticSDK {
  resourceId: string
  apiUrl: string
}

enum HitType {
  PAGEVIEW = 'pageview',
  EVENT = 'event'
}

interface SendInput {
  hitType: HitType
  category?: string
  action?: string
  label?: string
  value?: string
}

const { location, screen } = window

export default class WebAlyticSDK {
  private isInitialized = false

  private config: ConfigWebAlyticSDK

  private getCookie(cname: string) {
    const name = `${cname}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) { return c.substring(name.length, c.length) }
    }
    return ''
  }

  private getTopHost() {
    const domainsWithZoneBehaviors = ['msk.ru', 'com.br']
    let result = location.hostname
    const hostnameSplit = location.hostname.split('.')

    if (hostnameSplit.length > 2) {
      result = location.hostname.split('.').reverse().slice(0, 2).reverse()
        .join('.')
      // eslint-disable-next-line no-bitwise
      if (~domainsWithZoneBehaviors.indexOf(result)) {
        result = location.hostname.split('.').reverse().slice(0, 3).reverse()
          .join('.')
      }
    }
    return result
  }

  private setCookie(cname: string, cvalue: string) {
    const d = new Date()
    d.setTime(d.getTime() + (10 * 365 * 24 * 60 * 60 * 1000))
    const expires = `expires=${d.toUTCString()}`
    document.cookie = `${cname}=${cvalue};${expires};domain=${this.getTopHost()};path=/;SameSite=None;Secure`
  }

  private generatreUID() {
    return (`${1e7}${-1e3}${-4e3}${-8e3}${-1e11}`)
      .replace(/1|0/g, () =>
        // eslint-disable-next-line no-bitwise
        (0 | Math.random() * 16).toString(16))
      .replace(/-/g, '')
  }

  private findOrCreateUID() {
    const cname = '_wbltc.uid'
    let uid = this.getCookie(cname)
    if (!uid || uid.length !== 32) {
      uid = this.generatreUID()
      this.setCookie(cname, uid)
    }
    return uid
  }

  private getCustomDimensionsAndMetrics(params) {
    return Object.keys(params)
      .filter((key) =>
        /^(dimension|metric)([1-9]|[1-9][0-9]|[1][0-9][0-9])$/.test(key)).map((key) =>
        [
          key.replace('dimension', 'cd').replace('metric', 'cm'),
          params[key]
        ].join('='))
  }

  private sendPostRequest(query, body?) {
    query.push(`cid=${this.findOrCreateUID()}`)
    query.push(`tid=${this.config.resourceId}`)
    query.push(`z=${Math.random()}`)
    query.push(`sr=${[screen.width, screen.height].join('x')}`)
    query.push('ds=sdk')

    const url = [
      this.config.apiUrl,
      '/collect',
      '?',
      query.join('&')
    ].join('')

    if (window.navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body || {})], { type: 'text/plain' })
      window.navigator.sendBeacon(url, blob)
    } else {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.withCredentials = true
      const data = JSON.stringify(body)
      xhr.send(data)
    }
  }

  create(config: ConfigWebAlyticSDK):void{
    if (!config.apiUrl) throw new TypeError('WebAlyticSDK: Init must set api url')
    if (!config.resourceId) throw new TypeError('WebAlyticSDK: Init must set resourceId')
    if (this.isInitialized) throw new Error('WebAlyticSDK: WebAlyticSDK already init')

    this.config = config
    this.isInitialized = true
  }

  send(data: SendInput):void{
    switch (data.hitType) {
    case HitType.PAGEVIEW:
      this.pageview(data)
      break
    case HitType.EVENT:
      this.event(data)
      break
    default:
      break
    }
  }

  private pageview(params) {
    const url = encodeURIComponent(document.URL)
    const referrer = encodeURIComponent(document.referrer)

    this.sendPostRequest(
      [
        't=pageview',
        `dl=${url}`,
        `dr=${referrer}`
      ].concat(this.getCustomDimensionsAndMetrics(params || []))
    )
  }

  private event(params) {
    this.sendPostRequest(
      [
        't=event',
        `ec=${params.category}`,
        `ea=${params.action}`,
        `el=${params.label}`,
        `ev=${params.value}`
      ].concat(this.getCustomDimensionsAndMetrics(params))
    )
  }

  push(method: METHOD, options: any): void {
    try {
      this[method](options)
    } catch (err) {
      console.error(err)
    }
  }
}
