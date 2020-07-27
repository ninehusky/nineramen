const express = require('express');
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
      res.status(422);
      next(error);
    });
});


module.exports = router;
