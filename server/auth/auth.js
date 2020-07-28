const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.get('/', (req, res) => {
  res.json({
    message: 'grr youve reacheed the auth endpoint',
  });
});

router.get('/login', passport.authenticate('local'), (req, res) => {
  console.log('logging in...')
  res.json({
    message: 'logged in!',
  });
});


// router.get('/login', passport.authenticate('local', {
//   failureRedirect: '/login',
//   }), (req, res) => {
//   res.json({
//     message: 'Logged in succesfully',
//   });
// });

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
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