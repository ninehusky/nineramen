const User = require('./user');
const mongoose = require('mongoose');

async function checkUserWithId(id) {
  const user = await getUser({ _id: id });
  if (!user) {
    const error = new Error('A user with that ID does not exist.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

// Create
async function addUser(user) {
  let newUser = new User(user);
  newUser = await newUser.save(); // error handling?
  return newUser;
}

// Read
async function getUser(userData) {
  const user = await User.findOne(userData);
  return user;
}

async function getFullUser(userData) {
  const user = await User.findOne(userData).select('+password');
  return user;
}

async function getAllUsers() {
  const users = await User.find({});
  return users;
}

// Update
async function updateUser(id, updateData) {
  await checkUserWithId(id);
  const user = await User.findById(id);
  await user.set(updateData);
  await user.validate();
  const updatedUser = await user.save();
  return updatedUser;
}

// Destroy
async function deleteUser(id) {
  await checkUserWithId(id);
  const deletedUser = await User.deleteOne({ _id: id });
  return deletedUser;
}

module.exports = {
  addUser,
  getUser,
  getFullUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
