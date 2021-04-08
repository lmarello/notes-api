const mongoose = require('mongoose')
const {
  MONGO_CONNECTION_STRING_TEST,
  MONGO_CONNECTION_STRING,
  NODE_ENV,
} = process.env

const connectionString =
  NODE_ENV === 'test' ? MONGO_CONNECTION_STRING_TEST : MONGO_CONNECTION_STRING

mongoose
  .connect(connectionString, {
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
