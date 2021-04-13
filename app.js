require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

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

app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

module.exports = app
