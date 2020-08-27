const express = require('express');
const passport = require('passport');
const { ObjectId } = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

const API = require('./API');
const errorHandler = require('./errors');
require('../config/passport');

function sendRequireIDError(req, res, next) {
  res.status(405);
  const error = new Error('You must include an ID in the URL to perform this operation.');
  return next(error);
}

function validateChanges(changes) {
  if (Object.keys(changes).length === 0) {
    const error = new Error('The request body cannot be empty.');
    error.statusCode = 400;
    throw error;
  }
  const validChanges = ['name', 'password', 'userType'];
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

function validateId(id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error(`The id ${id} is not valid.`);
    error.statusCode = 400;
    throw error;
  }
}

function throwAdminError(message) {
  const error = new Error(message);
  error.statusCode = 403;
  throw error;
}

async function adminCheck(user, idOfUserToChange) {
  const sameId = (new ObjectId(user._id).equals(new ObjectId(idOfUserToChange)));
  if (!sameId) {
    if (user.userType !== 'admin') {
      throwAdminError('You must be an admin to change another user\'s account.');
    } else {
      const userToChange = await API.getUser({ _id: new ObjectId(idOfUserToChange) });
      if (userToChange.userType === 'admin') {
        throwAdminError('You cannot change the account of another admin.');
      }
    }
  }
}

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
    const users = await API.getAllUsers();
    res.json(users);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id);
    const user = await API.getUser({ _id: new ObjectId(req.params.id) });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    validateChanges(req.body);
    const userData = {
      name: req.body.name,
      password: req.body.password,
      userType: req.body.userType || undefined,
    };
    if (userData.userType === 'admin') {
      const error = new Error('You cannot create an admin account, you can only promote an existing one.');
      res.status(403);
      throw error;
    }
    const addedUser = await API.addUser(userData);
    res.status(201);
    res.json(addedUser);
  } catch (error) {
    return next(error);
  }
});

router.patch('/', sendRequireIDError);

router.patch('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    validateId(req.params.id);
    validateChanges(req.body);
    await adminCheck(req.user, req.params.id);
    if (req.body.userType === 'admin' && req.user.userType !== 'admin') {
      throwAdminError('You cannot promote an account if you are not an admin.');
    }
    await API.updateUser(new ObjectId(req.params.id), req.body);
    res.json({
      message: 'User succesfully updated.',
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/', sendRequireIDError);

router.delete('/:id', passport.authenticate('jwt'), async (req, res, next) => {
  try {
    validateId(req.params.id);
    await adminCheck(req.user, req.params.id);
    await API.deleteUser(new ObjectId(req.params.id));
    res.json({
      message: 'User deleted succesfully.',
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler.notFound);
router.use(errorHandler.handleError);

module.exports = router;
