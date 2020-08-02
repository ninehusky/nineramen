const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const EmojiEntry = require('../models/emoji-entry');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.json({
        message: 'youve reached the emoji endpoint',
    });
});

// Make a new emojientry
router.post('/', passport.authenticate('jwt'), (req, res, next) => {
    if (req.user) {
        if (req.user.userType !== 'admin') {
            User.findById(req.user._id, (err, user) => {
                if (err) {
                    next(err);
                }
                user.remainingDailyEntries--;
                user.save()
                    .catch((error) => {
                        next(error);
                    });
            });
        }
        EmojiEntry.create(req.body)
            .then((entry) => {
                res.json(entry);
            })
            .catch((error) => {
                next(error);
            });
    }
});

module.exports = router;