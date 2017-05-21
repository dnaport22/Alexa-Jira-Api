var http = require('https');

function Controller () {
  this._HOSTNAME = //;
  this._COMMENT_PATH = //;
  this.RESPONSE = 'Nothing happened.';
}

Controller.prototype.addComment = function (ticket, comment) {
  var data = {
    "comment": comment,
    "issue": ticket
  };

  var req = http.request(this.getOptions(), function(res) {
    res.on('data', function(body) {
      if (body.toString() == 'true') {
        this.setResponse('Comment added.');
      }
    });
  });

  req.on('error', function(e) {
    this.setResponse('Error occurred while adding comment.');
  });

  req.end(JSON.stringify(data));
};

Controller.prototype.addTimeLog = function (timelog, ticket, comment) {
  var data = {
    "comment": "Sample comments from alexa",
    "issue": "TP-1",
    "timeSpent": timelog,
    "date": new Date()
  };

  var req = http.request(this.getOptions(), function(res) {
    res.on('data', function(body) {
      if (body.toString() == 'true') {
        this.RESPONSE = 'Time logged.';
      }
    });
  });

  req.on('error', function(e) {
    this.RESPONSE = 'Error occurred while logging time.';
  });

  //req.write(JSON.stringify(data));
  req.end(JSON.stringify(data));
};

Controller.prototype.getOptions = function () {
  return options = {
    'method': 'POST',
    'hostname': this.getHostname(),
    'port': null,
    'path': this.getCommentPath(),
    'headers': {
      'content-type': 'application/json'
    }
  };
};

Controller.prototype.getResponse = function () {
  return this.RESPONSE;
};

Controller.prototype.setResponse = function (res) {
  this.RESPONSE = res;
};

Controller.prototype.getHostname = function () {
  return this._HOSTNAME;
};

Controller.prototype.getCommentPath = function () {
  return this._COMMENT_PATH;
};

module.exports = Controller;