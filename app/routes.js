const express = require('express');
const router = express.Router();

const passport = require('./passport');
const usersController = require('./controllers/usersController');
const apiController = require('./controllers/apiController');

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());

  // Login with username and password
  app.use('/api/login', passport.authenticateLocal());
  app.post('/api/login', usersController.login);

  // Data for graph
  app.get('/api/data', apiController.data);

  // Use bearer authentication for other routes
  router.use('/', passport.authenticateBearer());

  // Logout route
  router.get('/logout', usersController.logout);

  // Invoke function
  router.get('/invoke', apiController.invoke);

  // Get SAS blob token
  router.get('/blobToken', apiController.blobToken);

  // Namespace routes
  app.use('/api', router);
}

