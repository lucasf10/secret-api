import express, { Request, Response, Router, Express } from 'express'

import User from '@models/user'
import UserType from '../types/User'

const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username } = req.body

    if (await User.exists({ username: username })) { return res.status(422).send({ error: 'This username is already taken.' }) }

    const user: UserType = await User.create(req.body)
    return res.status(201).send({ user })
  } catch (err) {
    console.error(err)
    return res.status(400).send({ error: 'Registration failed' })
  }
})

export default (app: Express) => app.use('/auth', router)
