const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', (request, response) => {
  Note.find({})
    .then((notes) => response.json(notes))
    .catch((err) => {
      console.log(err)
      response.status(404).end()
    })
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

notesRouter.post('/', (request, response) => {
  const { content, important } = request.body

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
  })

  note
    .save()
    .then((savedNote) => {
      response.status(201).json(savedNote)
    })
    .catch((err) => {
      console.log(err)
      response.status(404).end()
    })
})

module.exports = notesRouter
