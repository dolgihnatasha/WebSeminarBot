"use strict";


module.exports = function (bot) {
    var MongoClient = require('mongodb').MongoClient;
    var mongoUri = 'mongodb://db_user:2611natasha@ds050539.mlab.com:50539/webseminardata';


    function sendCreateReply(id) {
        return function (res) {
            if (res.insertedCount == 1) {
                bot.sendMessage(id, 'Событие успешно добавлено!');
            } else {
                bot.sendMessage(id, 'Произошла ошибка. Попробуйте позже');
            }
        }
    }

    function isEventExist(ev, col) {
        return function () {
            return col.find(ev).toArray();
        }
    }

    function saveEvent(ev, col, id) {
        return function (res) {
            if (res.length === 0) {
                return col.insertOne(ev);
            } else {
                bot.sendMessage(id, 'Такое событие уже существует');
            }
        }
    }

    var options = {
        reply_markup: {
            inline_keyboard: [[{
                text: 'Еженедневно',
                callback_data: 'daily'}], [{
                text: 'Еженедельно',
                callback_data: 'weekly'}], [{
                text: 'Без повторений',
                callback_data: 'no_repeat'}
            ]]
        }
    };
    var toText = {
        daily: 'Еженедневно',
        weekly: 'Еженедельно',
        no_repeat: 'Без повтрений'
    };
    var date_options = {
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: "short"
    };

    var msInDay = 1000 * 60 * 60 * 24;

    // alert( date.toLocaleString("ru", options) ); // среда, 31 декабря 2014 г. н.э. 12:30:00



    function sendEvents(id) {
        return function (text) {
            bot.sendMessage(id, text);
        }
    }

    MongoClient.connect(mongoUri, function (err, db) {
        console.log('hey', err);
        function formatEvents(res) {
            var formatted = '';
            res = res.filter(function (e) {
                return !(e.repeat == 'no_repeat' && e.event_date - Date.now() < 0);
            });
            if (res.length == 0) {
                return 'Событий не запланировано';
            }
            // console.log(res)
            for (var i = 0; i < res.length; i++) {
                if (res[i].event_date - Date.now() < 0) {
                    var d = res[i].event_date;
                    var day = new Date();
                    day.setHours(d.getHours());
                    day.setMinutes(d.getMinutes());
                    day.setSeconds(d.getSeconds());
                    switch (res[i].repeat) {
                        case 'daily':
                            if (day <= Date.now()) {
                                day.setDate(day.getDay() + 1)
                            }
                            break;

                        case 'weekly':
                            var r = Math.trunc((Date.now() - d) / msInDay);
                            if (day <= Date.now()) {
                                day.setDate(day.getDate() + r % 7);
                            }
                            break;
                    }
                    res[i].event_date = day;
                }
                d = (res[i].event_date).getTimezoneOffset();
                (res[i].event_date).setMinutes((res[i].event_date).getMinutes() + (d + 60*5));
                var s = res[i].event_name + ' ' + (res[i].event_date).toLocaleString('ru-RU', date_options) + ' (' +
                    toText[res[i].repeat].toLowerCase() + ')';
                formatted += s + '\n';
            }
            return formatted;

        }

        if (!err) {
            var events = db.collection('events');
            var subscribers = db.collection('subscribers');

            bot.on('callback_query', function onCallbackQuery(msg) {
                var fromID = msg.from.id;
                var chatID = msg.message.chat.id;
                event[msg.from.id].repeat = msg.data;
                bot.editMessageText(toText[msg.data], {
                        chat_id: msg.message.chat.id,
                        message_id: msg.message.message_id
                    })
                    .then(isEventExist(event[fromID], events))
                    .then(saveEvent(event[fromID], events, chatID))
                    .then(sendCreateReply(chatID));
            });

            bot.onText(/\/echo (.+)/, function (msg, match) {
                var fromId = msg.from.id;
                var resp = match[1];
                bot.sendMessage(fromId, resp);
            });

            bot.onText(/\/subscribe/, function (msg) {
                var fromId = msg.from.id;
                subscribers.find({id: fromId})
                    .toArray()
                    .then(function (result) {
                        if (result.length === 0) {
                            subscribers.insertOne(msg.from);
                            bot.sendMessage(fromId, "Вы подписались на рассылку!");
                        } else {
                            bot.sendMessage(fromId, "Вы уже подписанны");
                        }
                    });
            });

            var waiting = {};
            var event = {};
            bot.onText(/\/addevent/, function (msg){
                var fromID = msg.from.id;
                waiting[fromID] = {};
                waiting[fromID].event_name = true;
                bot.sendMessage(fromID, 'Введите название события:')
            });

            bot.onText(/\/events/, function (msg) {
                var fromID = msg.from.id;
                events.find({}, {_id: 0})
                    .toArray()
                    .then(formatEvents)
                    .then(sendEvents(fromID));
            });

            bot.on('message', function (msg) {
                var fromID = msg.from.id;
                var chatID = msg.chat.id;
                if (msg.text.match(/\/chancel/)) {
                    event[fromID] = {};
                    waiting[fromID] = {};
                } else if (waiting[fromID] && waiting[fromID].event_name) {
                    event[fromID] = {};
                    event[fromID].event_name = msg.text;
                    waiting[fromID].event_name = false;
                    waiting[fromID].event_date = true;
                    bot.sendMessage(chatID, 'Введите дату и врямя в формате ГГГГ-ММ-ДД ЧЧ:ММ');
                } else if (waiting[fromID] && waiting[fromID].event_date){
                    var d = new Date(msg.text.replace(' ','T') + '+05:00');
                    if (!isNaN(d.valueOf())){
                        event[fromID].event_date = d;
                        waiting[fromID] = {};
                        bot.sendMessage(msg.from.id, 'Частота повторения:', options);
                    } else if (msg.text == 'test') {
                        event[fromID].event_date = new Date();
                        waiting[fromID] = {};
                        bot.sendMessage(msg.from.id, 'Частота повторения:', options);
                    } else {
                        bot.sendMessage(chatID, 'Время введено неверно. Введите дату и врямя ' +
                            'в формате ГГГГ-ММ-ДД ЧЧ:ММ. \nДля отмены  отправте /chancel')
                    }
                }
            });
        }

    });
    bot.sendMessage(103745732, 'i\'m on');
};
