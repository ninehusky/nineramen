const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.get('/', (req, res) => {
    res.json({
        message: 'grr youve reacheed the auth endpoint',
    });
});

router.get('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
    if (err) {
        return next(err);
    } else {
        if (!user) {
            res.status(401);
            const error = new Error(info.message);
            return next(error);
        }
        res.json({
            message: 'logged in successfully!',
        });
    }
    })(req, res, next)
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