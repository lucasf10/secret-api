import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'

import Post from '@models/post'
import User from '@models/user'

const router: Router = express.Router()
router.use(authMiddleware)

router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts = await Post.find() // .populate(['comments'])

    return res.status(200).send({ posts })
  } catch (err) {
    return res.status(400).send({ error: 'Error loading posts.' })
  }
})

router.get('/:postId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.findById(req.params.postId) // .populate(['comments'])

    return res.status(200).send({ post })
  } catch (err) {
    return res.status(400).send({ error: 'Error loading post.' })
  }
})

router.post('/:postId/like', async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.findById(req.params.postId)
    const user = await User.findById(req.userId)

    if (user.likedPosts.indexOf(post.id) !== -1)
      return res.status(400).send({ error: 'You already liked this post' })

    await User.updateOne(
      { _id: req.userId },
      { $push: { likedPosts: post.id } }
    )
    post.likeAmount += 1
    post.save()

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error loading post.' })
  }
})

router.post('/:postId/dislike', async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.findById(req.params.postId)
    const user = await User.findById(req.userId)

    if (user.likedPosts.indexOf(post.id) === -1)
      return res.status(400).send({ error: 'You didn\'t like this post yet' })

    await User.updateOne(
      { _id: req.userId },
      { $pull: { likedPosts: post.id } }
    )
    post.likeAmount -= 1
    post.save()

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error loading post.' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.create({ ...req.body, createdBy: req.userId })

    return res.status(201).send({ post })
  } catch (err) {
    return res.status(400).send({ error: 'Error creating new post.' })
  }
})

router.delete('/:postId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.findById(req.params.postId)

    if (String(post.createdBy) !== req.userId)
      return res.status(400).send({ error: 'User not allowed deleting this post.' })

    post.delete()

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting post.' })
  }
})

export default (app: Express) => app.use('/posts', router)
