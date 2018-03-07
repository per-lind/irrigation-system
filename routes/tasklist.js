var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function TaskList(messageDao) {
  this.messageDao = messageDao;
}

TaskList.prototype = {
  showTasks: function(req, res) {
    var self = this;

    var querySpec = {
      query: 'SELECT TOP 10 * FROM root r order by r.timestamp desc'
    };

    self.messageDao.find(querySpec, function(err, items) {
      if (err) {
        throw (err);
      }

      res.json( {
        title: '10 Messages ',
        messages: items
      });
    });
  },

  addTask: function(req, res) {
    var self = this;
    var item = req.body;

    self.messageDao.addItem(item, function(err) {
      if (err) {
        throw (err);
      }

      res.redirect('/');
    });
  },

  completeTask: function(req, res) {
    var self = this;
    var completedTasks = Object.keys(req.body);

    async.forEach(completedTasks, function taskIterator(completedTask, callback) {
      self.messageDao.updateItem(completedTask, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }, function goHome(err) {
      if (err) {
        throw err;
      } else {
        res.redirect('/');
      }
    });
  }
};

module.exports = TaskList;
