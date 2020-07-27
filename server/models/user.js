const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true,
};

const userSchema = new Schema({
    username: {
        ...requiredString,
        minlength: 5,
        maxlength: 20,
    },
    password: {
        ...requiredString,
        minlength: 8,
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;