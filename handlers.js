"use strict";


module.exports = function (bot) {

    var subscribers = [103745732];
    console.log('hey');

    bot.onText(/\/echo (.+)/, function (msg, match) {
        var fromId = msg.from.id;
        var resp = match[1];
        bot.sendMessage(fromId, resp);
    });


    bot.onText(/\/subscribe/, function (msg) {
        console.log(msg);
        console.log(subscribers);
        var fromId = msg.from.id;
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
        var fromId = msg.from.id;
        var messageId = msg.message_id;
        bot.sendMessage(fromId, 'Событие ' + match[1] + ' добавлено. ' + match[2])

    });

    // var MongoClient = require('mongodb').MongoClient;
    // var mongoUri = 'mongodb://dbuser:2611natasha@ds050539.mlab.com:50539/webseminardata';
    // MongoClient.connect(mongoUri, function (err, db) {
    //
    //     var connection = db;
    //
    //
    //
    //     // Matches /echo [whatever]
    //
    //
    // });
    // bot.on('message', function (msg) {
    //     var chatId = msg.chat.id;
    //     bot.sendMessage(chatId, 'hello!', {caption: 'Lovely kittens'});
    // });

    // Any kind of message
    // bot.sendMessage(USER, 'How old are you?', opts)
    //     .then(function (sended) {
    //         var chatId = sended.chat.id;
    //         var messageId = sended.message_id;
    //         bot.onReplyToMessage(chatId, messageId, function (message) {
    //             console.log('User is %s years old', message.text);
    //         });
    //     });
};
