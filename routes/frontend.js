const express = require('express')
const router = express.Router()

//Passport authentication
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var db = require('../db.json');

passport.use(new Strategy(
  function(username, password, cb) {
    if(db[username] != undefined) {
      bcrypt.compare(password, db[username].password, function(err, res) {
        if(err) {
          //Error comparing password
          return cb(err);
        }
        else {
          if(res) {
            //Correct password
            const user = username;
            return cb(null, user);
          }
          else {
            //Password missmatch
            return cb(new Error('Invalid username or password'))
          }
        }
      });
    }
    else {
      //Username not found in json DB
      return cb(err);
    }
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  if(db[id] != undefined) {
    cb(null, id);
  }
  else {
    cb(null, new Error('User ' + id + ' does not exist'))
  }
});

module.exports = function(app) {
  app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  router.use('/', express.static('public'))
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/hej',
    failureFlash : true 
  }));

  app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });
  return router
}

