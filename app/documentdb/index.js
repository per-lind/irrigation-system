const DocumentDBClient = require('documentdb').DocumentClient;
const uriFactory = require('documentdb').UriFactory;
const Promise = require('bluebird');
const config = require('../../config');
const docdbUtils = require('./docdbUtils');

// DocumentDB Connection
Promise.promisifyAll(DocumentDBClient.prototype);
const client = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

class DocumentDB {
  constructor(collectionId) {
    this.databaseUrl = uriFactory.createDatabaseUri(config.databaseId);
    this.collectionUrl = uriFactory.createDocumentCollectionUri(config.databaseId, collectionId);
    this.databaseId = config.databaseId;
    this.collectionId = collectionId;
    this.database = null;
    this.collection = null;
    this.init();
  }

  // Connect to database and get collection
  init() {
    docdbUtils.getDatabase(client, this.databaseUrl).then(database => {
      this.database = database;
      docdbUtils.getOrCreateCollection(client, this.collectionUrl).then(collection => {
        this.collection = collection;
      })
    }).catch(err => console.log(err));
  }

  // Query database
  query(querySpec) {
    return new Promise((resolve, reject) => {
      client.queryDocuments(this.collectionUrl, querySpec).toArray((error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = DocumentDB;
