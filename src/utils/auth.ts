import jwt from 'jsonwebtoken'

export const generateToken = (params = {}) => {
  const { SECRET } = process.env
  return jwt.sign(params, SECRET, {
    expiresIn: 86400
  })
}
