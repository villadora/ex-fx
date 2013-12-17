var fxWrapper = function(val, fx) {
    this.fx = fx;
    if (typeof val === "string") {
        this._v = parseFloat(val.replace(/[^0-9-.]/g, ""));
        this._fx = val.replace(/([^A-Za-z])/g, "");
    } else {
        this._v = val;
    }
};


var proto = fxWrapper.prototype;


function Fx(base, rates) {
    var exec = function(obj) {
        return new fxWrapper(obj, exec);
    };

    exec.base = base || "";
    exec.rates = rates || {};
    exec.settings = {
        from: exec.base,
        to: exec.base
    };

    exec.rebase = function(base) {
        this.base = this.settings.from = this.settings.to = base;
    };

    exec.__proto__ = {
        from: proto.from,
        to: proto.to
    };
    exec.convert = convert;
    return exec;
}

module.exports = Fx;


proto.convert = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._v);
    return convert.apply(this.fx, args);
};


proto.from = function(currency) {
    var wrapped = this.fx(convert.call(this.fx, this._v, {
        from: currency,
        to: this.fx.base
    }));
    wrapped._fx = this.fx.base;
    return wrapped;
};

proto.to = function(currency) {
    return convert.call(this.fx, this._v, {
        from: this._fx ? this._fx : this.fx.settings.from,
        to: currency
    });
};

function convert(val, opts) {
    // Convert arrays recursively
    if (typeof val === 'object' && val.length) {
        for (var i = 0; i < val.length; i++) {
            val[i] = this.convert(val[i], opts);
        }
        return val;
    }

    // Make sure we gots some opts
    opts = opts || {};

    // We need to know the `from` and `to` currencies
    if (!opts.from) opts.from = this.settings.from;
    if (!opts.to) opts.to = this.settings.to;

    
    // Multiple the value by the exchange rate
    return val * getRate(opts.to, opts.from, this.rates, this.base);
}

function getRate(to, from, rates, base) {
    rates[base] = 1;

    if (!rates[to] || !rates[from]) throw new Error("fx error");

    // If `from` currency === fx.base, return the basic exchange rate for the `to` currency
    if (from === base) {
        return rates[to];
    }

    // If `to` currency === fx.base, return the basic inverse rate of the `from` currency
    if (to === base) {
        return 1 / rates[from];
    }

    // Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the
    // relative exchange rate between the two currencies
    return rates[to] * (1 / rates[from]);
}