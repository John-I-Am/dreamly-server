const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Dream = require('../models/dream')
const api = supertest(app)
const bcrypt = require('bcrypt')
let tokens;

describe('when there is initially one user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('123456', 10)
    const user = new User({ username: 'john', passwordHash })
    await user.save()
  })

  test('creating new user existing username', async () => {
    const newUser = {
      username: 'john',
      password: '123456'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const users = await User.find({})
      expect(users).toHaveLength(1)
  })

  test('creating new user with fresh username', async () => {
    const newUser = {
      username: 'john1',
      password: '123456'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const users = await User.find({})
    expect(users).toHaveLength(2)

    const usernames = users.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
