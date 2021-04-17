const mongoose = require('mongoose')
const Note = require('../models/Note')
const User = require('../models/User')
const { hashPassword } = require('../services/auth')
const { api, getAllNotes, initialNotes } = require('./helpers')

beforeEach(async (done) => {
  await Note.deleteMany({})
  const notes = initialNotes.map((note) => new Note(note))
  const promises = notes.map((note) => note.save())
  await Promise.all(promises)

  await User.deleteMany({})
  const passwordHash = await hashPassword('password')
  const username = 'usertest'
  const name = 'nametest'

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const zz = await user.save()
  console.log(zz)
  done()
})

describe('Notes', () => {
  describe('get all notes', () => {
    test('notes are returnered as json', async (done) => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      done()
    })

    test('number of notes is correct', async () => {
      const { response } = await getAllNotes()
      expect(response.body).toHaveLength(initialNotes.length)
    })

    test('the content of any note is correct', async (done) => {
      const { contents } = await getAllNotes()
      expect(contents).toContain(initialNotes[0].content)
      done()
    })
  })

  describe('create a note', () => {
    test(`is possible with a valid note`, async (done) => {
      const newNote = {
        content: 'New Note',
        important: false,
        user: '60763c51ebc72d6bd55e2062',
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const { contents } = await getAllNotes()
      expect(contents).toContain(newNote.content)

      done()
    })

    test(`is not possible with a valid note`, async (done) => {
      const newNote = {
        important: false,
      }

      await api.post('/api/notes').send(newNote).expect(400)

      done()
    })
  })

  describe('delete a note', () => {
    test(`can be delete if exists a note with this id`, async (done) => {
      const { response } = await getAllNotes()
      const { id, content } = response.body[0]

      await api.delete(`/api/notes/${id}`).expect(204)

      const { contents } = await getAllNotes()
      expect(contents).not.toContain(content)

      done()
    })

    test(`can't be delete a note with a invalid id`, async (done) => {
      await api.delete(`/api/notes/2113}`).expect(400)

      const { response } = await getAllNotes()
      expect(response.body).toHaveLength(initialNotes.length)

      done()
    })
  })
})

afterAll(async () => {
  await Note.deleteMany({})
  mongoose.connection.close()
})
