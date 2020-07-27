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
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  User.findOne({
      username: req.body.username
  })
    .then((user) => {
      if (!user) {
        loginAuthorizationError(res, next);
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
          res.json({
            'success': 'youre in',
          });
        } else {
          loginAuthorizationError(res, next);
        }
      });
    }).catch((error) => {
      next(error);
    });
});

/**
 * Middleware that provides a sufficiently cryptic login message.
 * @param {*} res - response object
 * @param {*} next - callback function
 */
function loginAuthorizationError(res, next) {
  res.status(401);
  next(new Error('The username and/or password given is invalid.'));
}


module.exports = router;