import { NextFunction, Request, Response } from 'express'

import jwt from 'jsonwebtoken'

export default (req: Request, res: Response, next: NextFunction): Response => {
  const authHeader = req.headers.authorization

  if (!authHeader)
    return res.status(401).send({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if (!(parts.length === 2))
    return res.status(401).send({ error: 'Token error' })

  const [scheme, token] = parts
  if (!(/^Bearer$/i).test(scheme))
    return res.status(401).send({ error: 'Token malformatted' })

  const { SECRET } = process.env
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' })

    req.userId = decoded.id
    return next()
  })
}
