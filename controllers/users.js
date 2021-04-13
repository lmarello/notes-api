const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', (request, response) => {
  const { body } = request
  const { username, name, password } = body

  const user = new User({
    username,
    name,
    passwordHash: password,
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
