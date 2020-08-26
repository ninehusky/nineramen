const express = require('express');
const { ObjectId } = require('mongoose').Types.ObjectId;

const router = express.Router();

const API = require('./API');
const errorHandler = require('./errors');

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
  const validChanges = ['name', 'password'];
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
    const user = await API.getUser({ _id: req.params.id });
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
    const addedUser = await API.addUser(userData);
    res.status(201);
    res.json(addedUser);
  } catch (error) {
    return next(error);
  }
});

router.patch('/', sendRequireIDError);

router.patch('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id);
    validateChanges(req.body);
    await API.updateUser(req.params.id, req.body);
    res.json({
      message: 'User succesfully updated.',
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/', sendRequireIDError);

router.delete('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id);
    await API.deleteUser(req.params.id);
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
