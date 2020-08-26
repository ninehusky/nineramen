const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('user.databaseUrl'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
