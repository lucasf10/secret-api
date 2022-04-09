import User from '@models/user'
import UserType from 'src/app/types/User'
import supertest from 'supertest'
import { app } from '../../index'

const request = supertest(app)
describe('Users API test', () => {
  let registeredUser: UserType

  beforeAll(async () => {
    const registeredUserData = {
      email: 'registered@mail.com',
      username: 'registered',
      password: '123456'
    }

    registeredUser = await User.create(registeredUserData)
  })

  describe('POST /users/:userId/set_firebase_token', () => {
    it('should set firebase token', async () => {
      const firebaseToken = 'RANDOM_TOKEN'
      const res = await request
        .post(`/users/${registeredUser.id}/set_firebase_token`)
        .send({ firebaseToken })

      const updatedUser = await User.findById(registeredUser.id)

      expect(res.status).toBe(204)
      expect(updatedUser.firebaseToken).toEqual(firebaseToken)
    })
  })
})
