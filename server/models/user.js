const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const passwordUtils = require('../utils/password-utils');

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR) || 10;

const requiredString = {
    type: String,
    required: true,
};

const userSchema = new Schema({
    username: {
        ...requiredString,
        minlength: 5,
        maxlength: 20,
        unique: true,
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

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    user.password = bcrypt.hashSync(user.password, 10); 
    next();
    // passwordUtils.hashPassword(user.password)
    //     .then((hashedPassword) => {
    //         user.password = hashedPassword;
    //         console.log('user passwd ', hashedPassword);
    //         next();
    //     })
    //     .catch((error) => {
    //         next(error);
    //     });
});

userSchema.post('save', (err, doc, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('The given username is already in use!'));
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);