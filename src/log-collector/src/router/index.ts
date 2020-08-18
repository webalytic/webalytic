/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import { Dependencies } from '../container'
import { Request, Response } from '../types'

export default function createRouter({ mainController, sdkController }: Dependencies): express.Router {
  const router = express.Router()

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', 'true')

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization')
    try {
      if (req.method === 'OPTIONS') res.end()
      else next()
    } catch (err) {
      next(err)
    }
  })

  router.get('/', (req: Request, res: Response) => {
    mainController.index(req, res)
  })

  router.get('/sdk.js', (req: Request, res: Response) => {
    sdkController.sdk(req, res)
  })

  const collectHandler = (req: Request, res: Response) =>
    mainController.collect(req, res)

  router.get('/collect', collectHandler)
  router.post('/collect', collectHandler)

  return router
}
