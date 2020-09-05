/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/ban-types */

import WebAlyticSDK from './WebAlyticSDK'

declare global {

  interface Window {
    WebAlyticObject: string

    WebAlyticSDK: Function | []
  }
}

(function (w) {
  const varName = w.WebAlyticObject
  const webAlyticSDK = new WebAlyticSDK()
  const isArray = function (arr: any) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  if (w[varName] && isArray(w[varName].q)) {
    for (let i = 0; i < (w[varName].q as []).length; i += 1) {
      const [method, options] = w[varName].q[i]
      webAlyticSDK.push(method, options)
    }
  }
  window.WebAlyticSDK = webAlyticSDK.push.bind(webAlyticSDK)
}(window))
