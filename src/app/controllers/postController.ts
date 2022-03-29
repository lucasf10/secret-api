import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'
import mongoose from 'mongoose'

import Post from '@models/post'
import User from '@models/user'
import { getCity } from '@utils/functions'

const router: Router = express.Router()
router.use(authMiddleware)

router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const city = req.query.city
    const limit = Number(req.query.limit) || 10
    const offset = Number(req.query.offset) || 0
    const user = await User.findById(req.userId)
    const posts = await Post.aggregate()
      .match({ city })
      .addFields({ likedByUser: { $in: ['$_id', user.likedPosts] } })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .project({ createdBy: 0, location: 0, createdAt: 0, __v: 0 })

    return res.status(200).send({ posts })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Error loading posts.' })
  }
})

router.get('/:postId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId)
    const user = await User.findById(userId)
    const postQuery = await Post.aggregate()
      .match({ _id: new mongoose.Types.ObjectId(req.params.postId) })
      .lookup({
        from: 'comments',
        localField: 'comments',
        foreignField: '_id',
        as: 'commentsUnwided',
        pipeline: [{
          $sort: { createdAt: -1 }
        }]
      })
      .addFields({
        likedByUser: { $in: ['$_id', user.likedPosts] }
      })
      .project({
        text: 1,
        colorCode: 1,
        city: 1,
        likeAmount: 1,
        likedByUser: 1,
        comments: {
          $map: {
            input: '$commentsUnwided',
            as: 'comment',
            in: {
              _id: '$$comment._id',
              text: '$$comment.text',
              createdAt: '$$comment.createdAt',
              likeAmount: {
                $size: { $ifNull: ['$$comment.likedBy', []] }
              },
              likedByUser: {
                $in: [userId, { $ifNull: ['$$comment.likedBy', []] }]
              },
              createdByUser: {
                $eq: ['$$comment.createdBy', userId]
              }
            }
          }
        }
      })

    const post = postQuery?.length > 0 && postQuery[0]

    if (!post)
      return res.status(404).send({ error: 'Post not found' })

    return res.status(200).send({ post })
  } catch (err) {
    console.log(err)
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
    return res.status(400).send({ error: 'Error liking post.' })
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
    return res.status(400).send({ error: 'Error disliking post.' })
  }
})

router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { location } = req.body
    const city = await getCity(location.coordinates[0], location.coordinates[1])
    const post = await Post.create({ ...req.body, createdBy: req.userId, city })

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
