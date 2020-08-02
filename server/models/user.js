const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordUtils = require('../utils/password-utils');

const USER_DAILY_ENTRY_LIMIT = 50;

const requiredString = {
    type: String,
    required: true,
};

const userSchema = new Schema({
    username: {
        ...requiredString,
        minlength: 5,
        maxlength: 30,
        unique: true,
        validate: {
            validator: (name) => {
                return /^[A-Za-z0-9_]+$/.test(name);
            },
            message: (props) => `${props.value} is not a valid username!`
        },
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
    remainingDailyEntries: {
        type: Number,
        max: USER_DAILY_ENTRY_LIMIT,
        min: [0, 'No more daily entries available for this user'],
        default: USER_DAILY_ENTRY_LIMIT,

    },
});

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = passwordUtils.hashPassword(user.password);
    }
    next();
});

userSchema.post('save', (err, doc, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('The given username is already in use!'));
    } else {
        next();
    }
});

userSchema.methods.resetEntryLimit = function() {
    const user = this;
    user.remainingDailyEntries = USER_DAILY_ENTRY_LIMIT;
}

// userSchema.methods.verifyPassword = function(password) {
//     if (passwordUtils.comparePassword(password)) {
// 
//     }
// }

module.exports = mongoose.model('User', userSchema);