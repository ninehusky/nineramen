const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const config = require('config');

const users = require('./users');
const entries = require('./entries');

require('./config/database');

const app = express();
app.use(express.json());

app.use(helmet());
app.use(morgan('dev'));

// TODO: reexamine necessity of these two things
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: config.get('clientUrl'),
}));

app.use('/users', users);
app.use('/entries', entries);

module.exports = app;
