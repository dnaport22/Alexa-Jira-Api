'use strict';

const Alexa = require('alexa-sdk');
const http = require('https');

const APP_ID = 'amzn1.ask.skill.81b17d35-dc50-4dfd-9b27-29c2fc49d992';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var languageStrings = {
  'en-GB': {
    'translation': {
      'HELP_MESSAGE': 'I can add time log or comment on your jira tickets.',
      'MESSAGE_REQUEST': 'What do you want me to add in the comment?',
      'TIME_REQUEST': 'How much time you want me to log?',
      'TICKET_NUMBER_REQUEST': 'What is the ticket number? ...Say the last number'
    }
  }
};

var handlers = {
  'LaunchRequest': function () {
    this.emit(':tell', this.t('HELP_MESSAGE'));
  },
  'AddCommentIntent': function () {
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value) {
      var slotToElicit = 'TicketNumber';
      var speechOutput = this.t('TICKET_NUMBER_REQUEST');
      var repromptSpeech = speechOutput;
      this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    } else if (!intentObj.slots.Message.value) {
      var slotToElicit = 'Message';
      var speechOutput = this.t('MESSAGE_REQUEST');
      var repromptSpeech = speechOutput;
      var cardContent = this.t('MESSAGE_REQUEST');
      var cardTitle = 'Message';
      var updatedIntent = intentObj;
      this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
  },
  'LogTimeIntent': function () {
    var intentObj = this.event.request.intent;
    if (!intentObj.slots.TicketNumber.value) {
      var slotToElicit = 'TicketNumber';
      var speechOutput = this.t('TICKET_NUMBER_REQUEST');
      var repromptSpeech = speechOutput;
      this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    } else if (!intentObj.slots.TimeLog.value) {
      var slotToElicit = 'TimeLog';
      var speechOutput = this.t('TIME_REQUEST');
      var repromptSpeech = speechOutput;
      this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    } else if (!intentObj.slots.Message.value) {
      var slotToElicit = 'Message';
      var speechOutput  = this.t('MESSAGE_REQUEST');
      var repromptSpeech = speechOutput;
      this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
  },
  'AMAZON.HelpIntent': function () {
      var speechOutput = HELP_MESSAGE;
      var reprompt = HELP_REPROMPT;
      this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
      this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function () {
      this.emit(':tell', STOP_MESSAGE);
  }
};
