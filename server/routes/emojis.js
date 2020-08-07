const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const EmojiEntry = require('../models/emoji-entry');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    EmojiEntry.find({}, (err, entries) => {
        if (err) {
            next(err);
        }
        res.json(entries);
    });
});

// Make a new emojientry
router.post('/', passport.authenticate('jwt'), async (req, res, next) => {
    // search for duplicates
    const duplicateEntries = await User.find({
        word: req.body.word,
        emoji: req.body.emoji,
    });
    if (duplicateEntries) {
        res.status(422);
        return next(new Error(`An entry mapping ${req.body.word} to ${req.body.emoji} already exists!`));
    }
    if (req.user.userType !== 'admin') {
        try {
            let user = await User.findById(req.user._id);
            if (user.remainingDailyEntries > 0) {
                user.remainingDailyEntries--;
                await user.save();
            } else {
                res.status(403);
                return next(new Error('The given user cannot make any more entries today.'));
            }
        } catch (err) {
            return next(err);
        }
    }
    EmojiEntry.create({
        ...req.body,
        createdBy: req.user.username,
    })
        .then((entry) => {
            res.json({
                message: `Your emoji entry has been created! You have ${req.user.remainingDailyEntries} entries remaining.`,
            });
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;