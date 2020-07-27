const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const middlewares = require('./middlewares/middlewares');
const auth = require('./auth/auth');

const app = express();
app.use(express.json());

app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  origin: process.env.CLIENT_URL,
}));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res, next) => {
  res.send("Hello, world!");
});

app.use('/auth', auth);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
