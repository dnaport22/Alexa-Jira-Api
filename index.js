'use strict';

const Alexa = require('alexa-sdk');
const controller = require('./controller.js');
var http = require('https');

const APP_ID = //;

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.resources = languageStrings;
  alexa.registerHandlers(newSessionHandler, controller);
  alexa.execute();
};

var languageStrings = {
  'en-GB': {
    'translation': {
      'ASK_TICKET_NUMBER': 'What\'s the ticket number?',
      'ASK_MESSAGE_BODY': 'What do you want me to say',
      'ASK_TIME_TO_LOG': 'How much time you worked on this ticket?',
      'ASK_AGAIN': 'I did\'t get that, Can you say it again',
      'HELP_TEXT': 'dna is ready, Say log time or comment on ticket',
      'UNHANDLED_TEXT': 'Sorry, I think flare is sleeping.'
    }
  }
};

var newSessionHandler = {
  'NewSession': function () {
    this.attributes['ticket'] = 0;
    this.attributes['msg'] = '';
    this.attributes['time_log'] = 0;
    this.attributes['emit_ask'] = '';
    this.attributes['call_type'] = 0;
    this.emit(':ask', this.t('HELP_TEXT'));
  },
  'AddCommentIntent': function () {
    this.attributes['call_type'] = 1;
    this.attributes['emit_ask'] = this.t('ASK_MESSAGE_BODY');
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value ) {
      this.emit(':ask', this.t('ASK_TICKET_NUMBER'));
    } else {
      this.attributes['ticket'] = intentObj.slots.TicketNumber.value;
      this.emit(':ask', this.t('ASK_MESSAGE_BODY'));
    }
  },
  'AddTimeLogIntent': function () {
    this.attributes['call_type'] = 2;
    this.attributes['emit_ask'] = this.t('ASK_TIME_TO_LOG');
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value) {
      this.emit(':ask', this.t('ASK_TICKET_NUMBER'));
    } else {
      this.attributes['ticket'] = intentObj.slots.TicketNumber.value;
      this.emit(':ask', this.t('ASK_TIME_TO_LOG'));
    }
  },
  'AddTicketNumberIntent': function () {
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value) {
      this.emit(':ask', this.t('ASK_AGAIN'));
    } else {
      this.attributes['ticket'] = intentObj.slots.TicketNumber.value;
      this.emit(':ask', this.attributes['emit_ask']);
    }
  },
  'AddTimeIntent': function () {
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TimeLog.value) {
      this.emit(':ask', this.t('ASK_AGAIN'));
    } else {
      this.attributes['time_log'] = intentObj.slots.TimeLog.value;
      this.emit(':ask', this.t('ASK_MESSAGE_BODY'));
    }
  },
  'AddMessageIntent': function () {
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.Message.value) {
      this.emit(':ask', this.t('ASK_AGAIN'));
    } else {
      this.attributes['msg'] = intentObj.slots.Message.value;
      if (this.attributes['call_type'] == 1) {
        this.emit(':ask', 'Shall I add ' + this.attributes['msg'] + ' for ' + this.attributes['ticket']);
      } else {
        this.emit(':ask', 'Shall I log ' + this.attributes['time_log'] + ' for ' + this.attributes['ticket']);
      }
    }
  },
  'AMAZON.YesIntent': function() {
    if (this.attributes['call_type'] == 1) {
      //this.emit(':tell', 'Adding ' + this.attributes['msg'] + ' on ticket number' + this.attributes['ticket']);
      this.emit('AddComment');
    } else {
      //this.emit(':tell', 'Logging ' + this.attributes['time_log'] + ' on ticket number' + this.attributes['ticket']);
      this.emit('AddTimeLog');
    }
  },

  'AMAZON.NoIntent': function() {
    if (this.attributes['call_type'] == 1) {
      this.emit(':ask', 'Cancel Adding ' + this.attributes['msg'] + ' on ticket number' + this.attributes['ticket']);
    } else {
      this.emit(':ask', 'Cancel Logging ' + this.attributes['time_log'] + ' on ticket number' + this.attributes['ticket']);
    }
  },
  'Unhandled': function () {
    this.emit(':tell', this.t('UNHANDLED_TEXT'));
  }
};