const dbController = require('./dbController');
const iothubController = require('./iothubController');
const usersController = require('./usersController');

module.exports = db => ({
  dbController: dbController(db),
  iothubController,
  usersController,
});
