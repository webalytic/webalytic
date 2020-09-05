import { readFileSync } from 'fs'
import UglifyJS from 'uglify-js'

import { Request, Response } from '../types'

const scripts = {
  sdk: UglifyJS
    .minify(readFileSync(`${__dirname}/../sdk/sdk.js`).toString())
    .code,
  webalytic: UglifyJS
    .minify(readFileSync(`${__dirname}/../sdk/webalytic.js`).toString())
    .code
}

export default class SdkController {
  async sdk(req: Request, res: Response): Promise<void> {
    this.sendScript(req, res, scripts.sdk)
  }

  async webalytic(req: Request, res: Response): Promise<void> {
    this.sendScript(req, res, scripts.webalytic)
  }

  private sendScript(req: Request, res: Response, script: string) {
    res.setHeader('Content-Type', 'application/javascript')
    res.setHeader('Content-Length', Buffer.byteLength(script))
    res.setHeader('Cache-Control', `public, max-age=${2 * 60 * 60}`)

    res.write(script)
    res.end()
  }
}
