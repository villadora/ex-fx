var request = require('request'),
    freq = 60 * 60 * 1000,
    EventEmitter = require('events').EventEmitter,
    Money = require('../util/money'),
    oxr = require('open-exchange-rates');

oxr.set({
    app_id: '8bd9149a82d141738c1af21d3ae4289e'
});


module.exports = new EventEmitter();
module.exports.money = new Money();


var cbs = [];
module.exports.init = function(callback) {
    cbs.push(callback);
    update();
};


function update() {
    var now = Date.now();

    oxr.latest(function() {
        module.exports.money.rates = oxr.rates;
        module.exports.money.rebase(oxr.base);
        if (cbs.length) {
            var fns = cbs.concat();
            cbs = [];
            fns.map(function(fn) {
                fn();
            });
        }
    });

    setTimeout(update, freq + now - Date.now());
}



Object.defineProperty(module.exports, "freq", {
    get: function() {
        return freq;
    },
    set: function(val) {
        freq = val;
    }
});