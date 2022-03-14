import express, { Request, Response, Router, Express } from 'express'
import bcrypt from 'bcryptjs'

import User from '@models/user'
import UserType from '../types/User'
import { generateToken } from '../utils/auth'

const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username } = req.body

    if (await User.exists({ username: username }))
      return res.status(422).send({ error: 'This username is already taken.' })

    const user: UserType = await User.create(req.body)
    user.password = undefined

    return res.status(201).send({ user, token: generateToken({ id: user.id }) })
  } catch (err) {
    console.error(err)
    return res.status(400).send({ error: 'Registration failed' })
  }
})

router.post('/authenticate', async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body
  const user: UserType = await User.findOne({ username }).select('+password')

  if (!user)
    return res.status(400).send({ error: 'User not found' })

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password' })

  user.password = undefined

  return res.status(200).send({ user, token: generateToken({ id: user.id }) })
})

export default (app: Express) => app.use('/auth', router)
