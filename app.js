'use strict';


let TelegramBot = require('node-telegram-bot-api');

const token = '238471408:AAG55S_j7XegBq1GmEJVJI1BN-sbJpEpzSQ';

// See https://developers.openshift.com/en/node-js-environment-variables.html
const port = process.env.OPENSHIFT_NODEJS_PORT || 443;
const host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

let bot = new TelegramBot(token, {webHook: {port: port, host: host}});
// OpenShift enroutes :443 request to OPENSHIFT_NODEJS_PORT
bot.setWebHook('https://webseminar-bot.herokuapp.com:443/bot'+token);

bot.on('message', function (msg) {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, "I'm alive!");
});

require('./handlers')(bot);