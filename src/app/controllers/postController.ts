import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'

const router: Router = express.Router()
router.use(authMiddleware)

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true })
})

export default (app: Express) => app.use('/posts', router)
