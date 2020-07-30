const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.json({
        message: 'youve reached the users endpoint meow',
    });
});

router.get('/:username', passport.authenticate('jwt'), (req, res, next) => {
    User.findOne({
        username: req.params.username,
    })
        .then((user) => {
            if (!user) {
                const error = new Error('That user does not exist!');
                next(error);
            }
            res.json({
                message: `${user.username} is a ${user.userType}`,
            });
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;