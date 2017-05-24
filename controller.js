var request = require('request');
const HOSTNAME = 'alexajira.herokuapp.com';
const COMMENT_PATH = '/jiraapi?type=comment';
const TIME_LOG_PATH = '/jiraapi?type=log_time';

var Controller = {
  'AddComment': function () {
    var _this = this;

    var data = {
      comment: _this.attributes['msg'],
      issue: _this.attributes['ticket']
    };

    request.post({
      url: 'http://' + HOSTNAME + COMMENT_PATH,
      form: data
    }, function (error, response, body) {
      _this.emit(':tell', 'comment added');
    });
  },
  'AddTimeLog': function () {
    var _this = this;
    var time = new Date

    var data = {
      "comment":  _this.attributes['msg'],
      "issue": _this.attributes['ticket'],
      "timeSpent": _this.attributes['time_log'],
      "date": time.toISOString().slice(0,-1)+'+0000'
    };

    request.post({
      url: 'http://' + HOSTNAME + TIME_LOG_PATH,
      form: data
    }, function (error, response, body) {
      _this.emit(':tell', 'time logged');
    });
  }
};

module.exports = Controller;