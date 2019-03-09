const passport = require('passport');
const localStrategy = require('passport-local');
const bearerStrategy = require('passport-http-bearer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db.json');
const { JWT_SECRET } = require('../config');

// Authentication with username and password
const local = new localStrategy({ passReqToCallback: true }, (req, username, password, done) => {
  // Username not found in json DB
  if (!db[username]) return done(null, false)
  bcrypt.compare(password, db.users[username].password, (err, res) => {
    // Correct password
    if (!err && res) {
      // Generate token
      const token = jwt.sign({ id: username }, JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      req.token = token;
      return done(null, { username: username });
    }
    // Password missmatch or error
    done(null, false);
  });
});

// Authentication with token
const bearer = new bearerStrategy({ passReqToCallback: true }, (req, token, done) => {
  // Verify JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // If token was invalid
    if (err) return done(null, false);
    // If user not found in db
    if (!db[decoded.id]) return done(null, false);
    done(null, { username: decoded.id }, { scope: 'all' });
  });
});

// Authentication for raspberry pi
const pi = new bearerStrategy({ passReqToCallback: true }, (req, token, done) => {
  if (db.tokens.includes(token)) {
    return done(null, { username: 'pi' }, { scope: 'all' });
  }
  return done(null, false);
});

passport.use('local', local);
passport.use('bearer', bearer);
passport.use('pi', pi);

module.exports = {
  initialize() {
    return passport.initialize();
  },

  authenticateLocal() {
    return passport.authenticate('local', { session: false });
  },

  authenticateBearer() {
    return passport.authenticate('bearer', { session: false });
  },

  authenticatePi() {
    return passport.authenticate('pi', { session: false });
  },
}
