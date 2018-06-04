const collectionId = require('../../config').collectionId

module.exports = (DocumentDB) => {
  const db = new DocumentDB(collectionId);

  class Observation {

    static findAll(query) {
      let querySpec = '';
      if (query.fromDate) {
        querySpec = {
          query: 'SELECT r.timestamp, r.measures FROM root r WHERE r.timestamp >= @timestamp order by r.timestamp desc',
          parameters: [{
            name: '@timestamp',
            value: query.fromDate || new Date()
          }]
        }
      } else {
        querySpec = {
          query: 'SELECT top 50 r.timestamp, r.measures FROM root r order by r.timestamp desc',
        }
      }
      return db.query(querySpec);
    }
  }

  return Observation;
};
