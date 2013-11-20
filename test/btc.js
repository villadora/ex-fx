var assert = require('chai').assert;

describe('btc.js', function() {
    it('realtime', function(done) {
        this.timeout(10000);
        var realtime = require('../lib/btc/realtime');
        realtime.subscribe('row');
        realtime.once('currency', function(stat, cur) {
            assert(stat && cur);
            done();
        });
    });

    it.only('market', function(done) {
        this.timeout(10000);
        var btc = require('../lib/btc');
        setTimeout(function() {
            assert(btc.market.market('USD'));
            done();
        }, 5000);
    });
});