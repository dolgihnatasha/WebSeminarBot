"use strict";


module.exports = function (bot) {
    const MongoClient = require('mongodb').MongoClient;

    const mongoUri = 'mongodb://dbuser:2611natasha@ds050539.mlab.com:50539/webseminardata';

    MongoClient.connect(mongoUri, function (err, db) {

        let connection = db;

        let subscribers = [103745732];

        // Matches /echo [whatever]
        bot.onText(/\/echo (.+)/, function (msg, match) {

            let fromId = msg.from.id;
            let resp = match[1];
            bot.sendMessage(fromId, resp);
        });



        bot.onText(/\/subscribe/, function (msg) {
            console.log(msg);
            console.log(subscribers);
            let fromId = msg.from.id;
            if (msg.from.id == msg.chat.id) {
                if (subscribers.indexOf(msg.from.id) >= 0) {
                    bot.sendMessage(fromId, "Вы уже подписанны на рассылку!");
                } else {
                    subscribers.push(msg.from.id);
                    bot.sendMessage(fromId, "Вы подписались на рассылку!");
                }
            }
        });



        bot.onText(/\/addevent (.+); (.+)/, function (msg, match){
            // console.log(msg);
            let fromId = msg.from.id;
            let messageId = msg.message_id;
            bot.sendMessage(fromId, 'Событие ' + match[1] + ' добавлено. ' + match[2])

        });

    });


// let options = {
//     webHook: {
//         port: 443,
//         key: __dirname + '\\key.pem',
//         cert: __dirname + '\\crt.pem'
//     }
// };
// console.log(options.webHook.key);
//
// let bot = new TelegramBot(token, options);
// bot.setWebHook('localhost:443/bot' + token, require('./ssl_data').crt);

// bot.on('message', function (msg) {
//     let chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'hello!', {caption: 'Lovely kittens'});
// });

// Any kind of message
// bot.sendMessage(USER, 'How old are you?', opts)
//     .then(function (sended) {
//         let chatId = sended.chat.id;
//         let messageId = sended.message_id;
//         bot.onReplyToMessage(chatId, messageId, function (message) {
//             console.log('User is %s years old', message.text);
//         });
//     });
};
