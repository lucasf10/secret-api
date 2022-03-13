import express, { Express } from 'express'
import bodyParser from 'body-parser'
import authController from '@controllers/authController'

const PORT: number = 3000
const HOST: string = '0.0.0.0'

const app: Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

(authController)(app)

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, HOST)
