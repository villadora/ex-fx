var Money = require('../util/money'),
    market = require('./market'),
    realtime = require('./realtime');

module.exports = {
    market: market,
    realtime: realtime
};


var btcRates = {
    BTC: 1
}, btc = module.exports.money = Money("BTC");

btc.rates = btcRates;