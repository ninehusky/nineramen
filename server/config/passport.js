const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcryptjs');
const config = require('config');

const API = require('../users/API');
const { ExtractJwt } = require('passport-jwt');

const localOpts = {
  usernameField: 'name',
  passwordField: 'password',
};

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('jwtSecret'),
};

const loginErrorMessage = {
  message: 'The username and/or password given is invalid.',
};

const jwtErrorMessage = {
  message: 'You must be logged in to perform this. Please obtain a JWT and try again.',
};

passport.use(new LocalStrategy(localOpts, async (username, password, done) => {
  try {
    const user = await API.getFullUser({ name: username });
    if (!user) {
      return done(null, false, loginErrorMessage);
    }
    const authConfirm = bcrypt.compareSync(password, user.password);
    if (!authConfirm) {
      return done(null, false, loginErrorMessage);
    }
    user.password = undefined;
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
  try {
    const user = await API.getUser({ _id: jwtPayload.id });
    if (!user) {
      return done(null, false, jwtErrorMessage);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await API.getUser({ _id: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
