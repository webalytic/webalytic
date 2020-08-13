import { readFileSync } from 'fs'
import UglifyJS from 'uglify-js'

import { Request, Response } from '../types'

const script = UglifyJS
  .minify(readFileSync(`${__dirname}/../sdk/sdk.js`).toString())
  .code

export default class SdkController {
  async sdk(req: Request, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'application/javascript')
    res.setHeader('Content-Length', Buffer.byteLength(script))
    res.setHeader('Cache-Control', `public, max-age=${2 * 60 * 60}`)

    res.write(script)
    res.end()
  }
}
