const { CLIENT_BASE_URL, NODE_ENV, PORT } = process.env
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

// Connection to MongoDB Atlas
require('./database/connection')()

// Application-level Middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(bodyParser.json())


// Attach token to request
// app.use(require('./api/middleware/set-token'))


app.use(require('cors')({
  origin: CLIENT_BASE_URL,
  optionSuccessStatus:200
}))

// Routes
app.use('/api/v1', require('./api/routes/auth'))
app.use('/api/v1/users', require('./api/routes/users'))
//This line was pulled from the solutions branch
// app.use('/api/users/:userId/posts', require('./api/routes/posts'))


// Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Could not ${req.method} ${req.path}`)
  error.status = 404
  next(error)
})

// Error Handler
app.use((err, req, res, next) => {
  if (NODE_ENV === 'development') console.error(err)
  const { message, status } = err
  res.status(status).json({ status, message })
})

// Open Connection
const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
