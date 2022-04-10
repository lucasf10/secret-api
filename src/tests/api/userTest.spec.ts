import User from '@models/user'
import UserType from 'src/app/types/User'
import supertest from 'supertest'
import { app } from '../../index'
import { NEW_USER_DATA_1 } from '../utils/constants'

const request = supertest(app)
describe('Users API test', () => {
  let token: string
  let user: UserType

  beforeAll(async () => {
    const resUser1 = await request.post('/auth/register').send(NEW_USER_DATA_1)
    token = resUser1.body.token
    user = resUser1.body.user
  })

  describe('POST /users/:userId/set_firebase_token', () => {
    it('should set firebase token', async () => {
      const firebaseToken = 'RANDOM_TOKEN'
      const res = await request
        .post(`/users/${user._id}/set_firebase_token`)
        .send({ firebaseToken })
        .set('Authorization', `Bearer ${token}`)

      const updatedUser = await User.findById(user._id)

      expect(res.status).toBe(204)
      expect(updatedUser.firebaseToken).toEqual(firebaseToken)
    })
  })
})
