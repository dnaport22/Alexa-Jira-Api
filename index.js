'use strict';

const Alexa = require('alexa-sdk');
const Controller = require('./controller.js');

const APP_ID = 'amzn1.ask.skill.81b17d35-dc50-4dfd-9b27-29c2fc49d992';

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var languageStrings = {
  'en-GB': {
    'translation': {
      'ASK_TICKET_NUMBER': 'What\'s the ticket number?',
      'ASK_MESSAGE_BODY': 'What do you want me to say',
      'ASK_TIME_TO_LOG': 'How much time you want me to log?',
      'ASK_AGAIN': 'I did\'t get that, Can you say it again'
    }
  }
};

var handlers = {
  'NewSession': function () {
    this.attributes['ticket'] = 0;
    this.attributes['msg'] = '';
    this.attributes['time_log'] = 0;
    this.attributes['emit_ask'] = '';
    this.attributes['call_type'] = 0;
    this.emit('AddCommentIntent');
  },
  'AddCommentIntent': function () {
    this.attributes['call_type'] = 1;
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value) {
      this.attributes['emit_ask'] = this.t('ASK_MESSAGE_BODY');
      this.emit(':ask', this.t('ASK_TICKET_NUMBER'));
    } else {
      this.attributes['ticket'] = intentObj.slots.TicketNumber.value;
      Controller.addComment('ele2', 'sample');
      this.emit(':ask', this.t('ASK_MESSAGE_BODY'));
    }
  },
  'AddTimeLogIntent': function () {
    this.attributes['call_type'] = 2;
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value) {
      this.attributes['emit_ask'] = 'ASK_TIME_TO_LOG';
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
      this.attributes['ticket'] = intentObj.slots.TimeLog.value;
      this.emit(':ask', this.t('ASK_MESSAGE_BODY'));
    }
  },
  'AddMessageIntent': function () {
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.Message.value) {
      this.emit(':ask', this.t('ASK_AGAIN'));
    } else {
      this.attributes['msg'] = intentObj.slots.Message.value;
      this.emit('Confirm');
    }
  },
  'Confirm': function () {
    if (this.attributes['call_type'] == 1) {
      this.emit(':ask', 'Shall I add ' + this.attributes['msg'] + ' on ticket number' + this.attributes['ticket']);
    } else {
      this.emit(':ask', 'Shall I log ' + this.attributes['time_log'] + ' on ticket number' + this.attributes['ticket']);
    }

  },
  'AMAZON.YesIntent': function() {
    if (this.attributes['call_type'] == 1) {
      this.emit(':ask', 'Adding ' + this.attributes['msg'] + ' on ticket number' + this.attributes['ticket']);
    } else {
      this.emit(':ask', 'Logging ' + this.attributes['time_log'] + ' on ticket number' + this.attributes['ticket']);
    }
  },

  'AMAZON.NoIntent': function() {
    if (this.attributes['call_type'] == 1) {
      this.emit(':ask', 'Cancel Adding ' + this.attributes['msg'] + ' on ticket number' + this.attributes['ticket']);
    } else {
      this.emit(':ask', 'Cancel Logging ' + this.attributes['time_log'] + ' on ticket number' + this.attributes['ticket']);
    }
  }

};