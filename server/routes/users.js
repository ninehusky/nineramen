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

router.patch('/:username', passport.authenticate('jwt'), async (req, res, next) => {
    // it might make more sense to include this as an instance method
    const allowedUpdates = [username, password, ];
});

router.get('/promote/:username', passport.authenticate('jwt'), async (req, res, next) => {
    changeUserStatus('admin', req, res, next);
});

// note that here, admins can demote themselves
router.get('/demote/:username', passport.authenticate('jwt'), async (req, res, next) => {
    changeUserStatus('user', req, res, next);
});

async function changeUserStatus(status, req, res, next) {
    if (req.user.userType !== 'admin') {
        return next(new Error('You must be an admin to change the user type of other users!'));
    }
    try {
        const user = await User.findOneAndUpdate({ username: req.params.username }, {
            userType: status,
        });
        if (!user) {
            return next(new Error('That user does not exist!'));
        }
    } catch (error) {
        return next(error);
    }
    res.json({
        message: `Succesfully changed ${req.params.username}'s status to ${status}.`,
    });
}



module.exports = router;