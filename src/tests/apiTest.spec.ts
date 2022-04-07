import supertest from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../index'

import { MongoMemoryServer } from 'mongodb-memory-server'

const request = supertest(app)
let mongod: MongoMemoryServer

describe('API test', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const dbUrl = mongod.getUri()
    await mongoose.connect(dbUrl, {})
  })

  afterAll(async () => {
    await mongoose.connection.close()
    await mongod.stop()
    server.close()
  })

  describe('GET /', () => {
    it('should check that the server is up', async () => {
      const res = await request.get('/')

      expect(res.status).toBe(200)
    })
  })
})
