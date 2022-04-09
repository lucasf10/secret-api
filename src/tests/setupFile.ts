import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { server } from '../index'

let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const dbUrl = mongod.getUri()
  await mongoose.connect(dbUrl, {})
})

afterAll(async () => {
  await mongod.stop()
  await mongoose.connection.close()
  server.close()
})
