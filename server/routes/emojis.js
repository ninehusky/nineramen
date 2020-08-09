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
    try {
        // duplicateEntries is the array containing all EmojiEntries that match the word/emoji pair
        const duplicateEntries = await EmojiEntry.find({
            word: req.body.word,
            emoji: req.body.emoji,
        });
        if (duplicateEntries.length) {
            res.status(422);
            return next(new Error(`An entry mapping ${req.body.word} to ${req.body.emoji} already exists!`));
        }
    } catch (error) {
        return next(error);
    }
    if (req.user.userType !== 'admin') {
        try {
            let user = await User.findById(req.user._id);
            if (!user) {
                res.status(500);
                throw new Error('There was an error adding the entry.');
            }
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

router.get('/report/:id', passport.authenticate('jwt'), async (req, res, next) => {
    try {
        let emojiEntry = await EmojiEntry.findById(req.params.id);
        emojiEntry.reports.forEach((report) => {
            console.log(report.reportedBy, req.user.username);
            if (report.reportedBy === req.user.username) {
                res.status(400);
                throw new Error('You have already reported this entry.');
            }
        });
        emojiEntry.reports.push({
            reportedBy: req.user.username,
            description: req.body.description,
        });
        await emojiEntry.save();
        res.json({
            message: 'Thank you for your report. An admin will review this shortly.',
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;