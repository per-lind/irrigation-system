const express = require('express')
const router = express.Router()

var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('../config');
var TaskList = require('./tasklist');
var messageDao = require('../models/messageDao');

var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var messageDao = new messageDao(docDbClient, config.databaseId, config.collectionId);
var taskList = new TaskList(messageDao);
messageDao.init(function(err) { if(err) throw err; });

router.get('/', taskList.showTasks.bind(taskList));
router.post('/addtask', taskList.addTask.bind(taskList));
router.post('/completetask', taskList.completeTask.bind(taskList));

router.use('/static', express.static('public'))

module.exports = router
