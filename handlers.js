"use strict";


module.exports = function (bot) {



    var MongoClient = require('mongodb').MongoClient;
    var mongoUri = 'mongodb://db_user:2611natasha@ds050539.mlab.com:50539/webseminardata';
    MongoClient.connect(mongoUri, function (err, db) {

        var events = db.collection('events');
        var subscribers = [103745732];
        console.log('hey', err);

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
        var waiting = {};
        var event = {};
        bot.onText(/\/addevent/, function (msg){
            // console.log(msg);
            var fromID = msg.from.id;
            waiting[fromID] = {};
            waiting[fromID].event_name = true;
            bot.sendMessage(fromID, 'Введите название события:')

        });

        bot.on('message', function (msg) {
            var fromID = msg.from.id;
            if (waiting[fromID] && waiting[fromID].event_name) {
                event[fromID] = {};
                event[fromID].event_name = msg.text;
                waiting[fromID].event_name = false;
                waiting[fromID].event_date = true;
                console.log(event[fromID]);
                bot.sendMessage(fromID, 'Введите дату и врямя в формате ГГГГ-ММ-ДД ЧЧ:ММ');
            } else if (waiting[fromID] && waiting[fromID].event_date){
                var d = new Date(msg.text.split.join('T') + '+05:00');
                if (!isNaN(d.valueOf())){
                    event[fromID].event_date = d;
                    waiting[fromID] = {};
                    console.log(event[fromID]);
                    events.insertOne(event[fromID]);
                    bot.sendMessage(fromID, 'Событие успешно добавлено!');
                }
            }
            // bot.sendMessage(chatId, 'hello!', {caption: 'Lovely kittens'});
        });

    });


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
