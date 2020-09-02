const { ApiWrapper } = require('api-wrapper');
const user = require('./user');
const { User } = user;
const { userSchema } = user;

console.log(User);

const api = new ApiWrapper('User', userSchema, ['password', 'reports']);

module.exports = api;
