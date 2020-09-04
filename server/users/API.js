const { ApiWrapper } = require('api-wrapper');
const user = require('./user');
const mongoose = require('mongoose');
const { userSchema } = user;

const User = mongoose.model('User', userSchema);

class UserApiWrapper extends ApiWrapper {
  async verifyPassword(id, password) {
    await this.getById(id);
    const user = await this.model.findById(id);
    const result = await user.verifyPassword(password);
    return result;
  }
}

const api = new UserApiWrapper(User, ['name', 'password', 'userType']);

async function checkAuthorized(changerId, changeeId) {
  const changer = await api.getById(changerId);
  const changee = await api.getById(changeeId);
  console.log('changer', changer._id, '\nchangee', changee._id);
  if ((String)(changer._id) !== String(changee._id)) {
    if (changee.userType === 'admin' || changer.userType === 'user') {
      const error = new Error('You are not authorized to make this change.');
      error.statusCode = 403;
      throw error;
    }
  }
}

module.exports.checkAuthorized = checkAuthorized;
module.exports.api = api;
