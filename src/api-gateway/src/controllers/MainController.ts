import { Request, Response } from '../types'

export default class MainController {
  index(req: Request, res: Response): void {
    res.write('OK')
    res.end()
  }
}
