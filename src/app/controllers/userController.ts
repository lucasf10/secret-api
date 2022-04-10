import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'
import User from '@models/user'

const router: Router = express.Router()
router.use(authMiddleware)

router.post('/:userId/set_firebase_token', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firebaseToken } = req.body

    await User.updateOne(
      { _id: req.params.userId },
      { $set: { firebaseToken } }
    )

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error setting firebase token.' })
  }
})

export default (app: Express) => app.use('/users', router)
