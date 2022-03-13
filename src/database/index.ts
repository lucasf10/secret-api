import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'

mongoose.Promise = global.Promise
dotenv.config()

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env
const options: ConnectOptions = {}

mongoose.connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    options
)

export default mongoose
