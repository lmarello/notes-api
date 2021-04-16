const app = require('../app')
const supertest = require('supertest')
const User = require('../models/User')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Mock note 1',
    important: true,
    date: new Date(),
  },
  {
    content: 'Mock note 2',
    important: true,
    date: new Date(),
  },
]

const getAllNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map((note) => note.content),
    response,
  }
}

const getUsersFromDB = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  api,
  getAllNotes,
  initialNotes,
  getUsersFromDB,
}
