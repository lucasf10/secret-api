import mongoose from '@database/index'
import bcrypt from 'bcryptjs'
import { Schema } from 'mongoose'

import UserType from '../types/User'

const UserSchema: Schema = new mongoose.Schema<UserType>({
  username: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash

  next()
})

const User = mongoose.model<UserType>('User', UserSchema)

export default User
