const express = require('express')
const router = express.Router()

// DocumentDB Connection
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

// IOT HUB Connection
var Client = require('azure-iothub').Client;
var client = Client.fromConnectionString(config.iothubconnection);

const apiController = require('../controllers/apiController')

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("Logged in: " + req.user);
      return next();
    }
    res.status(403).send('Forbidden');
  }

//API Routes
router.get('/', taskList.showTasks.bind(taskList));
// route to test if the user is logged in or not 
router.get('/checkLogin', function(req, res) {
  res.send(req.isAuthenticated() ? '1' : '0');
});

router.post('/addtask', taskList.addTask.bind(taskList));
router.post('/completetask', taskList.completeTask.bind(taskList));
router.get('/invoke', isAuthenticated, (req, res) => apiController.invoke(req, res, client, config.deviceId));
router.get('/blobSAS', isAuthenticated, (req, res) => apiController.blobSAS(req, res));

router.use('/static', express.static('public'))

module.exports = router
