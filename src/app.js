//external import
const express = require('express')
const http = require('http')
const app = express()
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const server = http.createServer(app)
const { globalErrorHandler, middlewares } = require('./middlewares')
//socket
const io = require('socket.io')(server)
global.io = io
const { auth } = require('./routes')
app.use(middlewares)

//using routes
app.use('/api', auth)
//app.use('/profile', profileRoute)
//app.use('/post', postRoute)
//app.use('/comment', commentRoute)
//app.use('/reply', replyRoute)
//app.use('/security', securityRoute)
//app.use('/story', storyRoute)
//app.use('/notification', notificationRoute)
//app.use('/friend', friendRoute)

//using error handleling middlewares

app.use(globalErrorHandler)

module.exports = server
