var TelegramBot = require('node-telegram-bot-api');
var token = '238471408:AAG55S_j7XegBq1GmEJVJI1BN-sbJpEpzSQ';
var bot = new TelegramBot(token, {polling: true});


var MongoClient = require('mongodb').MongoClient;
var mongoUri = 'mongodb://db_user:2611natasha@ds050539.mlab.com:50539/webseminardata';

function switchOnNotifications(events_collection, subscribers_collection) {

    events_collection.find({}, {_id: 0})
        .toArray()
        .then(function (events) {
            subscribers_collection.find({}, {_id: 0})
                .toArray()
                .then(function (subscribers) {
                    // console.log(events, subscribers)
                    // sendMessages(events, subscribers)
                });
        })
}

function sendMessages(events, subscribers) {

    for (var i = 0; i < events.length; i++) {
        if (events[i].event_date)
        for (var j = 0; i < subscribers.length; j++) {
            console.log(subscribers[j]);
            // bot.sendMessage(subscribers[j].id, events[j]);
        }
    }
}

MongoClient.connect(mongoUri, function (err, db) {
    if (!err) {
        console.log('hey');
        var events = db.collection('events');
        var subscribers = db.collection('subscribers');

        switchOnNotifications(events, subscribers);
    }
});

var n = new Date();

// console.log(n);
// console.log(t.toString());
// console.log(t-n);
setTimeout(initTimers, 0, 1);
bot.sendMessage(103745732, 'i\'m on');
var i = 1;
function initTimers() {
    callback(1);
    setInterval(callback, 1000*10);
}

function callback() {
    console.log(i);
    bot.sendMessage(103745732, i.toString());
    i += 1;
}

