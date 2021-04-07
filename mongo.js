const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('db connected')
  })
  .catch((err) => console.log(err))

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
