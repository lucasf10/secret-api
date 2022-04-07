import mongoose from 'mongoose'

export default async () => {
  await mongoose.connection.close()
  await global.__MONGOD__.stop()
}
