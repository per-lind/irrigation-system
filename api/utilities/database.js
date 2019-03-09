const MongoClient = require('mongodb').MongoClient;
const { MONGODB_CONNECTION, MONGODB_DATABASE } = require('../config');

// TODO: connect to database
const database = () => {
  return MongoClient.connect(MONGODB_CONNECTION, { useNewUrlParser: true })
    .then(client => client.db(MONGODB_DATABASE));
}

module.exports = database;
