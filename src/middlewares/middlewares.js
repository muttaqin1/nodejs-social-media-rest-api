const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { signedCookieSecret } = require('../config');
module.exports = [
    express.json(),
    cors(),
    morgan('dev'),
    express.urlencoded({ extended: true }),
    cookieParser(signedCookieSecret),
];
