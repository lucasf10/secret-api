import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'
import { Types } from 'mongoose'

import Comment from '@models/comment'
import Post from '@models/post'
import User from '@models/user'
import { sendNotification } from '@utils/functions'

const router: Router = express.Router()
router.use(authMiddleware)

router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { post } = req.body
    const comment = await Comment.create({ ...req.body, createdBy: req.userId })
    const postObj = await Post.findById(post)
    const postOwner = await User.findById(postObj.createdBy)

    await Post.updateOne(
      { _id: post },
      { $push: { comments: comment.id } }
    )

    if (postOwner.firebaseToken && (postOwner.id as unknown as string) !== req.userId) {
      sendNotification(
        postOwner.firebaseToken,
        'Someone just commented on your secret.',
        'Go check it out!'
      )
    }

    return res.status(201).send({ comment })
  } catch (err) {
    return res.status(400).send({ error: 'Error creating new post.' })
  }
})

router.delete('/:commentId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (String(comment.createdBy) !== req.userId)
      return res.status(400).send({ error: 'User not allowed deleting this comment.' })

    await Post.updateOne(
      { _id: comment.post },
      { $pull: { comments: comment.id } }
    )
    comment.delete()

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting comment.' })
  }
})

router.post('/:commentId/like', async (req: Request, res: Response): Promise<Response> => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    const commentOwner = await User.findById(comment.createdBy)
    const userId = new Types.ObjectId(req.userId)

    if (comment.likedBy.indexOf(userId) !== -1)
      return res.status(400).send({ error: 'You already liked this post' })

    await Comment.updateOne(
      { _id: comment.id },
      { $push: { likedBy: userId } }
    )

    if (commentOwner.firebaseToken && (commentOwner.id as unknown as string) !== req.userId) {
      sendNotification(
        commentOwner.firebaseToken,
        'Someone just liked your comment.',
        'Go check it out!'
      )
    }

    return res.status(204).send()
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Error liking comment.' })
  }
})

router.post('/:postId/dislike', async (req: Request, res: Response): Promise<Response> => {
  try {
    const comment = await Comment.findById(req.params.postId)
    const userId = new Types.ObjectId(req.userId)

    if (comment.likedBy.indexOf(userId) === -1)
      return res.status(400).send({ error: 'You didn\'t like this post yet' })

    await Comment.updateOne(
      { _id: comment.id },
      { $pull: { likedBy: userId } }
    )

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error disliking comment.' })
  }
})

export default (app: Express) => app.use('/comment', router)
