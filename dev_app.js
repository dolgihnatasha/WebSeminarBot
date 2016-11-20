

var TelegramBot = require('node-telegram-bot-api');
var token = '238471408:AAG55S_j7XegBq1GmEJVJI1BN-sbJpEpzSQ';
var bot = new TelegramBot(token, {polling: true});

require('./handlers')(bot);
console.log('asdfrtgyhj');
