import mongoose, { Schema } from 'mongoose'

import CommentType from '../types/Comment'

const CommentSchema: Schema = new mongoose.Schema<CommentType>({
  text: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const Comment = mongoose.model<CommentType>('Comment', CommentSchema)

export default Comment
