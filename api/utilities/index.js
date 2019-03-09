const passport = require('./passport');
const database = require('./database').default;
const iothub = require('./iothub');

module.exports = {
  passport,
  database,
  iothub,
};
