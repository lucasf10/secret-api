import User from '@models/user'
import UserType from 'src/app/types/User'
import supertest from 'supertest'
import { app } from '../../index'
import { NEW_USER_DATA_1, NEW_USER_DATA_2 } from '../utils/constants'

const request = supertest(app)

describe('Auth API test', () => {
  beforeAll(async () => {
    User.create(NEW_USER_DATA_2)
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request.post('/auth/register').send(NEW_USER_DATA_1)
      const token: string = res.body.token
      const user: UserType = res.body.user

      expect(res.status).toBe(201)
      expect(token).not.toBeUndefined()
      expect(user._id).not.toBeUndefined()
      expect(user.createdAt).not.toBeUndefined()
      expect(user.email).toEqual(NEW_USER_DATA_1.email)
      expect(user.username).toEqual(NEW_USER_DATA_1.username)
      expect(user.likedPosts).toEqual([])
    })

    it('should not register a taken username', async () => {
      const res = await request.post('/auth/register').send({
        ...NEW_USER_DATA_1,
        username: NEW_USER_DATA_2.username
      })

      expect(res.status).toBe(422)
    })

    it('should not register a taken email', async () => {
      const res = await request.post('/auth/register').send({
        ...NEW_USER_DATA_1,
        email: NEW_USER_DATA_2.email
      })

      expect(res.status).toBe(422)
    })
  })

  describe('POST /auth/authenticate', () => {
    it('should authenticate a user', async () => {
      const res = await request.post('/auth/authenticate').send({
        username: NEW_USER_DATA_2.username,
        password: NEW_USER_DATA_2.password
      })
      const token: string = res.body.token
      const user: UserType = res.body.user

      expect(res.status).toBe(200)
      expect(token).not.toBeUndefined()
      expect(user._id).not.toBeUndefined()
      expect(user.createdAt).not.toBeUndefined()
      expect(user.email).toEqual(NEW_USER_DATA_2.email)
      expect(user.username).toEqual(NEW_USER_DATA_2.username)
    })

    it('should not authenticate an user that does not exist', async () => {
      const res = await request.post('/auth/authenticate').send({
        username: 'not_an_user',
        password: NEW_USER_DATA_2.password
      })

      expect(res.status).toBe(400)
    })

    it('should not authenticate an user with wrong password', async () => {
      const res = await request.post('/auth/authenticate').send({
        username: NEW_USER_DATA_2.username,
        password: 'wrong_password'
      })

      expect(res.status).toBe(400)
    })
  })
})
