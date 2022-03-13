import mongoose from '@database/index'
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

const User = mongoose.model<UserType>('User', UserSchema)

export default User
