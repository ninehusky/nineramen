const { ApiWrapper } = require('api-wrapper');
const user = require('./user');
const { User } = user;
const { userSchema } = user;

class UserApiWrapper extends ApiWrapper {
  async verifyPassword(id, password) {
    await this.getById(id);
    return this.model.findById(id).verifyPassword(password);
  }
}

const api = new ApiWrapper('User', userSchema, ['reports']);

async function checkAuthorized(changerId, changeeId) {
  const changer = await api.getById(changerId);
  const changee = await api.getById(changeeId);
  if (changer._id !== changee._id) {
    if (changee.userType === 'admin' || changer.userType === 'user') {
      const error = new Error('You are not authorized to make this change.');
      error.statusCode = 403;
      throw error;
    }
  }
}

module.exports.checkAuthorized = checkAuthorized;
module.exports = api;
