const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const { ObjectId } = require('mongoose').Types.ObjectId;

const router = express.Router();

const API = require('./API');
const errorHandler = require('./errors');

function validateChanges(changes) {
  const validChanges = ['word', 'emoji', 'absurdity', 'description'];
  const attemptedChanges = Object.keys(changes);
  for (let i = 0; i < attemptedChanges.length; i += 1) {
    const change = attemptedChanges[i];
    if (!validChanges.includes(change)) {
      const error = new Error(`The property ${change} is not a valid property to change.`);
      error.statusCode = 400;
      throw error;
    }
  }
}

async function checkValidID(id) {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  const entry = await API.getEntry({ _id: new ObjectId(id) });
  if (!entry) {
    const error = new Error('An entry with that ID does not exist!');
    error.statusCode = 404;
    throw error;
  }
}

router.use(passport.initialize());
router.use(passport.session());

router.get('/', async (req, res, next) => {
  try {
    const entries = await API.getAllEntries();
    res.json(entries);
  } catch (error) {
    return next(error);
  }
});

router.post('/', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    validateChanges(req.body);
    const entryData = {
      ...req.body,
      createdBy: new ObjectId(req.user._id),
    };
    const addedEntry = await API.addEntry(entryData);
    res.status(201);
    addedEntry.reports = undefined;
    res.json(addedEntry);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/report', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    checkValidID(req.params.id);
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler.notFound);
router.use(errorHandler.handleError);

module.exports = router;
