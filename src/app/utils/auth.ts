import jwt from 'jsonwebtoken'

export const generateToken = (params = {}) => {
  const { SECRET, SECRET_EXPIRATION } = process.env
  return jwt.sign(params, SECRET, {
    expiresIn: SECRET_EXPIRATION || 86400000
  })
}
