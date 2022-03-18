import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'

import Comment from '@models/comment'
import Post from '@models/post'

const router: Router = express.Router()
router.use(authMiddleware)

router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { post } = req.body
    const comment = await Comment.create({ ...req.body, createdBy: req.userId })

    await Post.updateOne(
      { _id: post },
      { $push: { comments: comment.id } }
    )

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

    comment.delete()

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting comment.' })
  }
})

export default (app: Express) => app.use('/comment', router)
