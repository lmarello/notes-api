const express = require('express')
const cors = require('cors')

const PORT = 3001

const app = express()

app.use(express.json())
app.use(cors())

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)

  if (isNaN(id)) response.status(404).end()

  const note = notes.find((note) => note.id === id)
  if (note) response.json(note).end()

  response.status(404).end()
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)

  if (isNaN(id)) response.status(404).end()

  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const { content, important } = request.body

  if (!content)
    response
      .status(400)
      .json({
        error: 'Parameters missing',
      })
      .end()

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const note = {
    id: maxId + 1,
    content: content,
    important: typeof important !== 'undefined' ? important : false,
    date: new Date().toISOString(),
  }

  notes = [...notes, note]
  response.status(201).json(note)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
