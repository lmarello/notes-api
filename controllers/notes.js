const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then((note) =>
      note ? response.status(201).json(note) : response.status(400).end()
    )
    .catch(next)
})

notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((newNote) => {
      response.status(200).json(newNote)
    })
    .catch(next)
})

notesRouter.post('/', async (request, response) => {
  const { content, important = false, userId } = request.body
  const user = await User.findById(userId)

  if (!content) {
    return response
      .status(400)
      .json({
        error: 'Parameters missing',
      })
      .end()
  }

  const note = new Note({
    content: content,
    important: typeof important !== 'undefined' ? important : false,
    date: new Date(),
    user: user._id,
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
  } catch (error) {
    response.status(404).end()
  }
})

module.exports = notesRouter
