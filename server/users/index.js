const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const errorHandler = require('error-utils');

const { api } = require('./API');
const { checkAuthorized } = require('./API');

require('../config/passport');

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (info.message === 'Missing credentials') {
        info.message = 'You must include a name and password in the request body.';
        res.status(400);
      } else {
        res.status(401);
      }
      const error = new Error(info.message);
      return next(error);
    }
    const payload = {
      id: user._id,
      name: user.name,
      userType: user.userType,
    };
    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: '1d',
    });
    res.json({ token });
  })(req, res, next);
});

router.get('/', async (req, res, next) => {
  try {
    const users = await api.getAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await api.getById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/reports', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    if (req.user.userType !== 'admin') {
      const error = new Error('You are not authorized to see the reports of the given user.');
      error.statusCode = 403;
      throw error;
    }
    const reports = await api.getReports(req.params.id);
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (req.body.userType === 'admin') {
      const error = new Error('You cannot create an admin, you can only promote an existing one.');
      error.statusCode = 403;
      throw error;
    }
    await api.create(req.body);
    res.status(201);
    res.json({
      message: 'User succesfully created.',
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
    res.json({
      message: 'Your report has been received. Thank you.',
    });
  } catch (error) {
    next(error);
  }
});

// router.patch('/', api.requiredIdError);

router.patch('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    if (req.body.userType === 'admin' && req.user.userType === 'user') {
      const error = new Error('You are not authorized to promote a user.');
      error.statusCode = 403;
      throw error;
    }
    if (req.body.password && (String)(req.user._id) !== (String)(req.params.id)) {
      const error = new Error('You cannot change the password of another user.');
      error.statusCode = 403;
      throw error;
    }
    await checkAuthorized(req.user._id, req.params.id);
    await api.updateById(req.params.id, req.body);
    res.json({
      message: 'User succesfully updated.',
    });
  } catch (error) {
    return next(error);
  }
});

// router.delete('/', sendRequireIDError);

router.delete('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    await api.getById(req.params.id);
    await checkAuthorized(req.user._id, req.params.id);
    await api.deleteById(req.params.id);
    res.json({
      message: 'User succesfully deleted.',
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler.notFound);
router.use(errorHandler.handleError);

module.exports = router;
