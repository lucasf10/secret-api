import express, { Request, Response, Router, Express } from 'express'
import authMiddleware from '../middlewares/auth'

import Post from '@models/post'

const router: Router = express.Router()
router.use(authMiddleware)

router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts = await Post.find().populate(['comments'])

    return res.status(200).send({ posts })
  } catch (err) {
    return res.status(400).send({ error: 'Error loading posts.' })
  }
})

router.get('/:postId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.find(req.params.postId).populate(['comments'])

    await post.save()

    return res.status(200).send({ post })
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

router.put('/:postId', async (req: Request, res: Response): Promise<Response> => {

})

router.delete('/:postId', async (req: Request, res: Response): Promise<Response> => {
  try {
    await Post.findByIdAndRemove(req.params.postId)

    return res.status(204).send()
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting post.' })
  }
})

export default (app: Express) => app.use('/posts', router)
