const dbController = require('./dbController');
const iothubController = require('./iothubController');
const usersController = require('./usersController');

module.exports = (db, websocket) => ({
  dbController: dbController(db, websocket),
  iothubController: iothubController(db),
  usersController,
});
