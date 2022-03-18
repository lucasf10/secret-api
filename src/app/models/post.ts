import mongoose from '@database/index'
import { Schema } from 'mongoose'

import PostType from '../types/Post'
import { LocationSchema } from './common'

const PostSchema: Schema = new mongoose.Schema<PostType>({
  text: {
    type: String,
    required: true
  },
  location: {
    type: LocationSchema,
    required: true
  },
  city: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likeAmount: {
    type: Number,
    default: 0
  },
  colorCode: {
    type: String,
    default: '#000000'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model<PostType>('Post', PostSchema)

export default Post
