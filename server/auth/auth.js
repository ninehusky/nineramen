const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res) => {
  res.json({
    message: 'grr youve reacheed the auth endpoint',
  });
});

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
