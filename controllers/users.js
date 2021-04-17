const usersRouter = require('express').Router()
const User = require('../models/User')
const { hashPassword } = require('../services/auth')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    important: 1,
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body
  const passwordHash = await hashPassword(password)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  user
    .save()
    .then((savedUser) => {
      response.status(201).json(savedUser)
    })
    .catch((err) => {
      console.log(err)
      response.status(404).json({ error: 'Error al crear el usuario' })
    })
})

module.exports = usersRouter
