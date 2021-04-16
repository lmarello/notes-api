const mongoose = require('mongoose')
const User = require('../models/User')
const { hashPassword } = require('../services/auth')
const { api, getUsersFromDB } = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await hashPassword('password')
  const username = 'usertest'
  const name = 'nametest'

  const user = new User({
    username,
    name,
    passwordHash,
  })

  await user.save()
})

describe('Users', () => {
  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsersFromDB()

    const user = {
      username: 'lmarello',
      name: 'leo marello',
      password: 'mi_password',
    }

    const createdUser = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsersFromDB()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const foundUser = usersAtEnd.find((u) => u._id === createdUser.id)?.username

    expect(foundUser.username).toBe(createdUser.username)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})
