import supertest from 'supertest'
import { app, server } from '../index'

const request = supertest(app)

describe('Server test', () => {
  afterAll(() => {
    server.close()
  })

  describe('GET /', () => {
    it('should check that the server is up', async () => {
      const res = await request.get('/')

      expect(res.status).toBe(200)
    })
  })
})
