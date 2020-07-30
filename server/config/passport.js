const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');

const passwordUtils = require('../utils/password-utils');
const User = require('../models/user');


passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
        username: username,
    }).then((user) => {
        if (!user) {
            return done(null, false, { message: 'The username and/or password given is invalid.' });
        }
        bcrypt.compare(password, user.password)
            .then((result) => {
                if (result) {
                    // passwords match
                    return done(null, user);
                }
                return done(null, false, { message: 'The username and/or password given is invalid.' });
            })
            .catch((error) => {
                return done(error);
            });
    })
        .catch((error) => {
            return done(error);
        });
}));

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    User.findById(jwt_payload._id, (err, user) => {
        if (err) {
            done(err);
        }
        if (!user) {
            done(null, false);
        }
        done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
