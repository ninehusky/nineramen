const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

userSchema.pre('save', function (next) {
    const user = this;
    const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR);
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        } 
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.post('save', (err, doc, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('The given username is already in use!'));
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(password, next) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return next(err);
        }
        next(null, isMatch);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = User;