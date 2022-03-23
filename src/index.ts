import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'

import authController from '@controllers/authController'
import postController from '@controllers/postController'
import commentController from '@controllers/commentController'

const PORT: number = 3000
const HOST: string = '0.0.0.0'

const app: Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

(authController)(app);
(postController)(app);
(commentController)(app)

app.get('/', (req: Request, res: Response): Response => {
  return res.status(200).send('Server is up!')
})

app.listen(PORT, HOST)
