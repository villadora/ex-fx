describe('fx.js', function() {
    it('fx', function(done) {
        this.timeout(10000);
        var fx = require('../lib/fx');
        setTimeout(function() {
            console.log(fx.money(1).to('CNY'));
            done();
        }, 2000);
    });
});