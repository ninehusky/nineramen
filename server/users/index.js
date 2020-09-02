const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const errorHandler = require('error-utils');

const api = require('./API');

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
    const sanitizedUsers = [];
    users.forEach((user) => {
      sanitizedUsers.push(api.sanitizeData(user));
    });
    res.json(sanitizedUsers);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let user = await api.getOne(req.params.id);
    user = api.sanitizeData(user);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userData = {
      name: req.body.name,
      password: req.body.password,
    }; // maybe sanitize further
    await api.create(userData);
    res.status(201);
    res.json({
      message: 'User succesfully created.',
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
      message: 'Your report has been received. Thank you.',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/', api.requiredIdError);

router.patch('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    await api.checkValidChange(req.user._id, req.params.id);
    console.log(req.body.userType);
    if (req.body.userType === 'admin' && req.user.userType === 'user') {
      const error = new Error('You are not authorized to promote a user.');
      error.statusCode = 403;
      throw error;
    }
    console.log('password is', req.body.password);
    if (req.body.password && (String)(req.user._id) !== (String)(req.params.id)) {
      const error = new Error('You cannot change the password of another user.');
      error.statusCode = 403;
      throw error;
    }
    const updateData = req.body;
    await api.updateOne(req.params.id, updateData);
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
    await api.checkValidChange(req.user._id, req.params.id);
    await api.delete(req.params.id);
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
