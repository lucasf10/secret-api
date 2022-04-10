import PostType from 'src/app/types/Post'
import UserType from 'src/app/types/User'
import supertest from 'supertest'
import { app } from '../../index'
import Post from '@models/post'
import CommentType from 'src/app/types/Comment'
import Comment from '@models/comment'
import { Types } from 'mongoose'
import {
  NEW_USER_DATA_1,
  NEW_USER_DATA_2,
  NEW_POST_DATA_1,
  NEW_POST_DATA_2,
  NEW_POST_DATA_3
} from '../utils/constants'

const request = supertest(app)

describe('Comments API test', () => {
  let token: string
  let token2: string
  let user1: UserType
  let post: PostType
  let comment: CommentType

  beforeAll(async () => {
    const resUser1 = await request.post('/auth/register').send(NEW_USER_DATA_1)
    const resUser2 = await request.post('/auth/register').send(NEW_USER_DATA_2)
    user1 = resUser1.body.user
    token = resUser1.body.token
    token2 = resUser2.body.token

    post = await Post.create({ ...NEW_POST_DATA_1, createdBy: user1._id, city: 'Vila Velha' })
  })

  describe('POST /comment', () => {
    it('should create a comment', async () => {
      const res = await request
        .post('/comment')
        .send({
          text: 'Text',
          post: post._id
        })
        .set('Authorization', `Bearer ${token}`)
      const updatedPost = await Post.findById(post._id)
      comment = res.body.comment

      expect(res.status).toBe(201)
      expect(comment._id).not.toBeUndefined()
      expect(comment.text).toEqual('Text')
      expect(comment.likedBy).toEqual([])
      expect(updatedPost.comments).toContainEqual(new Types.ObjectId(comment._id))
    })
  })

  describe('POST /comment/:commentId/like', () => {
    it('should like a comment', async () => {
      const res = await request
        .post(`/comment/${comment._id}/like`)
        .set('Authorization', `Bearer ${token}`)
      const updatedComment = await Comment.findById(comment._id)
      expect(res.status).toBe(204)
      expect(updatedComment.likedBy).toHaveLength(1)
      expect(updatedComment.likedBy).toContainEqual(new Types.ObjectId(user1._id))
    })

    it('should not be allowed to like a comment twice', async () => {
      const res = await request
        .post(`/comment/${comment._id}/like`)
        .set('Authorization', `Bearer ${token}`)
      const updatedComment = await Comment.findById(comment._id)
      expect(res.status).toBe(400)
      expect(updatedComment.likedBy).toHaveLength(1)
    })
  })

  describe('POST /comment/:commentId/dislike', () => {
    it('should not be allowed to dislike a comment that was not liked by the user', async () => {
      const res = await request
        .post(`/comment/${comment._id}/dislike`)
        .set('Authorization', `Bearer ${token2}`)
      const updatedComment = await Comment.findById(comment._id)
      expect(res.status).toBe(400)
      expect(updatedComment.likedBy).toHaveLength(1)
    })

    it('should dislike a comment', async () => {
      const res = await request
        .post(`/comment/${comment._id}/dislike`)
        .set('Authorization', `Bearer ${token}`)
      const updatedComment = await Comment.findById(comment._id)
      expect(res.status).toBe(204)
      expect(updatedComment.likedBy).toHaveLength(0)
    })
  })

  describe('DELETE /comment/:commentId', () => {
    it('should not delete a comment created by another user', async () => {
      const res = await request
        .delete(`/comment/${comment._id}`)
        .set('Authorization', `Bearer ${token2}`)
      const commentWasDeleted = !(await Comment.findById(comment._id))
      expect(res.status).toBe(400)
      expect(commentWasDeleted).toBe(false)
    })

    it('should delete a comment', async () => {
      const res = await request
        .delete(`/comment/${comment._id}`)
        .set('Authorization', `Bearer ${token}`)
      const commentWasDeleted = !(await Comment.findById(comment._id))
      expect(res.status).toBe(204)
      expect(commentWasDeleted).toBe(true)
    })
  })
})
