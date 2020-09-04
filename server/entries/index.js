const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const { ObjectId } = require('mongoose').Types.ObjectId;

const router = express.Router();

const api = require('./API');
const userApi = require('../users/API');

const errorHandler = require('error-utils');

router.use(passport.initialize());
router.use(passport.session());

router.get('/', async (req, res, next) => {
  try {
    const entries = await api.getAll();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const entry = await api.getById(req.params.id);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/reports', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    if (req.user.userType !== 'admin') {
      const error = new Error('You are not authorized to see the reports of the given entry.');
      error.statusCode = 403;
      throw error;
    }
    const reports = await api.getReports(req.params.id);
    res.json(reports);
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

router.post('/:id/reports/', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    const reportData = {
      createdBy: req.user._id,
      description: req.body.description,
    };
    await api.report(req.params.id, reportData);
    res.status(201);
    res.json({
      message: 'Your report has been submitted. Thank you.',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    const entry = await api.getById(req.params.id);
    await userApi.checkAuthorized(req.user._id, entry.createdBy);
    if (req.body.createdBy) {
      const error = new Error('You cannot change the author of an entry.');
      error.statusCode = 403;
      throw error;
    }
    const updateData = {
      ...req.body,
      createdBy: req.user._id,
    };
    await api.updateById(req.params.id, updateData);
    res.json({
      message: 'Entry succesfully updated.',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    const entry = await api.getById(req.params.id);
    await userApi.checkAuthorized(req.user._id, entry.createdBy);
    await api.deleteById(req.params.id);
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
