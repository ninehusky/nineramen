const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
            const payload = {
                _id: user._id,
                username: user.username,
                userType: user.userType,
            };
            jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d',
            }, (err, token) => {
                if (err) {
                    return next(err);
                }
                return res.json({
                    token: token,
                });
            });
        }
    })(req, res, next);
});


router.post('/signup', (req, res, next) => {
    console.log(req.body);
    if (req.body.userType === 'admin') { // consider validating before checking DB
        passport.authenticate('jwt', (err, user, info) => {
            if (err) {
                next(err);
            }
            console.log(user);
            if (user.userType !== 'admin') {
                res.status(403);
                next(new Error('You must be an admin to create an admin account.'));
            }
        })(req, res, next);
    }
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

function mustBeAdminError(res, next) {
    res.status(403);
    next(new Error('You must be an admin to access this endpoint.'));
}

module.exports = router;