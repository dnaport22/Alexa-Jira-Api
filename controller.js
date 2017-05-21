var request = require('request');
const HOSTNAME = //;
const COMMENT_PATH =//;

var Controller = {
  'AddComment': function (ticket, comment) {
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
  'AddTimeLog': function (timelog, ticket, comment) {
    var _this = this;

    var data = {
      "comment":  _this.attributes['msg'],
      "issue": _this.attributes['ticket'],
      "timeSpent": _this.attributes['time_log'],
      "date": new Date()
    };

    request.post({
      url: 'http://' + HOSTNAME + COMMENT_PATH,
      form: data
    }, function (error, response, body) {
      _this.emit(':tell', 'time logged');
    });
  }
};

module.exports = Controller;