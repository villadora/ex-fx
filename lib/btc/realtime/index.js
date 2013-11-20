var request = require('request'),
    WebSocket = require('ws'),
    EventEmitter = require('events').EventEmitter,
    htmlparser = require('htmlparser'),
    select = require('soupselect').select,
    _ = require('underscore'),
    debug = require('debug')('ex-fx:btc-realtime'),
    symbols = {},
    symbols2market = {};

var trend = {};

if (!_.str)
    _.str = require('underscore.string'), _.mixin(_.str.exports());

var ws;

var sendCommand = (function() {
    ws || newWs();

    return function(action, channel) {
        var obj = {
            "action": action,
            "channel": channel
        };

        if (ws.readyState != WebSocket.OPEN)
            ws.once('open', function() {
                ws.send(JSON.stringify(obj), function(err) {
                    if (err) {
                        ws.close();
                        ws.once('close', function() {
                            ws.removeAllListeners();
                            newWs();
                            setTimeout(sendCommand.call(this, action, channel), 5000);
                        });
                    }
                });
            });
        else {
            var ret = ws.send(JSON.stringify(obj), function(err) {
                if (err) {
                    ws.close();
                    ws.once('close', function() {
                        ws.removeAllListeners();
                        newWs();
                        setTimeout(sendCommand.call(this, action, channel), 5000);
                    });
                }
            });
        }
    };

    function newWs() {
        ws = new WebSocket('ws://bitcoincharts.com:8001/ws', {
            origin: 'http://bitcoincharts.com'
        });
        ws.on('message', handlMessage);
    }
})();



module.exports = {
    _subscribed: {},
    _onOpen: function(callback) {
        if (ws.readyState === WebSocket.OPEN)
            process.nextTick(callback);
        else
            ws.once('open', callback);
    },
    subscribe: function(channel) {
        this._subscribed[channel] = true;
        sendCommand("subscribe", channel);
    },
    unsubscribe: function(channel) {
        this._subscribed[channel] = false;
        sendCommand("unsubscribe", channel);
    },
    symbol: function(symbol) {
        if (arguments.length)
            return _.clone(symbols[symbol]);

        return _.clone(symbols);
    }
};

module.exports.__proto__ = new EventEmitter();

refresh();

module.exports.subscribe('row');

function handlMessage(message) {
    if (message == "x-reload") {
        return;
    }

    try {
        var msg = JSON.parse(message),
            channel = msg.channel,
            symbol = msg.payload.symbol,
            htmlData = msg.payload.data;

        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.error("Error: " + err);
            } else {
                try {
                    console.log(symbol);
                    var stat = readrow(dom);
                    stat.symbol = symbol;
                    Object.seal(stat);

                    symbols[symbol] = stat;
                    module.exports.emit('symbol', stat, symbol);
                    module.exports.emit('currency', stat, stat.currency);
                    module.exports.emit(stat.currency, stat, symbols2market[symbol]);
                } catch (e) {
                    console.error(e);
                }
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(htmlData);
    } catch (e) {
        console.error(e);
    }
}

function refresh() {
    request("http://bitcoincharts.com/markets/", function(err, resp, body) {
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.error("Error: " + err);
            } else {
                // soupselect happening here...
                var table = select(dom, 'table#markets'),
                    trs = select(table[0], 'tbody tr');
                for (var i = 1; i < trs.length; ++i) {
                    try {
                        var tr = trs[i];
                        var symbol = tr.attribs.id,
                            market = tr.attribs.market,
                            stat = readrow(tr.children);
                        stat.symbol = symbol;
                        symbols2market[symbol] = market;
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
}

function readrow(row) {
    var dom = select(row, 'td');
    var latest_trade = parseInt(dom[0].attribs.latest_trade, 10) * 1000,
        currency = _.trim(select(dom[0], 'span.sub')[0].children[0].data),
        lastest_price = parseFloat(_.trim(dom[2].children[0].data)),
        avg_price = parseFloat(_.trim(dom[4].children[0].data)),
        low_price = parseFloat(_.trim(dom[6].children[0].data)),
        high_price = parseFloat(_.trim(dom[7].children[0].data)),
        bid_price = parseFloat(_.trim(dom[8].children[0].data)),
        ask_price = parseFloat(_.trim(dom[9].children[0].data));

    return {
        currency: currency,
        lastest_price: latest_trade,
        avg_price: avg_price,
        low_price: low_price,
        high_price: high_price,
        bid_price: bid_price,
        ask_price: ask_price
    };
}