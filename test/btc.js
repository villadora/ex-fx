var assert = require('chai').assert,
    btc = require('../lib/btc');


describe('btc.js', function() {
    it('realtime', function(done) {
        this.timeout(10000);
        var realtime = btc.realtime;
        realtime.subscribe('row');
        realtime.once('currency', function(stat, cur) {
            assert(stat && cur);
            done();
        });
    });

    it.only('btc', function(done) {
        this.timeout(10000);
        btc.init(function() {
            var bitcoin = btc.money;
            assert(bitcoin(1).to('USD'));
            done();
        });
    });


    it('market', function(done) {
        this.timeout(10000);
        var market = btc.market;
        market.update(function() {
            assert(market.market('USD'));
            done();
        });
    });
});