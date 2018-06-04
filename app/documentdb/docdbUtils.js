const DocDBUtils = {
  getDatabase: (client, databaseUrl) => {
    console.log('Connecting to database');
    return client.readDatabaseAsync(databaseUrl).then(result => {
      console.log('Connection established');
      return result;
    });
  },

  getOrCreateCollection: function(client, collectionUrl) {
    console.log('Getting collection');
    return client.readCollectionAsync(collectionUrl).then(result => {
      console.log('Collection found');
      return result;
    }).catch(error => {
      console.log(error);
      if (error.code === 404) {
        console.log('Collection not found');
      }
    });
  }
};

module.exports = DocDBUtils;
