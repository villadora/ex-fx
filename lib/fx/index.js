var request = require('request'),
    freq = 60 * 60 * 1000,
    Money = require('../util/money'),
    oxr = require('open-exchange-rates');

oxr.set({
    app_id: '8bd9149a82d141738c1af21d3ae4289e'
});


/**
 * Wrapping for money
 */
module.exports.money = new Money();


function update() {
    var now = Date.now();

    oxr.latest(function() {
        module.exports.money.rates = oxr.rates;
        module.exports.money.rebase(oxr.base);
    });


    setTimeout(update, freq + now - Date.now());
}

update();


Object.defineProperty(module.exports, "freq", {
    get: function() {
        return freq;
    },
    set: function(val) {
        freq = val;
    }
});