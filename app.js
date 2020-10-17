require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dreamsRouter = require('./controller/dreams')
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    logger.info('conncected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connected to MongoDB', error.message)
  })

app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestLogger)
app.use(cors())
app.use('/api/dreams', dreamsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app