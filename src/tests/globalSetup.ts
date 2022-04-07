import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

export default async () => {
  const mongod = await MongoMemoryServer.create()
  const dbUrl = mongod.getUri()
  await mongoose.connect(dbUrl, {})

  global.__MONGOD__ = mongod
}
