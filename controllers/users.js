const usersRouter = require('express').Router()
const User = require('../models/User')
const { hashPassword } = require('../services/auth')

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
      response.status(404).end()
    })
})

module.exports = usersRouter
