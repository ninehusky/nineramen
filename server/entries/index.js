const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const { ObjectId } = require('mongoose').Types.ObjectId;

const router = express.Router();

const api = require('./API');
const errorHandler = require('error-utils');

router.use(passport.initialize());
router.use(passport.session());

router.get('/', async (req, res, next) => {
  try {
    const entries = api.getAll();
    const sanitizedEntries = [];
    entries.forEach((entry) => {
      sanitizedEntries.push(api.sanitizeData(entry));
    });
    res.json(sanitizedEntries);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let entry = await api.getOne(req.params.id);
    entry = api.sanitizeData(entry);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.post('/', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    const entryData = req.body;
    entryData.createdBy = req.user._id;
    await api.create(entryData);
    res.status(201);
    res.json({
      message: 'Entry succesfully created.',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/report/', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    const reportData = {
      createdBy: req.user._id,
      description: req.body.description,
    };
    await api.report(req.params.id, reportData);
    res.json({
      message: 'Your report has been submitted. Thank you.',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    await api.checkValidChange(req.user._id, entry.createdBy);
    await api.delete(req.params.id);
    res.json({
      message: 'Entry succesfully deleted.',
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler.notFound);
router.use(errorHandler.handleError);

module.exports = router;
