require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const Note = require('./models/Note')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

const app = express()

app.use(express.json())
app.use(cors())

Sentry.init({
  dsn:
    'https://dd977fea44584b5690e84849da97c67d@o566082.ingest.sentry.io/5708430',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler())

app.use(Sentry.Handlers.tracingHandler())

app.get('/api/notes', (request, response) => {
  Note.find({})
    .then((notes) => response.json(notes))
    .catch((err) => {
      console.log(err)
      response.status(404).end()
    })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then((note) =>
      note ? response.status(201).json(note) : response.status(400).end()
    )
    .catch(next)
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

app.put('/api/notes/:id', (request, response, next) => {
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

app.post('/api/notes', (request, response) => {
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

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

module.exports = app
