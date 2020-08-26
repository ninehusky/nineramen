const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');

const users = require('./users');

require('./config/database');

const app = express();
app.use(express.json());

app.use(helmet());
app.use(morgan('dev'));

// TODO: reexamine necessity of these two things
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: process.env.CLIENT_URL,
}));

app.use('/users', users);

module.exports = app;
