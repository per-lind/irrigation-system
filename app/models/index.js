const DocumentDB = require('../documentdb');

const models = {};

models.Observation = require('./Observation')(DocumentDB);

module.exports = models;
