import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'

mongoose.Promise = global.Promise
dotenv.config()

export const connectDB = async () => {
  try {
    const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env
    const options: ConnectOptions = {}
    const dbUrl = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

    await mongoose.connect(dbUrl, options)
  } catch (err) {
    console.error(err)
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
  } catch (err) {
    console.error(err)
  }
}
