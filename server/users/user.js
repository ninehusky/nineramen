const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const report = require('api-wrapper').Report;

const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

const userSchema = new Schema({
  name: {
    ...requiredString,
    minlength: 5,
    maxlength: 30,
    unique: true,
    validate: {
      validator: (name) => /^[A-Za-z0-9_-]+$/.test(name),
      message: (props) => 'That is not a valid username.',
    },
  },
  password: {
    ...requiredString,
    minlength: 8,
    select: false,
  },
  userType: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  reports: {
    type: [report],
    select: false,
  },
});

userSchema.plugin(uniqueValidator);

userSchema.methods.verifyPassword = async function(password) {
  const User = mongoose.model('User', userSchema);
  const user = await User.findById(this._id).select('+password');
  const result = bcrypt.compareSync(password, user.password);
  return result;
};

userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, config.get('user.saltWorkValue'));
  }
  next();
});

module.exports.userSchema = userSchema;
