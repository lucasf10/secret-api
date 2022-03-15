import express, { Request, Response, Router, Express } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import mailer from '../../modules/mailer'

import User from '@models/user'
import UserType from '../types/User'
import { generateToken } from '../utils/auth'

const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email } = req.body

    if (await User.exists({ email }))
      return res.status(422).send({ error: 'This e-mail is already taken.' })

    if (await User.exists({ username }))
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

  console.log(user.id)

  return res.status(200).send({ user, token: generateToken({ id: user.id }) })
})

router.post('/forgot_password', async (req: Request, res: Response): Promise<Response> => {
  const { username } = req.body

  try {
    const user: UserType = await User.findOne({ username })

    if (!user)
      return res.status(400).send({ error: 'User not found' })

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })

    mailer.sendMail({
      to: user.email,
      from: 'lucas@test.com',
      template: 'auth/forgot_password',
      context: { token }
    }, (err) => {
      console.log(err)
      if (err) return res.status(400).send({ error: 'Cannot send forgot password email.' })
      return res.send()
    })
  } catch (err) {
    return res.status(400).send({ error: 'Error on forgot password, try again.' })
  }
})

router.post('/reset_password', async (req: Request, res: Response): Promise<Response> => {
  const { username, token, password } = req.body

  try {
    const user: UserType = await User.findOne({ username })
      .select('+passwordResetToken passwordResetExpires')

    if (!user)
      return res.status(400).send({ error: 'User not found.' })

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token invalid.' })

    const now = new Date()

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired, get a new one.' })

    user.password = password
    await user.save()

    return res.status(200).send()
  } catch (err) {
    return res.status(400).send({ error: 'Cannot reset password, try again.' })
  }
})

export default (app: Express) => app.use('/auth', router)
