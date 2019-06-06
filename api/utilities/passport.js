const passport = require('passport');
const localStrategy = require('passport-local');
const bearerStrategy = require('passport-http-bearer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, AUTH_TOKEN } = require('../config');

const getUser = (db, username) =>
  db.collection('users').findOne({ username });

// Authentication with username and password
const local = db => new localStrategy({ passReqToCallback: true }, (req, username, password, done) => {
  // Find user in db
  getUser(db, username)
  .then(user => {
    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err, res) => {
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
  })
  // Something wrong with db connection
  .catch(error => {
    console.log("Failed to retrieve user from db: ", error);
    done(null, false);
  });
});

// Authentication with token
const bearer = new bearerStrategy({ passReqToCallback: true }, (req, token, done) => {
  // Verify JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // If token was invalid
    if (err) return done(null, false);
    done(null, { username: decoded.id }, { scope: 'all' });
  });
});

// Authentication for raspberry pi
const pi = new bearerStrategy({ passReqToCallback: true }, (req, token, done) => {
  if (AUTH_TOKEN === token) {
    return done(null, { username: 'pi' }, { scope: 'all' });
  }
  return done(null, false);
});

module.exports = db => {
  passport.use('local', local(db));
  passport.use('bearer', bearer);
  passport.use('pi', pi);

  return {
    initialize: () => passport.initialize(),
    authenticateLocal: () =>passport.authenticate('local', { session: false }),
    authenticateBearer: () => passport.authenticate('bearer', { session: false }),
    authenticatePi: () => passport.authenticate('pi', { session: false }),
  }
};
