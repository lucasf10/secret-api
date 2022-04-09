import fs from 'fs'
import path from 'path'
import PostType from 'src/app/types/Post'
import UserType from 'src/app/types/User'
import supertest from 'supertest'
import { app } from '../../index'
import Post from '@models/post'
import User from '@models/user'

const request = supertest(app)

describe('Post API test', () => {
  let token: string
  let token2: string
  let postMadrid: PostType
  let postVV: PostType
  let user1: UserType

  const newPostData = {
    text: 'Text',
    colorCode: 'red',
    location: {
      coordinates: [-20.526171, -40.377800]
    },
    textColor: '#000000'
  }

  const postData1 = {
    text: 'Text 1',
    colorCode: 'red',
    location: {
      coordinates: [40.416775, -3.703790]
    },
    textColor: '#000000'
  }

  const postData2 = {
    text: 'Text 2',
    colorCode: 'green',
    location: {
      coordinates: [-20.526171, -40.377800]
    },
    textColor: '#000000'
  }

  beforeAll(async () => {
    const newUserData1 = {
      username: 'test_user',
      email: 'user@test.com',
      password: 'password'
    }
    const newUserData2 = {
      username: 'test_user_2',
      email: 'mail@test.com',
      password: 'password'
    }
    const resUser1 = await request.post('/auth/register').send(newUserData1)
    const resUser2 = await request.post('/auth/register').send(newUserData2)
    token = resUser1.body.token
    token2 = resUser2.body.token
    user1 = resUser1.body.user

    postMadrid = await Post.create({ ...postData1, createdBy: user1._id, city: 'Madrid' })
    postVV = await Post.create({ ...postData2, createdBy: user1._id, city: 'Vila Velha' })
  })

  describe('POST /posts/', () => {
    it('should create a post with background color', async () => {
      const res = await request
        .post('/posts')
        .send(newPostData)
        .set('Authorization', `Bearer ${token}`)

      const post: PostType = res.body.post

      expect(res.status).toBe(201)
      expect(post._id).not.toBeUndefined()
      expect(post.text).toEqual(newPostData.text)
      expect(post.city).toEqual('Vila Velha')
      expect(post.colorCode).toEqual(newPostData.colorCode)
      expect(post.comments).toEqual([])
      expect(post.likeAmount).toEqual(0)
    })

    it('should create a post with background image', async () => {
      const backgroundImage = fs.readFileSync(
        path.join('./src/tests/assets/images/logo.png'),
        'base64'
      )
      const res = await request
        .post('/posts')
        .send({ ...newPostData, backgroundImage })
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(201)
      expect((res.body.post as PostType).backgroundImage).not.toBeNull()
      expect((res.body.post as PostType).backgroundImage).not.toBeUndefined()
    })
  })

  describe('GET /posts/', () => {
    jest.setTimeout(40000)
    it('should get all posts', async () => {
      const res = await request
        .get('/posts?city=Vila Velha')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body.posts).toHaveLength(3)
    })

    it('should get only 2 posts', async () => {
      const res = await request
        .get('/posts?city=Vila Velha&limit=2')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body.posts).toHaveLength(2)
    })
  })

  describe('GET /posts/:postId', () => {
    it('should get a post', async () => {
      const res = await request
        .get(`/posts/${postMadrid.id}`)
        .set('Authorization', `Bearer ${token}`)

      const post: PostType = res.body.post

      expect(res.status).toBe(200)
      expect(post._id).not.toBeUndefined()
      expect(post.text).toEqual(postMadrid.text)
      expect(post.city).toEqual('Madrid')
      expect(post.colorCode).toEqual(postMadrid.colorCode)
      expect(post.comments).toEqual([])
      expect(post.likeAmount).toEqual(0)
    })
  })

  describe('DELETE /posts/:postId', () => {
    it('should delete a post', async () => {
      const res = await request
        .delete(`/posts/${postMadrid.id}`)
        .set('Authorization', `Bearer ${token}`)
      const postWasDeleted = !(await Post.findById(postMadrid.id))
      expect(res.status).toBe(204)
      expect(postWasDeleted).toBe(true)
    })

    it('should not allow to delete a post created by another user', async () => {
      const res = await request
        .delete(`/posts/${postVV.id}`)
        .set('Authorization', `Bearer ${token2}`)
      const postWasDeleted = !(await Post.findById(postVV.id))
      expect(res.status).toBe(400)
      expect(postWasDeleted).toBe(false)
    })
  })

  describe('POST /posts/:postId/like', () => {
    it('should like a post', async () => {
      const res = await request
        .post(`/posts/${postVV.id}/like`)
        .set('Authorization', `Bearer ${token}`)
      const updatedPostVV = await Post.findById(postVV.id)
      const updatedUser = await User.findById(user1._id)
      expect(res.status).toBe(204)
      expect(updatedPostVV.likeAmount).toBe(1)
      expect(updatedUser.likedPosts.length).toBe(1)

      // Check if its in users list as well
    })

    it('should not be allowed to like a post twice', async () => {
      const res = await request
        .post(`/posts/${postVV.id}/like`)
        .set('Authorization', `Bearer ${token}`)
      const updatedPostVV = await Post.findById(postVV.id)
      expect(res.status).toBe(400)
      expect(updatedPostVV.likeAmount).toBe(1)
    })
  })

  describe('POST /posts/:postId/dislike', () => {
    it('should dislike a post', async () => {
      const res = await request
        .post(`/posts/${postVV.id}/dislike`)
        .set('Authorization', `Bearer ${token}`)
      const updatedPostVV = await Post.findById(postVV.id)
      const updatedUser = await User.findById(user1._id)
      expect(res.status).toBe(204)
      expect(updatedPostVV.likeAmount).toBe(0)
      expect(updatedUser.likedPosts.length).toBe(0)

      // Check if its in users list as well
    })

    it('should not be allowed to dislike a post that was not liked by the user', async () => {
      const res = await request
        .post(`/posts/${postVV.id}/dislike`)
        .set('Authorization', `Bearer ${token}`)
      const updatedPostVV = await Post.findById(postVV.id)
      expect(res.status).toBe(400)
      expect(updatedPostVV.likeAmount).toBe(0)
    })
  })
})
