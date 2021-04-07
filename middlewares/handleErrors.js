module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError')
    response
      .status(400)
      .send({
        error: 'id used is malformed',
      })
      .end()

  response.status(500).end()
}
