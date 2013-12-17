var Money = require('../util/money'),
    market = require('./market'),
    EventEmitter = require('events').EventEmitter,
    realtime = require('./realtime');

module.exports = new EventEmitter();

module.exports.market = market;
module.exports.realtime = realtime;


var btcRates = {
    BTC: 1
}, btc = module.exports.money = Money("BTC");

btc.rates = btcRates;


var price = "lastest_price";

module.exports.init = function(callback) {
    realtime.subscribe('row');
    realtime.refresh(function() {
        var symbols = realtime.symbol();

        Object.keys(symbols).map(function(key) {
            return symbols[key];
        }).forEach(function(stat) {
            btcRates[stat.currency] = stat[price];
        });

        callback && callback();
    });
};


realtime.on('currency', function(stat, currency) {
    btcRates[currency] = stat[price];
});