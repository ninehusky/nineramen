const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const config = require('config');

const { Schema } = mongoose.Schema;

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
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, config.get('user.saltWorkValue'));
  }
  next();
});