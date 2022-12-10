const express = require('express');
const { createServer } = require('http');
const app = express();
const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });
const server = createServer(app);
const { globalErrorHandler, middlewares } = require('./middlewares');

const io = require('socket.io')(server);
global.io = io;

const { auth, profile } = require('./routes');

app.use(middlewares);

app.use('/api', auth);
app.use('/api', profile);
//app.use('/post', postRoute)
//app.use('/comment', commentRoute)
//app.use('/reply', replyRoute)
//app.use('/security', securityRoute)
//app.use('/story', storyRoute)
//app.use('/notification', notificationRoute)
//app.use('/friend', friendRoute)

app.use(globalErrorHandler);

module.exports = server;
