var fx = require('./fx'),
    btc = require('./btc');


fx.init(function() {
    btc.init(function() {
        require('./algo')(fx.money, btc.money);
    });
});