const { ApiWrapper } = require('api-wrapper');
const { entrySchema } = require('./entry');

const api = new ApiWrapper('Entry', entrySchema, ['reports']);

module.exports = api;
