'use strict';


var TelegramBot = require('node-telegram-bot-api');

var token = '238471408:AAG55S_j7XegBq1GmEJVJI1BN-sbJpEpzSQ';

var port = process.env.PORT || 443;
var host = '0.0.0.0';

var bot = new TelegramBot(token, {webHook: {port: port, host: host}});
bot.setWebHook('https://webseminar-bot.herokuapp.com/:443/bot'+token);

require('./handlers')(bot);