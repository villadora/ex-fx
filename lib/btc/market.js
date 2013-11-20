var request = require('request'),
    htmlparser = require('htmlparser'),
    select = require('soupselect').select,
    freq = 60 * 5 * 1000,
    markets = {},
    updateTimer,
    _ = require('underscore');

if (!_.str)
    _.str = require('underscore.string'), _.mixin(_.str.exports());

// http://bitcoincharts.com/markets/currencies/

module.exports = {
    market: function(currency) {
        if (arguments.length)
            return _.clone(markets[currency]);

        return _.clone(markets);
    }
};

updateTable();


function updateTable(callback) {
    request("http://api.bitcoincharts.com/v1/weighted_prices.json", function(err, resp, body) {
        if (err) return console.error("Error: ", err);
        try {
            markets = JSON.parse(body);
        } catch (e) {
            console.error("Error when getting markets data", e);
        }

        if (updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(updateTable, freq);
    });
}


function oldUpdatetable(callback) {
    request("http://bitcoincharts.com/markets/currencies", function(err, resp, body) {
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.error("Error: " + err);
            } else {
                // soupselect happening here...
                var trs = select(dom, 'table.data tr');

                for (var i = 1; i < trs.length; ++i) {
                    var tds = select(trs[i], 'td'),
                        currency, h24, day7, day30;

                    try {
                        currency = tds[0].children[0].data,
                        h24 = parseFloat(tds[1].children[0].data),
                        day7 = parseFloat(tds[2].children[0].data),
                        day30 = parseFloat(tds[3].children[0].data);
                    } catch (e) {
                        return console.error("Parse currency: " + currency + " error: " + e.message);
                    }

                    if (currency) {
                        markets[_.trim(currency)] = {
                            "24h": h24,
                            "7d": day7,
                            "30d": day30
                        };
                    }
                }
            }

            if (callback) callback();
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });

    if (updateTimer) clearTimeout(updateTimer);

    updateTimer = setTimeout(oldUpdatetable, freq);
}