const config = {};

config.endpoint = process.env.DB_ENDPOINT;
config.primaryKey = process.env.DB_PRIMARY_KEY;
config.database = {"id": process.env.DB_ID };
config.collection = { "id": process.env.DB_COLLECTION };

module.exports = config;
