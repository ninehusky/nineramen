const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  origin: process.env.CLIENT_URL,
}));

app.get('/', (req, res, next) => {
  res.send("Hello, world!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://locahost:${port}`);
});
