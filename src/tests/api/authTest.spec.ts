import User from '@models/user'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import UserType from 'src/app/types/User'
import supertest from 'supertest'
import { app, server } from '../../index'

const request = supertest(app)
let mongod: MongoMemoryServer

describe('Auth API test', () => {
  const registeredUserData = {
    email: 'registered@mail.com',
    username: 'registered',
    password: '123456'
  }

  const newUserData = {
    username: 'test_user',
    email: 'user@test.com',
    password: 'password'
  }

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const dbUrl = mongod.getUri()
    await mongoose.connect(dbUrl, {})

    User.create(registeredUserData)
  })

  afterAll(async () => {
    await mongod.stop()
    await mongoose.connection.close()
    server.close()
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request.post('/auth/register').send(newUserData)
      const token: string = res.body.token
      const user: UserType = res.body.user

      expect(res.status).toBe(201)
      expect(token).not.toBeNull()
      expect(user.id).not.toBeNull()
      expect(user.createdAt).not.toBeNull()
      expect(user.email).toEqual(newUserData.email)
      expect(user.username).toEqual(newUserData.username)
      expect(user.likedPosts).toEqual([])
    })

    it('should not register a taken username', async () => {
      const res = await request.post('/auth/register').send({
        ...newUserData,
        username: registeredUserData.username
      })

      expect(res.status).toBe(422)
    })

    it('should not register a taken email', async () => {
      const res = await request.post('/auth/register').send({
        ...newUserData,
        email: registeredUserData.email
      })

      expect(res.status).toBe(422)
    })
  })

  describe('POST /auth/authenticate', () => {
    it('should authenticate a user', async () => {
      const res = await request.post('/auth/authenticate').send({
        username: registeredUserData.username,
        password: registeredUserData.password
      })
      const token: string = res.body.token
      const user: UserType = res.body.user

      expect(res.status).toBe(200)
      expect(token).not.toBeNull()
      expect(user.id).not.toBeNull()
      expect(user.createdAt).not.toBeNull()
      expect(user.email).toEqual(registeredUserData.email)
      expect(user.username).toEqual(registeredUserData.username)
    })

    it('should not authenticate an user that does not exist', async () => {
      const res = await request.post('/auth/authenticate').send({
        username: 'not_an_user',
        password: registeredUserData.password
      })

      expect(res.status).toBe(400)
    })

    it('should not authenticate an user with wrong password', async () => {
      const res = await request.post('/auth/authenticate').send({
        username: registeredUserData.username,
        password: 'wrong_password'
      })

      expect(res.status).toBe(400)
    })
  })
})
