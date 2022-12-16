const express = require('express');
const { createServer } = require('http');
const app = express();
const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../.env') });
const server = createServer(app);
const { globalErrorHandler, middlewares } = require('./middlewares');

const io = require('socket.io')(server);
global.io = io;

const { auth, profile, friend, post, comment, story, reply } = require('./routes');

app.use(middlewares);

app.use('/api', auth);
app.use('/api', profile);
app.use('/api', post);
app.use('/api', comment);
app.use('/api', reply);
app.use('/api', story);
//app.use('/notification', notificationRoute)
app.use('/api', friend);

app.use(globalErrorHandler);

module.exports = server;
