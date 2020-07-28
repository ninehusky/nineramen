const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passwordUtils = require('../utils/password-utils');
const User = require('../models/user');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'keyboard cat', // TODO: replace secret with something actually secret
};

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
        username: username,
    }).then((user) => {
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }).catch((error) => {
        return done(error);
    });
}));

// TODO: serialize

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
})

passport.use(new JwtStrategy(options, (jwt_payload, done) => {

}));