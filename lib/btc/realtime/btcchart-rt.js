Array.max = function(array) {
    var narray = [];
    for (var i = 0; i < array.length; i++)
        if (array[i] != null)
            narray.push(array[i]);
    return Math.max.apply(Math, narray);
};
Array.min = function(array) {
    var narray = [];
    for (var i = 0; i < array.length; i++)
        if (array[i] != null)
            narray.push(array[i]);
    return Math.min.apply(Math, narray);
};
cs.addEvent("row", new_row);

function new_row(channel, payload) {
    update_row(payload['symbol'], payload['data']);
}

jQuery.effects.highlight_nobg = function(o) {
    return this.queue(function() {
        var el = jQuery(this),
            props = ['backgroundColor', 'opacity'];
        var mode = jQuery.effects.setMode(el, o.options.mode || 'show');
        var color = o.options.color || "#ffff99";
        var oldColor = el.css("backgroundColor");
        jQuery.effects.save(el, props);
        el.css({
            backgroundColor: color
        });
        var animation = {
            backgroundColor: oldColor
        };
        el.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.options.easing,
            complete: function() {
                jQuery.effects.restore(el, props);
                if (mode == "show" && jQuery.browser.msie) this.style.removeAttribute('filter');
                if (o.callback) o.callback.apply(this, arguments);
                el.dequeue();
            }
        });

    });

};

var market_timeout;

function update_row(symbol, data) {
    colorize_markets();
    var row = $(document.getElementById(symbol));

    if (row.length == 0)
        return;

    row.html(data);

    colorize_market_row(row);

    if (typeof resizeMarkets == 'function')
        resizeMarkets();

    jQuery(row).effect('highlight_nobg', {}, 1000);

    render_sparkline(row.find(".marketsparkline"));

    //update_charts(symbol);
    //update_blobs(symbol);
}

function update_blobs(symbol) {
    jQuery('.rt-blob').each(function(i) {
        var blob = $(this);
        if (blob.attr('symbol') == symbol) {
            blob.load(blob.attr('src'));
        }
    });
}

function update_charts(symbol) {
    jQuery('.rt-chart').each(function(i) {
        var chart = $(this);
        if (chart.attr('symbol') == symbol) {
            var src = chart.attr('src');
            if (src.match(/\?/) == null) {
                src += "?"
            }
            src = src.replace(/&timestamp=.*/, "");
            var src = src + "&timestamp=" + new Date().getTime();
            chart.attr('src', src);
        }
    });
}


function colorize_market_row(row) {
    var row = jQuery(row);
    var ts = Math.round((new Date()).getTime() / 1000);
    var age = ts - row.children("td:first-child").attr('latest_trade');
    var color = [0, 0, 0];
    if (age <= 86400) {
        var change = row.children('td:first-child').attr('change');
        var hue = 230;
        if (change == "up") {
            hue = 140;
        } else if (change == "down") {
            hue = 0;
        }

        color = hsvToRgb(hue, 90.0, 50.0 * (1 - age / 86400));
    }

    row.css("background-color", "rgb(" + color + ")");
}

function colorize_markets() {
    var markets = jQuery('#markets tbody tr');
    jQuery.each(markets, function(index, row) {
        colorize_market_row(row);
    });
}

function render_sparklines() {
    jQuery.each(jQuery('.marketsparkline'), function(index, sparkline) {
        render_sparkline(sparkline);
    });
}

function render_sparkline(obj) {
    obj = jQuery(obj);
    var volume = obj.attr('volume').split(',');
    var price = obj.attr('price').split(',');
    var avg = [];
    for (var i = 0; i < price.length; i++) {
        avg.push(obj.attr('avg'));
    }

    var min = Array.min(price);
    var max = Array.max(price);
    obj.sparkline(volume, {
        height: '30px',
        type: 'bar',
        barSpacing: 0,
        barWidth: 2,
        barColor: '#727F8C'
    });
    obj.sparkline(price, {
        composite: true,
        fillColor: false,
        lineColor: '#ABCFF4',
        lineWidth: 1.5,
        spotRadius: 2.5,
        maxSpotColor: '#4f4',
        minSpotColor: '#f44'
    });
    obj.sparkline(avg, {
        composite: true,
        fillColor: false,
        lineColor: '#eeeeee',
        lineWidth: 1.5,
        chartRangeMin: min,
        chartRangeMax: max,
        spotRadius: 0
    });
}

jQuery('#markets th').tipTip({
    defaultPosition: "top",
    maxWidth: 500
});

render_sparklines();
colorize_markets();


Date.CultureInfo = {
    name: "en-US",
    englishName: "English (United States)",
    nativeName: "English (United States)",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    amDesignator: "AM",
    pmDesignator: "PM",
    firstDayOfWeek: 0,
    twoDigitYearMax: 2029,
    dateElementOrder: "mdy",
    formatPatterns: {
        shortDate: "M/d/yyyy",
        longDate: "dddd, MMMM dd, yyyy",
        shortTime: "h:mm tt",
        longTime: "h:mm:ss tt",
        fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt",
        sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
        universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
        rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
        monthDay: "MMMM dd",
        yearMonth: "MMMM, yyyy"
    },
    regexPatterns: {
        jan: /^jan(uary)?/i,
        feb: /^feb(ruary)?/i,
        mar: /^mar(ch)?/i,
        apr: /^apr(il)?/i,
        may: /^may/i,
        jun: /^jun(e)?/i,
        jul: /^jul(y)?/i,
        aug: /^aug(ust)?/i,
        sep: /^sep(t(ember)?)?/i,
        oct: /^oct(ober)?/i,
        nov: /^nov(ember)?/i,
        dec: /^dec(ember)?/i,
        sun: /^su(n(day)?)?/i,
        mon: /^mo(n(day)?)?/i,
        tue: /^tu(e(s(day)?)?)?/i,
        wed: /^we(d(nesday)?)?/i,
        thu: /^th(u(r(s(day)?)?)?)?/i,
        fri: /^fr(i(day)?)?/i,
        sat: /^sa(t(urday)?)?/i,
        future: /^next/i,
        past: /^last|past|prev(ious)?/i,
        add: /^(\+|after|from)/i,
        subtract: /^(\-|before|ago)/i,
        yesterday: /^yesterday/i,
        today: /^t(oday)?/i,
        tomorrow: /^tomorrow/i,
        now: /^n(ow)?/i,
        millisecond: /^ms|milli(second)?s?/i,
        second: /^sec(ond)?s?/i,
        minute: /^min(ute)?s?/i,
        hour: /^h(ou)?rs?/i,
        week: /^w(ee)?k/i,
        month: /^m(o(nth)?s?)?/i,
        day: /^d(ays?)?/i,
        year: /^y((ea)?rs?)?/i,
        shortMeridian: /^(a|p)/i,
        longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
        timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,
        ordinalSuffix: /^\s*(st|nd|rd|th)/i,
        timeContext: /^\s*(\:|a|p)/i
    },
    abbreviatedTimeZoneStandard: {
        GMT: "-000",
        EST: "-0400",
        CST: "-0500",
        MST: "-0600",
        PST: "-0700"
    },
    abbreviatedTimeZoneDST: {
        GMT: "-000",
        EDT: "-0500",
        CDT: "-0600",
        MDT: "-0700",
        PDT: "-0800"
    }
};
Date.getMonthNumberFromName = function(name) {
    var n = Date.CultureInfo.monthNames,
        m = Date.CultureInfo.abbreviatedMonthNames,
        s = name.toLowerCase();
    for (var i = 0; i < n.length; i++) {
        if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
            return i;
        }
    }
    return -1;
};
Date.getDayNumberFromName = function(name) {
    var n = Date.CultureInfo.dayNames,
        m = Date.CultureInfo.abbreviatedDayNames,
        o = Date.CultureInfo.shortestDayNames,
        s = name.toLowerCase();
    for (var i = 0; i < n.length; i++) {
        if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) {
            return i;
        }
    }
    return -1;
};
Date.isLeapYear = function(year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};
Date.getDaysInMonth = function(year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
Date.getTimezoneOffset = function(s, dst) {
    return (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()] : Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];
};
Date.getTimezoneAbbreviation = function(offset, dst) {
    var n = (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard,
        p;
    for (p in n) {
        if (n[p] === offset) {
            return p;
        }
    }
    return null;
};
Date.prototype.clone = function() {
    return new Date(this.getTime());
};
Date.prototype.compareTo = function(date) {
    if (isNaN(this)) {
        throw new Error(this);
    }
    if (date instanceof Date && !isNaN(date)) {
        return (this > date) ? 1 : (this < date) ? -1 : 0;
    } else {
        throw new TypeError(date);
    }
};
Date.prototype.equals = function(date) {
    return (this.compareTo(date) === 0);
};
Date.prototype.between = function(start, end) {
    var t = this.getTime();
    return t >= start.getTime() && t <= end.getTime();
};
Date.prototype.addMilliseconds = function(value) {
    this.setMilliseconds(this.getMilliseconds() + value);
    return this;
};
Date.prototype.addSeconds = function(value) {
    return this.addMilliseconds(value * 1000);
};
Date.prototype.addMinutes = function(value) {
    return this.addMilliseconds(value * 60000);
};
Date.prototype.addHours = function(value) {
    return this.addMilliseconds(value * 3600000);
};
Date.prototype.addDays = function(value) {
    return this.addMilliseconds(value * 86400000);
};
Date.prototype.addWeeks = function(value) {
    return this.addMilliseconds(value * 604800000);
};
Date.prototype.addMonths = function(value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
Date.prototype.addYears = function(value) {
    return this.addMonths(value * 12);
};
Date.prototype.add = function(config) {
    if (typeof config == "number") {
        this._orient = config;
        return this;
    }
    var x = config;
    if (x.millisecond || x.milliseconds) {
        this.addMilliseconds(x.millisecond || x.milliseconds);
    }
    if (x.second || x.seconds) {
        this.addSeconds(x.second || x.seconds);
    }
    if (x.minute || x.minutes) {
        this.addMinutes(x.minute || x.minutes);
    }
    if (x.hour || x.hours) {
        this.addHours(x.hour || x.hours);
    }
    if (x.month || x.months) {
        this.addMonths(x.month || x.months);
    }
    if (x.year || x.years) {
        this.addYears(x.year || x.years);
    }
    if (x.day || x.days) {
        this.addDays(x.day || x.days);
    }
    return this;
};
Date._validate = function(value, min, max, name) {
    if (typeof value != "number") {
        throw new TypeError(value + " is not a Number.");
    } else if (value < min || value > max) {
        throw new RangeError(value + " is not a valid value for " + name + ".");
    }
    return true;
};
Date.validateMillisecond = function(n) {
    return Date._validate(n, 0, 999, "milliseconds");
};
Date.validateSecond = function(n) {
    return Date._validate(n, 0, 59, "seconds");
};
Date.validateMinute = function(n) {
    return Date._validate(n, 0, 59, "minutes");
};
Date.validateHour = function(n) {
    return Date._validate(n, 0, 23, "hours");
};
Date.validateDay = function(n, year, month) {
    return Date._validate(n, 1, Date.getDaysInMonth(year, month), "days");
};
Date.validateMonth = function(n) {
    return Date._validate(n, 0, 11, "months");
};
Date.validateYear = function(n) {
    return Date._validate(n, 1, 9999, "seconds");
};
Date.prototype.set = function(config) {
    var x = config;
    if (!x.millisecond && x.millisecond !== 0) {
        x.millisecond = -1;
    }
    if (!x.second && x.second !== 0) {
        x.second = -1;
    }
    if (!x.minute && x.minute !== 0) {
        x.minute = -1;
    }
    if (!x.hour && x.hour !== 0) {
        x.hour = -1;
    }
    if (!x.day && x.day !== 0) {
        x.day = -1;
    }
    if (!x.month && x.month !== 0) {
        x.month = -1;
    }
    if (!x.year && x.year !== 0) {
        x.year = -1;
    }
    if (x.millisecond != -1 && Date.validateMillisecond(x.millisecond)) {
        this.addMilliseconds(x.millisecond - this.getMilliseconds());
    }
    if (x.second != -1 && Date.validateSecond(x.second)) {
        this.addSeconds(x.second - this.getSeconds());
    }
    if (x.minute != -1 && Date.validateMinute(x.minute)) {
        this.addMinutes(x.minute - this.getMinutes());
    }
    if (x.hour != -1 && Date.validateHour(x.hour)) {
        this.addHours(x.hour - this.getHours());
    }
    if (x.month !== -1 && Date.validateMonth(x.month)) {
        this.addMonths(x.month - this.getMonth());
    }
    if (x.year != -1 && Date.validateYear(x.year)) {
        this.addYears(x.year - this.getFullYear());
    }
    if (x.day != -1 && Date.validateDay(x.day, this.getFullYear(), this.getMonth())) {
        this.addDays(x.day - this.getDate());
    }
    if (x.timezone) {
        this.setTimezone(x.timezone);
    }
    if (x.timezoneOffset) {
        this.setTimezoneOffset(x.timezoneOffset);
    }
    return this;
};
Date.prototype.clearTime = function() {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};
Date.prototype.isLeapYear = function() {
    var y = this.getFullYear();
    return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0));
};
Date.prototype.isWeekday = function() {
    return !(this.is().sat() || this.is().sun());
};
Date.prototype.getDaysInMonth = function() {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};
Date.prototype.moveToFirstDayOfMonth = function() {
    return this.set({
        day: 1
    });
};
Date.prototype.moveToLastDayOfMonth = function() {
    return this.set({
        day: this.getDaysInMonth()
    });
};
Date.prototype.moveToDayOfWeek = function(day, orient) {
    var diff = (day - this.getDay() + 7 * (orient || +1)) % 7;
    return this.addDays((diff === 0) ? diff += 7 * (orient || +1) : diff);
};
Date.prototype.moveToMonth = function(month, orient) {
    var diff = (month - this.getMonth() + 12 * (orient || +1)) % 12;
    return this.addMonths((diff === 0) ? diff += 12 * (orient || +1) : diff);
};
Date.prototype.getDayOfYear = function() {
    return Math.floor((this - new Date(this.getFullYear(), 0, 1)) / 86400000);
};
Date.prototype.getWeekOfYear = function(firstDayOfWeek) {
    var y = this.getFullYear(),
        m = this.getMonth(),
        d = this.getDate();
    var dow = firstDayOfWeek || Date.CultureInfo.firstDayOfWeek;
    var offset = 7 + 1 - new Date(y, 0, 1).getDay();
    if (offset == 8) {
        offset = 1;
    }
    var daynum = ((Date.UTC(y, m, d, 0, 0, 0) - Date.UTC(y, 0, 1, 0, 0, 0)) / 86400000) + 1;
    var w = Math.floor((daynum - offset + 7) / 7);
    if (w === dow) {
        y--;
        var prevOffset = 7 + 1 - new Date(y, 0, 1).getDay();
        if (prevOffset == 2 || prevOffset == 8) {
            w = 53;
        } else {
            w = 52;
        }
    }
    return w;
};
Date.prototype.isDST = function() {
    console.log('isDST');
    return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == "D";
};
Date.prototype.getTimezone = function() {
    return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST());
};
Date.prototype.setTimezoneOffset = function(s) {
    var here = this.getTimezoneOffset(),
        there = Number(s) * -6 / 10;
    this.addMinutes(there - here);
    return this;
};
Date.prototype.setTimezone = function(s) {
    return this.setTimezoneOffset(Date.getTimezoneOffset(s));
};
Date.prototype.getUTCOffset = function() {
    var n = this.getTimezoneOffset() * -10 / 6,
        r;
    if (n < 0) {
        r = (n - 10000).toString();
        return r[0] + r.substr(2);
    } else {
        r = (n + 10000).toString();
        return "+" + r.substr(1);
    }
};
Date.prototype.getDayName = function(abbrev) {
    return abbrev ? Date.CultureInfo.abbreviatedDayNames[this.getDay()] : Date.CultureInfo.dayNames[this.getDay()];
};
Date.prototype.getMonthName = function(abbrev) {
    return abbrev ? Date.CultureInfo.abbreviatedMonthNames[this.getMonth()] : Date.CultureInfo.monthNames[this.getMonth()];
};
Date.prototype._toString = Date.prototype.toString;
Date.prototype.toString = function(format) {
    var self = this;
    var p = function p(s) {
        return (s.toString().length == 1) ? "0" + s : s;
    };
    return format ? format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, function(format) {
        switch (format) {
            case "hh":
                return p(self.getHours() < 13 ? self.getHours() : (self.getHours() - 12));
            case "h":
                return self.getHours() < 13 ? self.getHours() : (self.getHours() - 12);
            case "HH":
                return p(self.getHours());
            case "H":
                return self.getHours();
            case "mm":
                return p(self.getMinutes());
            case "m":
                return self.getMinutes();
            case "ss":
                return p(self.getSeconds());
            case "s":
                return self.getSeconds();
            case "yyyy":
                return self.getFullYear();
            case "yy":
                return self.getFullYear().toString().substring(2, 4);
            case "dddd":
                return self.getDayName();
            case "ddd":
                return self.getDayName(true);
            case "dd":
                return p(self.getDate());
            case "d":
                return self.getDate().toString();
            case "MMMM":
                return self.getMonthName();
            case "MMM":
                return self.getMonthName(true);
            case "MM":
                return p((self.getMonth() + 1));
            case "M":
                return self.getMonth() + 1;
            case "t":
                return self.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
            case "tt":
                return self.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
            case "zzz":
            case "zz":
            case "z":
                return "";
        }
    }) : this._toString();
};
Date.now = function() {
    return new Date();
};
Date.today = function() {
    return Date.now().clearTime();
};
Date.prototype._orient = +1;
Date.prototype.next = function() {
    this._orient = +1;
    return this;
};
Date.prototype.last = Date.prototype.prev = Date.prototype.previous = function() {
    this._orient = -1;
    return this;
};
Date.prototype._is = false;
Date.prototype.is = function() {
    this._is = true;
    return this;
};
Number.prototype._dateElement = "day";
Number.prototype.fromNow = function() {
    var c = {};
    c[this._dateElement] = this;
    return Date.now().add(c);
};
Number.prototype.ago = function() {
    var c = {};
    c[this._dateElement] = this * -1;
    return Date.now().add(c);
};
(function() {
    var $D = Date.prototype,
        $N = Number.prototype;
    var dx = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),
        mx = ("january february march april may june july august september october november december").split(/\s/),
        px = ("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),
        de;
    var df = function(n) {
        return function() {
            if (this._is) {
                this._is = false;
                return this.getDay() == n;
            }
            return this.moveToDayOfWeek(n, this._orient);
        };
    };
    for (var i = 0; i < dx.length; i++) {
        $D[dx[i]] = $D[dx[i].substring(0, 3)] = df(i);
    }
    var mf = function(n) {
        return function() {
            if (this._is) {
                this._is = false;
                return this.getMonth() === n;
            }
            return this.moveToMonth(n, this._orient);
        };
    };
    for (var j = 0; j < mx.length; j++) {
        $D[mx[j]] = $D[mx[j].substring(0, 3)] = mf(j);
    }
    var ef = function(j) {
        return function() {
            if (j.substring(j.length - 1) != "s") {
                j += "s";
            }
            return this["add" + j](this._orient);
        };
    };
    var nf = function(n) {
        return function() {
            this._dateElement = n;
            return this;
        };
    };
    for (var k = 0; k < px.length; k++) {
        de = px[k].toLowerCase();
        $D[de] = $D[de + "s"] = ef(px[k]);
        $N[de] = $N[de + "s"] = nf(de);
    }
}());
Date.prototype.toJSONString = function() {
    return this.toString("yyyy-MM-ddThh:mm:ssZ");
};
Date.prototype.toShortDateString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);
};
Date.prototype.toLongDateString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);
};
Date.prototype.toShortTimeString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);
};
Date.prototype.toLongTimeString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);
};
Date.prototype.getOrdinal = function() {
    switch (this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th";
    }
};
(function() {
    Date.Parsing = {
        Exception: function(s) {
            this.message = "Parse error at '" + s.substring(0, 10) + " ...'";
        }
    };
    var $P = Date.Parsing;
    var _ = $P.Operators = {
        rtoken: function(r) {
            return function(s) {
                var mx = s.match(r);
                if (mx) {
                    return ([mx[0], s.substring(mx[0].length)]);
                } else {
                    throw new $P.Exception(s);
                }
            };
        },
        token: function(s) {
            return function(s) {
                return _.rtoken(new RegExp("^\s*" + s + "\s*"))(s);
            };
        },
        stoken: function(s) {
            return _.rtoken(new RegExp("^" + s));
        },
        until: function(p) {
            return function(s) {
                var qx = [],
                    rx = null;
                while (s.length) {
                    try {
                        rx = p.call(this, s);
                    } catch (e) {
                        qx.push(rx[0]);
                        s = rx[1];
                        continue;
                    }
                    break;
                }
                return [qx, s];
            };
        },
        many: function(p) {
            return function(s) {
                var rx = [],
                    r = null;
                while (s.length) {
                    try {
                        r = p.call(this, s);
                    } catch (e) {
                        return [rx, s];
                    }
                    rx.push(r[0]);
                    s = r[1];
                }
                return [rx, s];
            };
        },
        optional: function(p) {
            return function(s) {
                var r = null;
                try {
                    r = p.call(this, s);
                } catch (e) {
                    return [null, s];
                }
                return [r[0], r[1]];
            };
        },
        not: function(p) {
            return function(s) {
                try {
                    p.call(this, s);
                } catch (e) {
                    return [null, s];
                }
                throw new $P.Exception(s);
            };
        },
        ignore: function(p) {
            return p ? function(s) {
                var r = null;
                r = p.call(this, s);
                return [null, r[1]];
            } : null;
        },
        product: function() {
            var px = arguments[0],
                qx = Array.prototype.slice.call(arguments, 1),
                rx = [];
            for (var i = 0; i < px.length; i++) {
                rx.push(_.each(px[i], qx));
            }
            return rx;
        },
        cache: function(rule) {
            var cache = {}, r = null;
            return function(s) {
                try {
                    r = cache[s] = (cache[s] || rule.call(this, s));
                } catch (e) {
                    r = cache[s] = e;
                }
                if (r instanceof $P.Exception) {
                    throw r;
                } else {
                    return r;
                }
            };
        },
        any: function() {
            var px = arguments;
            return function(s) {
                var r = null;
                for (var i = 0; i < px.length; i++) {
                    if (px[i] == null) {
                        continue;
                    }
                    try {
                        r = (px[i].call(this, s));
                    } catch (e) {
                        r = null;
                    }
                    if (r) {
                        return r;
                    }
                }
                throw new $P.Exception(s);
            };
        },
        each: function() {
            var px = arguments;
            return function(s) {
                var rx = [],
                    r = null;
                for (var i = 0; i < px.length; i++) {
                    if (px[i] == null) {
                        continue;
                    }
                    try {
                        r = (px[i].call(this, s));
                    } catch (e) {
                        throw new $P.Exception(s);
                    }
                    rx.push(r[0]);
                    s = r[1];
                }
                return [rx, s];
            };
        },
        all: function() {
            var px = arguments,
                _ = _;
            return _.each(_.optional(px));
        },
        sequence: function(px, d, c) {
            d = d || _.rtoken(/^\s*/);
            c = c || null;
            if (px.length == 1) {
                return px[0];
            }
            return function(s) {
                var r = null,
                    q = null;
                var rx = [];
                for (var i = 0; i < px.length; i++) {
                    try {
                        r = px[i].call(this, s);
                    } catch (e) {
                        break;
                    }
                    rx.push(r[0]);
                    try {
                        q = d.call(this, r[1]);
                    } catch (ex) {
                        q = null;
                        break;
                    }
                    s = q[1];
                }
                if (!r) {
                    throw new $P.Exception(s);
                }
                if (q) {
                    throw new $P.Exception(q[1]);
                }
                if (c) {
                    try {
                        r = c.call(this, r[1]);
                    } catch (ey) {
                        throw new $P.Exception(r[1]);
                    }
                }
                return [rx, (r ? r[1] : s)];
            };
        },
        between: function(d1, p, d2) {
            d2 = d2 || d1;
            var _fn = _.each(_.ignore(d1), p, _.ignore(d2));
            return function(s) {
                var rx = _fn.call(this, s);
                return [[rx[0][0], r[0][2]], rx[1]];
            };
        },
        list: function(p, d, c) {
            d = d || _.rtoken(/^\s*/);
            c = c || null;
            return (p instanceof Array ? _.each(_.product(p.slice(0, -1), _.ignore(d)), p.slice(-1), _.ignore(c)) : _.each(_.many(_.each(p, _.ignore(d))), px, _.ignore(c)));
        },
        set: function(px, d, c) {
            d = d || _.rtoken(/^\s*/);
            c = c || null;
            return function(s) {
                var r = null,
                    p = null,
                    q = null,
                    rx = null,
                    best = [
                        [], s
                    ],
                    last = false;
                for (var i = 0; i < px.length; i++) {
                    q = null;
                    p = null;
                    r = null;
                    last = (px.length == 1);
                    try {
                        r = px[i].call(this, s);
                    } catch (e) {
                        continue;
                    }
                    rx = [
                        [r[0]], r[1]
                    ];
                    if (r[1].length > 0 && !last) {
                        try {
                            q = d.call(this, r[1]);
                        } catch (ex) {
                            last = true;
                        }
                    } else {
                        last = true;
                    }
                    if (!last && q[1].length === 0) {
                        last = true;
                    }
                    if (!last) {
                        var qx = [];
                        for (var j = 0; j < px.length; j++) {
                            if (i != j) {
                                qx.push(px[j]);
                            }
                        }
                        p = _.set(qx, d).call(this, q[1]);
                        if (p[0].length > 0) {
                            rx[0] = rx[0].concat(p[0]);
                            rx[1] = p[1];
                        }
                    }
                    if (rx[1].length < best[1].length) {
                        best = rx;
                    }
                    if (best[1].length === 0) {
                        break;
                    }
                }
                if (best[0].length === 0) {
                    return best;
                }
                if (c) {
                    try {
                        q = c.call(this, best[1]);
                    } catch (ey) {
                        throw new $P.Exception(best[1]);
                    }
                    best[1] = q[1];
                }
                return best;
            };
        },
        forward: function(gr, fname) {
            return function(s) {
                return gr[fname].call(this, s);
            };
        },
        replace: function(rule, repl) {
            return function(s) {
                var r = rule.call(this, s);
                return [repl, r[1]];
            };
        },
        process: function(rule, fn) {
            return function(s) {
                var r = rule.call(this, s);
                return [fn.call(this, r[0]), r[1]];
            };
        },
        min: function(min, rule) {
            return function(s) {
                var rx = rule.call(this, s);
                if (rx[0].length < min) {
                    throw new $P.Exception(s);
                }
                return rx;
            };
        }
    };
    var _generator = function(op) {
        return function() {
            var args = null,
                rx = [];
            if (arguments.length > 1) {
                args = Array.prototype.slice.call(arguments);
            } else if (arguments[0] instanceof Array) {
                args = arguments[0];
            }
            if (args) {
                for (var i = 0, px = args.shift(); i < px.length; i++) {
                    args.unshift(px[i]);
                    rx.push(op.apply(null, args));
                    args.shift();
                    return rx;
                }
            } else {
                return op.apply(null, arguments);
            }
        };
    };
    var gx = "optional not ignore cache".split(/\s/);
    for (var i = 0; i < gx.length; i++) {
        _[gx[i]] = _generator(_[gx[i]]);
    }
    var _vector = function(op) {
        return function() {
            if (arguments[0] instanceof Array) {
                return op.apply(null, arguments[0]);
            } else {
                return op.apply(null, arguments);
            }
        };
    };
    var vx = "each any all".split(/\s/);
    for (var j = 0; j < vx.length; j++) {
        _[vx[j]] = _vector(_[vx[j]]);
    }
}());
(function() {
    var flattenAndCompact = function(ax) {
        var rx = [];
        for (var i = 0; i < ax.length; i++) {
            if (ax[i] instanceof Array) {
                rx = rx.concat(flattenAndCompact(ax[i]));
            } else {
                if (ax[i]) {
                    rx.push(ax[i]);
                }
            }
        }
        return rx;
    };
    Date.Grammar = {};
    Date.Translator = {
        hour: function(s) {
            return function() {
                this.hour = Number(s);
            };
        },
        minute: function(s) {
            return function() {
                this.minute = Number(s);
            };
        },
        second: function(s) {
            return function() {
                this.second = Number(s);
            };
        },
        meridian: function(s) {
            return function() {
                this.meridian = s.slice(0, 1).toLowerCase();
            };
        },
        timezone: function(s) {
            return function() {
                var n = s.replace(/[^\d\+\-]/g, "");
                if (n.length) {
                    this.timezoneOffset = Number(n);
                } else {
                    this.timezone = s.toLowerCase();
                }
            };
        },
        day: function(x) {
            var s = x[0];
            return function() {
                this.day = Number(s.match(/\d+/)[0]);
            };
        },
        month: function(s) {
            return function() {
                this.month = ((s.length == 3) ? Date.getMonthNumberFromName(s) : (Number(s) - 1));
            };
        },
        year: function(s) {
            return function() {
                var n = Number(s);
                this.year = ((s.length > 2) ? n : (n + (((n + 2000) < Date.CultureInfo.twoDigitYearMax) ? 2000 : 1900)));
            };
        },
        rday: function(s) {
            return function() {
                switch (s) {
                    case "yesterday":
                        this.days = -1;
                        break;
                    case "tomorrow":
                        this.days = 1;
                        break;
                    case "today":
                        this.days = 0;
                        break;
                    case "now":
                        this.days = 0;
                        this.now = true;
                        break;
                }
            };
        },
        finishExact: function(x) {
            x = (x instanceof Array) ? x : [x];
            var now = new Date();
            this.year = now.getFullYear();
            this.month = now.getMonth();
            this.day = 1;
            this.hour = 0;
            this.minute = 0;
            this.second = 0;
            for (var i = 0; i < x.length; i++) {
                if (x[i]) {
                    x[i].call(this);
                }
            }
            this.hour = (this.meridian == "p" && this.hour < 13) ? this.hour + 12 : this.hour;
            if (this.day > Date.getDaysInMonth(this.year, this.month)) {
                throw new RangeError(this.day + " is not a valid value for days.");
            }
            var r = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
            if (this.timezone) {
                r.set({
                    timezone: this.timezone
                });
            } else if (this.timezoneOffset) {
                r.set({
                    timezoneOffset: this.timezoneOffset
                });
            }
            return r;
        },
        finish: function(x) {
            x = (x instanceof Array) ? flattenAndCompact(x) : [x];
            if (x.length === 0) {
                return null;
            }
            for (var i = 0; i < x.length; i++) {
                if (typeof x[i] == "function") {
                    x[i].call(this);
                }
            }
            if (this.now) {
                return new Date();
            }
            var today = Date.today();
            var method = null;
            var expression = !! (this.days != null || this.orient || this.operator);
            if (expression) {
                var gap, mod, orient;
                orient = ((this.orient == "past" || this.operator == "subtract") ? -1 : 1);
                if (this.weekday) {
                    this.unit = "day";
                    gap = (Date.getDayNumberFromName(this.weekday) - today.getDay());
                    mod = 7;
                    this.days = gap ? ((gap + (orient * mod)) % mod) : (orient * mod);
                }
                if (this.month) {
                    this.unit = "month";
                    gap = (this.month - today.getMonth());
                    mod = 12;
                    this.months = gap ? ((gap + (orient * mod)) % mod) : (orient * mod);
                    this.month = null;
                }
                if (!this.unit) {
                    this.unit = "day";
                }
                if (this[this.unit + "s"] == null || this.operator != null) {
                    if (!this.value) {
                        this.value = 1;
                    }
                    if (this.unit == "week") {
                        this.unit = "day";
                        this.value = this.value * 7;
                    }
                    this[this.unit + "s"] = this.value * orient;
                }
                return today.add(this);
            } else {
                if (this.meridian && this.hour) {
                    this.hour = (this.hour < 13 && this.meridian == "p") ? this.hour + 12 : this.hour;
                }
                if (this.weekday && !this.day) {
                    this.day = (today.addDays((Date.getDayNumberFromName(this.weekday) - today.getDay()))).getDate();
                }
                if (this.month && !this.day) {
                    this.day = 1;
                }
                return today.set(this);
            }
        }
    };
    var _ = Date.Parsing.Operators,
        g = Date.Grammar,
        t = Date.Translator,
        _fn;
    g.datePartDelimiter = _.rtoken(/^([\s\-\.\,\/\x27]+)/);
    g.timePartDelimiter = _.stoken(":");
    g.whiteSpace = _.rtoken(/^\s*/);
    g.generalDelimiter = _.rtoken(/^(([\s\,]|at|on)+)/);
    var _C = {};
    g.ctoken = function(keys) {
        var fn = _C[keys];
        if (!fn) {
            var c = Date.CultureInfo.regexPatterns;
            var kx = keys.split(/\s+/),
                px = [];
            for (var i = 0; i < kx.length; i++) {
                px.push(_.replace(_.rtoken(c[kx[i]]), kx[i]));
            }
            fn = _C[keys] = _.any.apply(null, px);
        }
        return fn;
    };
    g.ctoken2 = function(key) {
        return _.rtoken(Date.CultureInfo.regexPatterns[key]);
    };
    g.h = _.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), t.hour));
    g.hh = _.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/), t.hour));
    g.H = _.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), t.hour));
    g.HH = _.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/), t.hour));
    g.m = _.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/), t.minute));
    g.mm = _.cache(_.process(_.rtoken(/^[0-5][0-9]/), t.minute));
    g.s = _.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/), t.second));
    g.ss = _.cache(_.process(_.rtoken(/^[0-5][0-9]/), t.second));
    g.hms = _.cache(_.sequence([g.H, g.mm, g.ss], g.timePartDelimiter));
    g.t = _.cache(_.process(g.ctoken2("shortMeridian"), t.meridian));
    g.tt = _.cache(_.process(g.ctoken2("longMeridian"), t.meridian));
    g.z = _.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/), t.timezone));
    g.zz = _.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/), t.timezone));
    g.zzz = _.cache(_.process(g.ctoken2("timezone"), t.timezone));
    g.timeSuffix = _.each(_.ignore(g.whiteSpace), _.set([g.tt, g.zzz]));
    g.time = _.each(_.optional(_.ignore(_.stoken("T"))), g.hms, g.timeSuffix);
    g.d = _.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/), _.optional(g.ctoken2("ordinalSuffix"))), t.day));
    g.dd = _.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/), _.optional(g.ctoken2("ordinalSuffix"))), t.day));
    g.ddd = g.dddd = _.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"), function(s) {
        return function() {
            this.weekday = s;
        };
    }));
    g.M = _.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/), t.month));
    g.MM = _.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/), t.month));
    g.MMM = g.MMMM = _.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), t.month));
    g.y = _.cache(_.process(_.rtoken(/^(\d\d?)/), t.year));
    g.yy = _.cache(_.process(_.rtoken(/^(\d\d)/), t.year));
    g.yyy = _.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/), t.year));
    g.yyyy = _.cache(_.process(_.rtoken(/^(\d\d\d\d)/), t.year));
    _fn = function() {
        return _.each(_.any.apply(null, arguments), _.not(g.ctoken2("timeContext")));
    };
    g.day = _fn(g.d, g.dd);
    g.month = _fn(g.M, g.MMM);
    g.year = _fn(g.yyyy, g.yy);
    g.orientation = _.process(g.ctoken("past future"), function(s) {
        return function() {
            this.orient = s;
        };
    });
    g.operator = _.process(g.ctoken("add subtract"), function(s) {
        return function() {
            this.operator = s;
        };
    });
    g.rday = _.process(g.ctoken("yesterday tomorrow today now"), t.rday);
    g.unit = _.process(g.ctoken("minute hour day week month year"), function(s) {
        return function() {
            this.unit = s;
        };
    });
    g.value = _.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/), function(s) {
        return function() {
            this.value = s.replace(/\D/g, "");
        };
    });
    g.expression = _.set([g.rday, g.operator, g.value, g.unit, g.orientation, g.ddd, g.MMM]);
    _fn = function() {
        return _.set(arguments, g.datePartDelimiter);
    };
    g.mdy = _fn(g.ddd, g.month, g.day, g.year);
    g.ymd = _fn(g.ddd, g.year, g.month, g.day);
    g.dmy = _fn(g.ddd, g.day, g.month, g.year);
    g.date = function(s) {
        return ((g[Date.CultureInfo.dateElementOrder] || g.mdy).call(this, s));
    };
    g.format = _.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function(fmt) {
        if (g[fmt]) {
            return g[fmt];
        } else {
            throw Date.Parsing.Exception(fmt);
        }
    }), _.process(_.rtoken(/^[^dMyhHmstz]+/), function(s) {
        return _.ignore(_.stoken(s));
    }))), function(rules) {
        return _.process(_.each.apply(null, rules), t.finishExact);
    });
    var _F = {};
    var _get = function(f) {
        return _F[f] = (_F[f] || g.format(f)[0]);
    };
    g.formats = function(fx) {
        if (fx instanceof Array) {
            var rx = [];
            for (var i = 0; i < fx.length; i++) {
                rx.push(_get(fx[i]));
            }
            return _.any.apply(null, rx);
        } else {
            return _get(fx);
        }
    };
    g._formats = g.formats(["yyyy-MM-ddTHH:mm:ss", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "d"]);
    g._start = _.process(_.set([g.date, g.time, g.expression], g.generalDelimiter, g.whiteSpace), t.finish);
    g.start = function(s) {
        try {
            var r = g._formats.call({}, s);
            if (r[1].length === 0) {
                return r;
            }
        } catch (e) {}
        return g._start.call({}, s);
    };
}());
Date._parse = Date.parse;
Date.parse = function(s) {
    var r = null;
    if (!s) {
        return null;
    }
    try {
        r = Date.Grammar.start.call({}, s);
    } catch (e) {
        return null;
    }
    return ((r[1].length === 0) ? r[0] : null);
};
Date.getParseFunction = function(fx) {
    var fn = Date.Grammar.formats(fx);
    return function(s) {
        var r = null;
        try {
            r = fn.call({}, s);
        } catch (e) {
            return null;
        }
        return ((r[1].length === 0) ? r[0] : null);
    };
};
Date.parseExact = function(s, fx) {
    return Date.getParseFunction(fx)(s);
};
(function(E, B) {
    function ka(a, b, d) {
        if (d === B && a.nodeType === 1) {
            d = a.getAttribute("data-" + b);
            if (typeof d === "string") {
                try {
                    d = d === "true" ? true : d === "false" ? false : d === "null" ? null : !c.isNaN(d) ? parseFloat(d) : Ja.test(d) ? c.parseJSON(d) : d
                } catch (e) {}
                c.data(a, b, d)
            } else d = B
        }
        return d
    }

    function U() {
        return false
    }

    function ca() {
        return true
    }

    function la(a, b, d) {
        d[0].type = a;
        return c.event.handle.apply(b, d)
    }

    function Ka(a) {
        var b, d, e, f, h, l, k, o, x, r, A, C = [];
        f = [];
        h = c.data(this, this.nodeType ? "events" : "__events__");
        if (typeof h === "function") h = h.events;
        if (!(a.liveFired === this || !h || !h.live || a.button && a.type === "click")) {
            if (a.namespace) A = RegExp("(^|\\.)" + a.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
            a.liveFired = this;
            var J = h.live.slice(0);
            for (k = 0; k < J.length; k++) {
                h = J[k];
                h.origType.replace(X, "") === a.type ? f.push(h.selector) : J.splice(k--, 1)
            }
            f = c(a.target).closest(f, a.currentTarget);
            o = 0;
            for (x = f.length; o < x; o++) {
                r = f[o];
                for (k = 0; k < J.length; k++) {
                    h = J[k];
                    if (r.selector === h.selector && (!A || A.test(h.namespace))) {
                        l = r.elem;
                        e = null;
                        if (h.preType === "mouseenter" || h.preType === "mouseleave") {
                            a.type = h.preType;
                            e = c(a.relatedTarget).closest(h.selector)[0]
                        }
                        if (!e || e !== l) C.push({
                            elem: l,
                            handleObj: h,
                            level: r.level
                        })
                    }
                }
            }
            o = 0;
            for (x = C.length; o < x; o++) {
                f = C[o];
                if (d && f.level > d) break;
                a.currentTarget = f.elem;
                a.data = f.handleObj.data;
                a.handleObj = f.handleObj;
                A = f.handleObj.origHandler.apply(f.elem, arguments);
                if (A === false || a.isPropagationStopped()) {
                    d = f.level;
                    if (A === false) b = false;
                    if (a.isImmediatePropagationStopped()) break
                }
            }
            return b
        }
    }

    function Y(a, b) {
        return (a && a !== "*" ? a + "." : "") + b.replace(La, "`").replace(Ma, "&")
    }

    function ma(a, b, d) {
        if (c.isFunction(b)) return c.grep(a, function(f, h) {
            return !!b.call(f, h, f) === d
        });
        else if (b.nodeType) return c.grep(a, function(f) {
            return f === b === d
        });
        else if (typeof b === "string") {
            var e = c.grep(a, function(f) {
                return f.nodeType === 1
            });
            if (Na.test(b)) return c.filter(b, e, !d);
            else b = c.filter(b, e)
        }
        return c.grep(a, function(f) {
            return c.inArray(f, b) >= 0 === d
        })
    }

    function na(a, b) {
        var d = 0;
        b.each(function() {
            if (this.nodeName === (a[d] && a[d].nodeName)) {
                var e = c.data(a[d++]),
                    f = c.data(this, e);
                if (e = e && e.events) {
                    delete f.handle;
                    f.events = {};
                    for (var h in e)
                        for (var l in e[h]) c.event.add(this, h, e[h][l], e[h][l].data)
                }
            }
        })
    }

    function Oa(a, b) {
        b.src ? c.ajax({
            url: b.src,
            async: false,
            dataType: "script"
        }) : c.globalEval(b.text || b.textContent || b.innerHTML || "");
        b.parentNode && b.parentNode.removeChild(b)
    }

    function oa(a, b, d) {
        var e = b === "width" ? a.offsetWidth : a.offsetHeight;
        if (d === "border") return e;
        c.each(b === "width" ? Pa : Qa, function() {
            d || (e -= parseFloat(c.css(a, "padding" + this)) || 0);
            if (d === "margin") e += parseFloat(c.css(a, "margin" + this)) || 0;
            else e -= parseFloat(c.css(a, "border" + this + "Width")) || 0
        });
        return e
    }

    function da(a, b, d, e) {
        if (c.isArray(b) && b.length) c.each(b, function(f, h) {
            d || Ra.test(a) ? e(a, h) : da(a + "[" + (typeof h === "object" || c.isArray(h) ? f : "") + "]", h, d, e)
        });
        else if (!d && b != null && typeof b === "object") c.isEmptyObject(b) ? e(a, "") : c.each(b, function(f, h) {
            da(a + "[" + f + "]", h, d, e)
        });
        else e(a, b)
    }

    function S(a, b) {
        var d = {};
        c.each(pa.concat.apply([], pa.slice(0, b)), function() {
            d[this] = a
        });
        return d
    }

    function qa(a) {
        if (!ea[a]) {
            var b = c("<" +
                a + ">").appendTo("body"),
                d = b.css("display");
            b.remove();
            if (d === "none" || d === "") d = "block";
            ea[a] = d
        }
        return ea[a]
    }

    function fa(a) {
        return c.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : false
    }
    var t = E.document,
        c = function() {
            function a() {
                if (!b.isReady) {
                    try {
                        t.documentElement.doScroll("left")
                    } catch (j) {
                        setTimeout(a, 1);
                        return
                    }
                    b.ready()
                }
            }
            var b = function(j, s) {
                return new b.fn.init(j, s)
            }, d = E.jQuery,
                e = E.$,
                f, h = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,
                l = /\S/,
                k = /^\s+/,
                o = /\s+$/,
                x = /\W/,
                r = /\d/,
                A = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                C = /^[\],:{}\s]*$/,
                J = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                w = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                I = /(?:^|:|,)(?:\s*\[)+/g,
                L = /(webkit)[ \/]([\w.]+)/,
                g = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                i = /(msie) ([\w.]+)/,
                n = /(mozilla)(?:.*? rv:([\w.]+))?/,
                m = navigator.userAgent,
                p = false,
                q = [],
                u, y = Object.prototype.toString,
                F = Object.prototype.hasOwnProperty,
                M = Array.prototype.push,
                N = Array.prototype.slice,
                O = String.prototype.trim,
                D = Array.prototype.indexOf,
                R = {};
            b.fn = b.prototype = {
                init: function(j, s) {
                    var v, z, H;
                    if (!j) return this;
                    if (j.nodeType) {
                        this.context = this[0] = j;
                        this.length = 1;
                        return this
                    }
                    if (j === "body" && !s && t.body) {
                        this.context = t;
                        this[0] = t.body;
                        this.selector = "body";
                        this.length = 1;
                        return this
                    }
                    if (typeof j === "string")
                        if ((v = h.exec(j)) && (v[1] || !s))
                            if (v[1]) {
                                H = s ? s.ownerDocument || s : t;
                                if (z = A.exec(j))
                                    if (b.isPlainObject(s)) {
                                        j = [t.createElement(z[1])];
                                        b.fn.attr.call(j, s, true)
                                    } else j = [H.createElement(z[1])];
                                    else {
                                        z = b.buildFragment([v[1]], [H]);
                                        j = (z.cacheable ? z.fragment.cloneNode(true) : z.fragment).childNodes
                                    }
                                return b.merge(this, j)
                            } else {
                                if ((z = t.getElementById(v[2])) && z.parentNode) {
                                    if (z.id !== v[2]) return f.find(j);
                                    this.length = 1;
                                    this[0] = z
                                }
                                this.context = t;
                                this.selector = j;
                                return this
                            } else
                    if (!s && !x.test(j)) {
                        this.selector = j;
                        this.context = t;
                        j = t.getElementsByTagName(j);
                        return b.merge(this, j)
                    } else return !s || s.jquery ? (s || f).find(j) : b(s).find(j);
                    else if (b.isFunction(j)) return f.ready(j);
                    if (j.selector !== B) {
                        this.selector = j.selector;
                        this.context = j.context
                    }
                    return b.makeArray(j, this)
                },
                selector: "",
                jquery: "1.4.4",
                length: 0,
                size: function() {
                    return this.length
                },
                toArray: function() {
                    return N.call(this, 0)
                },
                get: function(j) {
                    return j == null ? this.toArray() : j < 0 ? this.slice(j)[0] : this[j]
                },
                pushStack: function(j, s, v) {
                    var z = b();
                    b.isArray(j) ? M.apply(z, j) : b.merge(z, j);
                    z.prevObject = this;
                    z.context = this.context;
                    if (s === "find") z.selector = this.selector + (this.selector ? " " : "") + v;
                    else if (s) z.selector = this.selector + "." + s + "(" + v + ")";
                    return z
                },
                each: function(j, s) {
                    return b.each(this, j, s)
                },
                ready: function(j) {
                    b.bindReady();
                    if (b.isReady) j.call(t, b);
                    else q && q.push(j);
                    return this
                },
                eq: function(j) {
                    return j === -1 ? this.slice(j) : this.slice(j, +j + 1)
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                slice: function() {
                    return this.pushStack(N.apply(this, arguments), "slice", N.call(arguments).join(","))
                },
                map: function(j) {
                    return this.pushStack(b.map(this, function(s, v) {
                        return j.call(s, v, s)
                    }))
                },
                end: function() {
                    return this.prevObject || b(null)
                },
                push: M,
                sort: [].sort,
                splice: [].splice
            };
            b.fn.init.prototype = b.fn;
            b.extend = b.fn.extend = function() {
                var j, s, v, z, H, G = arguments[0] || {}, K = 1,
                    Q = arguments.length,
                    ga = false;
                if (typeof G === "boolean") {
                    ga = G;
                    G = arguments[1] || {};
                    K = 2
                }
                if (typeof G !== "object" && !b.isFunction(G)) G = {};
                if (Q === K) {
                    G = this;
                    --K
                }
                for (; K < Q; K++)
                    if ((j = arguments[K]) != null)
                        for (s in j) {
                            v = G[s];
                            z = j[s];
                            if (G !== z)
                                if (ga && z && (b.isPlainObject(z) || (H = b.isArray(z)))) {
                                    if (H) {
                                        H = false;
                                        v = v && b.isArray(v) ? v : []
                                    } else v = v && b.isPlainObject(v) ? v : {};
                                    G[s] = b.extend(ga, v, z)
                                } else
                            if (z !== B) G[s] = z
                        }
                return G
            };
            b.extend({
                noConflict: function(j) {
                    E.$ = e;
                    if (j) E.jQuery = d;
                    return b
                },
                isReady: false,
                readyWait: 1,
                ready: function(j) {
                    j === true && b.readyWait--;
                    if (!b.readyWait || j !== true && !b.isReady) {
                        if (!t.body) return setTimeout(b.ready, 1);
                        b.isReady = true;
                        if (!(j !== true && --b.readyWait > 0))
                            if (q) {
                                var s = 0,
                                    v = q;
                                for (q = null; j = v[s++];) j.call(t, b);
                                b.fn.trigger && b(t).trigger("ready").unbind("ready")
                            }
                    }
                },
                bindReady: function() {
                    if (!p) {
                        p = true;
                        if (t.readyState === "complete") return setTimeout(b.ready, 1);
                        if (t.addEventListener) {
                            t.addEventListener("DOMContentLoaded", u, false);
                            E.addEventListener("load", b.ready, false)
                        } else if (t.attachEvent) {
                            t.attachEvent("onreadystatechange", u);
                            E.attachEvent("onload", b.ready);
                            var j = false;
                            try {
                                j = E.frameElement == null
                            } catch (s) {}
                            t.documentElement.doScroll && j && a()
                        }
                    }
                },
                isFunction: function(j) {
                    return b.type(j) === "function"
                },
                isArray: Array.isArray || function(j) {
                    return b.type(j) === "array"
                },
                isWindow: function(j) {
                    return j && typeof j === "object" && "setInterval" in j
                },
                isNaN: function(j) {
                    return j == null || !r.test(j) || isNaN(j)
                },
                type: function(j) {
                    return j == null ? String(j) : R[y.call(j)] || "object"
                },
                isPlainObject: function(j) {
                    if (!j || b.type(j) !== "object" || j.nodeType || b.isWindow(j)) return false;
                    if (j.constructor && !F.call(j, "constructor") && !F.call(j.constructor.prototype, "isPrototypeOf")) return false;
                    for (var s in j);
                    return s === B || F.call(j, s)
                },
                isEmptyObject: function(j) {
                    for (var s in j) return false;
                    return true
                },
                error: function(j) {
                    throw j;
                },
                parseJSON: function(j) {
                    if (typeof j !== "string" || !j) return null;
                    j = b.trim(j);
                    if (C.test(j.replace(J, "@").replace(w, "]").replace(I, ""))) return E.JSON && E.JSON.parse ? E.JSON.parse(j) : (new Function("return " + j))();
                    else b.error("Invalid JSON: " + j)
                },
                noop: function() {},
                globalEval: function(j) {
                    if (j && l.test(j)) {
                        var s = t.getElementsByTagName("head")[0] || t.documentElement,
                            v = t.createElement("script");
                        v.type = "text/javascript";
                        if (b.support.scriptEval) v.appendChild(t.createTextNode(j));
                        else v.text = j;
                        s.insertBefore(v, s.firstChild);
                        s.removeChild(v)
                    }
                },
                nodeName: function(j, s) {
                    return j.nodeName && j.nodeName.toUpperCase() === s.toUpperCase()
                },
                each: function(j, s, v) {
                    var z, H = 0,
                        G = j.length,
                        K = G === B || b.isFunction(j);
                    if (v)
                        if (K)
                            for (z in j) {
                                if (s.apply(j[z], v) === false) break
                            } else
                                for (; H < G;) {
                                    if (s.apply(j[H++], v) === false) break
                                } else if (K)
                                    for (z in j) {
                                        if (s.call(j[z], z, j[z]) === false) break
                                    } else
                                        for (v = j[0]; H < G && s.call(v, H, v) !== false; v = j[++H]);
                    return j
                },
                trim: O ? function(j) {
                    return j == null ? "" : O.call(j)
                } : function(j) {
                    return j == null ? "" : j.toString().replace(k, "").replace(o, "")
                },
                makeArray: function(j, s) {
                    var v = s || [];
                    if (j != null) {
                        var z = b.type(j);
                        j.length == null || z === "string" || z === "function" || z === "regexp" || b.isWindow(j) ? M.call(v, j) : b.merge(v, j)
                    }
                    return v
                },
                inArray: function(j, s) {
                    if (s.indexOf) return s.indexOf(j);
                    for (var v = 0, z = s.length; v < z; v++)
                        if (s[v] === j) return v;
                    return -1
                },
                merge: function(j, s) {
                    var v = j.length,
                        z = 0;
                    if (typeof s.length === "number")
                        for (var H = s.length; z < H; z++) j[v++] = s[z];
                    else
                        for (; s[z] !== B;) j[v++] = s[z++];
                    j.length = v;
                    return j
                },
                grep: function(j, s, v) {
                    var z = [],
                        H;
                    v = !! v;
                    for (var G = 0, K = j.length; G < K; G++) {
                        H = !! s(j[G], G);
                        v !== H && z.push(j[G])
                    }
                    return z
                },
                map: function(j, s, v) {
                    for (var z = [], H, G = 0, K = j.length; G < K; G++) {
                        H = s(j[G], G, v);
                        if (H != null) z[z.length] = H
                    }
                    return z.concat.apply([], z)
                },
                guid: 1,
                proxy: function(j, s, v) {
                    if (arguments.length === 2)
                        if (typeof s === "string") {
                            v = j;
                            j = v[s];
                            s = B
                        } else
                    if (s && !b.isFunction(s)) {
                        v = s;
                        s = B
                    }
                    if (!s && j) s = function() {
                        return j.apply(v || this, arguments)
                    };
                    if (j) s.guid = j.guid = j.guid || s.guid || b.guid++;
                    return s
                },
                access: function(j, s, v, z, H, G) {
                    var K = j.length;
                    if (typeof s === "object") {
                        for (var Q in s) b.access(j, Q, s[Q], z, H, v);
                        return j
                    }
                    if (v !== B) {
                        z = !G && z && b.isFunction(v);
                        for (Q = 0; Q < K; Q++) H(j[Q], s, z ? v.call(j[Q], Q, H(j[Q], s)) : v, G);
                        return j
                    }
                    return K ? H(j[0], s) : B
                },
                now: function() {
                    return (new Date).getTime()
                },
                uaMatch: function(j) {
                    j = j.toLowerCase();
                    j = L.exec(j) || g.exec(j) || i.exec(j) || j.indexOf("compatible") < 0 && n.exec(j) || [];
                    return {
                        browser: j[1] || "",
                        version: j[2] || "0"
                    }
                },
                browser: {}
            });
            b.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(j, s) {
                R["[object " + s + "]"] = s.toLowerCase()
            });
            m = b.uaMatch(m);
            if (m.browser) {
                b.browser[m.browser] = true;
                b.browser.version = m.version
            }
            if (b.browser.webkit) b.browser.safari = true;
            if (D) b.inArray = function(j, s) {
                return D.call(s, j)
            };
            if (!/\s/.test("\u00a0")) {
                k = /^[\s\xA0]+/;
                o = /[\s\xA0]+$/
            }
            f = b(t);
            if (t.addEventListener) u = function() {
                t.removeEventListener("DOMContentLoaded", u, false);
                b.ready()
            };
            else if (t.attachEvent) u = function() {
                if (t.readyState === "complete") {
                    t.detachEvent("onreadystatechange", u);
                    b.ready()
                }
            };
            return E.jQuery = E.$ = b
        }();
    (function() {
        c.support = {};
        var a = t.documentElement,
            b = t.createElement("script"),
            d = t.createElement("div"),
            e = "script" + c.now();
        d.style.display = "none";
        d.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
        var f = d.getElementsByTagName("*"),
            h = d.getElementsByTagName("a")[0],
            l = t.createElement("select"),
            k = l.appendChild(t.createElement("option"));
        if (!(!f || !f.length || !h)) {
            c.support = {
                leadingWhitespace: d.firstChild.nodeType === 3,
                tbody: !d.getElementsByTagName("tbody").length,
                htmlSerialize: !! d.getElementsByTagName("link").length,
                style: /red/.test(h.getAttribute("style")),
                hrefNormalized: h.getAttribute("href") === "/a",
                opacity: /^0.55$/.test(h.style.opacity),
                cssFloat: !! h.style.cssFloat,
                checkOn: d.getElementsByTagName("input")[0].value === "on",
                optSelected: k.selected,
                deleteExpando: true,
                optDisabled: false,
                checkClone: false,
                scriptEval: false,
                noCloneEvent: true,
                boxModel: null,
                inlineBlockNeedsLayout: false,
                shrinkWrapBlocks: false,
                reliableHiddenOffsets: true
            };
            l.disabled = true;
            c.support.optDisabled = !k.disabled;
            b.type = "text/javascript";
            try {
                b.appendChild(t.createTextNode("window." + e + "=1;"))
            } catch (o) {}
            a.insertBefore(b, a.firstChild);
            if (E[e]) {
                c.support.scriptEval = true;
                delete E[e]
            }
            try {
                delete b.test
            } catch (x) {
                c.support.deleteExpando = false
            }
            a.removeChild(b);
            if (d.attachEvent && d.fireEvent) {
                d.attachEvent("onclick", function r() {
                    c.support.noCloneEvent = false;
                    d.detachEvent("onclick", r)
                });
                d.cloneNode(true).fireEvent("onclick")
            }
            d = t.createElement("div");
            d.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
            a = t.createDocumentFragment();
            a.appendChild(d.firstChild);
            c.support.checkClone = a.cloneNode(true).cloneNode(true).lastChild.checked;
            c(function() {
                var r = t.createElement("div");
                r.style.width = r.style.paddingLeft = "1px";
                t.body.appendChild(r);
                c.boxModel = c.support.boxModel = r.offsetWidth === 2;
                if ("zoom" in r.style) {
                    r.style.display = "inline";
                    r.style.zoom = 1;
                    c.support.inlineBlockNeedsLayout = r.offsetWidth === 2;
                    r.style.display = "";
                    r.innerHTML = "<div style='width:4px;'></div>";
                    c.support.shrinkWrapBlocks = r.offsetWidth !== 2
                }
                r.innerHTML = "<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";
                var A = r.getElementsByTagName("td");
                c.support.reliableHiddenOffsets = A[0].offsetHeight === 0;
                A[0].style.display = "";
                A[1].style.display = "none";
                c.support.reliableHiddenOffsets = c.support.reliableHiddenOffsets && A[0].offsetHeight === 0;
                r.innerHTML = "";
                t.body.removeChild(r).style.display = "none"
            });
            a = function(r) {
                var A = t.createElement("div");
                r = "on" + r;
                var C = r in A;
                if (!C) {
                    A.setAttribute(r, "return;");
                    C = typeof A[r] === "function"
                }
                return C
            };
            c.support.submitBubbles = a("submit");
            c.support.changeBubbles = a("change");
            a = b = d = f = h = null
        }
    })();
    var ra = {}, Ja = /^(?:\{.*\}|\[.*\])$/;
    c.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + c.now(),
        noData: {
            embed: true,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: true
        },
        data: function(a, b, d) {
            if (c.acceptData(a)) {
                a = a == E ? ra : a;
                var e = a.nodeType,
                    f = e ? a[c.expando] : null,
                    h = c.cache;
                if (!(e && !f && typeof b === "string" && d === B)) {
                    if (e) f || (a[c.expando] = f = ++c.uuid);
                    else h = a; if (typeof b === "object")
                        if (e) h[f] = c.extend(h[f], b);
                        else c.extend(h, b);
                        else
                    if (e && !h[f]) h[f] = {};
                    a = e ? h[f] : h;
                    if (d !== B) a[b] = d;
                    return typeof b === "string" ? a[b] : a
                }
            }
        },
        removeData: function(a, b) {
            if (c.acceptData(a)) {
                a = a == E ? ra : a;
                var d = a.nodeType,
                    e = d ? a[c.expando] : a,
                    f = c.cache,
                    h = d ? f[e] : e;
                if (b) {
                    if (h) {
                        delete h[b];
                        d && c.isEmptyObject(h) && c.removeData(a)
                    }
                } else if (d && c.support.deleteExpando) delete a[c.expando];
                else if (a.removeAttribute) a.removeAttribute(c.expando);
                else if (d) delete f[e];
                else
                    for (var l in a) delete a[l]
            }
        },
        acceptData: function(a) {
            if (a.nodeName) {
                var b = c.noData[a.nodeName.toLowerCase()];
                if (b) return !(b === true || a.getAttribute("classid") !== b)
            }
            return true
        }
    });
    c.fn.extend({
        data: function(a, b) {
            var d = null;
            if (typeof a === "undefined") {
                if (this.length) {
                    var e = this[0].attributes,
                        f;
                    d = c.data(this[0]);
                    for (var h = 0, l = e.length; h < l; h++) {
                        f = e[h].name;
                        if (f.indexOf("data-") === 0) {
                            f = f.substr(5);
                            ka(this[0], f, d[f])
                        }
                    }
                }
                return d
            } else if (typeof a === "object") return this.each(function() {
                c.data(this, a)
            });
            var k = a.split(".");
            k[1] = k[1] ? "." + k[1] : "";
            if (b === B) {
                d = this.triggerHandler("getData" + k[1] + "!", [k[0]]);
                if (d === B && this.length) {
                    d = c.data(this[0], a);
                    d = ka(this[0], a, d)
                }
                return d === B && k[1] ? this.data(k[0]) : d
            } else return this.each(function() {
                var o = c(this),
                    x = [k[0], b];
                o.triggerHandler("setData" + k[1] + "!", x);
                c.data(this, a, b);
                o.triggerHandler("changeData" + k[1] + "!", x)
            })
        },
        removeData: function(a) {
            return this.each(function() {
                c.removeData(this, a)
            })
        }
    });
    c.extend({
        queue: function(a, b, d) {
            if (a) {
                b = (b || "fx") + "queue";
                var e = c.data(a, b);
                if (!d) return e || [];
                if (!e || c.isArray(d)) e = c.data(a, b, c.makeArray(d));
                else e.push(d);
                return e
            }
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var d = c.queue(a, b),
                e = d.shift();
            if (e === "inprogress") e = d.shift();
            if (e) {
                b === "fx" && d.unshift("inprogress");
                e.call(a, function() {
                    c.dequeue(a, b)
                })
            }
        }
    });
    c.fn.extend({
        queue: function(a, b) {
            if (typeof a !== "string") {
                b = a;
                a = "fx"
            }
            if (b === B) return c.queue(this[0], a);
            return this.each(function() {
                var d = c.queue(this, a, b);
                a === "fx" && d[0] !== "inprogress" && c.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                c.dequeue(this, a)
            })
        },
        delay: function(a, b) {
            a = c.fx ? c.fx.speeds[a] || a : a;
            b = b || "fx";
            return this.queue(b, function() {
                var d = this;
                setTimeout(function() {
                    c.dequeue(d, b)
                }, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        }
    });
    var sa = /[\n\t]/g,
        ha = /\s+/,
        Sa = /\r/g,
        Ta = /^(?:href|src|style)$/,
        Ua = /^(?:button|input)$/i,
        Va = /^(?:button|input|object|select|textarea)$/i,
        Wa = /^a(?:rea)?$/i,
        ta = /^(?:radio|checkbox)$/i;
    c.props = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    };
    c.fn.extend({
        attr: function(a, b) {
            return c.access(this, a, b, true, c.attr)
        },
        removeAttr: function(a) {
            return this.each(function() {
                c.attr(this, a, "");
                this.nodeType === 1 && this.removeAttribute(a)
            })
        },
        addClass: function(a) {
            if (c.isFunction(a)) return this.each(function(x) {
                var r = c(this);
                r.addClass(a.call(this, x, r.attr("class")))
            });
            if (a && typeof a === "string")
                for (var b = (a || "").split(ha), d = 0, e = this.length; d < e; d++) {
                    var f = this[d];
                    if (f.nodeType === 1)
                        if (f.className) {
                            for (var h = " " + f.className + " ", l = f.className, k = 0, o = b.length; k < o; k++)
                                if (h.indexOf(" " + b[k] + " ") < 0) l += " " + b[k];
                            f.className = c.trim(l)
                        } else f.className = a
                }
            return this
        },
        removeClass: function(a) {
            if (c.isFunction(a)) return this.each(function(o) {
                var x = c(this);
                x.removeClass(a.call(this, o, x.attr("class")))
            });
            if (a && typeof a === "string" || a === B)
                for (var b = (a || "").split(ha), d = 0, e = this.length; d < e; d++) {
                    var f = this[d];
                    if (f.nodeType === 1 && f.className)
                        if (a) {
                            for (var h = (" " + f.className + " ").replace(sa, " "), l = 0, k = b.length; l < k; l++) h = h.replace(" " + b[l] + " ", " ");
                            f.className = c.trim(h)
                        } else f.className = ""
                }
            return this
        },
        toggleClass: function(a, b) {
            var d = typeof a,
                e = typeof b === "boolean";
            if (c.isFunction(a)) return this.each(function(f) {
                var h = c(this);
                h.toggleClass(a.call(this, f, h.attr("class"), b), b)
            });
            return this.each(function() {
                if (d === "string")
                    for (var f, h = 0, l = c(this), k = b, o = a.split(ha); f = o[h++];) {
                        k = e ? k : !l.hasClass(f);
                        l[k ? "addClass" : "removeClass"](f)
                    } else if (d === "undefined" || d === "boolean") {
                        this.className && c.data(this, "__className__", this.className);
                        this.className = this.className || a === false ? "" : c.data(this, "__className__") || ""
                    }
            })
        },
        hasClass: function(a) {
            a = " " + a + " ";
            for (var b = 0, d = this.length; b < d; b++)
                if ((" " + this[b].className + " ").replace(sa, " ").indexOf(a) > -1) return true;
            return false
        },
        val: function(a) {
            if (!arguments.length) {
                var b = this[0];
                if (b) {
                    if (c.nodeName(b, "option")) {
                        var d = b.attributes.value;
                        return !d || d.specified ? b.value : b.text
                    }
                    if (c.nodeName(b, "select")) {
                        var e = b.selectedIndex;
                        d = [];
                        var f = b.options;
                        b = b.type === "select-one";
                        if (e < 0) return null;
                        var h = b ? e : 0;
                        for (e = b ? e + 1 : f.length; h < e; h++) {
                            var l = f[h];
                            if (l.selected && (c.support.optDisabled ? !l.disabled : l.getAttribute("disabled") === null) && (!l.parentNode.disabled || !c.nodeName(l.parentNode, "optgroup"))) {
                                a = c(l).val();
                                if (b) return a;
                                d.push(a)
                            }
                        }
                        return d
                    }
                    if (ta.test(b.type) && !c.support.checkOn) return b.getAttribute("value") === null ? "on" : b.value;
                    return (b.value || "").replace(Sa, "")
                }
                return B
            }
            var k = c.isFunction(a);
            return this.each(function(o) {
                var x = c(this),
                    r = a;
                if (this.nodeType === 1) {
                    if (k) r = a.call(this, o, x.val());
                    if (r == null) r = "";
                    else if (typeof r === "number") r += "";
                    else if (c.isArray(r)) r = c.map(r, function(C) {
                        return C == null ? "" : C + ""
                    });
                    if (c.isArray(r) && ta.test(this.type)) this.checked = c.inArray(x.val(), r) >= 0;
                    else if (c.nodeName(this, "select")) {
                        var A = c.makeArray(r);
                        c("option", this).each(function() {
                            this.selected = c.inArray(c(this).val(), A) >= 0
                        });
                        if (!A.length) this.selectedIndex = -1
                    } else this.value = r
                }
            })
        }
    });
    c.extend({
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },
        attr: function(a, b, d, e) {
            if (!a || a.nodeType === 3 || a.nodeType === 8) return B;
            if (e && b in c.attrFn) return c(a)[b](d);
            e = a.nodeType !== 1 || !c.isXMLDoc(a);
            var f = d !== B;
            b = e && c.props[b] || b;
            var h = Ta.test(b);
            if ((b in a || a[b] !== B) && e && !h) {
                if (f) {
                    b === "type" && Ua.test(a.nodeName) && a.parentNode && c.error("type property can't be changed");
                    if (d === null) a.nodeType === 1 && a.removeAttribute(b);
                    else a[b] = d
                }
                if (c.nodeName(a, "form") && a.getAttributeNode(b)) return a.getAttributeNode(b).nodeValue;
                if (b === "tabIndex") return (b = a.getAttributeNode("tabIndex")) && b.specified ? b.value : Va.test(a.nodeName) || Wa.test(a.nodeName) && a.href ? 0 : B;
                return a[b]
            }
            if (!c.support.style && e && b === "style") {
                if (f) a.style.cssText = "" + d;
                return a.style.cssText
            }
            f && a.setAttribute(b, "" + d);
            if (!a.attributes[b] && a.hasAttribute && !a.hasAttribute(b)) return B;
            a = !c.support.hrefNormalized && e && h ? a.getAttribute(b, 2) : a.getAttribute(b);
            return a === null ? B : a
        }
    });
    var X = /\.(.*)$/,
        ia = /^(?:textarea|input|select)$/i,
        La = /\./g,
        Ma = / /g,
        Xa = /[^\w\s.|`]/g,
        Ya = function(a) {
            return a.replace(Xa, "\\$&")
        }, ua = {
            focusin: 0,
            focusout: 0
        };
    c.event = {
        add: function(a, b, d, e) {
            if (!(a.nodeType === 3 || a.nodeType === 8)) {
                if (c.isWindow(a) && a !== E && !a.frameElement) a = E;
                if (d === false) d = U;
                else if (!d) return;
                var f, h;
                if (d.handler) {
                    f = d;
                    d = f.handler
                }
                if (!d.guid) d.guid = c.guid++;
                if (h = c.data(a)) {
                    var l = a.nodeType ? "events" : "__events__",
                        k = h[l],
                        o = h.handle;
                    if (typeof k === "function") {
                        o = k.handle;
                        k = k.events
                    } else if (!k) {
                        a.nodeType || (h[l] = h = function() {});
                        h.events = k = {}
                    }
                    if (!o) h.handle = o = function() {
                        return typeof c !== "undefined" && !c.event.triggered ? c.event.handle.apply(o.elem, arguments) : B
                    };
                    o.elem = a;
                    b = b.split(" ");
                    for (var x = 0, r; l = b[x++];) {
                        h = f ? c.extend({}, f) : {
                            handler: d,
                            data: e
                        };
                        if (l.indexOf(".") > -1) {
                            r = l.split(".");
                            l = r.shift();
                            h.namespace = r.slice(0).sort().join(".")
                        } else {
                            r = [];
                            h.namespace = ""
                        }
                        h.type = l;
                        if (!h.guid) h.guid = d.guid;
                        var A = k[l],
                            C = c.event.special[l] || {};
                        if (!A) {
                            A = k[l] = [];
                            if (!C.setup || C.setup.call(a, e, r, o) === false)
                                if (a.addEventListener) a.addEventListener(l, o, false);
                                else a.attachEvent && a.attachEvent("on" + l, o)
                        }
                        if (C.add) {
                            C.add.call(a, h);
                            if (!h.handler.guid) h.handler.guid = d.guid
                        }
                        A.push(h);
                        c.event.global[l] = true
                    }
                    a = null
                }
            }
        },
        global: {},
        remove: function(a, b, d, e) {
            if (!(a.nodeType === 3 || a.nodeType === 8)) {
                if (d === false) d = U;
                var f, h, l = 0,
                    k, o, x, r, A, C, J = a.nodeType ? "events" : "__events__",
                    w = c.data(a),
                    I = w && w[J];
                if (w && I) {
                    if (typeof I === "function") {
                        w = I;
                        I = I.events
                    }
                    if (b && b.type) {
                        d = b.handler;
                        b = b.type
                    }
                    if (!b || typeof b === "string" && b.charAt(0) === ".") {
                        b = b || "";
                        for (f in I) c.event.remove(a, f + b)
                    } else {
                        for (b = b.split(" "); f = b[l++];) {
                            r = f;
                            k = f.indexOf(".") < 0;
                            o = [];
                            if (!k) {
                                o = f.split(".");
                                f = o.shift();
                                x = RegExp("(^|\\.)" +
                                    c.map(o.slice(0).sort(), Ya).join("\\.(?:.*\\.)?") + "(\\.|$)")
                            }
                            if (A = I[f])
                                if (d) {
                                    r = c.event.special[f] || {};
                                    for (h = e || 0; h < A.length; h++) {
                                        C = A[h];
                                        if (d.guid === C.guid) {
                                            if (k || x.test(C.namespace)) {
                                                e == null && A.splice(h--, 1);
                                                r.remove && r.remove.call(a, C)
                                            }
                                            if (e != null) break
                                        }
                                    }
                                    if (A.length === 0 || e != null && A.length === 1) {
                                        if (!r.teardown || r.teardown.call(a, o) === false) c.removeEvent(a, f, w.handle);
                                        delete I[f]
                                    }
                                } else
                                    for (h = 0; h < A.length; h++) {
                                        C = A[h];
                                        if (k || x.test(C.namespace)) {
                                            c.event.remove(a, r, C.handler, h);
                                            A.splice(h--, 1)
                                        }
                                    }
                        }
                        if (c.isEmptyObject(I)) {
                            if (b = w.handle) b.elem = null;
                            delete w.events;
                            delete w.handle;
                            if (typeof w === "function") c.removeData(a, J);
                            else c.isEmptyObject(w) && c.removeData(a)
                        }
                    }
                }
            }
        },
        trigger: function(a, b, d, e) {
            var f = a.type || a;
            if (!e) {
                a = typeof a === "object" ? a[c.expando] ? a : c.extend(c.Event(f), a) : c.Event(f);
                if (f.indexOf("!") >= 0) {
                    a.type = f = f.slice(0, -1);
                    a.exclusive = true
                }
                if (!d) {
                    a.stopPropagation();
                    c.event.global[f] && c.each(c.cache, function() {
                        this.events && this.events[f] && c.event.trigger(a, b, this.handle.elem)
                    })
                }
                if (!d || d.nodeType === 3 || d.nodeType === 8) return B;
                a.result = B;
                a.target = d;
                b = c.makeArray(b);
                b.unshift(a)
            }
            a.currentTarget = d;
            (e = d.nodeType ? c.data(d, "handle") : (c.data(d, "__events__") || {}).handle) && e.apply(d, b);
            e = d.parentNode || d.ownerDocument;
            try {
                if (!(d && d.nodeName && c.noData[d.nodeName.toLowerCase()]))
                    if (d["on" + f] && d["on" + f].apply(d, b) === false) {
                        a.result = false;
                        a.preventDefault()
                    }
            } catch (h) {}
            if (!a.isPropagationStopped() && e) c.event.trigger(a, b, e, true);
            else if (!a.isDefaultPrevented()) {
                var l;
                e = a.target;
                var k = f.replace(X, ""),
                    o = c.nodeName(e, "a") && k === "click",
                    x = c.event.special[k] || {};
                if ((!x._default || x._default.call(d, a) === false) && !o && !(e && e.nodeName && c.noData[e.nodeName.toLowerCase()])) {
                    try {
                        if (e[k]) {
                            if (l = e["on" + k]) e["on" + k] = null;
                            c.event.triggered = true;
                            e[k]()
                        }
                    } catch (r) {}
                    if (l) e["on" + k] = l;
                    c.event.triggered = false
                }
            }
        },
        handle: function(a) {
            var b, d, e, f;
            d = [];
            var h = c.makeArray(arguments);
            a = h[0] = c.event.fix(a || E.event);
            a.currentTarget = this;
            b = a.type.indexOf(".") < 0 && !a.exclusive;
            if (!b) {
                e = a.type.split(".");
                a.type = e.shift();
                d = e.slice(0).sort();
                e = RegExp("(^|\\.)" +
                    d.join("\\.(?:.*\\.)?") + "(\\.|$)")
            }
            a.namespace = a.namespace || d.join(".");
            f = c.data(this, this.nodeType ? "events" : "__events__");
            if (typeof f === "function") f = f.events;
            d = (f || {})[a.type];
            if (f && d) {
                d = d.slice(0);
                f = 0;
                for (var l = d.length; f < l; f++) {
                    var k = d[f];
                    if (b || e.test(k.namespace)) {
                        a.handler = k.handler;
                        a.data = k.data;
                        a.handleObj = k;
                        k = k.handler.apply(this, h);
                        if (k !== B) {
                            a.result = k;
                            if (k === false) {
                                a.preventDefault();
                                a.stopPropagation()
                            }
                        }
                        if (a.isImmediatePropagationStopped()) break
                    }
                }
            }
            return a.result
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function(a) {
            if (a[c.expando]) return a;
            var b = a;
            a = c.Event(b);
            for (var d = this.props.length, e; d;) {
                e = this.props[--d];
                a[e] = b[e]
            }
            if (!a.target) a.target = a.srcElement || t;
            if (a.target.nodeType === 3) a.target = a.target.parentNode;
            if (!a.relatedTarget && a.fromElement) a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement;
            if (a.pageX == null && a.clientX != null) {
                b = t.documentElement;
                d = t.body;
                a.pageX = a.clientX + (b && b.scrollLeft || d && d.scrollLeft || 0) - (b && b.clientLeft || d && d.clientLeft || 0);
                a.pageY = a.clientY + (b && b.scrollTop || d && d.scrollTop || 0) - (b && b.clientTop || d && d.clientTop || 0)
            }
            if (a.which == null && (a.charCode != null || a.keyCode != null)) a.which = a.charCode != null ? a.charCode : a.keyCode;
            if (!a.metaKey && a.ctrlKey) a.metaKey = a.ctrlKey;
            if (!a.which && a.button !== B) a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0;
            return a
        },
        guid: 1E8,
        proxy: c.proxy,
        special: {
            ready: {
                setup: c.bindReady,
                teardown: c.noop
            },
            live: {
                add: function(a) {
                    c.event.add(this, Y(a.origType, a.selector), c.extend({}, a, {
                        handler: Ka,
                        guid: a.handler.guid
                    }))
                },
                remove: function(a) {
                    c.event.remove(this, Y(a.origType, a.selector), a)
                }
            },
            beforeunload: {
                setup: function(a, b, d) {
                    if (c.isWindow(this)) this.onbeforeunload = d
                },
                teardown: function(a, b) {
                    if (this.onbeforeunload === b) this.onbeforeunload = null
                }
            }
        }
    };
    c.removeEvent = t.removeEventListener ? function(a, b, d) {
        a.removeEventListener && a.removeEventListener(b, d, false)
    } : function(a, b, d) {
        a.detachEvent && a.detachEvent("on" + b, d)
    };
    c.Event = function(a) {
        if (!this.preventDefault) return new c.Event(a);
        if (a && a.type) {
            this.originalEvent = a;
            this.type = a.type
        } else this.type = a;
        this.timeStamp = c.now();
        this[c.expando] = true
    };
    c.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = ca;
            var a = this.originalEvent;
            if (a)
                if (a.preventDefault) a.preventDefault();
                else a.returnValue = false
        },
        stopPropagation: function() {
            this.isPropagationStopped = ca;
            var a = this.originalEvent;
            if (a) {
                a.stopPropagation && a.stopPropagation();
                a.cancelBubble = true
            }
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = ca;
            this.stopPropagation()
        },
        isDefaultPrevented: U,
        isPropagationStopped: U,
        isImmediatePropagationStopped: U
    };
    var va = function(a) {
        var b = a.relatedTarget;
        try {
            for (; b && b !== this;) b = b.parentNode;
            if (b !== this) {
                a.type = a.data;
                c.event.handle.apply(this, arguments)
            }
        } catch (d) {}
    }, wa = function(a) {
            a.type = a.data;
            c.event.handle.apply(this, arguments)
        };
    c.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(a, b) {
        c.event.special[a] = {
            setup: function(d) {
                c.event.add(this, b, d && d.selector ? wa : va, a)
            },
            teardown: function(d) {
                c.event.remove(this, b, d && d.selector ? wa : va)
            }
        }
    });
    if (!c.support.submitBubbles) c.event.special.submit = {
        setup: function() {
            if (this.nodeName.toLowerCase() !== "form") {
                c.event.add(this, "click.specialSubmit", function(a) {
                    var b = a.target,
                        d = b.type;
                    if ((d === "submit" || d === "image") && c(b).closest("form").length) {
                        a.liveFired = B;
                        return la("submit", this, arguments)
                    }
                });
                c.event.add(this, "keypress.specialSubmit", function(a) {
                    var b = a.target,
                        d = b.type;
                    if ((d === "text" || d === "password") && c(b).closest("form").length && a.keyCode === 13) {
                        a.liveFired = B;
                        return la("submit", this, arguments)
                    }
                })
            } else return false
        },
        teardown: function() {
            c.event.remove(this, ".specialSubmit")
        }
    };
    if (!c.support.changeBubbles) {
        var V, xa = function(a) {
                var b = a.type,
                    d = a.value;
                if (b === "radio" || b === "checkbox") d = a.checked;
                else if (b === "select-multiple") d = a.selectedIndex > -1 ? c.map(a.options, function(e) {
                    return e.selected
                }).join("-") : "";
                else if (a.nodeName.toLowerCase() === "select") d = a.selectedIndex;
                return d
            }, Z = function(a, b) {
                var d = a.target,
                    e, f;
                if (!(!ia.test(d.nodeName) || d.readOnly)) {
                    e = c.data(d, "_change_data");
                    f = xa(d);
                    if (a.type !== "focusout" || d.type !== "radio") c.data(d, "_change_data", f);
                    if (!(e === B || f === e))
                        if (e != null || f) {
                            a.type = "change";
                            a.liveFired = B;
                            return c.event.trigger(a, b, d)
                        }
                }
            };
        c.event.special.change = {
            filters: {
                focusout: Z,
                beforedeactivate: Z,
                click: function(a) {
                    var b = a.target,
                        d = b.type;
                    if (d === "radio" || d === "checkbox" || b.nodeName.toLowerCase() === "select") return Z.call(this, a)
                },
                keydown: function(a) {
                    var b = a.target,
                        d = b.type;
                    if (a.keyCode === 13 && b.nodeName.toLowerCase() !== "textarea" || a.keyCode === 32 && (d === "checkbox" || d === "radio") || d === "select-multiple") return Z.call(this, a)
                },
                beforeactivate: function(a) {
                    a = a.target;
                    c.data(a, "_change_data", xa(a))
                }
            },
            setup: function() {
                if (this.type === "file") return false;
                for (var a in V) c.event.add(this, a + ".specialChange", V[a]);
                return ia.test(this.nodeName)
            },
            teardown: function() {
                c.event.remove(this, ".specialChange");
                return ia.test(this.nodeName)
            }
        };
        V = c.event.special.change.filters;
        V.focus = V.beforeactivate
    }
    t.addEventListener && c.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        function d(e) {
            e = c.event.fix(e);
            e.type = b;
            return c.event.trigger(e, null, e.target)
        }
        c.event.special[b] = {
            setup: function() {
                ua[b]++ === 0 && t.addEventListener(a, d, true)
            },
            teardown: function() {
                --ua[b] === 0 && t.removeEventListener(a, d, true)
            }
        }
    });
    c.each(["bind", "one"], function(a, b) {
        c.fn[b] = function(d, e, f) {
            if (typeof d === "object") {
                for (var h in d) this[b](h, e, d[h], f);
                return this
            }
            if (c.isFunction(e) || e === false) {
                f = e;
                e = B
            }
            var l = b === "one" ? c.proxy(f, function(o) {
                c(this).unbind(o, l);
                return f.apply(this, arguments)
            }) : f;
            if (d === "unload" && b !== "one") this.one(d, e, f);
            else {
                h = 0;
                for (var k = this.length; h < k; h++) c.event.add(this[h], d, l, e)
            }
            return this
        }
    });
    c.fn.extend({
        unbind: function(a, b) {
            if (typeof a === "object" && !a.preventDefault)
                for (var d in a) this.unbind(d, a[d]);
            else {
                d = 0;
                for (var e = this.length; d < e; d++) c.event.remove(this[d], a, b)
            }
            return this
        },
        delegate: function(a, b, d, e) {
            return this.live(b, d, e, a)
        },
        undelegate: function(a, b, d) {
            return arguments.length === 0 ? this.unbind("live") : this.die(b, null, d, a)
        },
        trigger: function(a, b) {
            return this.each(function() {
                c.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            if (this[0]) {
                var d = c.Event(a);
                d.preventDefault();
                d.stopPropagation();
                c.event.trigger(d, b, this[0]);
                return d.result
            }
        },
        toggle: function(a) {
            for (var b = arguments, d = 1; d < b.length;) c.proxy(a, b[d++]);
            return this.click(c.proxy(a, function(e) {
                var f = (c.data(this, "lastToggle" + a.guid) || 0) % d;
                c.data(this, "lastToggle" + a.guid, f + 1);
                e.preventDefault();
                return b[f].apply(this, arguments) || false
            }))
        },
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    });
    var ya = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    c.each(["live", "die"], function(a, b) {
        c.fn[b] = function(d, e, f, h) {
            var l, k = 0,
                o, x, r = h || this.selector;
            h = h ? this : c(this.context);
            if (typeof d === "object" && !d.preventDefault) {
                for (l in d) h[b](l, e, d[l], r);
                return this
            }
            if (c.isFunction(e)) {
                f = e;
                e = B
            }
            for (d = (d || "").split(" ");
                (l = d[k++]) != null;) {
                o = X.exec(l);
                x = "";
                if (o) {
                    x = o[0];
                    l = l.replace(X, "")
                }
                if (l === "hover") d.push("mouseenter" + x, "mouseleave" + x);
                else {
                    o = l;
                    if (l === "focus" || l === "blur") {
                        d.push(ya[l] + x);
                        l += x
                    } else l = (ya[l] || l) + x; if (b === "live") {
                        x = 0;
                        for (var A = h.length; x < A; x++) c.event.add(h[x], "live." + Y(l, r), {
                            data: e,
                            selector: r,
                            handler: f,
                            origType: l,
                            origHandler: f,
                            preType: o
                        })
                    } else h.unbind("live." + Y(l, r), f)
                }
            }
            return this
        }
    });
    c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "), function(a, b) {
        c.fn[b] = function(d, e) {
            if (e == null) {
                e = d;
                d = null
            }
            return arguments.length > 0 ? this.bind(b, d, e) : this.trigger(b)
        };
        if (c.attrFn) c.attrFn[b] = true
    });
    E.attachEvent && !E.addEventListener && c(E).bind("unload", function() {
        for (var a in c.cache)
            if (c.cache[a].handle) try {
                c.event.remove(c.cache[a].handle.elem)
            } catch (b) {}
    });
    (function() {
        function a(g, i, n, m, p, q) {
            p = 0;
            for (var u = m.length; p < u; p++) {
                var y = m[p];
                if (y) {
                    var F = false;
                    for (y = y[g]; y;) {
                        if (y.sizcache === n) {
                            F = m[y.sizset];
                            break
                        }
                        if (y.nodeType === 1 && !q) {
                            y.sizcache = n;
                            y.sizset = p
                        }
                        if (y.nodeName.toLowerCase() === i) {
                            F = y;
                            break
                        }
                        y = y[g]
                    }
                    m[p] = F
                }
            }
        }

        function b(g, i, n, m, p, q) {
            p = 0;
            for (var u = m.length; p < u; p++) {
                var y = m[p];
                if (y) {
                    var F = false;
                    for (y = y[g]; y;) {
                        if (y.sizcache === n) {
                            F = m[y.sizset];
                            break
                        }
                        if (y.nodeType === 1) {
                            if (!q) {
                                y.sizcache = n;
                                y.sizset = p
                            }
                            if (typeof i !== "string") {
                                if (y === i) {
                                    F = true;
                                    break
                                }
                            } else if (k.filter(i, [y]).length > 0) {
                                F = y;
                                break
                            }
                        }
                        y = y[g]
                    }
                    m[p] = F
                }
            }
        }
        var d = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            e = 0,
            f = Object.prototype.toString,
            h = false,
            l = true;
        [0, 0].sort(function() {
                l = false;
                return 0
            });
        var k = function(g, i, n, m) {
            n = n || [];
            var p = i = i || t;
            if (i.nodeType !== 1 && i.nodeType !== 9) return [];
            if (!g || typeof g !== "string") return n;
            var q, u, y, F, M, N = true,
                O = k.isXML(i),
                D = [],
                R = g;
            do {
                d.exec("");
                if (q = d.exec(R)) {
                    R = q[3];
                    D.push(q[1]);
                    if (q[2]) {
                        F = q[3];
                        break
                    }
                }
            } while (q);
            if (D.length > 1 && x.exec(g))
                if (D.length === 2 && o.relative[D[0]]) u = L(D[0] + D[1], i);
                else
                    for (u = o.relative[D[0]] ? [i] : k(D.shift(), i); D.length;) {
                        g = D.shift();
                        if (o.relative[g]) g += D.shift();
                        u = L(g, u)
                    } else {
                        if (!m && D.length > 1 && i.nodeType === 9 && !O && o.match.ID.test(D[0]) && !o.match.ID.test(D[D.length - 1])) {
                            q = k.find(D.shift(), i, O);
                            i = q.expr ? k.filter(q.expr, q.set)[0] : q.set[0]
                        }
                        if (i) {
                            q = m ? {
                                expr: D.pop(),
                                set: C(m)
                            } : k.find(D.pop(), D.length === 1 && (D[0] === "~" || D[0] === "+") && i.parentNode ? i.parentNode : i, O);
                            u = q.expr ? k.filter(q.expr, q.set) : q.set;
                            if (D.length > 0) y = C(u);
                            else N = false;
                            for (; D.length;) {
                                q = M = D.pop();
                                if (o.relative[M]) q = D.pop();
                                else M = ""; if (q == null) q = i;
                                o.relative[M](y, q, O)
                            }
                        } else y = []
                    }
            y || (y = u);
            y || k.error(M || g);
            if (f.call(y) === "[object Array]")
                if (N)
                    if (i && i.nodeType === 1)
                        for (g = 0; y[g] != null; g++) {
                            if (y[g] && (y[g] === true || y[g].nodeType === 1 && k.contains(i, y[g]))) n.push(u[g])
                        } else
                            for (g = 0; y[g] != null; g++) y[g] && y[g].nodeType === 1 && n.push(u[g]);
                    else n.push.apply(n, y);
                    else C(y, n);
            if (F) {
                k(F, p, n, m);
                k.uniqueSort(n)
            }
            return n
        };
        k.uniqueSort = function(g) {
            if (w) {
                h = l;
                g.sort(w);
                if (h)
                    for (var i = 1; i < g.length; i++) g[i] === g[i - 1] && g.splice(i--, 1)
            }
            return g
        };
        k.matches = function(g, i) {
            return k(g, null, null, i)
        };
        k.matchesSelector = function(g, i) {
            return k(i, null, null, [g]).length > 0
        };
        k.find = function(g, i, n) {
            var m;
            if (!g) return [];
            for (var p = 0, q = o.order.length; p < q; p++) {
                var u, y = o.order[p];
                if (u = o.leftMatch[y].exec(g)) {
                    var F = u[1];
                    u.splice(1, 1);
                    if (F.substr(F.length - 1) !== "\\") {
                        u[1] = (u[1] || "").replace(/\\/g, "");
                        m = o.find[y](u, i, n);
                        if (m != null) {
                            g = g.replace(o.match[y], "");
                            break
                        }
                    }
                }
            }
            m || (m = i.getElementsByTagName("*"));
            return {
                set: m,
                expr: g
            }
        };
        k.filter = function(g, i, n, m) {
            for (var p, q, u = g, y = [], F = i, M = i && i[0] && k.isXML(i[0]); g && i.length;) {
                for (var N in o.filter)
                    if ((p = o.leftMatch[N].exec(g)) != null && p[2]) {
                        var O, D, R = o.filter[N];
                        D = p[1];
                        q = false;
                        p.splice(1, 1);
                        if (D.substr(D.length - 1) !== "\\") {
                            if (F === y) y = [];
                            if (o.preFilter[N])
                                if (p = o.preFilter[N](p, F, n, y, m, M)) {
                                    if (p === true) continue
                                } else q = O = true;
                            if (p)
                                for (var j = 0;
                                    (D = F[j]) != null; j++)
                                    if (D) {
                                        O = R(D, p, j, F);
                                        var s = m ^ !! O;
                                        if (n && O != null)
                                            if (s) q = true;
                                            else F[j] = false;
                                            else
                                        if (s) {
                                            y.push(D);
                                            q = true
                                        }
                                    }
                            if (O !== B) {
                                n || (F = y);
                                g = g.replace(o.match[N], "");
                                if (!q) return [];
                                break
                            }
                        }
                    }
                if (g === u)
                    if (q == null) k.error(g);
                    else break;
                u = g
            }
            return F
        };
        k.error = function(g) {
            throw "Syntax error, unrecognized expression: " + g;
        };
        var o = k.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(g) {
                    return g.getAttribute("href")
                }
            },
            relative: {
                "+": function(g, i) {
                    var n = typeof i === "string",
                        m = n && !/\W/.test(i);
                    n = n && !m;
                    if (m) i = i.toLowerCase();
                    m = 0;
                    for (var p = g.length, q; m < p; m++)
                        if (q = g[m]) {
                            for (;
                                (q = q.previousSibling) && q.nodeType !== 1;);
                            g[m] = n || q && q.nodeName.toLowerCase() === i ? q || false : q === i
                        }
                    n && k.filter(i, g, true)
                },
                ">": function(g, i) {
                    var n, m = typeof i === "string",
                        p = 0,
                        q = g.length;
                    if (m && !/\W/.test(i))
                        for (i = i.toLowerCase(); p < q; p++) {
                            if (n = g[p]) {
                                n = n.parentNode;
                                g[p] = n.nodeName.toLowerCase() === i ? n : false
                            }
                        } else {
                            for (; p < q; p++)
                                if (n = g[p]) g[p] = m ? n.parentNode : n.parentNode === i;
                            m && k.filter(i, g, true)
                        }
                },
                "": function(g, i, n) {
                    var m, p = e++,
                        q = b;
                    if (typeof i === "string" && !/\W/.test(i)) {
                        m = i = i.toLowerCase();
                        q = a
                    }
                    q("parentNode", i, p, g, m, n)
                },
                "~": function(g, i, n) {
                    var m, p = e++,
                        q = b;
                    if (typeof i === "string" && !/\W/.test(i)) {
                        m = i = i.toLowerCase();
                        q = a
                    }
                    q("previousSibling", i, p, g, m, n)
                }
            },
            find: {
                ID: function(g, i, n) {
                    if (typeof i.getElementById !== "undefined" && !n) return (g = i.getElementById(g[1])) && g.parentNode ? [g] : []
                },
                NAME: function(g, i) {
                    if (typeof i.getElementsByName !== "undefined") {
                        for (var n = [], m = i.getElementsByName(g[1]), p = 0, q = m.length; p < q; p++) m[p].getAttribute("name") === g[1] && n.push(m[p]);
                        return n.length === 0 ? null : n
                    }
                },
                TAG: function(g, i) {
                    return i.getElementsByTagName(g[1])
                }
            },
            preFilter: {
                CLASS: function(g, i, n, m, p, q) {
                    g = " " + g[1].replace(/\\/g, "") + " ";
                    if (q) return g;
                    q = 0;
                    for (var u;
                        (u = i[q]) != null; q++)
                        if (u)
                            if (p ^ (u.className && (" " + u.className + " ").replace(/[\t\n]/g, " ").indexOf(g) >= 0)) n || m.push(u);
                            else
                    if (n) i[q] = false;
                    return false
                },
                ID: function(g) {
                    return g[1].replace(/\\/g, "")
                },
                TAG: function(g) {
                    return g[1].toLowerCase()
                },
                CHILD: function(g) {
                    if (g[1] === "nth") {
                        var i = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2] === "even" && "2n" || g[2] === "odd" && "2n+1" || !/\D/.test(g[2]) && "0n+" + g[2] || g[2]);
                        g[2] = i[1] + (i[2] || 1) - 0;
                        g[3] = i[3] - 0
                    }
                    g[0] = e++;
                    return g
                },
                ATTR: function(g, i, n, m, p, q) {
                    i = g[1].replace(/\\/g, "");
                    if (!q && o.attrMap[i]) g[1] = o.attrMap[i];
                    if (g[2] === "~=") g[4] = " " + g[4] + " ";
                    return g
                },
                PSEUDO: function(g, i, n, m, p) {
                    if (g[1] === "not")
                        if ((d.exec(g[3]) || "").length > 1 || /^\w/.test(g[3])) g[3] = k(g[3], null, null, i);
                        else {
                            g = k.filter(g[3], i, n, true ^ p);
                            n || m.push.apply(m, g);
                            return false
                        } else
                    if (o.match.POS.test(g[0]) || o.match.CHILD.test(g[0])) return true;
                    return g
                },
                POS: function(g) {
                    g.unshift(true);
                    return g
                }
            },
            filters: {
                enabled: function(g) {
                    return g.disabled === false && g.type !== "hidden"
                },
                disabled: function(g) {
                    return g.disabled === true
                },
                checked: function(g) {
                    return g.checked === true
                },
                selected: function(g) {
                    return g.selected === true
                },
                parent: function(g) {
                    return !!g.firstChild
                },
                empty: function(g) {
                    return !g.firstChild
                },
                has: function(g, i, n) {
                    return !!k(n[3], g).length
                },
                header: function(g) {
                    return /h\d/i.test(g.nodeName)
                },
                text: function(g) {
                    return "text" === g.type
                },
                radio: function(g) {
                    return "radio" === g.type
                },
                checkbox: function(g) {
                    return "checkbox" === g.type
                },
                file: function(g) {
                    return "file" === g.type
                },
                password: function(g) {
                    return "password" === g.type
                },
                submit: function(g) {
                    return "submit" === g.type
                },
                image: function(g) {
                    return "image" === g.type
                },
                reset: function(g) {
                    return "reset" === g.type
                },
                button: function(g) {
                    return "button" === g.type || g.nodeName.toLowerCase() === "button"
                },
                input: function(g) {
                    return /input|select|textarea|button/i.test(g.nodeName)
                }
            },
            setFilters: {
                first: function(g, i) {
                    return i === 0
                },
                last: function(g, i, n, m) {
                    return i === m.length - 1
                },
                even: function(g, i) {
                    return i % 2 === 0
                },
                odd: function(g, i) {
                    return i % 2 === 1
                },
                lt: function(g, i, n) {
                    return i < n[3] - 0
                },
                gt: function(g, i, n) {
                    return i > n[3] - 0
                },
                nth: function(g, i, n) {
                    return n[3] -
                        0 === i
                },
                eq: function(g, i, n) {
                    return n[3] - 0 === i
                }
            },
            filter: {
                PSEUDO: function(g, i, n, m) {
                    var p = i[1],
                        q = o.filters[p];
                    if (q) return q(g, n, i, m);
                    else if (p === "contains") return (g.textContent || g.innerText || k.getText([g]) || "").indexOf(i[3]) >= 0;
                    else if (p === "not") {
                        i = i[3];
                        n = 0;
                        for (m = i.length; n < m; n++)
                            if (i[n] === g) return false;
                        return true
                    } else k.error("Syntax error, unrecognized expression: " + p)
                },
                CHILD: function(g, i) {
                    var n = i[1],
                        m = g;
                    switch (n) {
                        case "only":
                        case "first":
                            for (; m = m.previousSibling;)
                                if (m.nodeType === 1) return false;
                            if (n === "first") return true;
                            m = g;
                        case "last":
                            for (; m = m.nextSibling;)
                                if (m.nodeType === 1) return false;
                            return true;
                        case "nth":
                            n = i[2];
                            var p = i[3];
                            if (n === 1 && p === 0) return true;
                            var q = i[0],
                                u = g.parentNode;
                            if (u && (u.sizcache !== q || !g.nodeIndex)) {
                                var y = 0;
                                for (m = u.firstChild; m; m = m.nextSibling)
                                    if (m.nodeType === 1) m.nodeIndex = ++y;
                                u.sizcache = q
                            }
                            m = g.nodeIndex - p;
                            return n === 0 ? m === 0 : m % n === 0 && m / n >= 0
                    }
                },
                ID: function(g, i) {
                    return g.nodeType === 1 && g.getAttribute("id") === i
                },
                TAG: function(g, i) {
                    return i === "*" && g.nodeType === 1 || g.nodeName.toLowerCase() === i
                },
                CLASS: function(g, i) {
                    return (" " + (g.className || g.getAttribute("class")) + " ").indexOf(i) > -1
                },
                ATTR: function(g, i) {
                    var n = i[1];
                    n = o.attrHandle[n] ? o.attrHandle[n](g) : g[n] != null ? g[n] : g.getAttribute(n);
                    var m = n + "",
                        p = i[2],
                        q = i[4];
                    return n == null ? p === "!=" : p === "=" ? m === q : p === "*=" ? m.indexOf(q) >= 0 : p === "~=" ? (" " + m + " ").indexOf(q) >= 0 : !q ? m && n !== false : p === "!=" ? m !== q : p === "^=" ? m.indexOf(q) === 0 : p === "$=" ? m.substr(m.length - q.length) === q : p === "|=" ? m === q || m.substr(0, q.length + 1) === q + "-" : false
                },
                POS: function(g, i, n, m) {
                    var p = o.setFilters[i[2]];
                    if (p) return p(g, n, i, m)
                }
            }
        }, x = o.match.POS,
            r = function(g, i) {
                return "\\" + (i - 0 + 1)
            }, A;
        for (A in o.match) {
            o.match[A] = RegExp(o.match[A].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            o.leftMatch[A] = RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[A].source.replace(/\\(\d+)/g, r))
        }
        var C = function(g, i) {
            g = Array.prototype.slice.call(g, 0);
            if (i) {
                i.push.apply(i, g);
                return i
            }
            return g
        };
        try {
            Array.prototype.slice.call(t.documentElement.childNodes, 0)
        } catch (J) {
            C = function(g, i) {
                var n = 0,
                    m = i || [];
                if (f.call(g) === "[object Array]") Array.prototype.push.apply(m, g);
                else if (typeof g.length === "number")
                    for (var p = g.length; n < p; n++) m.push(g[n]);
                else
                    for (; g[n]; n++) m.push(g[n]);
                return m
            }
        }
        var w, I;
        if (t.documentElement.compareDocumentPosition) w = function(g, i) {
            if (g === i) {
                h = true;
                return 0
            }
            if (!g.compareDocumentPosition || !i.compareDocumentPosition) return g.compareDocumentPosition ? -1 : 1;
            return g.compareDocumentPosition(i) & 4 ? -1 : 1
        };
        else {
            w = function(g, i) {
                var n, m, p = [],
                    q = [];
                n = g.parentNode;
                m = i.parentNode;
                var u = n;
                if (g === i) {
                    h = true;
                    return 0
                } else if (n === m) return I(g, i);
                else if (n) {
                    if (!m) return 1
                } else return -1;
                for (; u;) {
                    p.unshift(u);
                    u = u.parentNode
                }
                for (u = m; u;) {
                    q.unshift(u);
                    u = u.parentNode
                }
                n = p.length;
                m = q.length;
                for (u = 0; u < n && u < m; u++)
                    if (p[u] !== q[u]) return I(p[u], q[u]);
                return u === n ? I(g, q[u], -1) : I(p[u], i, 1)
            };
            I = function(g, i, n) {
                if (g === i) return n;
                for (g = g.nextSibling; g;) {
                    if (g === i) return -1;
                    g = g.nextSibling
                }
                return 1
            }
        }
        k.getText = function(g) {
            for (var i = "", n, m = 0; g[m]; m++) {
                n = g[m];
                if (n.nodeType === 3 || n.nodeType === 4) i += n.nodeValue;
                else if (n.nodeType !== 8) i += k.getText(n.childNodes)
            }
            return i
        };
        (function() {
            var g = t.createElement("div"),
                i = "script" + (new Date).getTime(),
                n = t.documentElement;
            g.innerHTML = "<a name='" + i + "'/>";
            n.insertBefore(g, n.firstChild);
            if (t.getElementById(i)) {
                o.find.ID = function(m, p, q) {
                    if (typeof p.getElementById !== "undefined" && !q) return (p = p.getElementById(m[1])) ? p.id === m[1] || typeof p.getAttributeNode !== "undefined" && p.getAttributeNode("id").nodeValue === m[1] ? [p] : B : []
                };
                o.filter.ID = function(m, p) {
                    var q = typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id");
                    return m.nodeType === 1 && q && q.nodeValue === p
                }
            }
            n.removeChild(g);
            n = g = null
        })();
        (function() {
            var g = t.createElement("div");
            g.appendChild(t.createComment(""));
            if (g.getElementsByTagName("*").length > 0) o.find.TAG = function(i, n) {
                var m = n.getElementsByTagName(i[1]);
                if (i[1] === "*") {
                    for (var p = [], q = 0; m[q]; q++) m[q].nodeType === 1 && p.push(m[q]);
                    m = p
                }
                return m
            };
            g.innerHTML = "<a href='#'></a>";
            if (g.firstChild && typeof g.firstChild.getAttribute !== "undefined" && g.firstChild.getAttribute("href") !== "#") o.attrHandle.href = function(i) {
                return i.getAttribute("href", 2)
            };
            g = null
        })();
        t.querySelectorAll && function() {
            var g = k,
                i = t.createElement("div");
            i.innerHTML = "<p class='TEST'></p>";
            if (!(i.querySelectorAll && i.querySelectorAll(".TEST").length === 0)) {
                k = function(m, p, q, u) {
                    p = p || t;
                    m = m.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                    if (!u && !k.isXML(p))
                        if (p.nodeType === 9) try {
                            return C(p.querySelectorAll(m), q)
                        } catch (y) {} else if (p.nodeType === 1 && p.nodeName.toLowerCase() !== "object") {
                            var F = p.getAttribute("id"),
                                M = F || "__sizzle__";
                            F || p.setAttribute("id", M);
                            try {
                                return C(p.querySelectorAll("#" + M + " " + m), q)
                            } catch (N) {} finally {
                                F || p.removeAttribute("id")
                            }
                        }
                    return g(m, p, q, u)
                };
                for (var n in g) k[n] = g[n];
                i = null
            }
        }();
        (function() {
            var g = t.documentElement,
                i = g.matchesSelector || g.mozMatchesSelector || g.webkitMatchesSelector || g.msMatchesSelector,
                n = false;
            try {
                i.call(t.documentElement, "[test!='']:sizzle")
            } catch (m) {
                n = true
            }
            if (i) k.matchesSelector = function(p, q) {
                q = q.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                if (!k.isXML(p)) try {
                    if (n || !o.match.PSEUDO.test(q) && !/!=/.test(q)) return i.call(p, q)
                } catch (u) {}
                return k(q, null, null, [p]).length > 0
            }
        })();
        (function() {
            var g = t.createElement("div");
            g.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!(!g.getElementsByClassName || g.getElementsByClassName("e").length === 0)) {
                g.lastChild.className = "e";
                if (g.getElementsByClassName("e").length !== 1) {
                    o.order.splice(1, 0, "CLASS");
                    o.find.CLASS = function(i, n, m) {
                        if (typeof n.getElementsByClassName !== "undefined" && !m) return n.getElementsByClassName(i[1])
                    };
                    g = null
                }
            }
        })();
        k.contains = t.documentElement.contains ? function(g, i) {
            return g !== i && (g.contains ? g.contains(i) : true)
        } : t.documentElement.compareDocumentPosition ? function(g, i) {
            return !!(g.compareDocumentPosition(i) & 16)
        } : function() {
            return false
        };
        k.isXML = function(g) {
            return (g = (g ? g.ownerDocument || g : 0).documentElement) ? g.nodeName !== "HTML" : false
        };
        var L = function(g, i) {
            for (var n, m = [], p = "", q = i.nodeType ? [i] : i; n = o.match.PSEUDO.exec(g);) {
                p += n[0];
                g = g.replace(o.match.PSEUDO, "")
            }
            g = o.relative[g] ? g + "*" : g;
            n = 0;
            for (var u = q.length; n < u; n++) k(g, q[n], m);
            return k.filter(p, m)
        };
        c.find = k;
        c.expr = k.selectors;
        c.expr[":"] = c.expr.filters;
        c.unique = k.uniqueSort;
        c.text = k.getText;
        c.isXMLDoc = k.isXML;
        c.contains = k.contains
    })();
    var Za = /Until$/,
        $a = /^(?:parents|prevUntil|prevAll)/,
        ab = /,/,
        Na = /^.[^:#\[\.,]*$/,
        bb = Array.prototype.slice,
        cb = c.expr.match.POS;
    c.fn.extend({
        find: function(a) {
            for (var b = this.pushStack("", "find", a), d = 0, e = 0, f = this.length; e < f; e++) {
                d = b.length;
                c.find(a, this[e], b);
                if (e > 0)
                    for (var h = d; h < b.length; h++)
                        for (var l = 0; l < d; l++)
                            if (b[l] === b[h]) {
                                b.splice(h--, 1);
                                break
                            }
            }
            return b
        },
        has: function(a) {
            var b = c(a);
            return this.filter(function() {
                for (var d = 0, e = b.length; d < e; d++)
                    if (c.contains(this, b[d])) return true
            })
        },
        not: function(a) {
            return this.pushStack(ma(this, a, false), "not", a)
        },
        filter: function(a) {
            return this.pushStack(ma(this, a, true), "filter", a)
        },
        is: function(a) {
            return !!a && c.filter(a, this).length > 0
        },
        closest: function(a, b) {
            var d = [],
                e, f, h = this[0];
            if (c.isArray(a)) {
                var l, k = {}, o = 1;
                if (h && a.length) {
                    e = 0;
                    for (f = a.length; e < f; e++) {
                        l = a[e];
                        k[l] || (k[l] = c.expr.match.POS.test(l) ? c(l, b || this.context) : l)
                    }
                    for (; h && h.ownerDocument && h !== b;) {
                        for (l in k) {
                            e = k[l];
                            if (e.jquery ? e.index(h) > -1 : c(h).is(e)) d.push({
                                selector: l,
                                elem: h,
                                level: o
                            })
                        }
                        h = h.parentNode;
                        o++
                    }
                }
                return d
            }
            l = cb.test(a) ? c(a, b || this.context) : null;
            e = 0;
            for (f = this.length; e < f; e++)
                for (h = this[e]; h;)
                    if (l ? l.index(h) > -1 : c.find.matchesSelector(h, a)) {
                        d.push(h);
                        break
                    } else {
                        h = h.parentNode;
                        if (!h || !h.ownerDocument || h === b) break
                    }
            d = d.length > 1 ? c.unique(d) : d;
            return this.pushStack(d, "closest", a)
        },
        index: function(a) {
            if (!a || typeof a === "string") return c.inArray(this[0], a ? c(a) : this.parent().children());
            return c.inArray(a.jquery ? a[0] : a, this)
        },
        add: function(a, b) {
            var d = typeof a === "string" ? c(a, b || this.context) : c.makeArray(a),
                e = c.merge(this.get(), d);
            return this.pushStack(!d[0] || !d[0].parentNode || d[0].parentNode.nodeType === 11 || !e[0] || !e[0].parentNode || e[0].parentNode.nodeType === 11 ? e : c.unique(e))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    });
    c.each({
        parent: function(a) {
            return (a = a.parentNode) && a.nodeType !== 11 ? a : null
        },
        parents: function(a) {
            return c.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, d) {
            return c.dir(a, "parentNode", d)
        },
        next: function(a) {
            return c.nth(a, 2, "nextSibling")
        },
        prev: function(a) {
            return c.nth(a, 2, "previousSibling")
        },
        nextAll: function(a) {
            return c.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return c.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, d) {
            return c.dir(a, "nextSibling", d)
        },
        prevUntil: function(a, b, d) {
            return c.dir(a, "previousSibling", d)
        },
        siblings: function(a) {
            return c.sibling(a.parentNode.firstChild, a)
        },
        children: function(a) {
            return c.sibling(a.firstChild)
        },
        contents: function(a) {
            return c.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : c.makeArray(a.childNodes)
        }
    }, function(a, b) {
        c.fn[a] = function(d, e) {
            var f = c.map(this, b, d);
            Za.test(a) || (e = d);
            if (e && typeof e === "string") f = c.filter(e, f);
            f = this.length > 1 ? c.unique(f) : f;
            if ((this.length > 1 || ab.test(e)) && $a.test(a)) f = f.reverse();
            return this.pushStack(f, a, bb.call(arguments).join(","))
        }
    });
    c.extend({
        filter: function(a, b, d) {
            if (d) a = ":not(" + a + ")";
            return b.length === 1 ? c.find.matchesSelector(b[0], a) ? [b[0]] : [] : c.find.matches(a, b)
        },
        dir: function(a, b, d) {
            var e = [];
            for (a = a[b]; a && a.nodeType !== 9 && (d === B || a.nodeType !== 1 || !c(a).is(d));) {
                a.nodeType === 1 && e.push(a);
                a = a[b]
            }
            return e
        },
        nth: function(a, b, d) {
            b = b || 1;
            for (var e = 0; a; a = a[d])
                if (a.nodeType === 1 && ++e === b) break;
            return a
        },
        sibling: function(a, b) {
            for (var d = []; a; a = a.nextSibling) a.nodeType === 1 && a !== b && d.push(a);
            return d
        }
    });
    var za = / jQuery\d+="(?:\d+|null)"/g,
        $ = /^\s+/,
        Aa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        Ba = /<([\w:]+)/,
        db = /<tbody/i,
        eb = /<|&#?\w+;/,
        Ca = /<(?:script|object|embed|option|style)/i,
        Da = /checked\s*(?:[^=]|=\s*.checked.)/i,
        fb = /\=([^="'>\s]+\/)>/g,
        P = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        };
    P.optgroup = P.option;
    P.tbody = P.tfoot = P.colgroup = P.caption = P.thead;
    P.th = P.td;
    if (!c.support.htmlSerialize) P._default = [1, "div<div>", "</div>"];
    c.fn.extend({
        text: function(a) {
            if (c.isFunction(a)) return this.each(function(b) {
                var d = c(this);
                d.text(a.call(this, b, d.text()))
            });
            if (typeof a !== "object" && a !== B) return this.empty().append((this[0] && this[0].ownerDocument || t).createTextNode(a));
            return c.text(this)
        },
        wrapAll: function(a) {
            if (c.isFunction(a)) return this.each(function(d) {
                c(this).wrapAll(a.call(this, d))
            });
            if (this[0]) {
                var b = c(a, this[0].ownerDocument).eq(0).clone(true);
                this[0].parentNode && b.insertBefore(this[0]);
                b.map(function() {
                    for (var d = this; d.firstChild && d.firstChild.nodeType === 1;) d = d.firstChild;
                    return d
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            if (c.isFunction(a)) return this.each(function(b) {
                c(this).wrapInner(a.call(this, b))
            });
            return this.each(function() {
                var b = c(this),
                    d = b.contents();
                d.length ? d.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            return this.each(function() {
                c(this).wrapAll(a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                c.nodeName(this, "body") || c(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, true, function(a) {
                this.nodeType === 1 && this.appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, true, function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, false, function(b) {
                this.parentNode.insertBefore(b, this)
            });
            else if (arguments.length) {
                var a = c(arguments[0]);
                a.push.apply(a, this.toArray());
                return this.pushStack(a, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, false, function(b) {
                this.parentNode.insertBefore(b, this.nextSibling)
            });
            else if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                a.push.apply(a, c(arguments[0]).toArray());
                return a
            }
        },
        remove: function(a, b) {
            for (var d = 0, e;
                (e = this[d]) != null; d++)
                if (!a || c.filter(a, [e]).length) {
                    if (!b && e.nodeType === 1) {
                        c.cleanData(e.getElementsByTagName("*"));
                        c.cleanData([e])
                    }
                    e.parentNode && e.parentNode.removeChild(e)
                }
            return this
        },
        empty: function() {
            for (var a = 0, b;
                (b = this[a]) != null; a++)
                for (b.nodeType === 1 && c.cleanData(b.getElementsByTagName("*")); b.firstChild;) b.removeChild(b.firstChild);
            return this
        },
        clone: function(a) {
            var b = this.map(function() {
                if (!c.support.noCloneEvent && !c.isXMLDoc(this)) {
                    var d = this.outerHTML,
                        e = this.ownerDocument;
                    if (!d) {
                        d = e.createElement("div");
                        d.appendChild(this.cloneNode(true));
                        d = d.innerHTML
                    }
                    return c.clean([d.replace(za, "").replace(fb, '="$1">').replace($, "")], e)[0]
                } else return this.cloneNode(true)
            });
            if (a === true) {
                na(this, b);
                na(this.find("*"), b.find("*"))
            }
            return b
        },
        html: function(a) {
            if (a === B) return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(za, "") : null;
            else if (typeof a === "string" && !Ca.test(a) && (c.support.leadingWhitespace || !$.test(a)) && !P[(Ba.exec(a) || ["", ""])[1].toLowerCase()]) {
                a = a.replace(Aa, "<$1></$2>");
                try {
                    for (var b = 0, d = this.length; b < d; b++)
                        if (this[b].nodeType === 1) {
                            c.cleanData(this[b].getElementsByTagName("*"));
                            this[b].innerHTML = a
                        }
                } catch (e) {
                    this.empty().append(a)
                }
            } else c.isFunction(a) ? this.each(function(f) {
                var h = c(this);
                h.html(a.call(this, f, h.html()))
            }) : this.empty().append(a);
            return this
        },
        replaceWith: function(a) {
            if (this[0] && this[0].parentNode) {
                if (c.isFunction(a)) return this.each(function(b) {
                    var d = c(this),
                        e = d.html();
                    d.replaceWith(a.call(this, b, e))
                });
                if (typeof a !== "string") a = c(a).detach();
                return this.each(function() {
                    var b = this.nextSibling,
                        d = this.parentNode;
                    c(this).remove();
                    b ? c(b).before(a) : c(d).append(a)
                })
            } else return this.pushStack(c(c.isFunction(a) ? a() : a), "replaceWith", a)
        },
        detach: function(a) {
            return this.remove(a, true)
        },
        domManip: function(a, b, d) {
            var e, f, h, l = a[0],
                k = [];
            if (!c.support.checkClone && arguments.length === 3 && typeof l === "string" && Da.test(l)) return this.each(function() {
                c(this).domManip(a, b, d, true)
            });
            if (c.isFunction(l)) return this.each(function(x) {
                var r = c(this);
                a[0] = l.call(this, x, b ? r.html() : B);
                r.domManip(a, b, d)
            });
            if (this[0]) {
                e = l && l.parentNode;
                e = c.support.parentNode && e && e.nodeType === 11 && e.childNodes.length === this.length ? {
                    fragment: e
                } : c.buildFragment(a, this, k);
                h = e.fragment;
                if (f = h.childNodes.length === 1 ? h = h.firstChild : h.firstChild) {
                    b = b && c.nodeName(f, "tr");
                    f = 0;
                    for (var o = this.length; f < o; f++) d.call(b ? c.nodeName(this[f], "table") ? this[f].getElementsByTagName("tbody")[0] || this[f].appendChild(this[f].ownerDocument.createElement("tbody")) : this[f] : this[f], f > 0 || e.cacheable || this.length > 1 ? h.cloneNode(true) : h)
                }
                k.length && c.each(k, Oa)
            }
            return this
        }
    });
    c.buildFragment = function(a, b, d) {
        var e, f, h;
        b = b && b[0] ? b[0].ownerDocument || b[0] : t;
        if (a.length === 1 && typeof a[0] === "string" && a[0].length < 512 && b === t && !Ca.test(a[0]) && (c.support.checkClone || !Da.test(a[0]))) {
            f = true;
            if (h = c.fragments[a[0]])
                if (h !== 1) e = h
        }
        if (!e) {
            e = b.createDocumentFragment();
            c.clean(a, b, e, d)
        }
        if (f) c.fragments[a[0]] = h ? e : 1;
        return {
            fragment: e,
            cacheable: f
        }
    };
    c.fragments = {};
    c.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        c.fn[a] = function(d) {
            var e = [];
            d = c(d);
            var f = this.length === 1 && this[0].parentNode;
            if (f && f.nodeType === 11 && f.childNodes.length === 1 && d.length === 1) {
                d[b](this[0]);
                return this
            } else {
                f = 0;
                for (var h = d.length; f < h; f++) {
                    var l = (f > 0 ? this.clone(true) : this).get();
                    c(d[f])[b](l);
                    e = e.concat(l)
                }
                return this.pushStack(e, a, d.selector)
            }
        }
    });
    c.extend({
        clean: function(a, b, d, e) {
            b = b || t;
            if (typeof b.createElement === "undefined") b = b.ownerDocument || b[0] && b[0].ownerDocument || t;
            for (var f = [], h = 0, l;
                (l = a[h]) != null; h++) {
                if (typeof l === "number") l += "";
                if (l) {
                    if (typeof l === "string" && !eb.test(l)) l = b.createTextNode(l);
                    else if (typeof l === "string") {
                        l = l.replace(Aa, "<$1></$2>");
                        var k = (Ba.exec(l) || ["", ""])[1].toLowerCase(),
                            o = P[k] || P._default,
                            x = o[0],
                            r = b.createElement("div");
                        for (r.innerHTML = o[1] + l + o[2]; x--;) r = r.lastChild;
                        if (!c.support.tbody) {
                            x = db.test(l);
                            k = k === "table" && !x ? r.firstChild && r.firstChild.childNodes : o[1] === "<table>" && !x ? r.childNodes : [];
                            for (o = k.length -
                                1; o >= 0; --o) c.nodeName(k[o], "tbody") && !k[o].childNodes.length && k[o].parentNode.removeChild(k[o])
                        }!c.support.leadingWhitespace && $.test(l) && r.insertBefore(b.createTextNode($.exec(l)[0]), r.firstChild);
                        l = r.childNodes
                    }
                    if (l.nodeType) f.push(l);
                    else f = c.merge(f, l)
                }
            }
            if (d)
                for (h = 0; f[h]; h++)
                    if (e && c.nodeName(f[h], "script") && (!f[h].type || f[h].type.toLowerCase() === "text/javascript")) e.push(f[h].parentNode ? f[h].parentNode.removeChild(f[h]) : f[h]);
                    else {
                        f[h].nodeType === 1 && f.splice.apply(f, [h + 1, 0].concat(c.makeArray(f[h].getElementsByTagName("script"))));
                        d.appendChild(f[h])
                    }
            return f
        },
        cleanData: function(a) {
            for (var b, d, e = c.cache, f = c.event.special, h = c.support.deleteExpando, l = 0, k;
                (k = a[l]) != null; l++)
                if (!(k.nodeName && c.noData[k.nodeName.toLowerCase()]))
                    if (d = k[c.expando]) {
                        if ((b = e[d]) && b.events)
                            for (var o in b.events) f[o] ? c.event.remove(k, o) : c.removeEvent(k, o, b.handle);
                        if (h) delete k[c.expando];
                        else k.removeAttribute && k.removeAttribute(c.expando);
                        delete e[d]
                    }
        }
    });
    var Ea = /alpha\([^)]*\)/i,
        gb = /opacity=([^)]*)/,
        hb = /-([a-z])/ig,
        ib = /([A-Z])/g,
        Fa = /^-?\d+(?:px)?$/i,
        jb = /^-?\d/,
        kb = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, Pa = ["Left", "Right"],
        Qa = ["Top", "Bottom"],
        W, Ga, aa, lb = function(a, b) {
            return b.toUpperCase()
        };
    c.fn.css = function(a, b) {
        if (arguments.length === 2 && b === B) return this;
        return c.access(this, a, b, true, function(d, e, f) {
            return f !== B ? c.style(d, e, f) : c.css(d, e)
        })
    };
    c.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var d = W(a, "opacity", "opacity");
                        return d === "" ? "1" : d
                    } else return a.style.opacity
                }
            }
        },
        cssNumber: {
            zIndex: true,
            fontWeight: true,
            opacity: true,
            zoom: true,
            lineHeight: true
        },
        cssProps: {
            "float": c.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, d, e) {
            if (!(!a || a.nodeType === 3 || a.nodeType === 8 || !a.style)) {
                var f, h = c.camelCase(b),
                    l = a.style,
                    k = c.cssHooks[h];
                b = c.cssProps[h] || h;
                if (d !== B) {
                    if (!(typeof d === "number" && isNaN(d) || d == null)) {
                        if (typeof d === "number" && !c.cssNumber[h]) d += "px";
                        if (!k || !("set" in k) || (d = k.set(a, d)) !== B) try {
                            l[b] = d
                        } catch (o) {}
                    }
                } else {
                    if (k && "get" in k && (f = k.get(a, false, e)) !== B) return f;
                    return l[b]
                }
            }
        },
        css: function(a, b, d) {
            var e, f = c.camelCase(b),
                h = c.cssHooks[f];
            b = c.cssProps[f] || f;
            if (h && "get" in h && (e = h.get(a, true, d)) !== B) return e;
            else if (W) return W(a, b, f)
        },
        swap: function(a, b, d) {
            var e = {}, f;
            for (f in b) {
                e[f] = a.style[f];
                a.style[f] = b[f]
            }
            d.call(a);
            for (f in b) a.style[f] = e[f]
        },
        camelCase: function(a) {
            return a.replace(hb, lb)
        }
    });
    c.curCSS = c.css;
    c.each(["height", "width"], function(a, b) {
        c.cssHooks[b] = {
            get: function(d, e, f) {
                var h;
                if (e) {
                    if (d.offsetWidth !== 0) h = oa(d, b, f);
                    else c.swap(d, kb, function() {
                        h = oa(d, b, f)
                    }); if (h <= 0) {
                        h = W(d, b, b);
                        if (h === "0px" && aa) h = aa(d, b, b);
                        if (h != null) return h === "" || h === "auto" ? "0px" : h
                    }
                    if (h < 0 || h == null) {
                        h = d.style[b];
                        return h === "" || h === "auto" ? "0px" : h
                    }
                    return typeof h === "string" ? h : h + "px"
                }
            },
            set: function(d, e) {
                if (Fa.test(e)) {
                    e = parseFloat(e);
                    if (e >= 0) return e + "px"
                } else return e
            }
        }
    });
    if (!c.support.opacity) c.cssHooks.opacity = {
        get: function(a, b) {
            return gb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var d = a.style;
            d.zoom = 1;
            var e = c.isNaN(b) ? "" : "alpha(opacity=" + b * 100 + ")",
                f = d.filter || "";
            d.filter = Ea.test(f) ? f.replace(Ea, e) : d.filter + " " + e
        }
    };
    if (t.defaultView && t.defaultView.getComputedStyle) Ga = function(a, b, d) {
        var e;
        d = d.replace(ib, "-$1").toLowerCase();
        if (!(b = a.ownerDocument.defaultView)) return B;
        if (b = b.getComputedStyle(a, null)) {
            e = b.getPropertyValue(d);
            if (e === "" && !c.contains(a.ownerDocument.documentElement, a)) e = c.style(a, d)
        }
        return e
    };
    if (t.documentElement.currentStyle) aa = function(a, b) {
        var d, e, f = a.currentStyle && a.currentStyle[b],
            h = a.style;
        if (!Fa.test(f) && jb.test(f)) {
            d = h.left;
            e = a.runtimeStyle.left;
            a.runtimeStyle.left = a.currentStyle.left;
            h.left = b === "fontSize" ? "1em" : f || 0;
            f = h.pixelLeft + "px";
            h.left = d;
            a.runtimeStyle.left = e
        }
        return f === "" ? "auto" : f
    };
    W = Ga || aa;
    if (c.expr && c.expr.filters) {
        c.expr.filters.hidden = function(a) {
            var b = a.offsetHeight;
            return a.offsetWidth === 0 && b === 0 || !c.support.reliableHiddenOffsets && (a.style.display || c.css(a, "display")) === "none"
        };
        c.expr.filters.visible = function(a) {
            return !c.expr.filters.hidden(a)
        }
    }
    var mb = c.now(),
        nb = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ob = /^(?:select|textarea)/i,
        pb = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        qb = /^(?:GET|HEAD)$/,
        Ra = /\[\]$/,
        T = /\=\?(&|$)/,
        ja = /\?/,
        rb = /([?&])_=[^&]*/,
        sb = /^(\w+:)?\/\/([^\/?#]+)/,
        tb = /%20/g,
        ub = /#.*$/,
        Ha = c.fn.load;
    c.fn.extend({
        load: function(a, b, d) {
            if (typeof a !== "string" && Ha) return Ha.apply(this, arguments);
            else if (!this.length) return this;
            var e = a.indexOf(" ");
            if (e >= 0) {
                var f = a.slice(e, a.length);
                a = a.slice(0, e)
            }
            e = "GET";
            if (b)
                if (c.isFunction(b)) {
                    d = b;
                    b = null
                } else
            if (typeof b === "object") {
                b = c.param(b, c.ajaxSettings.traditional);
                e = "POST"
            }
            var h = this;
            c.ajax({
                url: a,
                type: e,
                dataType: "html",
                data: b,
                complete: function(l, k) {
                    if (k === "success" || k === "notmodified") h.html(f ? c("<div>").append(l.responseText.replace(nb, "")).find(f) : l.responseText);
                    d && h.each(d, [l.responseText, k, l])
                }
            });
            return this
        },
        serialize: function() {
            return c.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? c.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || ob.test(this.nodeName) || pb.test(this.type))
            }).map(function(a, b) {
                var d = c(this).val();
                return d == null ? null : c.isArray(d) ? c.map(d, function(e) {
                    return {
                        name: b.name,
                        value: e
                    }
                }) : {
                    name: b.name,
                    value: d
                }
            }).get()
        }
    });
    c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        c.fn[b] = function(d) {
            return this.bind(b, d)
        }
    });
    c.extend({
        get: function(a, b, d, e) {
            if (c.isFunction(b)) {
                e = e || d;
                d = b;
                b = null
            }
            return c.ajax({
                type: "GET",
                url: a,
                data: b,
                success: d,
                dataType: e
            })
        },
        getScript: function(a, b) {
            return c.get(a, null, b, "script")
        },
        getJSON: function(a, b, d) {
            return c.get(a, b, d, "json")
        },
        post: function(a, b, d, e) {
            if (c.isFunction(b)) {
                e = e || d;
                d = b;
                b = {}
            }
            return c.ajax({
                type: "POST",
                url: a,
                data: b,
                success: d,
                dataType: e
            })
        },
        ajaxSetup: function(a) {
            c.extend(c.ajaxSettings, a)
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            xhr: function() {
                return new E.XMLHttpRequest
            },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        ajax: function(a) {
            var b = c.extend(true, {}, c.ajaxSettings, a),
                d, e, f, h = b.type.toUpperCase(),
                l = qb.test(h);
            b.url = b.url.replace(ub, "");
            b.context = a && a.context != null ? a.context : b;
            if (b.data && b.processData && typeof b.data !== "string") b.data = c.param(b.data, b.traditional);
            if (b.dataType === "jsonp") {
                if (h === "GET") T.test(b.url) || (b.url += (ja.test(b.url) ? "&" : "?") + (b.jsonp || "callback") + "=?");
                else if (!b.data || !T.test(b.data)) b.data = (b.data ? b.data + "&" : "") + (b.jsonp || "callback") + "=?";
                b.dataType = "json"
            }
            if (b.dataType === "json" && (b.data && T.test(b.data) || T.test(b.url))) {
                d = b.jsonpCallback || "jsonp" + mb++;
                if (b.data) b.data = (b.data + "").replace(T, "=" + d + "$1");
                b.url = b.url.replace(T, "=" + d + "$1");
                b.dataType = "script";
                var k = E[d];
                E[d] = function(m) {
                    if (c.isFunction(k)) k(m);
                    else {
                        E[d] = B;
                        try {
                            delete E[d]
                        } catch (p) {}
                    }
                    f = m;
                    c.handleSuccess(b, w, e, f);
                    c.handleComplete(b, w, e, f);
                    r && r.removeChild(A)
                }
            }
            if (b.dataType === "script" && b.cache === null) b.cache = false;
            if (b.cache === false && l) {
                var o = c.now(),
                    x = b.url.replace(rb, "$1_=" + o);
                b.url = x + (x === b.url ? (ja.test(b.url) ? "&" : "?") + "_=" + o : "")
            }
            if (b.data && l) b.url += (ja.test(b.url) ? "&" : "?") + b.data;
            b.global && c.active++ === 0 && c.event.trigger("ajaxStart");
            o = (o = sb.exec(b.url)) && (o[1] && o[1].toLowerCase() !== location.protocol || o[2].toLowerCase() !== location.host);
            if (b.dataType === "script" && h === "GET" && o) {
                var r = t.getElementsByTagName("head")[0] || t.documentElement,
                    A = t.createElement("script");
                if (b.scriptCharset) A.charset = b.scriptCharset;
                A.src = b.url;
                if (!d) {
                    var C = false;
                    A.onload = A.onreadystatechange = function() {
                        if (!C && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                            C = true;
                            c.handleSuccess(b, w, e, f);
                            c.handleComplete(b, w, e, f);
                            A.onload = A.onreadystatechange = null;
                            r && A.parentNode && r.removeChild(A)
                        }
                    }
                }
                r.insertBefore(A, r.firstChild);
                return B
            }
            var J = false,
                w = b.xhr();
            if (w) {
                b.username ? w.open(h, b.url, b.async, b.username, b.password) : w.open(h, b.url, b.async);
                try {
                    if (b.data != null && !l || a && a.contentType) w.setRequestHeader("Content-Type", b.contentType);
                    if (b.ifModified) {
                        c.lastModified[b.url] && w.setRequestHeader("If-Modified-Since", c.lastModified[b.url]);
                        c.etag[b.url] && w.setRequestHeader("If-None-Match", c.etag[b.url])
                    }
                    o || w.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    w.setRequestHeader("Accept", b.dataType && b.accepts[b.dataType] ? b.accepts[b.dataType] + ", */*; q=0.01" : b.accepts._default)
                } catch (I) {}
                if (b.beforeSend && b.beforeSend.call(b.context, w, b) === false) {
                    b.global && c.active-- === 1 && c.event.trigger("ajaxStop");
                    w.abort();
                    return false
                }
                b.global && c.triggerGlobal(b, "ajaxSend", [w, b]);
                var L = w.onreadystatechange = function(m) {
                    if (!w || w.readyState === 0 || m === "abort") {
                        J || c.handleComplete(b, w, e, f);
                        J = true;
                        if (w) w.onreadystatechange = c.noop
                    } else if (!J && w && (w.readyState === 4 || m === "timeout")) {
                        J = true;
                        w.onreadystatechange = c.noop;
                        e = m === "timeout" ? "timeout" : !c.httpSuccess(w) ? "error" : b.ifModified && c.httpNotModified(w, b.url) ? "notmodified" : "success";
                        var p;
                        if (e === "success") try {
                            f = c.httpData(w, b.dataType, b)
                        } catch (q) {
                            e = "parsererror";
                            p = q
                        }
                        if (e === "success" || e === "notmodified") d || c.handleSuccess(b, w, e, f);
                        else c.handleError(b, w, e, p);
                        d || c.handleComplete(b, w, e, f);
                        m === "timeout" && w.abort();
                        if (b.async) w = null
                    }
                };
                try {
                    var g = w.abort;
                    w.abort = function() {
                        w && Function.prototype.call.call(g, w);
                        L("abort")
                    }
                } catch (i) {}
                b.async && b.timeout > 0 && setTimeout(function() {
                    w && !J && L("timeout")
                }, b.timeout);
                try {
                    w.send(l || b.data == null ? null : b.data)
                } catch (n) {
                    c.handleError(b, w, null, n);
                    c.handleComplete(b, w, e, f)
                }
                b.async || L();
                return w
            }
        },
        param: function(a, b) {
            var d = [],
                e = function(h, l) {
                    l = c.isFunction(l) ? l() : l;
                    d[d.length] = encodeURIComponent(h) + "=" + encodeURIComponent(l)
                };
            if (b === B) b = c.ajaxSettings.traditional;
            if (c.isArray(a) || a.jquery) c.each(a, function() {
                e(this.name, this.value)
            });
            else
                for (var f in a) da(f, a[f], b, e);
            return d.join("&").replace(tb, "+")
        }
    });
    c.extend({
        active: 0,
        lastModified: {},
        etag: {},
        handleError: function(a, b, d, e) {
            a.error && a.error.call(a.context, b, d, e);
            a.global && c.triggerGlobal(a, "ajaxError", [b, a, e])
        },
        handleSuccess: function(a, b, d, e) {
            a.success && a.success.call(a.context, e, d, b);
            a.global && c.triggerGlobal(a, "ajaxSuccess", [b, a])
        },
        handleComplete: function(a, b, d) {
            a.complete && a.complete.call(a.context, b, d);
            a.global && c.triggerGlobal(a, "ajaxComplete", [b, a]);
            a.global && c.active-- === 1 && c.event.trigger("ajaxStop")
        },
        triggerGlobal: function(a, b, d) {
            (a.context && a.context.url == null ? c(a.context) : c.event).trigger(b, d)
        },
        httpSuccess: function(a) {
            try {
                return !a.status && location.protocol === "file:" || a.status >= 200 && a.status < 300 || a.status === 304 || a.status === 1223
            } catch (b) {}
            return false
        },
        httpNotModified: function(a, b) {
            var d = a.getResponseHeader("Last-Modified"),
                e = a.getResponseHeader("Etag");
            if (d) c.lastModified[b] = d;
            if (e) c.etag[b] = e;
            return a.status === 304
        },
        httpData: function(a, b, d) {
            var e = a.getResponseHeader("content-type") || "",
                f = b === "xml" || !b && e.indexOf("xml") >= 0;
            a = f ? a.responseXML : a.responseText;
            f && a.documentElement.nodeName === "parsererror" && c.error("parsererror");
            if (d && d.dataFilter) a = d.dataFilter(a, b);
            if (typeof a === "string")
                if (b === "json" || !b && e.indexOf("json") >= 0) a = c.parseJSON(a);
                else
            if (b === "script" || !b && e.indexOf("javascript") >= 0) c.globalEval(a);
            return a
        }
    });
    if (E.ActiveXObject) c.ajaxSettings.xhr = function() {
        if (E.location.protocol !== "file:") try {
            return new E.XMLHttpRequest
        } catch (a) {}
        try {
            return new E.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    };
    c.support.ajax = !! c.ajaxSettings.xhr();
    var ea = {}, vb = /^(?:toggle|show|hide)$/,
        wb = /^([+\-]=)?([\d+.\-]+)(.*)$/,
        ba, pa = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ];
    c.fn.extend({
        show: function(a, b, d) {
            if (a || a === 0) return this.animate(S("show", 3), a, b, d);
            else {
                d = 0;
                for (var e = this.length; d < e; d++) {
                    a = this[d];
                    b = a.style.display;
                    if (!c.data(a, "olddisplay") && b === "none") b = a.style.display = "";
                    b === "" && c.css(a, "display") === "none" && c.data(a, "olddisplay", qa(a.nodeName))
                }
                for (d = 0; d < e; d++) {
                    a = this[d];
                    b = a.style.display;
                    if (b === "" || b === "none") a.style.display = c.data(a, "olddisplay") || ""
                }
                return this
            }
        },
        hide: function(a, b, d) {
            if (a || a === 0) return this.animate(S("hide", 3), a, b, d);
            else {
                a = 0;
                for (b = this.length; a < b; a++) {
                    d = c.css(this[a], "display");
                    d !== "none" && c.data(this[a], "olddisplay", d)
                }
                for (a = 0; a < b; a++) this[a].style.display = "none";
                return this
            }
        },
        _toggle: c.fn.toggle,
        toggle: function(a, b, d) {
            var e = typeof a === "boolean";
            if (c.isFunction(a) && c.isFunction(b)) this._toggle.apply(this, arguments);
            else a == null || e ? this.each(function() {
                var f = e ? a : c(this).is(":hidden");
                c(this)[f ? "show" : "hide"]()
            }) : this.animate(S("toggle", 3), a, b, d);
            return this
        },
        fadeTo: function(a, b, d, e) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, d, e)
        },
        animate: function(a, b, d, e) {
            var f = c.speed(b, d, e);
            if (c.isEmptyObject(a)) return this.each(f.complete);
            return this[f.queue === false ? "each" : "queue"](function() {
                var h = c.extend({}, f),
                    l, k = this.nodeType === 1,
                    o = k && c(this).is(":hidden"),
                    x = this;
                for (l in a) {
                    var r = c.camelCase(l);
                    if (l !== r) {
                        a[r] = a[l];
                        delete a[l];
                        l = r
                    }
                    if (a[l] === "hide" && o || a[l] === "show" && !o) return h.complete.call(this);
                    if (k && (l === "height" || l === "width")) {
                        h.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];
                        if (c.css(this, "display") === "inline" && c.css(this, "float") === "none")
                            if (c.support.inlineBlockNeedsLayout)
                                if (qa(this.nodeName) === "inline") this.style.display = "inline-block";
                                else {
                                    this.style.display = "inline";
                                    this.style.zoom = 1
                                } else this.style.display = "inline-block"
                    }
                    if (c.isArray(a[l])) {
                        (h.specialEasing = h.specialEasing || {})[l] = a[l][1];
                        a[l] = a[l][0]
                    }
                }
                if (h.overflow != null) this.style.overflow = "hidden";
                h.curAnim = c.extend({}, a);
                c.each(a, function(A, C) {
                    var J = new c.fx(x, h, A);
                    if (vb.test(C)) J[C === "toggle" ? o ? "show" : "hide" : C](a);
                    else {
                        var w = wb.exec(C),
                            I = J.cur() || 0;
                        if (w) {
                            var L = parseFloat(w[2]),
                                g = w[3] || "px";
                            if (g !== "px") {
                                c.style(x, A, (L || 1) + g);
                                I = (L || 1) / J.cur() * I;
                                c.style(x, A, I + g)
                            }
                            if (w[1]) L = (w[1] === "-=" ? -1 : 1) * L + I;
                            J.custom(I, L, g)
                        } else J.custom(I, C, "")
                    }
                });
                return true
            })
        },
        stop: function(a, b) {
            var d = c.timers;
            a && this.queue([]);
            this.each(function() {
                for (var e = d.length - 1; e >= 0; e--)
                    if (d[e].elem === this) {
                        b && d[e](true);
                        d.splice(e, 1)
                    }
            });
            b || this.dequeue();
            return this
        }
    });
    c.each({
        slideDown: S("show", 1),
        slideUp: S("hide", 1),
        slideToggle: S("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        c.fn[a] = function(d, e, f) {
            return this.animate(b, d, e, f)
        }
    });
    c.extend({
        speed: function(a, b, d) {
            var e = a && typeof a === "object" ? c.extend({}, a) : {
                complete: d || !d && b || c.isFunction(a) && a,
                duration: a,
                easing: d && b || b && !c.isFunction(b) && b
            };
            e.duration = c.fx.off ? 0 : typeof e.duration === "number" ? e.duration : e.duration in c.fx.speeds ? c.fx.speeds[e.duration] : c.fx.speeds._default;
            e.old = e.complete;
            e.complete = function() {
                e.queue !== false && c(this).dequeue();
                c.isFunction(e.old) && e.old.call(this)
            };
            return e
        },
        easing: {
            linear: function(a, b, d, e) {
                return d + e * a
            },
            swing: function(a, b, d, e) {
                return (-Math.cos(a * Math.PI) / 2 + 0.5) * e + d
            }
        },
        timers: [],
        fx: function(a, b, d) {
            this.options = b;
            this.elem = a;
            this.prop = d;
            if (!b.orig) b.orig = {}
        }
    });
    c.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this);
            (c.fx.step[this.prop] || c.fx.step._default)(this)
        },
        cur: function() {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
            var a = parseFloat(c.css(this.elem, this.prop));
            return a && a > -1E4 ? a : 0
        },
        custom: function(a, b, d) {
            function e(l) {
                return f.step(l)
            }
            var f = this,
                h = c.fx;
            this.startTime = c.now();
            this.start = a;
            this.end = b;
            this.unit = d || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            e.elem = this.elem;
            if (e() && c.timers.push(e) && !ba) ba = setInterval(h.tick, h.interval)
        },
        show: function() {
            this.options.orig[this.prop] = c.style(this.elem, this.prop);
            this.options.show = true;
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
            c(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = c.style(this.elem, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0)
        },
        step: function(a) {
            var b = c.now(),
                d = true;
            if (a || b >= this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                for (var e in this.options.curAnim)
                    if (this.options.curAnim[e] !== true) d = false;
                if (d) {
                    if (this.options.overflow != null && !c.support.shrinkWrapBlocks) {
                        var f = this.elem,
                            h = this.options;
                        c.each(["", "X", "Y"], function(k, o) {
                            f.style["overflow" + o] = h.overflow[k]
                        })
                    }
                    this.options.hide && c(this.elem).hide();
                    if (this.options.hide || this.options.show)
                        for (var l in this.options.curAnim) c.style(this.elem, l, this.options.orig[l]);
                    this.options.complete.call(this.elem)
                }
                return false
            } else {
                a = b - this.startTime;
                this.state = a / this.options.duration;
                b = this.options.easing || (c.easing.swing ? "swing" : "linear");
                this.pos = c.easing[this.options.specialEasing && this.options.specialEasing[this.prop] || b](this.state, a, 0, 1, this.options.duration);
                this.now = this.start + (this.end - this.start) * this.pos;
                this.update()
            }
            return true
        }
    };
    c.extend(c.fx, {
        tick: function() {
            for (var a = c.timers, b = 0; b < a.length; b++) a[b]() || a.splice(b--, 1);
            a.length || c.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(ba);
            ba = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                c.style(a.elem, "opacity", a.now)
            },
            _default: function(a) {
                if (a.elem.style && a.elem.style[a.prop] != null) a.elem.style[a.prop] = (a.prop === "width" || a.prop === "height" ? Math.max(0, a.now) : a.now) + a.unit;
                else a.elem[a.prop] = a.now
            }
        }
    });
    if (c.expr && c.expr.filters) c.expr.filters.animated = function(a) {
        return c.grep(c.timers, function(b) {
            return a === b.elem
        }).length
    };
    var xb = /^t(?:able|d|h)$/i,
        Ia = /^(?:body|html)$/i;
    c.fn.offset = "getBoundingClientRect" in t.documentElement ? function(a) {
        var b = this[0],
            d;
        if (a) return this.each(function(l) {
            c.offset.setOffset(this, a, l)
        });
        if (!b || !b.ownerDocument) return null;
        if (b === b.ownerDocument.body) return c.offset.bodyOffset(b);
        try {
            d = b.getBoundingClientRect()
        } catch (e) {}
        var f = b.ownerDocument,
            h = f.documentElement;
        if (!d || !c.contains(h, b)) return d || {
            top: 0,
            left: 0
        };
        b = f.body;
        f = fa(f);
        return {
            top: d.top + (f.pageYOffset || c.support.boxModel && h.scrollTop || b.scrollTop) - (h.clientTop || b.clientTop || 0),
            left: d.left + (f.pageXOffset || c.support.boxModel && h.scrollLeft || b.scrollLeft) - (h.clientLeft || b.clientLeft || 0)
        }
    } : function(a) {
        var b = this[0];
        if (a) return this.each(function(x) {
            c.offset.setOffset(this, a, x)
        });
        if (!b || !b.ownerDocument) return null;
        if (b === b.ownerDocument.body) return c.offset.bodyOffset(b);
        c.offset.initialize();
        var d, e = b.offsetParent,
            f = b.ownerDocument,
            h = f.documentElement,
            l = f.body;
        d = (f = f.defaultView) ? f.getComputedStyle(b, null) : b.currentStyle;
        for (var k = b.offsetTop, o = b.offsetLeft;
            (b = b.parentNode) && b !== l && b !== h;) {
            if (c.offset.supportsFixedPosition && d.position === "fixed") break;
            d = f ? f.getComputedStyle(b, null) : b.currentStyle;
            k -= b.scrollTop;
            o -= b.scrollLeft;
            if (b === e) {
                k += b.offsetTop;
                o += b.offsetLeft;
                if (c.offset.doesNotAddBorder && !(c.offset.doesAddBorderForTableAndCells && xb.test(b.nodeName))) {
                    k += parseFloat(d.borderTopWidth) || 0;
                    o += parseFloat(d.borderLeftWidth) || 0
                }
                e = b.offsetParent
            }
            if (c.offset.subtractsBorderForOverflowNotVisible && d.overflow !== "visible") {
                k += parseFloat(d.borderTopWidth) || 0;
                o += parseFloat(d.borderLeftWidth) || 0
            }
            d = d
        }
        if (d.position === "relative" || d.position === "static") {
            k += l.offsetTop;
            o += l.offsetLeft
        }
        if (c.offset.supportsFixedPosition && d.position === "fixed") {
            k += Math.max(h.scrollTop, l.scrollTop);
            o += Math.max(h.scrollLeft, l.scrollLeft)
        }
        return {
            top: k,
            left: o
        }
    };
    c.offset = {
        initialize: function() {
            var a = t.body,
                b = t.createElement("div"),
                d, e, f, h = parseFloat(c.css(a, "marginTop")) || 0;
            c.extend(b.style, {
                position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: "1px",
                height: "1px",
                visibility: "hidden"
            });
            b.innerHTML = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
            a.insertBefore(b, a.firstChild);
            d = b.firstChild;
            e = d.firstChild;
            f = d.nextSibling.firstChild.firstChild;
            this.doesNotAddBorder = e.offsetTop !== 5;
            this.doesAddBorderForTableAndCells = f.offsetTop === 5;
            e.style.position = "fixed";
            e.style.top = "20px";
            this.supportsFixedPosition = e.offsetTop === 20 || e.offsetTop === 15;
            e.style.position = e.style.top = "";
            d.style.overflow = "hidden";
            d.style.position = "relative";
            this.subtractsBorderForOverflowNotVisible = e.offsetTop === -5;
            this.doesNotIncludeMarginInBodyOffset = a.offsetTop !== h;
            a.removeChild(b);
            c.offset.initialize = c.noop
        },
        bodyOffset: function(a) {
            var b = a.offsetTop,
                d = a.offsetLeft;
            c.offset.initialize();
            if (c.offset.doesNotIncludeMarginInBodyOffset) {
                b += parseFloat(c.css(a, "marginTop")) || 0;
                d += parseFloat(c.css(a, "marginLeft")) || 0
            }
            return {
                top: b,
                left: d
            }
        },
        setOffset: function(a, b, d) {
            var e = c.css(a, "position");
            if (e === "static") a.style.position = "relative";
            var f = c(a),
                h = f.offset(),
                l = c.css(a, "top"),
                k = c.css(a, "left"),
                o = e === "absolute" && c.inArray("auto", [l, k]) > -1;
            e = {};
            var x = {};
            if (o) x = f.position();
            l = o ? x.top : parseInt(l, 10) || 0;
            k = o ? x.left : parseInt(k, 10) || 0;
            if (c.isFunction(b)) b = b.call(a, d, h);
            if (b.top != null) e.top = b.top - h.top + l;
            if (b.left != null) e.left = b.left - h.left + k;
            "using" in b ? b.using.call(a, e) : f.css(e)
        }
    };
    c.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var a = this[0],
                b = this.offsetParent(),
                d = this.offset(),
                e = Ia.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
            d.top -= parseFloat(c.css(a, "marginTop")) || 0;
            d.left -= parseFloat(c.css(a, "marginLeft")) || 0;
            e.top += parseFloat(c.css(b[0], "borderTopWidth")) || 0;
            e.left += parseFloat(c.css(b[0], "borderLeftWidth")) || 0;
            return {
                top: d.top - e.top,
                left: d.left - e.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || t.body; a && !Ia.test(a.nodeName) && c.css(a, "position") === "static";) a = a.offsetParent;
                return a
            })
        }
    });
    c.each(["Left", "Top"], function(a, b) {
        var d = "scroll" + b;
        c.fn[d] = function(e) {
            var f = this[0],
                h;
            if (!f) return null;
            if (e !== B) return this.each(function() {
                if (h = fa(this)) h.scrollTo(!a ? e : c(h).scrollLeft(), a ? e : c(h).scrollTop());
                else this[d] = e
            });
            else return (h = fa(f)) ? "pageXOffset" in h ? h[a ? "pageYOffset" : "pageXOffset"] : c.support.boxModel && h.document.documentElement[d] || h.document.body[d] : f[d]
        }
    });
    c.each(["Height", "Width"], function(a, b) {
        var d = b.toLowerCase();
        c.fn["inner" + b] = function() {
            return this[0] ? parseFloat(c.css(this[0], d, "padding")) : null
        };
        c.fn["outer" + b] = function(e) {
            return this[0] ? parseFloat(c.css(this[0], d, e ? "margin" : "border")) : null
        };
        c.fn[d] = function(e) {
            var f = this[0];
            if (!f) return e == null ? null : this;
            if (c.isFunction(e)) return this.each(function(l) {
                var k = c(this);
                k[d](e.call(this, l, k[d]()))
            });
            if (c.isWindow(f)) return f.document.compatMode === "CSS1Compat" && f.document.documentElement["client" + b] || f.document.body["client" + b];
            else if (f.nodeType === 9) return Math.max(f.documentElement["client" +
                b], f.body["scroll" + b], f.documentElement["scroll" + b], f.body["offset" + b], f.documentElement["offset" + b]);
            else if (e === B) {
                f = c.css(f, d);
                var h = parseFloat(f);
                return c.isNaN(h) ? f : h
            } else return this.css(d, typeof e === "string" ? e : e + "px")
        }
    })
})(window);
(function(b, c) {
    function f(g) {
        return !b(g).parents().andSelf().filter(function() {
            return b.curCSS(this, "visibility") === "hidden" || b.expr.filters.hidden(this)
        }).length
    }
    b.ui = b.ui || {};
    if (!b.ui.version) {
        b.extend(b.ui, {
            version: "1.8.6",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        });
        b.fn.extend({
            _focus: b.fn.focus,
            focus: function(g, e) {
                return typeof g === "number" ? this.each(function() {
                    var a = this;
                    setTimeout(function() {
                        b(a).focus();
                        e && e.call(a)
                    }, g)
                }) : this._focus.apply(this, arguments)
            },
            scrollParent: function() {
                var g;
                g = b.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test(b.curCSS(this, "position", 1)) && /(auto|scroll)/.test(b.curCSS(this, "overflow", 1) + b.curCSS(this, "overflow-y", 1) + b.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function() {
                    return /(auto|scroll)/.test(b.curCSS(this, "overflow", 1) + b.curCSS(this, "overflow-y", 1) + b.curCSS(this, "overflow-x", 1))
                }).eq(0);
                return /fixed/.test(this.css("position")) || !g.length ? b(document) : g
            },
            zIndex: function(g) {
                if (g !== c) return this.css("zIndex", g);
                if (this.length) {
                    g = b(this[0]);
                    for (var e; g.length && g[0] !== document;) {
                        e = g.css("position");
                        if (e === "absolute" || e === "relative" || e === "fixed") {
                            e = parseInt(g.css("zIndex"), 10);
                            if (!isNaN(e) && e !== 0) return e
                        }
                        g = g.parent()
                    }
                }
                return 0
            },
            disableSelection: function() {
                return this.bind((b.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(g) {
                    g.preventDefault()
                })
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            }
        });
        b.each(["Width", "Height"], function(g, e) {
            function a(j, n, q, l) {
                b.each(d, function() {
                    n -= parseFloat(b.curCSS(j, "padding" + this, true)) || 0;
                    if (q) n -= parseFloat(b.curCSS(j, "border" + this + "Width", true)) || 0;
                    if (l) n -= parseFloat(b.curCSS(j, "margin" + this, true)) || 0
                });
                return n
            }
            var d = e === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                h = e.toLowerCase(),
                i = {
                    innerWidth: b.fn.innerWidth,
                    innerHeight: b.fn.innerHeight,
                    outerWidth: b.fn.outerWidth,
                    outerHeight: b.fn.outerHeight
                };
            b.fn["inner" + e] = function(j) {
                if (j === c) return i["inner" + e].call(this);
                return this.each(function() {
                    b(this).css(h, a(this, j) + "px")
                })
            };
            b.fn["outer" + e] = function(j, n) {
                if (typeof j !== "number") return i["outer" + e].call(this, j);
                return this.each(function() {
                    b(this).css(h, a(this, j, true, n) + "px")
                })
            }
        });
        b.extend(b.expr[":"], {
            data: function(g, e, a) {
                return !!b.data(g, a[3])
            },
            focusable: function(g) {
                var e = g.nodeName.toLowerCase(),
                    a = b.attr(g, "tabindex");
                if ("area" === e) {
                    e = g.parentNode;
                    a = e.name;
                    if (!g.href || !a || e.nodeName.toLowerCase() !== "map") return false;
                    g = b("img[usemap=#" + a + "]")[0];
                    return !!g && f(g)
                }
                return (/input|select|textarea|button|object/.test(e) ? !g.disabled : "a" == e ? g.href || !isNaN(a) : !isNaN(a)) && f(g)
            },
            tabbable: function(g) {
                var e = b.attr(g, "tabindex");
                return (isNaN(e) || e >= 0) && b(g).is(":focusable")
            }
        });
        b(function() {
            var g = document.body,
                e = g.appendChild(e = document.createElement("div"));
            b.extend(e.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            });
            b.support.minHeight = e.offsetHeight === 100;
            b.support.selectstart = "onselectstart" in e;
            g.removeChild(e).style.display = "none"
        });
        b.extend(b.ui, {
            plugin: {
                add: function(g, e, a) {
                    g = b.ui[g].prototype;
                    for (var d in a) {
                        g.plugins[d] = g.plugins[d] || [];
                        g.plugins[d].push([e, a[d]])
                    }
                },
                call: function(g, e, a) {
                    if ((e = g.plugins[e]) && g.element[0].parentNode)
                        for (var d = 0; d < e.length; d++) g.options[e[d][0]] && e[d][1].apply(g.element, a)
                }
            },
            contains: function(g, e) {
                return document.compareDocumentPosition ? g.compareDocumentPosition(e) & 16 : g !== e && g.contains(e)
            },
            hasScroll: function(g, e) {
                if (b(g).css("overflow") === "hidden") return false;
                e = e && e === "left" ? "scrollLeft" : "scrollTop";
                var a = false;
                if (g[e] > 0) return true;
                g[e] = 1;
                a = g[e] > 0;
                g[e] = 0;
                return a
            },
            isOverAxis: function(g, e, a) {
                return g > e && g < e + a
            },
            isOver: function(g, e, a, d, h, i) {
                return b.ui.isOverAxis(g, a, h) && b.ui.isOverAxis(e, d, i)
            }
        })
    }
})(jQuery);
(function(b, c) {
    if (b.cleanData) {
        var f = b.cleanData;
        b.cleanData = function(e) {
            for (var a = 0, d;
                (d = e[a]) != null; a++) b(d).triggerHandler("remove");
            f(e)
        }
    } else {
        var g = b.fn.remove;
        b.fn.remove = function(e, a) {
            return this.each(function() {
                if (!a)
                    if (!e || b.filter(e, [this]).length) b("*", this).add([this]).each(function() {
                        b(this).triggerHandler("remove")
                    });
                return g.call(b(this), e, a)
            })
        }
    }
    b.widget = function(e, a, d) {
        var h = e.split(".")[0],
            i;
        e = e.split(".")[1];
        i = h + "-" + e;
        if (!d) {
            d = a;
            a = b.Widget
        }
        b.expr[":"][i] = function(j) {
            return !!b.data(j, e)
        };
        b[h] = b[h] || {};
        b[h][e] = function(j, n) {
            arguments.length && this._createWidget(j, n)
        };
        a = new a;
        a.options = b.extend(true, {}, a.options);
        b[h][e].prototype = b.extend(true, a, {
            namespace: h,
            widgetName: e,
            widgetEventPrefix: b[h][e].prototype.widgetEventPrefix || e,
            widgetBaseClass: i
        }, d);
        b.widget.bridge(e, b[h][e])
    };
    b.widget.bridge = function(e, a) {
        b.fn[e] = function(d) {
            var h = typeof d === "string",
                i = Array.prototype.slice.call(arguments, 1),
                j = this;
            d = !h && i.length ? b.extend.apply(null, [true, d].concat(i)) : d;
            if (h && d.charAt(0) === "_") return j;
            h ? this.each(function() {
                var n = b.data(this, e),
                    q = n && b.isFunction(n[d]) ? n[d].apply(n, i) : n;
                if (q !== n && q !== c) {
                    j = q;
                    return false
                }
            }) : this.each(function() {
                var n = b.data(this, e);
                n ? n.option(d || {})._init() : b.data(this, e, new a(d, this))
            });
            return j
        }
    };
    b.Widget = function(e, a) {
        arguments.length && this._createWidget(e, a)
    };
    b.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function(e, a) {
            b.data(a, this.widgetName, this);
            this.element = b(a);
            this.options = b.extend(true, {}, this.options, this._getCreateOptions(), e);
            var d = this;
            this.element.bind("remove." + this.widgetName, function() {
                d.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function() {
            return b.metadata && b.metadata.get(this.element[0])[this.widgetName]
        },
        _create: function() {},
        _init: function() {},
        destroy: function() {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function() {
            return this.element
        },
        option: function(e, a) {
            var d = e;
            if (arguments.length === 0) return b.extend({}, this.options);
            if (typeof e === "string") {
                if (a === c) return this.options[e];
                d = {};
                d[e] = a
            }
            this._setOptions(d);
            return this
        },
        _setOptions: function(e) {
            var a = this;
            b.each(e, function(d, h) {
                a._setOption(d, h)
            });
            return this
        },
        _setOption: function(e, a) {
            this.options[e] = a;
            if (e === "disabled") this.widget()[a ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", a);
            return this
        },
        enable: function() {
            return this._setOption("disabled", false)
        },
        disable: function() {
            return this._setOption("disabled", true)
        },
        _trigger: function(e, a, d) {
            var h = this.options[e];
            a = b.Event(a);
            a.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase();
            d = d || {};
            if (a.originalEvent) {
                e = b.event.props.length;
                for (var i; e;) {
                    i = b.event.props[--e];
                    a[i] = a.originalEvent[i]
                }
            }
            this.element.trigger(a, d);
            return !(b.isFunction(h) && h.call(this.element[0], a, d) === false || a.isDefaultPrevented())
        }
    }
})(jQuery);
(function(b) {
    b.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var c = this;
            this.element.bind("mousedown." + this.widgetName, function(f) {
                return c._mouseDown(f)
            }).bind("click." + this.widgetName, function(f) {
                if (c._preventClickEvent) {
                    c._preventClickEvent = false;
                    f.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName)
        },
        _mouseDown: function(c) {
            c.originalEvent = c.originalEvent || {};
            if (!c.originalEvent.mouseHandled) {
                this._mouseStarted && this._mouseUp(c);
                this._mouseDownEvent = c;
                var f = this,
                    g = c.which == 1,
                    e = typeof this.options.cancel == "string" ? b(c.target).parents().add(c.target).filter(this.options.cancel).length : false;
                if (!g || e || !this._mouseCapture(c)) return true;
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) this._mouseDelayTimer = setTimeout(function() {
                    f.mouseDelayMet = true
                }, this.options.delay);
                if (this._mouseDistanceMet(c) && this._mouseDelayMet(c)) {
                    this._mouseStarted = this._mouseStart(c) !== false;
                    if (!this._mouseStarted) {
                        c.preventDefault();
                        return true
                    }
                }
                this._mouseMoveDelegate = function(a) {
                    return f._mouseMove(a)
                };
                this._mouseUpDelegate = function(a) {
                    return f._mouseUp(a)
                };
                b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                c.preventDefault();
                return c.originalEvent.mouseHandled = true
            }
        },
        _mouseMove: function(c) {
            if (b.browser.msie && !(document.documentMode >= 9) && !c.button) return this._mouseUp(c);
            if (this._mouseStarted) {
                this._mouseDrag(c);
                return c.preventDefault()
            }
            if (this._mouseDistanceMet(c) && this._mouseDelayMet(c))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, c) !== false) ? this._mouseDrag(c) : this._mouseUp(c);
            return !this._mouseStarted
        },
        _mouseUp: function(c) {
            b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                this._preventClickEvent = c.target == this._mouseDownEvent.target;
                this._mouseStop(c)
            }
            return false
        },
        _mouseDistanceMet: function(c) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX -
                c.pageX), Math.abs(this._mouseDownEvent.pageY - c.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return true
        }
    })
})(jQuery);
(function(b) {
    b.widget("ui.draggable", b.ui.mouse, {
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false
        },
        _create: function() {
            if (this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position"))) this.element[0].style.position = "relative";
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._mouseInit()
        },
        destroy: function() {
            if (this.element.data("draggable")) {
                this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
                this._mouseDestroy();
                return this
            }
        },
        _mouseCapture: function(c) {
            var f = this.options;
            if (this.helper || f.disabled || b(c.target).is(".ui-resizable-handle")) return false;
            this.handle = this._getHandle(c);
            if (!this.handle) return false;
            return true
        },
        _mouseStart: function(c) {
            var f = this.options;
            this.helper = this._createHelper(c);
            this._cacheHelperProportions();
            if (b.ui.ddmanager) b.ui.ddmanager.current = this;
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            b.extend(this.offset, {
                click: {
                    left: c.pageX - this.offset.left,
                    top: c.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this.position = this._generatePosition(c);
            this.originalPageX = c.pageX;
            this.originalPageY = c.pageY;
            f.cursorAt && this._adjustOffsetFromHelper(f.cursorAt);
            f.containment && this._setContainment();
            if (this._trigger("start", c) === false) {
                this._clear();
                return false
            }
            this._cacheHelperProportions();
            b.ui.ddmanager && !f.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, c);
            this.helper.addClass("ui-draggable-dragging");
            this._mouseDrag(c, true);
            return true
        },
        _mouseDrag: function(c, f) {
            this.position = this._generatePosition(c);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!f) {
                f = this._uiHash();
                if (this._trigger("drag", c, f) === false) {
                    this._mouseUp({});
                    return false
                }
                this.position = f.position
            }
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            b.ui.ddmanager && b.ui.ddmanager.drag(this, c);
            return false
        },
        _mouseStop: function(c) {
            var f = false;
            if (b.ui.ddmanager && !this.options.dropBehaviour) f = b.ui.ddmanager.drop(this, c);
            if (this.dropped) {
                f = this.dropped;
                this.dropped = false
            }
            if (!this.element[0] || !this.element[0].parentNode) return false;
            if (this.options.revert == "invalid" && !f || this.options.revert == "valid" && f || this.options.revert === true || b.isFunction(this.options.revert) && this.options.revert.call(this.element, f)) {
                var g = this;
                b(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                    g._trigger("stop", c) !== false && g._clear()
                })
            } else this._trigger("stop", c) !== false && this._clear();
            return false
        },
        cancel: function() {
            this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear();
            return this
        },
        _getHandle: function(c) {
            var f = !this.options.handle || !b(this.options.handle, this.element).length ? true : false;
            b(this.options.handle, this.element).find("*").andSelf().each(function() {
                if (this == c.target) f = true
            });
            return f
        },
        _createHelper: function(c) {
            var f = this.options;
            c = b.isFunction(f.helper) ? b(f.helper.apply(this.element[0], [c])) : f.helper == "clone" ? this.element.clone() : this.element;
            c.parents("body").length || c.appendTo(f.appendTo == "parent" ? this.element[0].parentNode : f.appendTo);
            c[0] != this.element[0] && !/(fixed|absolute)/.test(c.css("position")) && c.css("position", "absolute");
            return c
        },
        _adjustOffsetFromHelper: function(c) {
            if (typeof c == "string") c = c.split(" ");
            if (b.isArray(c)) c = {
                left: +c[0],
                top: +c[1] || 0
            };
            if ("left" in c) this.offset.click.left = c.left + this.margins.left;
            if ("right" in c) this.offset.click.left = this.helperProportions.width - c.right + this.margins.left;
            if ("top" in c) this.offset.click.top = c.top + this.margins.top;
            if ("bottom" in c) this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var c = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && b.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                c.left += this.scrollParent.scrollLeft();
                c.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && b.browser.msie) c = {
                top: 0,
                left: 0
            };
            return {
                top: c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var c = this.element.position();
                return {
                    top: c.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: c.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var c = this.options;
            if (c.containment == "parent") c.containment = this.helper[0].parentNode;
            if (c.containment == "document" || c.containment == "window") this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, b(c.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (b(c.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(c.containment) && c.containment.constructor != Array) {
                var f = b(c.containment)[0];
                if (f) {
                    c = b(c.containment).offset();
                    var g = b(f).css("overflow") != "hidden";
                    this.containment = [c.left + (parseInt(b(f).css("borderLeftWidth"), 10) || 0) + (parseInt(b(f).css("paddingLeft"), 10) || 0) - this.margins.left, c.top + (parseInt(b(f).css("borderTopWidth"), 10) || 0) + (parseInt(b(f).css("paddingTop"), 10) || 0) - this.margins.top, c.left + (g ? Math.max(f.scrollWidth, f.offsetWidth) : f.offsetWidth) - (parseInt(b(f).css("borderLeftWidth"), 10) || 0) - (parseInt(b(f).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, c.top + (g ? Math.max(f.scrollHeight, f.offsetHeight) : f.offsetHeight) - (parseInt(b(f).css("borderTopWidth"), 10) || 0) - (parseInt(b(f).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
                }
            } else if (c.containment.constructor == Array) this.containment = c.containment
        },
        _convertPositionTo: function(c, f) {
            if (!f) f = this.position;
            c = c == "absolute" ? 1 : -1;
            var g = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && b.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                e = /(html|body)/i.test(g[0].tagName);
            return {
                top: f.top + this.offset.relative.top * c + this.offset.parent.top * c - (b.browser.safari && b.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : g.scrollTop()) * c),
                left: f.left + this.offset.relative.left * c + this.offset.parent.left * c - (b.browser.safari && b.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : g.scrollLeft()) * c)
            }
        },
        _generatePosition: function(c) {
            var f = this.options,
                g = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && b.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                e = /(html|body)/i.test(g[0].tagName),
                a = c.pageX,
                d = c.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (c.pageX - this.offset.click.left < this.containment[0]) a = this.containment[0] + this.offset.click.left;
                    if (c.pageY - this.offset.click.top < this.containment[1]) d = this.containment[1] +
                        this.offset.click.top;
                    if (c.pageX - this.offset.click.left > this.containment[2]) a = this.containment[2] + this.offset.click.left;
                    if (c.pageY - this.offset.click.top > this.containment[3]) d = this.containment[3] + this.offset.click.top
                }
                if (f.grid) {
                    d = this.originalPageY + Math.round((d - this.originalPageY) / f.grid[1]) * f.grid[1];
                    d = this.containment ? !(d - this.offset.click.top < this.containment[1] || d - this.offset.click.top > this.containment[3]) ? d : !(d - this.offset.click.top < this.containment[1]) ? d - f.grid[1] : d + f.grid[1] : d;
                    a = this.originalPageX +
                        Math.round((a - this.originalPageX) / f.grid[0]) * f.grid[0];
                    a = this.containment ? !(a - this.offset.click.left < this.containment[0] || a - this.offset.click.left > this.containment[2]) ? a : !(a - this.offset.click.left < this.containment[0]) ? a - f.grid[0] : a + f.grid[0] : a
                }
            }
            return {
                top: d - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (b.browser.safari && b.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : g.scrollTop()),
                left: a - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (b.browser.safari && b.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : g.scrollLeft())
            }
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = false
        },
        _trigger: function(c, f, g) {
            g = g || this._uiHash();
            b.ui.plugin.call(this, c, [f, g]);
            if (c == "drag") this.positionAbs = this._convertPositionTo("absolute");
            return b.Widget.prototype._trigger.call(this, c, f, g)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    });
    b.extend(b.ui.draggable, {
        version: "1.8.6"
    });
    b.ui.plugin.add("draggable", "connectToSortable", {
        start: function(c, f) {
            var g = b(this).data("draggable"),
                e = g.options,
                a = b.extend({}, f, {
                    item: g.element
                });
            g.sortables = [];
            b(e.connectToSortable).each(function() {
                var d = b.data(this, "sortable");
                if (d && !d.options.disabled) {
                    g.sortables.push({
                        instance: d,
                        shouldRevert: d.options.revert
                    });
                    d._refreshItems();
                    d._trigger("activate", c, a)
                }
            })
        },
        stop: function(c, f) {
            var g = b(this).data("draggable"),
                e = b.extend({}, f, {
                    item: g.element
                });
            b.each(g.sortables, function() {
                if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    g.cancelHelperRemoval = true;
                    this.instance.cancelHelperRemoval = false;
                    if (this.shouldRevert) this.instance.options.revert = true;
                    this.instance._mouseStop(c);
                    this.instance.options.helper = this.instance.options._helper;
                    g.options.helper == "original" && this.instance.currentItem.css({
                        top: "auto",
                        left: "auto"
                    })
                } else {
                    this.instance.cancelHelperRemoval = false;
                    this.instance._trigger("deactivate", c, e)
                }
            })
        },
        drag: function(c, f) {
            var g = b(this).data("draggable"),
                e = this;
            b.each(g.sortables, function() {
                this.instance.positionAbs = g.positionAbs;
                this.instance.helperProportions = g.helperProportions;
                this.instance.offset.click = g.offset.click;
                if (this.instance._intersectsWith(this.instance.containerCache)) {
                    if (!this.instance.isOver) {
                        this.instance.isOver = 1;
                        this.instance.currentItem = b(e).clone().appendTo(this.instance.element).data("sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper;
                        this.instance.options.helper = function() {
                            return f.helper[0]
                        };
                        c.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(c, true);
                        this.instance._mouseStart(c, true, true);
                        this.instance.offset.click.top = g.offset.click.top;
                        this.instance.offset.click.left = g.offset.click.left;
                        this.instance.offset.parent.left -= g.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= g.offset.parent.top - this.instance.offset.parent.top;
                        g._trigger("toSortable", c);
                        g.dropped = this.instance.element;
                        g.currentItem = g.element;
                        this.instance.fromOutside = g
                    }
                    this.instance.currentItem && this.instance._mouseDrag(c)
                } else if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    this.instance.cancelHelperRemoval = true;
                    this.instance.options.revert = false;
                    this.instance._trigger("out", c, this.instance._uiHash(this.instance));
                    this.instance._mouseStop(c, true);
                    this.instance.options.helper = this.instance.options._helper;
                    this.instance.currentItem.remove();
                    this.instance.placeholder && this.instance.placeholder.remove();
                    g._trigger("fromSortable", c);
                    g.dropped = false
                }
            })
        }
    });
    b.ui.plugin.add("draggable", "cursor", {
        start: function() {
            var c = b("body"),
                f = b(this).data("draggable").options;
            if (c.css("cursor")) f._cursor = c.css("cursor");
            c.css("cursor", f.cursor)
        },
        stop: function() {
            var c = b(this).data("draggable").options;
            c._cursor && b("body").css("cursor", c._cursor)
        }
    });
    b.ui.plugin.add("draggable", "iframeFix", {
        start: function() {
            var c = b(this).data("draggable").options;
            b(c.iframeFix === true ? "iframe" : c.iframeFix).each(function() {
                b('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1E3
                }).css(b(this).offset()).appendTo("body")
            })
        },
        stop: function() {
            b("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
            })
        }
    });
    b.ui.plugin.add("draggable", "opacity", {
        start: function(c, f) {
            c = b(f.helper);
            f = b(this).data("draggable").options;
            if (c.css("opacity")) f._opacity = c.css("opacity");
            c.css("opacity", f.opacity)
        },
        stop: function(c, f) {
            c = b(this).data("draggable").options;
            c._opacity && b(f.helper).css("opacity", c._opacity)
        }
    });
    b.ui.plugin.add("draggable", "scroll", {
        start: function() {
            var c = b(this).data("draggable");
            if (c.scrollParent[0] != document && c.scrollParent[0].tagName != "HTML") c.overflowOffset = c.scrollParent.offset()
        },
        drag: function(c) {
            var f = b(this).data("draggable"),
                g = f.options,
                e = false;
            if (f.scrollParent[0] != document && f.scrollParent[0].tagName != "HTML") {
                if (!g.axis || g.axis != "x")
                    if (f.overflowOffset.top + f.scrollParent[0].offsetHeight - c.pageY < g.scrollSensitivity) f.scrollParent[0].scrollTop = e = f.scrollParent[0].scrollTop + g.scrollSpeed;
                    else
                if (c.pageY - f.overflowOffset.top < g.scrollSensitivity) f.scrollParent[0].scrollTop = e = f.scrollParent[0].scrollTop - g.scrollSpeed;
                if (!g.axis || g.axis != "y")
                    if (f.overflowOffset.left + f.scrollParent[0].offsetWidth - c.pageX < g.scrollSensitivity) f.scrollParent[0].scrollLeft = e = f.scrollParent[0].scrollLeft + g.scrollSpeed;
                    else
                if (c.pageX -
                    f.overflowOffset.left < g.scrollSensitivity) f.scrollParent[0].scrollLeft = e = f.scrollParent[0].scrollLeft - g.scrollSpeed
            } else {
                if (!g.axis || g.axis != "x")
                    if (c.pageY - b(document).scrollTop() < g.scrollSensitivity) e = b(document).scrollTop(b(document).scrollTop() - g.scrollSpeed);
                    else
                if (b(window).height() - (c.pageY - b(document).scrollTop()) < g.scrollSensitivity) e = b(document).scrollTop(b(document).scrollTop() + g.scrollSpeed);
                if (!g.axis || g.axis != "y")
                    if (c.pageX - b(document).scrollLeft() < g.scrollSensitivity) e = b(document).scrollLeft(b(document).scrollLeft() -
                        g.scrollSpeed);
                    else
                if (b(window).width() - (c.pageX - b(document).scrollLeft()) < g.scrollSensitivity) e = b(document).scrollLeft(b(document).scrollLeft() + g.scrollSpeed)
            }
            e !== false && b.ui.ddmanager && !g.dropBehaviour && b.ui.ddmanager.prepareOffsets(f, c)
        }
    });
    b.ui.plugin.add("draggable", "snap", {
        start: function() {
            var c = b(this).data("draggable"),
                f = c.options;
            c.snapElements = [];
            b(f.snap.constructor != String ? f.snap.items || ":data(draggable)" : f.snap).each(function() {
                var g = b(this),
                    e = g.offset();
                this != c.element[0] && c.snapElements.push({
                    item: this,
                    width: g.outerWidth(),
                    height: g.outerHeight(),
                    top: e.top,
                    left: e.left
                })
            })
        },
        drag: function(c, f) {
            for (var g = b(this).data("draggable"), e = g.options, a = e.snapTolerance, d = f.offset.left, h = d + g.helperProportions.width, i = f.offset.top, j = i + g.helperProportions.height, n = g.snapElements.length - 1; n >= 0; n--) {
                var q = g.snapElements[n].left,
                    l = q + g.snapElements[n].width,
                    k = g.snapElements[n].top,
                    m = k + g.snapElements[n].height;
                if (q - a < d && d < l + a && k - a < i && i < m + a || q - a < d && d < l + a && k - a < j && j < m + a || q - a < h && h < l + a && k - a < i && i < m + a || q - a < h && h < l + a && k - a < j && j < m + a) {
                    if (e.snapMode != "inner") {
                        var o = Math.abs(k - j) <= a,
                            p = Math.abs(m - i) <= a,
                            s = Math.abs(q - h) <= a,
                            r = Math.abs(l - d) <= a;
                        if (o) f.position.top = g._convertPositionTo("relative", {
                            top: k - g.helperProportions.height,
                            left: 0
                        }).top - g.margins.top;
                        if (p) f.position.top = g._convertPositionTo("relative", {
                            top: m,
                            left: 0
                        }).top - g.margins.top;
                        if (s) f.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: q - g.helperProportions.width
                        }).left - g.margins.left;
                        if (r) f.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: l
                        }).left - g.margins.left
                    }
                    var u = o || p || s || r;
                    if (e.snapMode != "outer") {
                        o = Math.abs(k - i) <= a;
                        p = Math.abs(m - j) <= a;
                        s = Math.abs(q - d) <= a;
                        r = Math.abs(l - h) <= a;
                        if (o) f.position.top = g._convertPositionTo("relative", {
                            top: k,
                            left: 0
                        }).top - g.margins.top;
                        if (p) f.position.top = g._convertPositionTo("relative", {
                            top: m - g.helperProportions.height,
                            left: 0
                        }).top - g.margins.top;
                        if (s) f.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: q
                        }).left - g.margins.left;
                        if (r) f.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: l - g.helperProportions.width
                        }).left - g.margins.left
                    }
                    if (!g.snapElements[n].snapping && (o || p || s || r || u)) g.options.snap.snap && g.options.snap.snap.call(g.element, c, b.extend(g._uiHash(), {
                        snapItem: g.snapElements[n].item
                    }));
                    g.snapElements[n].snapping = o || p || s || r || u
                } else {
                    g.snapElements[n].snapping && g.options.snap.release && g.options.snap.release.call(g.element, c, b.extend(g._uiHash(), {
                        snapItem: g.snapElements[n].item
                    }));
                    g.snapElements[n].snapping = false
                }
            }
        }
    });
    b.ui.plugin.add("draggable", "stack", {
        start: function() {
            var c = b(this).data("draggable").options;
            c = b.makeArray(b(c.stack)).sort(function(g, e) {
                return (parseInt(b(g).css("zIndex"), 10) || 0) - (parseInt(b(e).css("zIndex"), 10) || 0)
            });
            if (c.length) {
                var f = parseInt(c[0].style.zIndex) || 0;
                b(c).each(function(g) {
                    this.style.zIndex = f + g
                });
                this[0].style.zIndex = f + c.length
            }
        }
    });
    b.ui.plugin.add("draggable", "zIndex", {
        start: function(c, f) {
            c = b(f.helper);
            f = b(this).data("draggable").options;
            if (c.css("zIndex")) f._zIndex = c.css("zIndex");
            c.css("zIndex", f.zIndex)
        },
        stop: function(c, f) {
            c = b(this).data("draggable").options;
            c._zIndex && b(f.helper).css("zIndex", c._zIndex)
        }
    })
})(jQuery);
(function(b) {
    b.widget("ui.droppable", {
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: false,
            addClasses: true,
            greedy: false,
            hoverClass: false,
            scope: "default",
            tolerance: "intersect"
        },
        _create: function() {
            var c = this.options,
                f = c.accept;
            this.isover = 0;
            this.isout = 1;
            this.accept = b.isFunction(f) ? f : function(g) {
                return g.is(f)
            };
            this.proportions = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
            };
            b.ui.ddmanager.droppables[c.scope] = b.ui.ddmanager.droppables[c.scope] || [];
            b.ui.ddmanager.droppables[c.scope].push(this);
            c.addClasses && this.element.addClass("ui-droppable")
        },
        destroy: function() {
            for (var c = b.ui.ddmanager.droppables[this.options.scope], f = 0; f < c.length; f++) c[f] == this && c.splice(f, 1);
            this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");
            return this
        },
        _setOption: function(c, f) {
            if (c == "accept") this.accept = b.isFunction(f) ? f : function(g) {
                return g.is(f)
            };
            b.Widget.prototype._setOption.apply(this, arguments)
        },
        _activate: function(c) {
            var f = b.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass);
            f && this._trigger("activate", c, this.ui(f))
        },
        _deactivate: function(c) {
            var f = b.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            f && this._trigger("deactivate", c, this.ui(f))
        },
        _over: function(c) {
            var f = b.ui.ddmanager.current;
            if (!(!f || (f.currentItem || f.element)[0] == this.element[0]))
                if (this.accept.call(this.element[0], f.currentItem || f.element)) {
                    this.options.hoverClass && this.element.addClass(this.options.hoverClass);
                    this._trigger("over", c, this.ui(f))
                }
        },
        _out: function(c) {
            var f = b.ui.ddmanager.current;
            if (!(!f || (f.currentItem || f.element)[0] == this.element[0]))
                if (this.accept.call(this.element[0], f.currentItem || f.element)) {
                    this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                    this._trigger("out", c, this.ui(f))
                }
        },
        _drop: function(c, f) {
            var g = f || b.ui.ddmanager.current;
            if (!g || (g.currentItem || g.element)[0] == this.element[0]) return false;
            var e = false;
            this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
                var a = b.data(this, "droppable");
                if (a.options.greedy && !a.options.disabled && a.options.scope == g.options.scope && a.accept.call(a.element[0], g.currentItem || g.element) && b.ui.intersect(g, b.extend(a, {
                    offset: a.element.offset()
                }), a.options.tolerance)) {
                    e = true;
                    return false
                }
            });
            if (e) return false;
            if (this.accept.call(this.element[0], g.currentItem || g.element)) {
                this.options.activeClass && this.element.removeClass(this.options.activeClass);
                this.options.hoverClass && this.element.removeClass(this.options.hoverClass);
                this._trigger("drop", c, this.ui(g));
                return this.element
            }
            return false
        },
        ui: function(c) {
            return {
                draggable: c.currentItem || c.element,
                helper: c.helper,
                position: c.position,
                offset: c.positionAbs
            }
        }
    });
    b.extend(b.ui.droppable, {
        version: "1.8.6"
    });
    b.ui.intersect = function(c, f, g) {
        if (!f.offset) return false;
        var e = (c.positionAbs || c.position.absolute).left,
            a = e + c.helperProportions.width,
            d = (c.positionAbs || c.position.absolute).top,
            h = d + c.helperProportions.height,
            i = f.offset.left,
            j = i + f.proportions.width,
            n = f.offset.top,
            q = n + f.proportions.height;
        switch (g) {
            case "fit":
                return i <= e && a <= j && n <= d && h <= q;
            case "intersect":
                return i < e + c.helperProportions.width / 2 && a - c.helperProportions.width / 2 < j && n < d + c.helperProportions.height / 2 && h - c.helperProportions.height / 2 < q;
            case "pointer":
                return b.ui.isOver((c.positionAbs || c.position.absolute).top + (c.clickOffset || c.offset.click).top, (c.positionAbs || c.position.absolute).left + (c.clickOffset || c.offset.click).left, n, i, f.proportions.height, f.proportions.width);
            case "touch":
                return (d >= n && d <= q || h >= n && h <= q || d < n && h > q) && (e >= i && e <= j || a >= i && a <= j || e < i && a > j);
            default:
                return false
        }
    };
    b.ui.ddmanager = {
        current: null,
        droppables: {
            "default": []
        },
        prepareOffsets: function(c, f) {
            var g = b.ui.ddmanager.droppables[c.options.scope] || [],
                e = f ? f.type : null,
                a = (c.currentItem || c.element).find(":data(droppable)").andSelf(),
                d = 0;
            a: for (; d < g.length; d++)
                if (!(g[d].options.disabled || c && !g[d].accept.call(g[d].element[0], c.currentItem || c.element))) {
                    for (var h = 0; h < a.length; h++)
                        if (a[h] == g[d].element[0]) {
                            g[d].proportions.height = 0;
                            continue a
                        }
                    g[d].visible = g[d].element.css("display") != "none";
                    if (g[d].visible) {
                        g[d].offset = g[d].element.offset();
                        g[d].proportions = {
                            width: g[d].element[0].offsetWidth,
                            height: g[d].element[0].offsetHeight
                        };
                        e == "mousedown" && g[d]._activate.call(g[d], f)
                    }
                }
        },
        drop: function(c, f) {
            var g = false;
            b.each(b.ui.ddmanager.droppables[c.options.scope] || [], function() {
                if (this.options) {
                    if (!this.options.disabled && this.visible && b.ui.intersect(c, this, this.options.tolerance)) g = g || this._drop.call(this, f);
                    if (!this.options.disabled && this.visible && this.accept.call(this.element[0], c.currentItem || c.element)) {
                        this.isout = 1;
                        this.isover = 0;
                        this._deactivate.call(this, f)
                    }
                }
            });
            return g
        },
        drag: function(c, f) {
            c.options.refreshPositions && b.ui.ddmanager.prepareOffsets(c, f);
            b.each(b.ui.ddmanager.droppables[c.options.scope] || [], function() {
                if (!(this.options.disabled || this.greedyChild || !this.visible)) {
                    var g = b.ui.intersect(c, this, this.options.tolerance);
                    if (g = !g && this.isover == 1 ? "isout" : g && this.isover == 0 ? "isover" : null) {
                        var e;
                        if (this.options.greedy) {
                            var a = this.element.parents(":data(droppable):eq(0)");
                            if (a.length) {
                                e = b.data(a[0], "droppable");
                                e.greedyChild = g == "isover" ? 1 : 0
                            }
                        }
                        if (e && g == "isover") {
                            e.isover = 0;
                            e.isout = 1;
                            e._out.call(e, f)
                        }
                        this[g] = 1;
                        this[g == "isout" ? "isover" : "isout"] = 0;
                        this[g == "isover" ? "_over" : "_out"].call(this, f);
                        if (e && g == "isout") {
                            e.isout = 0;
                            e.isover = 1;
                            e._over.call(e, f)
                        }
                    }
                }
            })
        }
    }
})(jQuery);
(function(b) {
    b.widget("ui.resizable", b.ui.mouse, {
        widgetEventPrefix: "resize",
        options: {
            alsoResize: false,
            animate: false,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: false,
            autoHide: false,
            containment: false,
            ghost: false,
            grid: false,
            handles: "e,s,se",
            helper: false,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 1E3
        },
        _create: function() {
            var g = this,
                e = this.options;
            this.element.addClass("ui-resizable");
            b.extend(this, {
                _aspectRatio: !! e.aspectRatio,
                aspectRatio: e.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: e.helper || e.ghost || e.animate ? e.helper || "ui-resizable-helper" : null
            });
            if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
                /relative/.test(this.element.css("position")) && b.browser.opera && this.element.css({
                    position: "relative",
                    top: "auto",
                    left: "auto"
                });
                this.element.wrap(b('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
                    position: this.element.css("position"),
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight(),
                    top: this.element.css("top"),
                    left: this.element.css("left")
                }));
                this.element = this.element.parent().data("resizable", this.element.data("resizable"));
                this.elementIsWrapper = true;
                this.element.css({
                    marginLeft: this.originalElement.css("marginLeft"),
                    marginTop: this.originalElement.css("marginTop"),
                    marginRight: this.originalElement.css("marginRight"),
                    marginBottom: this.originalElement.css("marginBottom")
                });
                this.originalElement.css({
                    marginLeft: 0,
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0
                });
                this.originalResizeStyle = this.originalElement.css("resize");
                this.originalElement.css("resize", "none");
                this._proportionallyResizeElements.push(this.originalElement.css({
                    position: "static",
                    zoom: 1,
                    display: "block"
                }));
                this.originalElement.css({
                    margin: this.originalElement.css("margin")
                });
                this._proportionallyResize()
            }
            this.handles = e.handles || (!b(".ui-resizable-handle", this.element).length ? "e,s,se" : {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            });
            if (this.handles.constructor == String) {
                if (this.handles == "all") this.handles = "n,e,s,w,se,sw,ne,nw";
                var a = this.handles.split(",");
                this.handles = {};
                for (var d = 0; d < a.length; d++) {
                    var h = b.trim(a[d]),
                        i = b('<div class="ui-resizable-handle ' + ("ui-resizable-" + h) + '"></div>');
                    /sw|se|ne|nw/.test(h) && i.css({
                        zIndex: ++e.zIndex
                    });
                    "se" == h && i.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
                    this.handles[h] = ".ui-resizable-" + h;
                    this.element.append(i)
                }
            }
            this._renderAxis = function(j) {
                j = j || this.element;
                for (var n in this.handles) {
                    if (this.handles[n].constructor == String) this.handles[n] = b(this.handles[n], this.element).show();
                    if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                        var q = b(this.handles[n], this.element),
                            l = 0;
                        l = /sw|ne|nw|se|n|s/.test(n) ? q.outerHeight() : q.outerWidth();
                        q = ["padding", /ne|nw|n/.test(n) ? "Top" : /se|sw|s/.test(n) ? "Bottom" : /^e$/.test(n) ? "Right" : "Left"].join("");
                        j.css(q, l);
                        this._proportionallyResize()
                    }
                    b(this.handles[n])
                }
            };
            this._renderAxis(this.element);
            this._handles = b(".ui-resizable-handle", this.element).disableSelection();
            this._handles.mouseover(function() {
                if (!g.resizing) {
                    if (this.className) var j = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                    g.axis = j && j[1] ? j[1] : "se"
                }
            });
            if (e.autoHide) {
                this._handles.hide();
                b(this.element).addClass("ui-resizable-autohide").hover(function() {
                    b(this).removeClass("ui-resizable-autohide");
                    g._handles.show()
                }, function() {
                    if (!g.resizing) {
                        b(this).addClass("ui-resizable-autohide");
                        g._handles.hide()
                    }
                })
            }
            this._mouseInit()
        },
        destroy: function() {
            this._mouseDestroy();
            var g = function(a) {
                b(a).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
            };
            if (this.elementIsWrapper) {
                g(this.element);
                var e = this.element;
                e.after(this.originalElement.css({
                    position: e.css("position"),
                    width: e.outerWidth(),
                    height: e.outerHeight(),
                    top: e.css("top"),
                    left: e.css("left")
                })).remove()
            }
            this.originalElement.css("resize", this.originalResizeStyle);
            g(this.originalElement);
            return this
        },
        _mouseCapture: function(g) {
            var e = false;
            for (var a in this.handles)
                if (b(this.handles[a])[0] == g.target) e = true;
            return !this.options.disabled && e
        },
        _mouseStart: function(g) {
            var e = this.options,
                a = this.element.position(),
                d = this.element;
            this.resizing = true;
            this.documentScroll = {
                top: b(document).scrollTop(),
                left: b(document).scrollLeft()
            };
            if (d.is(".ui-draggable") || /absolute/.test(d.css("position"))) d.css({
                position: "absolute",
                top: a.top,
                left: a.left
            });
            b.browser.opera && /relative/.test(d.css("position")) && d.css({
                position: "relative",
                top: "auto",
                left: "auto"
            });
            this._renderProxy();
            a = c(this.helper.css("left"));
            var h = c(this.helper.css("top"));
            if (e.containment) {
                a += b(e.containment).scrollLeft() || 0;
                h += b(e.containment).scrollTop() || 0
            }
            this.offset = this.helper.offset();
            this.position = {
                left: a,
                top: h
            };
            this.size = this._helper ? {
                width: d.outerWidth(),
                height: d.outerHeight()
            } : {
                width: d.width(),
                height: d.height()
            };
            this.originalSize = this._helper ? {
                width: d.outerWidth(),
                height: d.outerHeight()
            } : {
                width: d.width(),
                height: d.height()
            };
            this.originalPosition = {
                left: a,
                top: h
            };
            this.sizeDiff = {
                width: d.outerWidth() - d.width(),
                height: d.outerHeight() - d.height()
            };
            this.originalMousePosition = {
                left: g.pageX,
                top: g.pageY
            };
            this.aspectRatio = typeof e.aspectRatio == "number" ? e.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
            e = b(".ui-resizable-" + this.axis).css("cursor");
            b("body").css("cursor", e == "auto" ? this.axis + "-resize" : e);
            d.addClass("ui-resizable-resizing");
            this._propagate("start", g);
            return true
        },
        _mouseDrag: function(g) {
            var e = this.helper,
                a = this.originalMousePosition,
                d = this._change[this.axis];
            if (!d) return false;
            a = d.apply(this, [g, g.pageX - a.left || 0, g.pageY - a.top || 0]);
            if (this._aspectRatio || g.shiftKey) a = this._updateRatio(a, g);
            a = this._respectSize(a, g);
            this._propagate("resize", g);
            e.css({
                top: this.position.top + "px",
                left: this.position.left + "px",
                width: this.size.width + "px",
                height: this.size.height + "px"
            });
            !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize();
            this._updateCache(a);
            this._trigger("resize", g, this.ui());
            return false
        },
        _mouseStop: function(g) {
            this.resizing = false;
            var e = this.options,
                a = this;
            if (this._helper) {
                var d = this._proportionallyResizeElements,
                    h = d.length && /textarea/i.test(d[0].nodeName);
                d = h && b.ui.hasScroll(d[0], "left") ? 0 : a.sizeDiff.height;
                h = {
                    width: a.size.width - (h ? 0 : a.sizeDiff.width),
                    height: a.size.height - d
                };
                d = parseInt(a.element.css("left"), 10) + (a.position.left - a.originalPosition.left) || null;
                var i = parseInt(a.element.css("top"), 10) + (a.position.top - a.originalPosition.top) || null;
                e.animate || this.element.css(b.extend(h, {
                    top: i,
                    left: d
                }));
                a.helper.height(a.size.height);
                a.helper.width(a.size.width);
                this._helper && !e.animate && this._proportionallyResize()
            }
            b("body").css("cursor", "auto");
            this.element.removeClass("ui-resizable-resizing");
            this._propagate("stop", g);
            this._helper && this.helper.remove();
            return false
        },
        _updateCache: function(g) {
            this.offset = this.helper.offset();
            if (f(g.left)) this.position.left = g.left;
            if (f(g.top)) this.position.top = g.top;
            if (f(g.height)) this.size.height = g.height;
            if (f(g.width)) this.size.width = g.width
        },
        _updateRatio: function(g) {
            var e = this.position,
                a = this.size,
                d = this.axis;
            if (g.height) g.width = a.height * this.aspectRatio;
            else if (g.width) g.height = a.width / this.aspectRatio;
            if (d == "sw") {
                g.left = e.left + (a.width - g.width);
                g.top = null
            }
            if (d == "nw") {
                g.top = e.top + (a.height - g.height);
                g.left = e.left + (a.width - g.width)
            }
            return g
        },
        _respectSize: function(g) {
            var e = this.options,
                a = this.axis,
                d = f(g.width) && e.maxWidth && e.maxWidth < g.width,
                h = f(g.height) && e.maxHeight && e.maxHeight < g.height,
                i = f(g.width) && e.minWidth && e.minWidth > g.width,
                j = f(g.height) && e.minHeight && e.minHeight > g.height;
            if (i) g.width = e.minWidth;
            if (j) g.height = e.minHeight;
            if (d) g.width = e.maxWidth;
            if (h) g.height = e.maxHeight;
            var n = this.originalPosition.left + this.originalSize.width,
                q = this.position.top + this.size.height,
                l = /sw|nw|w/.test(a);
            a = /nw|ne|n/.test(a);
            if (i && l) g.left = n - e.minWidth;
            if (d && l) g.left = n - e.maxWidth;
            if (j && a) g.top = q - e.minHeight;
            if (h && a) g.top = q - e.maxHeight;
            if ((e = !g.width && !g.height) && !g.left && g.top) g.top = null;
            else if (e && !g.top && g.left) g.left = null;
            return g
        },
        _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length)
                for (var g = this.helper || this.element, e = 0; e < this._proportionallyResizeElements.length; e++) {
                    var a = this._proportionallyResizeElements[e];
                    if (!this.borderDif) {
                        var d = [a.css("borderTopWidth"), a.css("borderRightWidth"), a.css("borderBottomWidth"), a.css("borderLeftWidth")],
                            h = [a.css("paddingTop"), a.css("paddingRight"), a.css("paddingBottom"), a.css("paddingLeft")];
                        this.borderDif = b.map(d, function(i, j) {
                            i = parseInt(i, 10) || 0;
                            j = parseInt(h[j], 10) || 0;
                            return i + j
                        })
                    }
                    b.browser.msie && (b(g).is(":hidden") || b(g).parents(":hidden").length) || a.css({
                        height: g.height() - this.borderDif[0] - this.borderDif[2] || 0,
                        width: g.width() - this.borderDif[1] - this.borderDif[3] || 0
                    })
                }
        },
        _renderProxy: function() {
            var g = this.options;
            this.elementOffset = this.element.offset();
            if (this._helper) {
                this.helper = this.helper || b('<div style="overflow:hidden;"></div>');
                var e = b.browser.msie && b.browser.version < 7,
                    a = e ? 1 : 0;
                e = e ? 2 : -1;
                this.helper.addClass(this._helper).css({
                    width: this.element.outerWidth() + e,
                    height: this.element.outerHeight() + e,
                    position: "absolute",
                    left: this.elementOffset.left - a + "px",
                    top: this.elementOffset.top - a + "px",
                    zIndex: ++g.zIndex
                });
                this.helper.appendTo("body").disableSelection()
            } else this.helper = this.element
        },
        _change: {
            e: function(g, e) {
                return {
                    width: this.originalSize.width + e
                }
            },
            w: function(g, e) {
                return {
                    left: this.originalPosition.left + e,
                    width: this.originalSize.width - e
                }
            },
            n: function(g, e, a) {
                return {
                    top: this.originalPosition.top + a,
                    height: this.originalSize.height - a
                }
            },
            s: function(g, e, a) {
                return {
                    height: this.originalSize.height + a
                }
            },
            se: function(g, e, a) {
                return b.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [g, e, a]))
            },
            sw: function(g, e, a) {
                return b.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [g, e, a]))
            },
            ne: function(g, e, a) {
                return b.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [g, e, a]))
            },
            nw: function(g, e, a) {
                return b.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [g, e, a]))
            }
        },
        _propagate: function(g, e) {
            b.ui.plugin.call(this, g, [e, this.ui()]);
            g != "resize" && this._trigger(g, e, this.ui())
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    });
    b.extend(b.ui.resizable, {
        version: "1.8.6"
    });
    b.ui.plugin.add("resizable", "alsoResize", {
        start: function() {
            var g = b(this).data("resizable").options,
                e = function(a) {
                    b(a).each(function() {
                        var d = b(this);
                        d.data("resizable-alsoresize", {
                            width: parseInt(d.width(), 10),
                            height: parseInt(d.height(), 10),
                            left: parseInt(d.css("left"), 10),
                            top: parseInt(d.css("top"), 10),
                            position: d.css("position")
                        })
                    })
                };
            if (typeof g.alsoResize == "object" && !g.alsoResize.parentNode)
                if (g.alsoResize.length) {
                    g.alsoResize = g.alsoResize[0];
                    e(g.alsoResize)
                } else b.each(g.alsoResize, function(a) {
                    e(a)
                });
                else e(g.alsoResize)
        },
        resize: function(g, e) {
            var a = b(this).data("resizable");
            g = a.options;
            var d = a.originalSize,
                h = a.originalPosition,
                i = {
                    height: a.size.height - d.height || 0,
                    width: a.size.width - d.width || 0,
                    top: a.position.top - h.top || 0,
                    left: a.position.left - h.left || 0
                }, j = function(n, q) {
                    b(n).each(function() {
                        var l = b(this),
                            k = b(this).data("resizable-alsoresize"),
                            m = {}, o = q && q.length ? q : l.parents(e.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                        b.each(o, function(p, s) {
                            if ((p = (k[s] || 0) + (i[s] || 0)) && p >= 0) m[s] = p || null
                        });
                        if (b.browser.opera && /relative/.test(l.css("position"))) {
                            a._revertToRelativePosition = true;
                            l.css({
                                position: "absolute",
                                top: "auto",
                                left: "auto"
                            })
                        }
                        l.css(m)
                    })
                };
            typeof g.alsoResize == "object" && !g.alsoResize.nodeType ? b.each(g.alsoResize, function(n, q) {
                j(n, q)
            }) : j(g.alsoResize)
        },
        stop: function() {
            var g = b(this).data("resizable"),
                e = g.options,
                a = function(d) {
                    b(d).each(function() {
                        var h = b(this);
                        h.css({
                            position: h.data("resizable-alsoresize").position
                        })
                    })
                };
            if (g._revertToRelativePosition) {
                g._revertToRelativePosition = false;
                typeof e.alsoResize == "object" && !e.alsoResize.nodeType ? b.each(e.alsoResize, function(d) {
                    a(d)
                }) : a(e.alsoResize)
            }
            b(this).removeData("resizable-alsoresize")
        }
    });
    b.ui.plugin.add("resizable", "animate", {
        stop: function(g) {
            var e = b(this).data("resizable"),
                a = e.options,
                d = e._proportionallyResizeElements,
                h = d.length && /textarea/i.test(d[0].nodeName),
                i = h && b.ui.hasScroll(d[0], "left") ? 0 : e.sizeDiff.height;
            h = {
                width: e.size.width - (h ? 0 : e.sizeDiff.width),
                height: e.size.height - i
            };
            i = parseInt(e.element.css("left"), 10) + (e.position.left -
                e.originalPosition.left) || null;
            var j = parseInt(e.element.css("top"), 10) + (e.position.top - e.originalPosition.top) || null;
            e.element.animate(b.extend(h, j && i ? {
                top: j,
                left: i
            } : {}), {
                duration: a.animateDuration,
                easing: a.animateEasing,
                step: function() {
                    var n = {
                        width: parseInt(e.element.css("width"), 10),
                        height: parseInt(e.element.css("height"), 10),
                        top: parseInt(e.element.css("top"), 10),
                        left: parseInt(e.element.css("left"), 10)
                    };
                    d && d.length && b(d[0]).css({
                        width: n.width,
                        height: n.height
                    });
                    e._updateCache(n);
                    e._propagate("resize", g)
                }
            })
        }
    });
    b.ui.plugin.add("resizable", "containment", {
        start: function() {
            var g = b(this).data("resizable"),
                e = g.element,
                a = g.options.containment;
            if (e = a instanceof b ? a.get(0) : /parent/.test(a) ? e.parent().get(0) : a) {
                g.containerElement = b(e);
                if (/document/.test(a) || a == document) {
                    g.containerOffset = {
                        left: 0,
                        top: 0
                    };
                    g.containerPosition = {
                        left: 0,
                        top: 0
                    };
                    g.parentData = {
                        element: b(document),
                        left: 0,
                        top: 0,
                        width: b(document).width(),
                        height: b(document).height() || document.body.parentNode.scrollHeight
                    }
                } else {
                    var d = b(e),
                        h = [];
                    b(["Top", "Right", "Left", "Bottom"]).each(function(n, q) {
                        h[n] = c(d.css("padding" + q))
                    });
                    g.containerOffset = d.offset();
                    g.containerPosition = d.position();
                    g.containerSize = {
                        height: d.innerHeight() - h[3],
                        width: d.innerWidth() - h[1]
                    };
                    a = g.containerOffset;
                    var i = g.containerSize.height,
                        j = g.containerSize.width;
                    j = b.ui.hasScroll(e, "left") ? e.scrollWidth : j;
                    i = b.ui.hasScroll(e) ? e.scrollHeight : i;
                    g.parentData = {
                        element: e,
                        left: a.left,
                        top: a.top,
                        width: j,
                        height: i
                    }
                }
            }
        },
        resize: function(g) {
            var e = b(this).data("resizable"),
                a = e.options,
                d = e.containerOffset,
                h = e.position;
            g = e._aspectRatio || g.shiftKey;
            var i = {
                top: 0,
                left: 0
            }, j = e.containerElement;
            if (j[0] != document && /static/.test(j.css("position"))) i = d;
            if (h.left < (e._helper ? d.left : 0)) {
                e.size.width += e._helper ? e.position.left - d.left : e.position.left - i.left;
                if (g) e.size.height = e.size.width / a.aspectRatio;
                e.position.left = a.helper ? d.left : 0
            }
            if (h.top < (e._helper ? d.top : 0)) {
                e.size.height += e._helper ? e.position.top - d.top : e.position.top;
                if (g) e.size.width = e.size.height * a.aspectRatio;
                e.position.top = e._helper ? d.top : 0
            }
            e.offset.left = e.parentData.left + e.position.left;
            e.offset.top = e.parentData.top + e.position.top;
            a = Math.abs((e._helper ? e.offset.left - i.left : e.offset.left - i.left) + e.sizeDiff.width);
            d = Math.abs((e._helper ? e.offset.top - i.top : e.offset.top - d.top) + e.sizeDiff.height);
            h = e.containerElement.get(0) == e.element.parent().get(0);
            i = /relative|absolute/.test(e.containerElement.css("position"));
            if (h && i) a -= e.parentData.left;
            if (a + e.size.width >= e.parentData.width) {
                e.size.width = e.parentData.width - a;
                if (g) e.size.height = e.size.width / e.aspectRatio
            }
            if (d +
                e.size.height >= e.parentData.height) {
                e.size.height = e.parentData.height - d;
                if (g) e.size.width = e.size.height * e.aspectRatio
            }
        },
        stop: function() {
            var g = b(this).data("resizable"),
                e = g.options,
                a = g.containerOffset,
                d = g.containerPosition,
                h = g.containerElement,
                i = b(g.helper),
                j = i.offset(),
                n = i.outerWidth() - g.sizeDiff.width;
            i = i.outerHeight() - g.sizeDiff.height;
            g._helper && !e.animate && /relative/.test(h.css("position")) && b(this).css({
                left: j.left - d.left - a.left,
                width: n,
                height: i
            });
            g._helper && !e.animate && /static/.test(h.css("position")) && b(this).css({
                left: j.left - d.left - a.left,
                width: n,
                height: i
            })
        }
    });
    b.ui.plugin.add("resizable", "ghost", {
        start: function() {
            var g = b(this).data("resizable"),
                e = g.options,
                a = g.size;
            g.ghost = g.originalElement.clone();
            g.ghost.css({
                opacity: 0.25,
                display: "block",
                position: "relative",
                height: a.height,
                width: a.width,
                margin: 0,
                left: 0,
                top: 0
            }).addClass("ui-resizable-ghost").addClass(typeof e.ghost == "string" ? e.ghost : "");
            g.ghost.appendTo(g.helper)
        },
        resize: function() {
            var g = b(this).data("resizable");
            g.ghost && g.ghost.css({
                position: "relative",
                height: g.size.height,
                width: g.size.width
            })
        },
        stop: function() {
            var g = b(this).data("resizable");
            g.ghost && g.helper && g.helper.get(0).removeChild(g.ghost.get(0))
        }
    });
    b.ui.plugin.add("resizable", "grid", {
        resize: function() {
            var g = b(this).data("resizable"),
                e = g.options,
                a = g.size,
                d = g.originalSize,
                h = g.originalPosition,
                i = g.axis;
            e.grid = typeof e.grid == "number" ? [e.grid, e.grid] : e.grid;
            var j = Math.round((a.width - d.width) / (e.grid[0] || 1)) * (e.grid[0] || 1);
            e = Math.round((a.height - d.height) / (e.grid[1] || 1)) * (e.grid[1] || 1);
            if (/^(se|s|e)$/.test(i)) {
                g.size.width = d.width + j;
                g.size.height = d.height + e
            } else if (/^(ne)$/.test(i)) {
                g.size.width = d.width + j;
                g.size.height = d.height + e;
                g.position.top = h.top - e
            } else {
                if (/^(sw)$/.test(i)) {
                    g.size.width = d.width + j;
                    g.size.height = d.height + e
                } else {
                    g.size.width = d.width + j;
                    g.size.height = d.height + e;
                    g.position.top = h.top - e
                }
                g.position.left = h.left - j
            }
        }
    });
    var c = function(g) {
        return parseInt(g, 10) || 0
    }, f = function(g) {
            return !isNaN(parseInt(g, 10))
        }
})(jQuery);
(function(b) {
    b.widget("ui.selectable", b.ui.mouse, {
        options: {
            appendTo: "body",
            autoRefresh: true,
            distance: 0,
            filter: "*",
            tolerance: "touch"
        },
        _create: function() {
            var c = this;
            this.element.addClass("ui-selectable");
            this.dragged = false;
            var f;
            this.refresh = function() {
                f = b(c.options.filter, c.element[0]);
                f.each(function() {
                    var g = b(this),
                        e = g.offset();
                    b.data(this, "selectable-item", {
                        element: this,
                        $element: g,
                        left: e.left,
                        top: e.top,
                        right: e.left + g.outerWidth(),
                        bottom: e.top + g.outerHeight(),
                        startselected: false,
                        selected: g.hasClass("ui-selected"),
                        selecting: g.hasClass("ui-selecting"),
                        unselecting: g.hasClass("ui-unselecting")
                    })
                })
            };
            this.refresh();
            this.selectees = f.addClass("ui-selectee");
            this._mouseInit();
            this.helper = b("<div class='ui-selectable-helper'></div>")
        },
        destroy: function() {
            this.selectees.removeClass("ui-selectee").removeData("selectable-item");
            this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable");
            this._mouseDestroy();
            return this
        },
        _mouseStart: function(c) {
            var f = this;
            this.opos = [c.pageX, c.pageY];
            if (!this.options.disabled) {
                var g = this.options;
                this.selectees = b(g.filter, this.element[0]);
                this._trigger("start", c);
                b(g.appendTo).append(this.helper);
                this.helper.css({
                    left: c.clientX,
                    top: c.clientY,
                    width: 0,
                    height: 0
                });
                g.autoRefresh && this.refresh();
                this.selectees.filter(".ui-selected").each(function() {
                    var e = b.data(this, "selectable-item");
                    e.startselected = true;
                    if (!c.metaKey) {
                        e.$element.removeClass("ui-selected");
                        e.selected = false;
                        e.$element.addClass("ui-unselecting");
                        e.unselecting = true;
                        f._trigger("unselecting", c, {
                            unselecting: e.element
                        })
                    }
                });
                b(c.target).parents().andSelf().each(function() {
                    var e = b.data(this, "selectable-item");
                    if (e) {
                        var a = !c.metaKey || !e.$element.hasClass("ui-selected");
                        e.$element.removeClass(a ? "ui-unselecting" : "ui-selected").addClass(a ? "ui-selecting" : "ui-unselecting");
                        e.unselecting = !a;
                        e.selecting = a;
                        (e.selected = a) ? f._trigger("selecting", c, {
                            selecting: e.element
                        }) : f._trigger("unselecting", c, {
                            unselecting: e.element
                        });
                        return false
                    }
                })
            }
        },
        _mouseDrag: function(c) {
            var f = this;
            this.dragged = true;
            if (!this.options.disabled) {
                var g = this.options,
                    e = this.opos[0],
                    a = this.opos[1],
                    d = c.pageX,
                    h = c.pageY;
                if (e > d) {
                    var i = d;
                    d = e;
                    e = i
                }
                if (a > h) {
                    i = h;
                    h = a;
                    a = i
                }
                this.helper.css({
                    left: e,
                    top: a,
                    width: d - e,
                    height: h - a
                });
                this.selectees.each(function() {
                    var j = b.data(this, "selectable-item");
                    if (!(!j || j.element == f.element[0])) {
                        var n = false;
                        if (g.tolerance == "touch") n = !(j.left > d || j.right < e || j.top > h || j.bottom < a);
                        else if (g.tolerance == "fit") n = j.left > e && j.right < d && j.top > a && j.bottom < h;
                        if (n) {
                            if (j.selected) {
                                j.$element.removeClass("ui-selected");
                                j.selected = false
                            }
                            if (j.unselecting) {
                                j.$element.removeClass("ui-unselecting");
                                j.unselecting = false
                            }
                            if (!j.selecting) {
                                j.$element.addClass("ui-selecting");
                                j.selecting = true;
                                f._trigger("selecting", c, {
                                    selecting: j.element
                                })
                            }
                        } else {
                            if (j.selecting)
                                if (c.metaKey && j.startselected) {
                                    j.$element.removeClass("ui-selecting");
                                    j.selecting = false;
                                    j.$element.addClass("ui-selected");
                                    j.selected = true
                                } else {
                                    j.$element.removeClass("ui-selecting");
                                    j.selecting = false;
                                    if (j.startselected) {
                                        j.$element.addClass("ui-unselecting");
                                        j.unselecting = true
                                    }
                                    f._trigger("unselecting", c, {
                                        unselecting: j.element
                                    })
                                }
                            if (j.selected)
                                if (!c.metaKey && !j.startselected) {
                                    j.$element.removeClass("ui-selected");
                                    j.selected = false;
                                    j.$element.addClass("ui-unselecting");
                                    j.unselecting = true;
                                    f._trigger("unselecting", c, {
                                        unselecting: j.element
                                    })
                                }
                        }
                    }
                });
                return false
            }
        },
        _mouseStop: function(c) {
            var f = this;
            this.dragged = false;
            b(".ui-unselecting", this.element[0]).each(function() {
                var g = b.data(this, "selectable-item");
                g.$element.removeClass("ui-unselecting");
                g.unselecting = false;
                g.startselected = false;
                f._trigger("unselected", c, {
                    unselected: g.element
                })
            });
            b(".ui-selecting", this.element[0]).each(function() {
                var g = b.data(this, "selectable-item");
                g.$element.removeClass("ui-selecting").addClass("ui-selected");
                g.selecting = false;
                g.selected = true;
                g.startselected = true;
                f._trigger("selected", c, {
                    selected: g.element
                })
            });
            this._trigger("stop", c);
            this.helper.remove();
            return false
        }
    });
    b.extend(b.ui.selectable, {
        version: "1.8.6"
    })
})(jQuery);
(function(b) {
    b.widget("ui.sortable", b.ui.mouse, {
        widgetEventPrefix: "sort",
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1E3
        },
        _create: function() {
            this.containerCache = {};
            this.element.addClass("ui-sortable");
            this.refresh();
            this.floating = this.items.length ? /left|right/.test(this.items[0].item.css("float")) : false;
            this.offset = this.element.offset();
            this._mouseInit()
        },
        destroy: function() {
            this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable");
            this._mouseDestroy();
            for (var c = this.items.length - 1; c >= 0; c--) this.items[c].item.removeData("sortable-item");
            return this
        },
        _setOption: function(c, f) {
            if (c === "disabled") {
                this.options[c] = f;
                this.widget()[f ? "addClass" : "removeClass"]("ui-sortable-disabled")
            } else b.Widget.prototype._setOption.apply(this, arguments)
        },
        _mouseCapture: function(c, f) {
            if (this.reverting) return false;
            if (this.options.disabled || this.options.type == "static") return false;
            this._refreshItems(c);
            var g = null,
                e = this;
            b(c.target).parents().each(function() {
                if (b.data(this, "sortable-item") == e) {
                    g = b(this);
                    return false
                }
            });
            if (b.data(c.target, "sortable-item") == e) g = b(c.target);
            if (!g) return false;
            if (this.options.handle && !f) {
                var a = false;
                b(this.options.handle, g).find("*").andSelf().each(function() {
                    if (this == c.target) a = true
                });
                if (!a) return false
            }
            this.currentItem = g;
            this._removeCurrentsFromItems();
            return true
        },
        _mouseStart: function(c, f, g) {
            f = this.options;
            var e = this;
            this.currentContainer = this;
            this.refreshPositions();
            this.helper = this._createHelper(c);
            this._cacheHelperProportions();
            this._cacheMargins();
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.currentItem.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");
            b.extend(this.offset, {
                click: {
                    left: c.pageX - this.offset.left,
                    top: c.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this._generatePosition(c);
            this.originalPageX = c.pageX;
            this.originalPageY = c.pageY;
            f.cursorAt && this._adjustOffsetFromHelper(f.cursorAt);
            this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            };
            this.helper[0] != this.currentItem[0] && this.currentItem.hide();
            this._createPlaceholder();
            f.containment && this._setContainment();
            if (f.cursor) {
                if (b("body").css("cursor")) this._storedCursor = b("body").css("cursor");
                b("body").css("cursor", f.cursor)
            }
            if (f.opacity) {
                if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
                this.helper.css("opacity", f.opacity)
            }
            if (f.zIndex) {
                if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
                this.helper.css("zIndex", f.zIndex)
            }
            if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") this.overflowOffset = this.scrollParent.offset();
            this._trigger("start", c, this._uiHash());
            this._preserveHelperProportions || this._cacheHelperProportions();
            if (!g)
                for (g = this.containers.length - 1; g >= 0; g--) this.containers[g]._trigger("activate", c, e._uiHash(this));
            if (b.ui.ddmanager) b.ui.ddmanager.current = this;
            b.ui.ddmanager && !f.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, c);
            this.dragging = true;
            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(c);
            return true
        },
        _mouseDrag: function(c) {
            this.position = this._generatePosition(c);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.lastPositionAbs) this.lastPositionAbs = this.positionAbs;
            if (this.options.scroll) {
                var f = this.options,
                    g = false;
                if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
                    if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - c.pageY < f.scrollSensitivity) this.scrollParent[0].scrollTop = g = this.scrollParent[0].scrollTop + f.scrollSpeed;
                    else if (c.pageY - this.overflowOffset.top < f.scrollSensitivity) this.scrollParent[0].scrollTop = g = this.scrollParent[0].scrollTop - f.scrollSpeed;
                    if (this.overflowOffset.left +
                        this.scrollParent[0].offsetWidth - c.pageX < f.scrollSensitivity) this.scrollParent[0].scrollLeft = g = this.scrollParent[0].scrollLeft + f.scrollSpeed;
                    else if (c.pageX - this.overflowOffset.left < f.scrollSensitivity) this.scrollParent[0].scrollLeft = g = this.scrollParent[0].scrollLeft - f.scrollSpeed
                } else {
                    if (c.pageY - b(document).scrollTop() < f.scrollSensitivity) g = b(document).scrollTop(b(document).scrollTop() - f.scrollSpeed);
                    else if (b(window).height() - (c.pageY - b(document).scrollTop()) < f.scrollSensitivity) g = b(document).scrollTop(b(document).scrollTop() +
                        f.scrollSpeed);
                    if (c.pageX - b(document).scrollLeft() < f.scrollSensitivity) g = b(document).scrollLeft(b(document).scrollLeft() - f.scrollSpeed);
                    else if (b(window).width() - (c.pageX - b(document).scrollLeft()) < f.scrollSensitivity) g = b(document).scrollLeft(b(document).scrollLeft() + f.scrollSpeed)
                }
                g !== false && b.ui.ddmanager && !f.dropBehaviour && b.ui.ddmanager.prepareOffsets(this, c)
            }
            this.positionAbs = this._convertPositionTo("absolute");
            if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px";
            for (f = this.items.length - 1; f >= 0; f--) {
                g = this.items[f];
                var e = g.item[0],
                    a = this._intersectsWithPointer(g);
                if (a)
                    if (e != this.currentItem[0] && this.placeholder[a == 1 ? "next" : "prev"]()[0] != e && !b.ui.contains(this.placeholder[0], e) && (this.options.type == "semi-dynamic" ? !b.ui.contains(this.element[0], e) : true)) {
                        this.direction = a == 1 ? "down" : "up";
                        if (this.options.tolerance == "pointer" || this._intersectsWithSides(g)) this._rearrange(c, g);
                        else break;
                        this._trigger("change", c, this._uiHash());
                        break
                    }
            }
            this._contactContainers(c);
            b.ui.ddmanager && b.ui.ddmanager.drag(this, c);
            this._trigger("sort", c, this._uiHash());
            this.lastPositionAbs = this.positionAbs;
            return false
        },
        _mouseStop: function(c, f) {
            if (c) {
                b.ui.ddmanager && !this.options.dropBehaviour && b.ui.ddmanager.drop(this, c);
                if (this.options.revert) {
                    var g = this;
                    f = g.placeholder.offset();
                    g.reverting = true;
                    b(this.helper).animate({
                        left: f.left - this.offset.parent.left - g.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
                        top: f.top - this.offset.parent.top - g.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
                    }, parseInt(this.options.revert, 10) || 500, function() {
                        g._clear(c)
                    })
                } else this._clear(c, f);
                return false
            }
        },
        cancel: function() {
            var c = this;
            if (this.dragging) {
                this._mouseUp();
                this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var f = this.containers.length - 1; f >= 0; f--) {
                    this.containers[f]._trigger("deactivate", null, c._uiHash(this));
                    if (this.containers[f].containerCache.over) {
                        this.containers[f]._trigger("out", null, c._uiHash(this));
                        this.containers[f].containerCache.over = 0
                    }
                }
            }
            this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove();
            b.extend(this, {
                helper: null,
                dragging: false,
                reverting: false,
                _noFinalSort: null
            });
            this.domPosition.prev ? b(this.domPosition.prev).after(this.currentItem) : b(this.domPosition.parent).prepend(this.currentItem);
            return this
        },
        serialize: function(c) {
            var f = this._getItemsAsjQuery(c && c.connected),
                g = [];
            c = c || {};
            b(f).each(function() {
                var e = (b(c.item || this).attr(c.attribute || "id") || "").match(c.expression || /(.+)[-=_](.+)/);
                if (e) g.push((c.key || e[1] + "[]") + "=" + (c.key && c.expression ? e[1] : e[2]))
            });
            !g.length && c.key && g.push(c.key + "=");
            return g.join("&")
        },
        toArray: function(c) {
            var f = this._getItemsAsjQuery(c && c.connected),
                g = [];
            c = c || {};
            f.each(function() {
                g.push(b(c.item || this).attr(c.attribute || "id") || "")
            });
            return g
        },
        _intersectsWith: function(c) {
            var f = this.positionAbs.left,
                g = f + this.helperProportions.width,
                e = this.positionAbs.top,
                a = e + this.helperProportions.height,
                d = c.left,
                h = d + c.width,
                i = c.top,
                j = i + c.height,
                n = this.offset.click.top,
                q = this.offset.click.left;
            n = e + n > i && e + n < j && f + q > d && f + q < h;
            return this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > c[this.floating ? "width" : "height"] ? n : d < f +
                this.helperProportions.width / 2 && g - this.helperProportions.width / 2 < h && i < e + this.helperProportions.height / 2 && a - this.helperProportions.height / 2 < j
        },
        _intersectsWithPointer: function(c) {
            var f = b.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, c.top, c.height);
            c = b.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, c.left, c.width);
            f = f && c;
            c = this._getDragVerticalDirection();
            var g = this._getDragHorizontalDirection();
            if (!f) return false;
            return this.floating ? g && g == "right" || c == "down" ? 2 : 1 : c && (c == "down" ? 2 : 1)
        },
        _intersectsWithSides: function(c) {
            var f = b.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, c.top + c.height / 2, c.height);
            c = b.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, c.left + c.width / 2, c.width);
            var g = this._getDragVerticalDirection(),
                e = this._getDragHorizontalDirection();
            return this.floating && e ? e == "right" && c || e == "left" && !c : g && (g == "down" && f || g == "up" && !f)
        },
        _getDragVerticalDirection: function() {
            var c = this.positionAbs.top - this.lastPositionAbs.top;
            return c != 0 && (c > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function() {
            var c = this.positionAbs.left - this.lastPositionAbs.left;
            return c != 0 && (c > 0 ? "right" : "left")
        },
        refresh: function(c) {
            this._refreshItems(c);
            this.refreshPositions();
            return this
        },
        _connectWith: function() {
            var c = this.options;
            return c.connectWith.constructor == String ? [c.connectWith] : c.connectWith
        },
        _getItemsAsjQuery: function(c) {
            var f = [],
                g = [],
                e = this._connectWith();
            if (e && c)
                for (c = e.length - 1; c >= 0; c--)
                    for (var a = b(e[c]), d = a.length - 1; d >= 0; d--) {
                        var h = b.data(a[d], "sortable");
                        if (h && h != this && !h.options.disabled) g.push([b.isFunction(h.options.items) ? h.options.items.call(h.element) : b(h.options.items, h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), h])
                    }
            g.push([b.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : b(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
            for (c = g.length - 1; c >= 0; c--) g[c][0].each(function() {
                f.push(this)
            });
            return b(f)
        },
        _removeCurrentsFromItems: function() {
            for (var c = this.currentItem.find(":data(sortable-item)"), f = 0; f < this.items.length; f++)
                for (var g = 0; g < c.length; g++) c[g] == this.items[f].item[0] && this.items.splice(f, 1)
        },
        _refreshItems: function(c) {
            this.items = [];
            this.containers = [this];
            var f = this.items,
                g = [
                    [b.isFunction(this.options.items) ? this.options.items.call(this.element[0], c, {
                        item: this.currentItem
                    }) : b(this.options.items, this.element), this]
                ],
                e = this._connectWith();
            if (e)
                for (var a = e.length - 1; a >= 0; a--)
                    for (var d = b(e[a]), h = d.length - 1; h >= 0; h--) {
                        var i = b.data(d[h], "sortable");
                        if (i && i != this && !i.options.disabled) {
                            g.push([b.isFunction(i.options.items) ? i.options.items.call(i.element[0], c, {
                                item: this.currentItem
                            }) : b(i.options.items, i.element), i]);
                            this.containers.push(i)
                        }
                    }
            for (a = g.length - 1; a >= 0; a--) {
                c = g[a][1];
                e = g[a][0];
                h = 0;
                for (d = e.length; h < d; h++) {
                    i = b(e[h]);
                    i.data("sortable-item", c);
                    f.push({
                        item: i,
                        instance: c,
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    })
                }
            }
        },
        refreshPositions: function(c) {
            if (this.offsetParent && this.helper) this.offset.parent = this._getParentOffset();
            for (var f = this.items.length - 1; f >= 0; f--) {
                var g = this.items[f],
                    e = this.options.toleranceElement ? b(this.options.toleranceElement, g.item) : g.item;
                if (!c) {
                    g.width = e.outerWidth();
                    g.height = e.outerHeight()
                }
                e = e.offset();
                g.left = e.left;
                g.top = e.top
            }
            if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this);
            else
                for (f = this.containers.length - 1; f >= 0; f--) {
                    e = this.containers[f].element.offset();
                    this.containers[f].containerCache.left = e.left;
                    this.containers[f].containerCache.top = e.top;
                    this.containers[f].containerCache.width = this.containers[f].element.outerWidth();
                    this.containers[f].containerCache.height = this.containers[f].element.outerHeight()
                }
            return this
        },
        _createPlaceholder: function(c) {
            var f = c || this,
                g = f.options;
            if (!g.placeholder || g.placeholder.constructor == String) {
                var e = g.placeholder;
                g.placeholder = {
                    element: function() {
                        var a = b(document.createElement(f.currentItem[0].nodeName)).addClass(e || f.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                        if (!e) a.style.visibility = "hidden";
                        return a
                    },
                    update: function(a, d) {
                        if (!(e && !g.forcePlaceholderSize)) {
                            d.height() || d.height(f.currentItem.innerHeight() - parseInt(f.currentItem.css("paddingTop") || 0, 10) - parseInt(f.currentItem.css("paddingBottom") || 0, 10));
                            d.width() || d.width(f.currentItem.innerWidth() - parseInt(f.currentItem.css("paddingLeft") || 0, 10) - parseInt(f.currentItem.css("paddingRight") || 0, 10))
                        }
                    }
                }
            }
            f.placeholder = b(g.placeholder.element.call(f.element, f.currentItem));
            f.currentItem.after(f.placeholder);
            g.placeholder.update(f, f.placeholder)
        },
        _contactContainers: function(c) {
            for (var f = null, g = null, e = this.containers.length - 1; e >= 0; e--)
                if (!b.ui.contains(this.currentItem[0], this.containers[e].element[0]))
                    if (this._intersectsWith(this.containers[e].containerCache)) {
                        if (!(f && b.ui.contains(this.containers[e].element[0], f.element[0]))) {
                            f = this.containers[e];
                            g = e
                        }
                    } else
            if (this.containers[e].containerCache.over) {
                this.containers[e]._trigger("out", c, this._uiHash(this));
                this.containers[e].containerCache.over = 0
            }
            if (f)
                if (this.containers.length === 1) {
                    this.containers[g]._trigger("over", c, this._uiHash(this));
                    this.containers[g].containerCache.over = 1
                } else
            if (this.currentContainer != this.containers[g]) {
                f = 1E4;
                e = null;
                for (var a = this.positionAbs[this.containers[g].floating ? "left" : "top"], d = this.items.length - 1; d >= 0; d--)
                    if (b.ui.contains(this.containers[g].element[0], this.items[d].item[0])) {
                        var h = this.items[d][this.containers[g].floating ? "left" : "top"];
                        if (Math.abs(h - a) < f) {
                            f = Math.abs(h - a);
                            e = this.items[d]
                        }
                    }
                if (e || this.options.dropOnEmpty) {
                    this.currentContainer = this.containers[g];
                    e ? this._rearrange(c, e, null, true) : this._rearrange(c, null, this.containers[g].element, true);
                    this._trigger("change", c, this._uiHash());
                    this.containers[g]._trigger("change", c, this._uiHash(this));
                    this.options.placeholder.update(this.currentContainer, this.placeholder);
                    this.containers[g]._trigger("over", c, this._uiHash(this));
                    this.containers[g].containerCache.over = 1
                }
            }
        },
        _createHelper: function(c) {
            var f = this.options;
            c = b.isFunction(f.helper) ? b(f.helper.apply(this.element[0], [c, this.currentItem])) : f.helper == "clone" ? this.currentItem.clone() : this.currentItem;
            c.parents("body").length || b(f.appendTo != "parent" ? f.appendTo : this.currentItem[0].parentNode)[0].appendChild(c[0]);
            if (c[0] == this.currentItem[0]) this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            };
            if (c[0].style.width == "" || f.forceHelperSize) c.width(this.currentItem.width());
            if (c[0].style.height == "" || f.forceHelperSize) c.height(this.currentItem.height());
            return c
        },
        _adjustOffsetFromHelper: function(c) {
            if (typeof c == "string") c = c.split(" ");
            if (b.isArray(c)) c = {
                left: +c[0],
                top: +c[1] || 0
            };
            if ("left" in c) this.offset.click.left = c.left + this.margins.left;
            if ("right" in c) this.offset.click.left = this.helperProportions.width - c.right + this.margins.left;
            if ("top" in c) this.offset.click.top = c.top + this.margins.top;
            if ("bottom" in c) this.offset.click.top = this.helperProportions.height - c.bottom + this.margins.top
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var c = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && b.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                c.left += this.scrollParent.scrollLeft();
                c.top += this.scrollParent.scrollTop()
            }
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && b.browser.msie) c = {
                top: 0,
                left: 0
            };
            return {
                top: c.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: c.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var c = this.currentItem.position();
                return {
                    top: c.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: c.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var c = this.options;
            if (c.containment == "parent") c.containment = this.helper[0].parentNode;
            if (c.containment == "document" || c.containment == "window") this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, b(c.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (b(c.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height -
                this.margins.top
            ];
            if (!/^(document|window|parent)$/.test(c.containment)) {
                var f = b(c.containment)[0];
                c = b(c.containment).offset();
                var g = b(f).css("overflow") != "hidden";
                this.containment = [c.left + (parseInt(b(f).css("borderLeftWidth"), 10) || 0) + (parseInt(b(f).css("paddingLeft"), 10) || 0) - this.margins.left, c.top + (parseInt(b(f).css("borderTopWidth"), 10) || 0) + (parseInt(b(f).css("paddingTop"), 10) || 0) - this.margins.top, c.left + (g ? Math.max(f.scrollWidth, f.offsetWidth) : f.offsetWidth) - (parseInt(b(f).css("borderLeftWidth"), 10) || 0) - (parseInt(b(f).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, c.top + (g ? Math.max(f.scrollHeight, f.offsetHeight) : f.offsetHeight) - (parseInt(b(f).css("borderTopWidth"), 10) || 0) - (parseInt(b(f).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            }
        },
        _convertPositionTo: function(c, f) {
            if (!f) f = this.position;
            c = c == "absolute" ? 1 : -1;
            var g = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && b.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                e = /(html|body)/i.test(g[0].tagName);
            return {
                top: f.top + this.offset.relative.top * c + this.offset.parent.top * c - (b.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : g.scrollTop()) * c),
                left: f.left + this.offset.relative.left * c + this.offset.parent.left * c - (b.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : g.scrollLeft()) * c)
            }
        },
        _generatePosition: function(c) {
            var f = this.options,
                g = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && b.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                e = /(html|body)/i.test(g[0].tagName);
            if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) this.offset.relative = this._getRelativeOffset();
            var a = c.pageX,
                d = c.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (c.pageX - this.offset.click.left < this.containment[0]) a = this.containment[0] +
                        this.offset.click.left;
                    if (c.pageY - this.offset.click.top < this.containment[1]) d = this.containment[1] + this.offset.click.top;
                    if (c.pageX - this.offset.click.left > this.containment[2]) a = this.containment[2] + this.offset.click.left;
                    if (c.pageY - this.offset.click.top > this.containment[3]) d = this.containment[3] + this.offset.click.top
                }
                if (f.grid) {
                    d = this.originalPageY + Math.round((d - this.originalPageY) / f.grid[1]) * f.grid[1];
                    d = this.containment ? !(d - this.offset.click.top < this.containment[1] || d - this.offset.click.top > this.containment[3]) ? d : !(d - this.offset.click.top < this.containment[1]) ? d - f.grid[1] : d + f.grid[1] : d;
                    a = this.originalPageX + Math.round((a - this.originalPageX) / f.grid[0]) * f.grid[0];
                    a = this.containment ? !(a - this.offset.click.left < this.containment[0] || a - this.offset.click.left > this.containment[2]) ? a : !(a - this.offset.click.left < this.containment[0]) ? a - f.grid[0] : a + f.grid[0] : a
                }
            }
            return {
                top: d - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (b.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : g.scrollTop()),
                left: a - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (b.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : g.scrollLeft())
            }
        },
        _rearrange: function(c, f, g, e) {
            g ? g[0].appendChild(this.placeholder[0]) : f.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == "down" ? f.item[0] : f.item[0].nextSibling);
            this.counter = this.counter ? ++this.counter : 1;
            var a = this,
                d = this.counter;
            window.setTimeout(function() {
                d == a.counter && a.refreshPositions(!e)
            }, 0)
        },
        _clear: function(c, f) {
            this.reverting = false;
            var g = [];
            !this._noFinalSort && this.currentItem[0].parentNode && this.placeholder.before(this.currentItem);
            this._noFinalSort = null;
            if (this.helper[0] == this.currentItem[0]) {
                for (var e in this._storedCSS)
                    if (this._storedCSS[e] == "auto" || this._storedCSS[e] == "static") this._storedCSS[e] = "";
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            this.fromOutside && !f && g.push(function(a) {
                this._trigger("receive", a, this._uiHash(this.fromOutside))
            });
            if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !f) g.push(function(a) {
                this._trigger("update", a, this._uiHash())
            });
            if (!b.ui.contains(this.element[0], this.currentItem[0])) {
                f || g.push(function(a) {
                    this._trigger("remove", a, this._uiHash())
                });
                for (e = this.containers.length - 1; e >= 0; e--)
                    if (b.ui.contains(this.containers[e].element[0], this.currentItem[0]) && !f) {
                        g.push(function(a) {
                            return function(d) {
                                a._trigger("receive", d, this._uiHash(this))
                            }
                        }.call(this, this.containers[e]));
                        g.push(function(a) {
                            return function(d) {
                                a._trigger("update", d, this._uiHash(this))
                            }
                        }.call(this, this.containers[e]))
                    }
            }
            for (e = this.containers.length - 1; e >= 0; e--) {
                f || g.push(function(a) {
                    return function(d) {
                        a._trigger("deactivate", d, this._uiHash(this))
                    }
                }.call(this, this.containers[e]));
                if (this.containers[e].containerCache.over) {
                    g.push(function(a) {
                        return function(d) {
                            a._trigger("out", d, this._uiHash(this))
                        }
                    }.call(this, this.containers[e]));
                    this.containers[e].containerCache.over = 0
                }
            }
            this._storedCursor && b("body").css("cursor", this._storedCursor);
            this._storedOpacity && this.helper.css("opacity", this._storedOpacity);
            if (this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex);
            this.dragging = false;
            if (this.cancelHelperRemoval) {
                if (!f) {
                    this._trigger("beforeStop", c, this._uiHash());
                    for (e = 0; e < g.length; e++) g[e].call(this, c);
                    this._trigger("stop", c, this._uiHash())
                }
                return false
            }
            f || this._trigger("beforeStop", c, this._uiHash());
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
            this.helper[0] != this.currentItem[0] && this.helper.remove();
            this.helper = null;
            if (!f) {
                for (e = 0; e < g.length; e++) g[e].call(this, c);
                this._trigger("stop", c, this._uiHash())
            }
            this.fromOutside = false;
            return true
        },
        _trigger: function() {
            b.Widget.prototype._trigger.apply(this, arguments) === false && this.cancel()
        },
        _uiHash: function(c) {
            var f = c || this;
            return {
                helper: f.helper,
                placeholder: f.placeholder || b([]),
                position: f.position,
                originalPosition: f.originalPosition,
                offset: f.positionAbs,
                item: f.currentItem,
                sender: c ? c.element : null
            }
        }
    });
    b.extend(b.ui.sortable, {
        version: "1.8.6"
    })
})(jQuery);
jQuery.effects || function(b, c) {
    function f(l) {
        var k;
        if (l && l.constructor == Array && l.length == 3) return l;
        if (k = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(l)) return [parseInt(k[1], 10), parseInt(k[2], 10), parseInt(k[3], 10)];
        if (k = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(l)) return [parseFloat(k[1]) * 2.55, parseFloat(k[2]) * 2.55, parseFloat(k[3]) * 2.55];
        if (k = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(l)) return [parseInt(k[1], 16), parseInt(k[2], 16), parseInt(k[3], 16)];
        if (k = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(l)) return [parseInt(k[1] + k[1], 16), parseInt(k[2] + k[2], 16), parseInt(k[3] + k[3], 16)];
        if (/rgba\(0, 0, 0, 0\)/.exec(l)) return j.transparent;
        return j[b.trim(l).toLowerCase()]
    }

    function g(l, k) {
        var m;
        do {
            m = b.curCSS(l, k);
            if (m != "" && m != "transparent" || b.nodeName(l, "body")) break;
            k = "backgroundColor"
        } while (l = l.parentNode);
        return f(m)
    }

    function e() {
        var l = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
            k = {}, m, o;
        if (l && l.length && l[0] && l[l[0]])
            for (var p = l.length; p--;) {
                m = l[p];
                if (typeof l[m] == "string") {
                    o = m.replace(/\-(\w)/g, function(s, r) {
                        return r.toUpperCase()
                    });
                    k[o] = l[m]
                }
            } else
                for (m in l)
                    if (typeof l[m] === "string") k[m] = l[m];
        return k
    }

    function a(l) {
        var k, m;
        for (k in l) {
            m = l[k];
            if (m == null || b.isFunction(m) || k in q || /scrollbar/.test(k) || !/color/i.test(k) && isNaN(parseFloat(m))) delete l[k]
        }
        return l
    }

    function d(l, k) {
        var m = {
            _: 0
        }, o;
        for (o in k)
            if (l[o] != k[o]) m[o] = k[o];
        return m
    }

    function h(l, k, m, o) {
        if (typeof l == "object") {
            o = k;
            m = null;
            k = l;
            l = k.effect
        }
        if (b.isFunction(k)) {
            o = k;
            m = null;
            k = {}
        }
        if (typeof k == "number" || b.fx.speeds[k]) {
            o = m;
            m = k;
            k = {}
        }
        if (b.isFunction(m)) {
            o = m;
            m = null
        }
        k = k || {};
        m = m || k.duration;
        m = b.fx.off ? 0 : typeof m == "number" ? m : b.fx.speeds[m] || b.fx.speeds._default;
        o = o || k.complete;
        return [l, k, m, o]
    }

    function i(l) {
        if (!l || typeof l === "number" || b.fx.speeds[l]) return true;
        if (typeof l === "string" && !b.effects[l]) return true;
        return false
    }
    b.effects = {};
    b.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function(l, k) {
        b.fx.step[k] = function(m) {
            if (!m.colorInit) {
                m.start = g(m.elem, k);
                m.end = f(m.end);
                m.colorInit = true
            }
            m.elem.style[k] = "rgb(" + Math.max(Math.min(parseInt(m.pos * (m.end[0] - m.start[0]) + m.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(m.pos * (m.end[1] - m.start[1]) + m.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(m.pos * (m.end[2] - m.start[2]) + m.start[2], 10), 255), 0) + ")"
        }
    });
    var j = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    }, n = ["add", "remove", "toggle"],
        q = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
    b.effects.animateClass = function(l, k, m, o) {
        if (b.isFunction(m)) {
            o = m;
            m = null
        }
        return this.each(function() {
            var p = b(this),
                s = p.attr("style") || " ",
                r = a(e.call(this)),
                u, v = p.attr("className");
            b.each(n, function(w, y) {
                l[y] && p[y + "Class"](l[y])
            });
            u = a(e.call(this));
            p.attr("className", v);
            p.animate(d(r, u), k, m, function() {
                b.each(n, function(w, y) {
                    l[y] && p[y + "Class"](l[y])
                });
                if (typeof p.attr("style") == "object") {
                    p.attr("style").cssText = "";
                    p.attr("style").cssText = s
                } else p.attr("style", s);
                o && o.apply(this, arguments)
            })
        })
    };
    b.fn.extend({
        _addClass: b.fn.addClass,
        addClass: function(l, k, m, o) {
            return k ? b.effects.animateClass.apply(this, [{
                    add: l
                },
                k, m, o
            ]) : this._addClass(l)
        },
        _removeClass: b.fn.removeClass,
        removeClass: function(l, k, m, o) {
            return k ? b.effects.animateClass.apply(this, [{
                    remove: l
                },
                k, m, o
            ]) : this._removeClass(l)
        },
        _toggleClass: b.fn.toggleClass,
        toggleClass: function(l, k, m, o, p) {
            return typeof k == "boolean" || k === c ? m ? b.effects.animateClass.apply(this, [k ? {
                    add: l
                } : {
                    remove: l
                },
                m, o, p
            ]) : this._toggleClass(l, k) : b.effects.animateClass.apply(this, [{
                    toggle: l
                },
                k, m, o
            ])
        },
        switchClass: function(l, k, m, o, p) {
            return b.effects.animateClass.apply(this, [{
                    add: k,
                    remove: l
                },
                m, o, p
            ])
        }
    });
    b.extend(b.effects, {
        version: "1.8.6",
        save: function(l, k) {
            for (var m = 0; m < k.length; m++) k[m] !== null && l.data("ec.storage." + k[m], l[0].style[k[m]])
        },
        restore: function(l, k) {
            for (var m = 0; m < k.length; m++) k[m] !== null && l.css(k[m], l.data("ec.storage." + k[m]))
        },
        setMode: function(l, k) {
            if (k == "toggle") k = l.is(":hidden") ? "show" : "hide";
            return k
        },
        getBaseline: function(l, k) {
            var m;
            switch (l[0]) {
                case "top":
                    m = 0;
                    break;
                case "middle":
                    m = 0.5;
                    break;
                case "bottom":
                    m = 1;
                    break;
                default:
                    m = l[0] / k.height
            }
            switch (l[1]) {
                case "left":
                    l = 0;
                    break;
                case "center":
                    l = 0.5;
                    break;
                case "right":
                    l = 1;
                    break;
                default:
                    l = l[1] / k.width
            }
            return {
                x: l,
                y: m
            }
        },
        createWrapper: function(l) {
            if (l.parent().is(".ui-effects-wrapper")) return l.parent();
            var k = {
                width: l.outerWidth(true),
                height: l.outerHeight(true),
                "float": l.css("float")
            }, m = b("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                });
            l.wrap(m);
            m = l.parent();
            if (l.css("position") == "static") {
                m.css({
                    position: "relative"
                });
                l.css({
                    position: "relative"
                })
            } else {
                b.extend(k, {
                    position: l.css("position"),
                    zIndex: l.css("z-index")
                });
                b.each(["top", "left", "bottom", "right"], function(o, p) {
                    k[p] = l.css(p);
                    if (isNaN(parseInt(k[p], 10))) k[p] = "auto"
                });
                l.css({
                    position: "relative",
                    top: 0,
                    left: 0
                })
            }
            return m.css(k).show()
        },
        removeWrapper: function(l) {
            if (l.parent().is(".ui-effects-wrapper")) return l.parent().replaceWith(l);
            return l
        },
        setTransition: function(l, k, m, o) {
            o = o || {};
            b.each(k, function(p, s) {
                unit = l.cssUnit(s);
                if (unit[0] > 0) o[s] = unit[0] * m + unit[1]
            });
            return o
        }
    });
    b.fn.extend({
        effect: function(l) {
            var k = h.apply(this, arguments),
                m = {
                    options: k[1],
                    duration: k[2],
                    callback: k[3]
                };
            k = m.options.mode;
            var o = b.effects[l];
            if (b.fx.off || !o) return k ? this[k](m.duration, m.callback) : this.each(function() {
                m.callback && m.callback.call(this)
            });
            return o.call(this, m)
        },
        _show: b.fn.show,
        show: function(l) {
            if (i(l)) return this._show.apply(this, arguments);
            else {
                var k = h.apply(this, arguments);
                k[1].mode = "show";
                return this.effect.apply(this, k)
            }
        },
        _hide: b.fn.hide,
        hide: function(l) {
            if (i(l)) return this._hide.apply(this, arguments);
            else {
                var k = h.apply(this, arguments);
                k[1].mode = "hide";
                return this.effect.apply(this, k)
            }
        },
        __toggle: b.fn.toggle,
        toggle: function(l) {
            if (i(l) || typeof l === "boolean" || b.isFunction(l)) return this.__toggle.apply(this, arguments);
            else {
                var k = h.apply(this, arguments);
                k[1].mode = "toggle";
                return this.effect.apply(this, k)
            }
        },
        cssUnit: function(l) {
            var k = this.css(l),
                m = [];
            b.each(["em", "px", "%", "pt"], function(o, p) {
                if (k.indexOf(p) > 0) m = [parseFloat(k), p]
            });
            return m
        }
    });
    b.easing.jswing = b.easing.swing;
    b.extend(b.easing, {
        def: "easeOutQuad",
        swing: function(l, k, m, o, p) {
            return b.easing[b.easing.def](l, k, m, o, p)
        },
        easeInQuad: function(l, k, m, o, p) {
            return o * (k /= p) * k + m
        },
        easeOutQuad: function(l, k, m, o, p) {
            return -o * (k /= p) * (k - 2) + m
        },
        easeInOutQuad: function(l, k, m, o, p) {
            if ((k /= p / 2) < 1) return o / 2 * k * k + m;
            return -o / 2 * (--k * (k - 2) - 1) + m
        },
        easeInCubic: function(l, k, m, o, p) {
            return o * (k /= p) * k * k + m
        },
        easeOutCubic: function(l, k, m, o, p) {
            return o * ((k = k / p - 1) * k * k + 1) + m
        },
        easeInOutCubic: function(l, k, m, o, p) {
            if ((k /= p / 2) < 1) return o / 2 * k * k * k + m;
            return o / 2 * ((k -= 2) * k * k + 2) + m
        },
        easeInQuart: function(l, k, m, o, p) {
            return o * (k /= p) * k * k * k + m
        },
        easeOutQuart: function(l, k, m, o, p) {
            return -o * ((k = k / p - 1) * k * k * k - 1) + m
        },
        easeInOutQuart: function(l, k, m, o, p) {
            if ((k /= p / 2) < 1) return o / 2 * k * k * k * k + m;
            return -o / 2 * ((k -= 2) * k * k * k - 2) + m
        },
        easeInQuint: function(l, k, m, o, p) {
            return o * (k /= p) * k * k * k * k + m
        },
        easeOutQuint: function(l, k, m, o, p) {
            return o * ((k = k / p - 1) * k * k * k * k + 1) + m
        },
        easeInOutQuint: function(l, k, m, o, p) {
            if ((k /= p / 2) < 1) return o / 2 * k * k * k * k * k + m;
            return o / 2 * ((k -= 2) * k * k * k * k + 2) + m
        },
        easeInSine: function(l, k, m, o, p) {
            return -o * Math.cos(k / p * (Math.PI / 2)) + o + m
        },
        easeOutSine: function(l, k, m, o, p) {
            return o * Math.sin(k / p * (Math.PI / 2)) + m
        },
        easeInOutSine: function(l, k, m, o, p) {
            return -o / 2 * (Math.cos(Math.PI * k / p) - 1) + m
        },
        easeInExpo: function(l, k, m, o, p) {
            return k == 0 ? m : o * Math.pow(2, 10 * (k / p - 1)) + m
        },
        easeOutExpo: function(l, k, m, o, p) {
            return k == p ? m + o : o * (-Math.pow(2, -10 * k / p) + 1) + m
        },
        easeInOutExpo: function(l, k, m, o, p) {
            if (k == 0) return m;
            if (k == p) return m + o;
            if ((k /= p / 2) < 1) return o / 2 * Math.pow(2, 10 * (k - 1)) + m;
            return o / 2 * (-Math.pow(2, -10 * --k) + 2) + m
        },
        easeInCirc: function(l, k, m, o, p) {
            return -o * (Math.sqrt(1 - (k /= p) * k) - 1) + m
        },
        easeOutCirc: function(l, k, m, o, p) {
            return o * Math.sqrt(1 - (k = k / p - 1) * k) + m
        },
        easeInOutCirc: function(l, k, m, o, p) {
            if ((k /= p / 2) < 1) return -o / 2 * (Math.sqrt(1 - k * k) - 1) + m;
            return o / 2 * (Math.sqrt(1 - (k -= 2) * k) + 1) + m
        },
        easeInElastic: function(l, k, m, o, p) {
            l = 1.70158;
            var s = 0,
                r = o;
            if (k == 0) return m;
            if ((k /= p) == 1) return m + o;
            s || (s = p * 0.3);
            if (r < Math.abs(o)) {
                r = o;
                l = s / 4
            } else l = s / (2 * Math.PI) * Math.asin(o / r);
            return -(r * Math.pow(2, 10 * (k -= 1)) * Math.sin((k * p - l) * 2 * Math.PI / s)) + m
        },
        easeOutElastic: function(l, k, m, o, p) {
            l = 1.70158;
            var s = 0,
                r = o;
            if (k == 0) return m;
            if ((k /= p) == 1) return m +
                o;
            s || (s = p * 0.3);
            if (r < Math.abs(o)) {
                r = o;
                l = s / 4
            } else l = s / (2 * Math.PI) * Math.asin(o / r);
            return r * Math.pow(2, -10 * k) * Math.sin((k * p - l) * 2 * Math.PI / s) + o + m
        },
        easeInOutElastic: function(l, k, m, o, p) {
            l = 1.70158;
            var s = 0,
                r = o;
            if (k == 0) return m;
            if ((k /= p / 2) == 2) return m + o;
            s || (s = p * 0.3 * 1.5);
            if (r < Math.abs(o)) {
                r = o;
                l = s / 4
            } else l = s / (2 * Math.PI) * Math.asin(o / r); if (k < 1) return -0.5 * r * Math.pow(2, 10 * (k -= 1)) * Math.sin((k * p - l) * 2 * Math.PI / s) + m;
            return r * Math.pow(2, -10 * (k -= 1)) * Math.sin((k * p - l) * 2 * Math.PI / s) * 0.5 + o + m
        },
        easeInBack: function(l, k, m, o, p, s) {
            if (s == c) s = 1.70158;
            return o * (k /= p) * k * ((s + 1) * k - s) + m
        },
        easeOutBack: function(l, k, m, o, p, s) {
            if (s == c) s = 1.70158;
            return o * ((k = k / p - 1) * k * ((s + 1) * k + s) + 1) + m
        },
        easeInOutBack: function(l, k, m, o, p, s) {
            if (s == c) s = 1.70158;
            if ((k /= p / 2) < 1) return o / 2 * k * k * (((s *= 1.525) + 1) * k - s) + m;
            return o / 2 * ((k -= 2) * k * (((s *= 1.525) + 1) * k + s) + 2) + m
        },
        easeInBounce: function(l, k, m, o, p) {
            return o - b.easing.easeOutBounce(l, p - k, 0, o, p) + m
        },
        easeOutBounce: function(l, k, m, o, p) {
            return (k /= p) < 1 / 2.75 ? o * 7.5625 * k * k + m : k < 2 / 2.75 ? o * (7.5625 * (k -= 1.5 / 2.75) * k + 0.75) + m : k < 2.5 / 2.75 ? o * (7.5625 * (k -= 2.25 / 2.75) * k + 0.9375) + m : o * (7.5625 * (k -= 2.625 / 2.75) * k + 0.984375) + m
        },
        easeInOutBounce: function(l, k, m, o, p) {
            if (k < p / 2) return b.easing.easeInBounce(l, k * 2, 0, o, p) * 0.5 + m;
            return b.easing.easeOutBounce(l, k * 2 - p, 0, o, p) * 0.5 + o * 0.5 + m
        }
    })
}(jQuery);
(function(b) {
    b.effects.blind = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left"],
                e = b.effects.setMode(f, c.options.mode || "hide"),
                a = c.options.direction || "vertical";
            b.effects.save(f, g);
            f.show();
            var d = b.effects.createWrapper(f).css({
                overflow: "hidden"
            }),
                h = a == "vertical" ? "height" : "width";
            a = a == "vertical" ? d.height() : d.width();
            e == "show" && d.css(h, 0);
            var i = {};
            i[h] = e == "show" ? a : 0;
            d.animate(i, c.duration, c.options.easing, function() {
                e == "hide" && f.hide();
                b.effects.restore(f, g);
                b.effects.removeWrapper(f);
                c.callback && c.callback.apply(f[0], arguments);
                f.dequeue()
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.bounce = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left"],
                e = b.effects.setMode(f, c.options.mode || "effect"),
                a = c.options.direction || "up",
                d = c.options.distance || 20,
                h = c.options.times || 5,
                i = c.duration || 250;
            /show|hide/.test(e) && g.push("opacity");
            b.effects.save(f, g);
            f.show();
            b.effects.createWrapper(f);
            var j = a == "up" || a == "down" ? "top" : "left";
            a = a == "up" || a == "left" ? "pos" : "neg";
            d = c.options.distance || (j == "top" ? f.outerHeight({
                margin: true
            }) / 3 : f.outerWidth({
                margin: true
            }) / 3);
            if (e == "show") f.css("opacity", 0).css(j, a == "pos" ? -d : d);
            if (e == "hide") d /= h * 2;
            e != "hide" && h--;
            if (e == "show") {
                var n = {
                    opacity: 1
                };
                n[j] = (a == "pos" ? "+=" : "-=") + d;
                f.animate(n, i / 2, c.options.easing);
                d /= 2;
                h--
            }
            for (n = 0; n < h; n++) {
                var q = {}, l = {};
                q[j] = (a == "pos" ? "-=" : "+=") + d;
                l[j] = (a == "pos" ? "+=" : "-=") + d;
                f.animate(q, i / 2, c.options.easing).animate(l, i / 2, c.options.easing);
                d = e == "hide" ? d * 2 : d / 2
            }
            if (e == "hide") {
                n = {
                    opacity: 0
                };
                n[j] = (a == "pos" ? "-=" : "+=") + d;
                f.animate(n, i / 2, c.options.easing, function() {
                    f.hide();
                    b.effects.restore(f, g);
                    b.effects.removeWrapper(f);
                    c.callback && c.callback.apply(this, arguments)
                })
            } else {
                q = {};
                l = {};
                q[j] = (a == "pos" ? "-=" : "+=") + d;
                l[j] = (a == "pos" ? "+=" : "-=") + d;
                f.animate(q, i / 2, c.options.easing).animate(l, i / 2, c.options.easing, function() {
                    b.effects.restore(f, g);
                    b.effects.removeWrapper(f);
                    c.callback && c.callback.apply(this, arguments)
                })
            }
            f.queue("fx", function() {
                f.dequeue()
            });
            f.dequeue()
        })
    }
})(jQuery);
(function(b) {
    b.effects.clip = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left", "height", "width"],
                e = b.effects.setMode(f, c.options.mode || "hide"),
                a = c.options.direction || "vertical";
            b.effects.save(f, g);
            f.show();
            var d = b.effects.createWrapper(f).css({
                overflow: "hidden"
            });
            d = f[0].tagName == "IMG" ? d : f;
            var h = {
                size: a == "vertical" ? "height" : "width",
                position: a == "vertical" ? "top" : "left"
            };
            a = a == "vertical" ? d.height() : d.width();
            if (e == "show") {
                d.css(h.size, 0);
                d.css(h.position, a / 2)
            }
            var i = {};
            i[h.size] = e == "show" ? a : 0;
            i[h.position] = e == "show" ? 0 : a / 2;
            d.animate(i, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function() {
                    e == "hide" && f.hide();
                    b.effects.restore(f, g);
                    b.effects.removeWrapper(f);
                    c.callback && c.callback.apply(f[0], arguments);
                    f.dequeue()
                }
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.drop = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left", "opacity"],
                e = b.effects.setMode(f, c.options.mode || "hide"),
                a = c.options.direction || "left";
            b.effects.save(f, g);
            f.show();
            b.effects.createWrapper(f);
            var d = a == "up" || a == "down" ? "top" : "left";
            a = a == "up" || a == "left" ? "pos" : "neg";
            var h = c.options.distance || (d == "top" ? f.outerHeight({
                margin: true
            }) / 2 : f.outerWidth({
                margin: true
            }) / 2);
            if (e == "show") f.css("opacity", 0).css(d, a == "pos" ? -h : h);
            var i = {
                opacity: e == "show" ? 1 : 0
            };
            i[d] = (e == "show" ? a == "pos" ? "+=" : "-=" : a == "pos" ? "-=" : "+=") + h;
            f.animate(i, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function() {
                    e == "hide" && f.hide();
                    b.effects.restore(f, g);
                    b.effects.removeWrapper(f);
                    c.callback && c.callback.apply(this, arguments);
                    f.dequeue()
                }
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.explode = function(c) {
        return this.queue(function() {
            var f = c.options.pieces ? Math.round(Math.sqrt(c.options.pieces)) : 3,
                g = c.options.pieces ? Math.round(Math.sqrt(c.options.pieces)) : 3;
            c.options.mode = c.options.mode == "toggle" ? b(this).is(":visible") ? "hide" : "show" : c.options.mode;
            var e = b(this).show().css("visibility", "hidden"),
                a = e.offset();
            a.top -= parseInt(e.css("marginTop"), 10) || 0;
            a.left -= parseInt(e.css("marginLeft"), 10) || 0;
            for (var d = e.outerWidth(true), h = e.outerHeight(true), i = 0; i < f; i++)
                for (var j = 0; j < g; j++) e.clone().appendTo("body").wrap("<div></div>").css({
                    position: "absolute",
                    visibility: "visible",
                    left: -j * (d / g),
                    top: -i * (h / f)
                }).parent().addClass("ui-effects-explode").css({
                    position: "absolute",
                    overflow: "hidden",
                    width: d / g,
                    height: h / f,
                    left: a.left + j * (d / g) + (c.options.mode == "show" ? (j - Math.floor(g / 2)) * (d / g) : 0),
                    top: a.top + i * (h / f) + (c.options.mode == "show" ? (i - Math.floor(f / 2)) * (h / f) : 0),
                    opacity: c.options.mode == "show" ? 0 : 1
                }).animate({
                    left: a.left + j * (d / g) + (c.options.mode == "show" ? 0 : (j - Math.floor(g / 2)) * (d / g)),
                    top: a.top + i * (h / f) + (c.options.mode == "show" ? 0 : (i - Math.floor(f / 2)) * (h / f)),
                    opacity: c.options.mode == "show" ? 1 : 0
                }, c.duration || 500);
            setTimeout(function() {
                c.options.mode == "show" ? e.css({
                    visibility: "visible"
                }) : e.css({
                    visibility: "visible"
                }).hide();
                c.callback && c.callback.apply(e[0]);
                e.dequeue();
                b("div.ui-effects-explode").remove()
            }, c.duration || 500)
        })
    }
})(jQuery);
(function(b) {
    b.effects.fade = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = b.effects.setMode(f, c.options.mode || "hide");
            f.animate({
                opacity: g
            }, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function() {
                    c.callback && c.callback.apply(this, arguments);
                    f.dequeue()
                }
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.fold = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left"],
                e = b.effects.setMode(f, c.options.mode || "hide"),
                a = c.options.size || 15,
                d = !! c.options.horizFirst,
                h = c.duration ? c.duration / 2 : b.fx.speeds._default / 2;
            b.effects.save(f, g);
            f.show();
            var i = b.effects.createWrapper(f).css({
                overflow: "hidden"
            }),
                j = e == "show" != d,
                n = j ? ["width", "height"] : ["height", "width"];
            j = j ? [i.width(), i.height()] : [i.height(), i.width()];
            var q = /([0-9]+)%/.exec(a);
            if (q) a = parseInt(q[1], 10) / 100 * j[e == "hide" ? 0 : 1];
            if (e == "show") i.css(d ? {
                height: 0,
                width: a
            } : {
                height: a,
                width: 0
            });
            d = {};
            q = {};
            d[n[0]] = e == "show" ? j[0] : a;
            q[n[1]] = e == "show" ? j[1] : 0;
            i.animate(d, h, c.options.easing).animate(q, h, c.options.easing, function() {
                e == "hide" && f.hide();
                b.effects.restore(f, g);
                b.effects.removeWrapper(f);
                c.callback && c.callback.apply(f[0], arguments);
                f.dequeue()
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.highlight = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["backgroundImage", "backgroundColor", "opacity"],
                e = b.effects.setMode(f, c.options.mode || "show"),
                a = {
                    backgroundColor: f.css("backgroundColor")
                };
            if (e == "hide") a.opacity = 0;
            b.effects.save(f, g);
            f.show().css({
                backgroundImage: "none",
                backgroundColor: c.options.color || "#ffff99"
            }).animate(a, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function() {
                    e == "hide" && f.hide();
                    b.effects.restore(f, g);
                    e == "show" && !b.support.opacity && this.style.removeAttribute("filter");
                    c.callback && c.callback.apply(this, arguments);
                    f.dequeue()
                }
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.pulsate = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = b.effects.setMode(f, c.options.mode || "show");
            times = (c.options.times || 5) * 2 - 1;
            duration = c.duration ? c.duration / 2 : b.fx.speeds._default / 2;
            isVisible = f.is(":visible");
            animateTo = 0;
            if (!isVisible) {
                f.css("opacity", 0).show();
                animateTo = 1
            }
            if (g == "hide" && isVisible || g == "show" && !isVisible) times--;
            for (g = 0; g < times; g++) {
                f.animate({
                    opacity: animateTo
                }, duration, c.options.easing);
                animateTo = (animateTo + 1) % 2
            }
            f.animate({
                opacity: animateTo
            }, duration, c.options.easing, function() {
                animateTo == 0 && f.hide();
                c.callback && c.callback.apply(this, arguments)
            });
            f.queue("fx", function() {
                f.dequeue()
            }).dequeue()
        })
    }
})(jQuery);
(function(b) {
    b.effects.puff = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = b.effects.setMode(f, c.options.mode || "hide"),
                e = parseInt(c.options.percent, 10) || 150,
                a = e / 100,
                d = {
                    height: f.height(),
                    width: f.width()
                };
            b.extend(c.options, {
                fade: true,
                mode: g,
                percent: g == "hide" ? e : 100,
                from: g == "hide" ? d : {
                    height: d.height * a,
                    width: d.width * a
                }
            });
            f.effect("scale", c.options, c.duration, c.callback);
            f.dequeue()
        })
    };
    b.effects.scale = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = b.extend(true, {}, c.options),
                e = b.effects.setMode(f, c.options.mode || "effect"),
                a = parseInt(c.options.percent, 10) || (parseInt(c.options.percent, 10) == 0 ? 0 : e == "hide" ? 0 : 100),
                d = c.options.direction || "both",
                h = c.options.origin;
            if (e != "effect") {
                g.origin = h || ["middle", "center"];
                g.restore = true
            }
            h = {
                height: f.height(),
                width: f.width()
            };
            f.from = c.options.from || (e == "show" ? {
                height: 0,
                width: 0
            } : h);
            a = {
                y: d != "horizontal" ? a / 100 : 1,
                x: d != "vertical" ? a / 100 : 1
            };
            f.to = {
                height: h.height * a.y,
                width: h.width * a.x
            };
            if (c.options.fade) {
                if (e == "show") {
                    f.from.opacity = 0;
                    f.to.opacity = 1
                }
                if (e == "hide") {
                    f.from.opacity = 1;
                    f.to.opacity = 0
                }
            }
            g.from = f.from;
            g.to = f.to;
            g.mode = e;
            f.effect("size", g, c.duration, c.callback);
            f.dequeue()
        })
    };
    b.effects.size = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left", "width", "height", "overflow", "opacity"],
                e = ["position", "top", "left", "overflow", "opacity"],
                a = ["width", "height", "overflow"],
                d = ["fontSize"],
                h = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
                i = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
                j = b.effects.setMode(f, c.options.mode || "effect"),
                n = c.options.restore || false,
                q = c.options.scale || "both",
                l = c.options.origin,
                k = {
                    height: f.height(),
                    width: f.width()
                };
            f.from = c.options.from || k;
            f.to = c.options.to || k;
            if (l) {
                l = b.effects.getBaseline(l, k);
                f.from.top = (k.height - f.from.height) * l.y;
                f.from.left = (k.width - f.from.width) * l.x;
                f.to.top = (k.height - f.to.height) * l.y;
                f.to.left = (k.width - f.to.width) * l.x
            }
            var m = {
                from: {
                    y: f.from.height / k.height,
                    x: f.from.width / k.width
                },
                to: {
                    y: f.to.height / k.height,
                    x: f.to.width / k.width
                }
            };
            if (q == "box" || q == "both") {
                if (m.from.y != m.to.y) {
                    g = g.concat(h);
                    f.from = b.effects.setTransition(f, h, m.from.y, f.from);
                    f.to = b.effects.setTransition(f, h, m.to.y, f.to)
                }
                if (m.from.x != m.to.x) {
                    g = g.concat(i);
                    f.from = b.effects.setTransition(f, i, m.from.x, f.from);
                    f.to = b.effects.setTransition(f, i, m.to.x, f.to)
                }
            }
            if (q == "content" || q == "both")
                if (m.from.y != m.to.y) {
                    g = g.concat(d);
                    f.from = b.effects.setTransition(f, d, m.from.y, f.from);
                    f.to = b.effects.setTransition(f, d, m.to.y, f.to)
                }
            b.effects.save(f, n ? g : e);
            f.show();
            b.effects.createWrapper(f);
            f.css("overflow", "hidden").css(f.from);
            if (q == "content" || q == "both") {
                h = h.concat(["marginTop", "marginBottom"]).concat(d);
                i = i.concat(["marginLeft", "marginRight"]);
                a = g.concat(h).concat(i);
                f.find("*[width]").each(function() {
                    child = b(this);
                    n && b.effects.save(child, a);
                    var o = {
                        height: child.height(),
                        width: child.width()
                    };
                    child.from = {
                        height: o.height * m.from.y,
                        width: o.width * m.from.x
                    };
                    child.to = {
                        height: o.height * m.to.y,
                        width: o.width * m.to.x
                    };
                    if (m.from.y != m.to.y) {
                        child.from = b.effects.setTransition(child, h, m.from.y, child.from);
                        child.to = b.effects.setTransition(child, h, m.to.y, child.to)
                    }
                    if (m.from.x != m.to.x) {
                        child.from = b.effects.setTransition(child, i, m.from.x, child.from);
                        child.to = b.effects.setTransition(child, i, m.to.x, child.to)
                    }
                    child.css(child.from);
                    child.animate(child.to, c.duration, c.options.easing, function() {
                        n && b.effects.restore(child, a)
                    })
                })
            }
            f.animate(f.to, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function() {
                    f.to.opacity === 0 && f.css("opacity", f.from.opacity);
                    j == "hide" && f.hide();
                    b.effects.restore(f, n ? g : e);
                    b.effects.removeWrapper(f);
                    c.callback && c.callback.apply(this, arguments);
                    f.dequeue()
                }
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.shake = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left"];
            b.effects.setMode(f, c.options.mode || "effect");
            var e = c.options.direction || "left",
                a = c.options.distance || 20,
                d = c.options.times || 3,
                h = c.duration || c.options.duration || 140;
            b.effects.save(f, g);
            f.show();
            b.effects.createWrapper(f);
            var i = e == "up" || e == "down" ? "top" : "left",
                j = e == "up" || e == "left" ? "pos" : "neg";
            e = {};
            var n = {}, q = {};
            e[i] = (j == "pos" ? "-=" : "+=") + a;
            n[i] = (j == "pos" ? "+=" : "-=") + a * 2;
            q[i] = (j == "pos" ? "-=" : "+=") +
                a * 2;
            f.animate(e, h, c.options.easing);
            for (a = 1; a < d; a++) f.animate(n, h, c.options.easing).animate(q, h, c.options.easing);
            f.animate(n, h, c.options.easing).animate(e, h / 2, c.options.easing, function() {
                b.effects.restore(f, g);
                b.effects.removeWrapper(f);
                c.callback && c.callback.apply(this, arguments)
            });
            f.queue("fx", function() {
                f.dequeue()
            });
            f.dequeue()
        })
    }
})(jQuery);
(function(b) {
    b.effects.slide = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = ["position", "top", "left"],
                e = b.effects.setMode(f, c.options.mode || "show"),
                a = c.options.direction || "left";
            b.effects.save(f, g);
            f.show();
            b.effects.createWrapper(f).css({
                overflow: "hidden"
            });
            var d = a == "up" || a == "down" ? "top" : "left";
            a = a == "up" || a == "left" ? "pos" : "neg";
            var h = c.options.distance || (d == "top" ? f.outerHeight({
                margin: true
            }) : f.outerWidth({
                margin: true
            }));
            if (e == "show") f.css(d, a == "pos" ? -h : h);
            var i = {};
            i[d] = (e == "show" ? a == "pos" ? "+=" : "-=" : a == "pos" ? "-=" : "+=") + h;
            f.animate(i, {
                queue: false,
                duration: c.duration,
                easing: c.options.easing,
                complete: function() {
                    e == "hide" && f.hide();
                    b.effects.restore(f, g);
                    b.effects.removeWrapper(f);
                    c.callback && c.callback.apply(this, arguments);
                    f.dequeue()
                }
            })
        })
    }
})(jQuery);
(function(b) {
    b.effects.transfer = function(c) {
        return this.queue(function() {
            var f = b(this),
                g = b(c.options.to),
                e = g.offset();
            g = {
                top: e.top,
                left: e.left,
                height: g.innerHeight(),
                width: g.innerWidth()
            };
            e = f.offset();
            var a = b('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(c.options.className).css({
                top: e.top,
                left: e.left,
                height: f.innerHeight(),
                width: f.innerWidth(),
                position: "absolute"
            }).animate(g, c.duration, c.options.easing, function() {
                a.remove();
                c.callback && c.callback.apply(f[0], arguments);
                f.dequeue()
            })
        })
    }
})(jQuery);
(function(b) {
    b.widget("ui.accordion", {
        options: {
            active: 0,
            animated: "slide",
            autoHeight: true,
            clearStyle: false,
            collapsible: false,
            event: "click",
            fillSpace: false,
            header: "> li > :first-child,> :not(li):even",
            icons: {
                header: "ui-icon-triangle-1-e",
                headerSelected: "ui-icon-triangle-1-s"
            },
            navigation: false,
            navigationFilter: function() {
                return this.href.toLowerCase() === location.href.toLowerCase()
            }
        },
        _create: function() {
            var c = this,
                f = c.options;
            c.running = 0;
            c.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix");
            c.headers = c.element.find(f.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion", function() {
                f.disabled || b(this).addClass("ui-state-hover")
            }).bind("mouseleave.accordion", function() {
                f.disabled || b(this).removeClass("ui-state-hover")
            }).bind("focus.accordion", function() {
                f.disabled || b(this).addClass("ui-state-focus")
            }).bind("blur.accordion", function() {
                f.disabled || b(this).removeClass("ui-state-focus")
            });
            c.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
            if (f.navigation) {
                var g = c.element.find("a").filter(f.navigationFilter).eq(0);
                if (g.length) {
                    var e = g.closest(".ui-accordion-header");
                    c.active = e.length ? e : g.closest(".ui-accordion-content").prev()
                }
            }
            c.active = c._findActive(c.active || f.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");
            c.active.next().addClass("ui-accordion-content-active");
            c._createIcons();
            c.resize();
            c.element.attr("role", "tablist");
            c.headers.attr("role", "tab").bind("keydown.accordion", function(a) {
                return c._keydown(a)
            }).next().attr("role", "tabpanel");
            c.headers.not(c.active || "").attr({
                "aria-expanded": "false",
                tabIndex: -1
            }).next().hide();
            c.active.length ? c.active.attr({
                "aria-expanded": "true",
                tabIndex: 0
            }) : c.headers.eq(0).attr("tabIndex", 0);
            b.browser.safari || c.headers.find("a").attr("tabIndex", -1);
            f.event && c.headers.bind(f.event.split(" ").join(".accordion ") + ".accordion", function(a) {
                c._clickHandler.call(c, a, this);
                a.preventDefault()
            })
        },
        _createIcons: function() {
            var c = this.options;
            if (c.icons) {
                b("<span></span>").addClass("ui-icon " +
                    c.icons.header).prependTo(this.headers);
                this.active.children(".ui-icon").toggleClass(c.icons.header).toggleClass(c.icons.headerSelected);
                this.element.addClass("ui-accordion-icons")
            }
        },
        _destroyIcons: function() {
            this.headers.children(".ui-icon").remove();
            this.element.removeClass("ui-accordion-icons")
        },
        destroy: function() {
            var c = this.options;
            this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
            this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("tabIndex");
            this.headers.find("a").removeAttr("tabIndex");
            this._destroyIcons();
            var f = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");
            if (c.autoHeight || c.fillHeight) f.css("height", "");
            return b.Widget.prototype.destroy.call(this)
        },
        _setOption: function(c, f) {
            b.Widget.prototype._setOption.apply(this, arguments);
            c == "active" && this.activate(f);
            if (c == "icons") {
                this._destroyIcons();
                f && this._createIcons()
            }
            if (c == "disabled") this.headers.add(this.headers.next())[f ? "addClass" : "removeClass"]("ui-accordion-disabled ui-state-disabled")
        },
        _keydown: function(c) {
            if (!(this.options.disabled || c.altKey || c.ctrlKey)) {
                var f = b.ui.keyCode,
                    g = this.headers.length,
                    e = this.headers.index(c.target),
                    a = false;
                switch (c.keyCode) {
                    case f.RIGHT:
                    case f.DOWN:
                        a = this.headers[(e + 1) % g];
                        break;
                    case f.LEFT:
                    case f.UP:
                        a = this.headers[(e - 1 + g) % g];
                        break;
                    case f.SPACE:
                    case f.ENTER:
                        this._clickHandler({
                            target: c.target
                        }, c.target);
                        c.preventDefault()
                }
                if (a) {
                    b(c.target).attr("tabIndex", -1);
                    b(a).attr("tabIndex", 0);
                    a.focus();
                    return false
                }
                return true
            }
        },
        resize: function() {
            var c = this.options,
                f;
            if (c.fillSpace) {
                if (b.browser.msie) {
                    var g = this.element.parent().css("overflow");
                    this.element.parent().css("overflow", "hidden")
                }
                f = this.element.parent().height();
                b.browser.msie && this.element.parent().css("overflow", g);
                this.headers.each(function() {
                    f -= b(this).outerHeight(true)
                });
                this.headers.next().each(function() {
                    b(this).height(Math.max(0, f - b(this).innerHeight() +
                        b(this).height()))
                }).css("overflow", "auto")
            } else if (c.autoHeight) {
                f = 0;
                this.headers.next().each(function() {
                    f = Math.max(f, b(this).height("").height())
                }).height(f)
            }
            return this
        },
        activate: function(c) {
            this.options.active = c;
            c = this._findActive(c)[0];
            this._clickHandler({
                target: c
            }, c);
            return this
        },
        _findActive: function(c) {
            return c ? typeof c === "number" ? this.headers.filter(":eq(" + c + ")") : this.headers.not(this.headers.not(c)) : c === false ? b([]) : this.headers.filter(":eq(0)")
        },
        _clickHandler: function(c, f) {
            var g = this.options;
            if (!g.disabled)
                if (c.target) {
                    c = b(c.currentTarget || f);
                    f = c[0] === this.active[0];
                    g.active = g.collapsible && f ? false : this.headers.index(c);
                    if (!(this.running || !g.collapsible && f)) {
                        this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(g.icons.headerSelected).addClass(g.icons.header);
                        if (!f) {
                            c.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(g.icons.header).addClass(g.icons.headerSelected);
                            c.next().addClass("ui-accordion-content-active")
                        }
                        d = c.next();
                        e = this.active.next();
                        a = {
                            options: g,
                            newHeader: f && g.collapsible ? b([]) : c,
                            oldHeader: this.active,
                            newContent: f && g.collapsible ? b([]) : d,
                            oldContent: e
                        };
                        g = this.headers.index(this.active[0]) > this.headers.index(c[0]);
                        this.active = f ? b([]) : c;
                        this._toggle(d, e, a, f, g)
                    }
                } else
            if (g.collapsible) {
                this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(g.icons.headerSelected).addClass(g.icons.header);
                this.active.next().addClass("ui-accordion-content-active");
                var e = this.active.next(),
                    a = {
                        options: g,
                        newHeader: b([]),
                        oldHeader: g.active,
                        newContent: b([]),
                        oldContent: e
                    }, d = this.active = b([]);
                this._toggle(d, e, a)
            }
        },
        _toggle: function(c, f, g, e, a) {
            var d = this,
                h = d.options;
            d.toShow = c;
            d.toHide = f;
            d.data = g;
            var i = function() {
                if (d) return d._completed.apply(d, arguments)
            };
            d._trigger("changestart", null, d.data);
            d.running = f.size() === 0 ? c.size() : f.size();
            if (h.animated) {
                g = {};
                g = h.collapsible && e ? {
                    toShow: b([]),
                    toHide: f,
                    complete: i,
                    down: a,
                    autoHeight: h.autoHeight || h.fillSpace
                } : {
                    toShow: c,
                    toHide: f,
                    complete: i,
                    down: a,
                    autoHeight: h.autoHeight || h.fillSpace
                };
                if (!h.proxied) h.proxied = h.animated;
                if (!h.proxiedDuration) h.proxiedDuration = h.duration;
                h.animated = b.isFunction(h.proxied) ? h.proxied(g) : h.proxied;
                h.duration = b.isFunction(h.proxiedDuration) ? h.proxiedDuration(g) : h.proxiedDuration;
                e = b.ui.accordion.animations;
                var j = h.duration,
                    n = h.animated;
                if (n && !e[n] && !b.easing[n]) n = "slide";
                e[n] || (e[n] = function(q) {
                    this.slide(q, {
                        easing: n,
                        duration: j || 700
                    })
                });
                e[n](g)
            } else {
                if (h.collapsible && e) c.toggle();
                else {
                    f.hide();
                    c.show()
                }
                i(true)
            }
            f.prev().attr({
                "aria-expanded": "false",
                tabIndex: -1
            }).blur();
            c.prev().attr({
                "aria-expanded": "true",
                tabIndex: 0
            }).focus()
        },
        _completed: function(c) {
            this.running = c ? 0 : --this.running;
            if (!this.running) {
                this.options.clearStyle && this.toShow.add(this.toHide).css({
                    height: "",
                    overflow: ""
                });
                this.toHide.removeClass("ui-accordion-content-active");
                this._trigger("change", null, this.data)
            }
        }
    });
    b.extend(b.ui.accordion, {
        version: "1.8.6",
        animations: {
            slide: function(c, f) {
                c = b.extend({
                    easing: "swing",
                    duration: 300
                }, c, f);
                if (c.toHide.size())
                    if (c.toShow.size()) {
                        var g = c.toShow.css("overflow"),
                            e = 0,
                            a = {}, d = {}, h;
                        f = c.toShow;
                        h = f[0].style.width;
                        f.width(parseInt(f.parent().width(), 10) - parseInt(f.css("paddingLeft"), 10) - parseInt(f.css("paddingRight"), 10) - (parseInt(f.css("borderLeftWidth"), 10) || 0) - (parseInt(f.css("borderRightWidth"), 10) || 0));
                        b.each(["height", "paddingTop", "paddingBottom"], function(i, j) {
                            d[j] = "hide";
                            i = ("" + b.css(c.toShow[0], j)).match(/^([\d+-.]+)(.*)$/);
                            a[j] = {
                                value: i[1],
                                unit: i[2] || "px"
                            }
                        });
                        c.toShow.css({
                            height: 0,
                            overflow: "hidden"
                        }).show();
                        c.toHide.filter(":hidden").each(c.complete).end().filter(":visible").animate(d, {
                            step: function(i, j) {
                                if (j.prop == "height") e = j.end - j.start === 0 ? 0 : (j.now - j.start) / (j.end - j.start);
                                c.toShow[0].style[j.prop] = e * a[j.prop].value + a[j.prop].unit
                            },
                            duration: c.duration,
                            easing: c.easing,
                            complete: function() {
                                c.autoHeight || c.toShow.css("height", "");
                                c.toShow.css({
                                    width: h,
                                    overflow: g
                                });
                                c.complete()
                            }
                        })
                    } else c.toHide.animate({
                        height: "hide",
                        paddingTop: "hide",
                        paddingBottom: "hide"
                    }, c);
                    else c.toShow.animate({
                        height: "show",
                        paddingTop: "show",
                        paddingBottom: "show"
                    }, c)
            },
            bounceslide: function(c) {
                this.slide(c, {
                    easing: c.down ? "easeOutBounce" : "swing",
                    duration: c.down ? 1E3 : 200
                })
            }
        }
    })
})(jQuery);
(function(b) {
    b.widget("ui.autocomplete", {
        options: {
            appendTo: "body",
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null
        },
        _create: function() {
            var c = this,
                f = this.element[0].ownerDocument,
                g;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({
                role: "textbox",
                "aria-autocomplete": "list",
                "aria-haspopup": "true"
            }).bind("keydown.autocomplete", function(e) {
                if (!(c.options.disabled || c.element.attr("readonly"))) {
                    g = false;
                    var a = b.ui.keyCode;
                    switch (e.keyCode) {
                        case a.PAGE_UP:
                            c._move("previousPage", e);
                            break;
                        case a.PAGE_DOWN:
                            c._move("nextPage", e);
                            break;
                        case a.UP:
                            c._move("previous", e);
                            e.preventDefault();
                            break;
                        case a.DOWN:
                            c._move("next", e);
                            e.preventDefault();
                            break;
                        case a.ENTER:
                        case a.NUMPAD_ENTER:
                            if (c.menu.active) {
                                g = true;
                                e.preventDefault()
                            }
                        case a.TAB:
                            if (!c.menu.active) return;
                            c.menu.select(e);
                            break;
                        case a.ESCAPE:
                            c.element.val(c.term);
                            c.close(e);
                            break;
                        default:
                            clearTimeout(c.searching);
                            c.searching = setTimeout(function() {
                                if (c.term != c.element.val()) {
                                    c.selectedItem = null;
                                    c.search(null, e)
                                }
                            }, c.options.delay);
                            break
                    }
                }
            }).bind("keypress.autocomplete", function(e) {
                if (g) {
                    g = false;
                    e.preventDefault()
                }
            }).bind("focus.autocomplete", function() {
                if (!c.options.disabled) {
                    c.selectedItem = null;
                    c.previous = c.element.val()
                }
            }).bind("blur.autocomplete", function(e) {
                if (!c.options.disabled) {
                    clearTimeout(c.searching);
                    c.closing = setTimeout(function() {
                        c.close(e);
                        c._change(e)
                    }, 150)
                }
            });
            this._initSource();
            this.response = function() {
                return c._response.apply(c, arguments)
            };
            this.menu = b("<ul></ul>").addClass("ui-autocomplete").appendTo(b(this.options.appendTo || "body", f)[0]).mousedown(function(e) {
                var a = c.menu.element[0];
                b(e.target).closest(".ui-menu-item").length || setTimeout(function() {
                    b(document).one("mousedown", function(d) {
                        d.target !== c.element[0] && d.target !== a && !b.ui.contains(a, d.target) && c.close()
                    })
                }, 1);
                setTimeout(function() {
                    clearTimeout(c.closing)
                }, 13)
            }).menu({
                focus: function(e, a) {
                    a = a.item.data("item.autocomplete");
                    false !== c._trigger("focus", e, {
                        item: a
                    }) && /^key/.test(e.originalEvent.type) && c.element.val(a.value)
                },
                selected: function(e, a) {
                    a = a.item.data("item.autocomplete");
                    var d = c.previous;
                    if (c.element[0] !== f.activeElement) {
                        c.element.focus();
                        c.previous = d;
                        setTimeout(function() {
                            c.previous = d
                        }, 1)
                    }
                    false !== c._trigger("select", e, {
                        item: a
                    }) && c.element.val(a.value);
                    c.term = c.element.val();
                    c.close(e);
                    c.selectedItem = a
                },
                blur: function() {
                    c.menu.element.is(":visible") && c.element.val() !== c.term && c.element.val(c.term)
                }
            }).zIndex(this.element.zIndex() + 1).css({
                top: 0,
                left: 0
            }).hide().data("menu");
            b.fn.bgiframe && this.menu.element.bgiframe()
        },
        destroy: function() {
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
            this.menu.element.remove();
            b.Widget.prototype.destroy.call(this)
        },
        _setOption: function(c, f) {
            b.Widget.prototype._setOption.apply(this, arguments);
            c === "source" && this._initSource();
            if (c === "appendTo") this.menu.element.appendTo(b(f || "body", this.element[0].ownerDocument)[0])
        },
        _initSource: function() {
            var c = this,
                f, g;
            if (b.isArray(this.options.source)) {
                f = this.options.source;
                this.source = function(e, a) {
                    a(b.ui.autocomplete.filter(f, e.term))
                }
            } else if (typeof this.options.source === "string") {
                g = this.options.source;
                this.source = function(e, a) {
                    c.xhr && c.xhr.abort();
                    c.xhr = b.getJSON(g, e, function(d, h, i) {
                        i === c.xhr && a(d);
                        c.xhr = null
                    })
                }
            } else this.source = this.options.source
        },
        search: function(c, f) {
            c = c != null ? c : this.element.val();
            this.term = this.element.val();
            if (c.length < this.options.minLength) return this.close(f);
            clearTimeout(this.closing);
            if (this._trigger("search", f) !== false) return this._search(c)
        },
        _search: function(c) {
            this.element.addClass("ui-autocomplete-loading");
            this.source({
                term: c
            }, this.response)
        },
        _response: function(c) {
            if (c && c.length) {
                c = this._normalize(c);
                this._suggest(c);
                this._trigger("open")
            } else this.close();
            this.element.removeClass("ui-autocomplete-loading")
        },
        close: function(c) {
            clearTimeout(this.closing);
            if (this.menu.element.is(":visible")) {
                this._trigger("close", c);
                this.menu.element.hide();
                this.menu.deactivate()
            }
        },
        _change: function(c) {
            this.previous !== this.element.val() && this._trigger("change", c, {
                item: this.selectedItem
            })
        },
        _normalize: function(c) {
            if (c.length && c[0].label && c[0].value) return c;
            return b.map(c, function(f) {
                if (typeof f === "string") return {
                    label: f,
                    value: f
                };
                return b.extend({
                    label: f.label || f.value,
                    value: f.value || f.label
                }, f)
            })
        },
        _suggest: function(c) {
            this._renderMenu(this.menu.element.empty().zIndex(this.element.zIndex() + 1), c);
            this.menu.deactivate();
            this.menu.refresh();
            this.menu.element.show().position(b.extend({
                of: this.element
            }, this.options.position));
            this._resizeMenu()
        },
        _resizeMenu: function() {
            var c = this.menu.element;
            c.outerWidth(Math.max(c.width("").outerWidth(), this.element.outerWidth()))
        },
        _renderMenu: function(c, f) {
            var g = this;
            b.each(f, function(e, a) {
                g._renderItem(c, a)
            })
        },
        _renderItem: function(c, f) {
            return b("<li></li>").data("item.autocomplete", f).append(b("<a></a>").text(f.label)).appendTo(c)
        },
        _move: function(c, f) {
            if (this.menu.element.is(":visible"))
                if (this.menu.first() && /^previous/.test(c) || this.menu.last() && /^next/.test(c)) {
                    this.element.val(this.term);
                    this.menu.deactivate()
                } else this.menu[c](f);
                else this.search(null, f)
        },
        widget: function() {
            return this.menu.element
        }
    });
    b.extend(b.ui.autocomplete, {
        escapeRegex: function(c) {
            return c.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        },
        filter: function(c, f) {
            var g = new RegExp(b.ui.autocomplete.escapeRegex(f), "i");
            return b.grep(c, function(e) {
                return g.test(e.label || e.value || e)
            })
        }
    })
})(jQuery);
(function(b) {
    b.widget("ui.menu", {
        _create: function() {
            var c = this;
            this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({
                role: "listbox",
                "aria-activedescendant": "ui-active-menuitem"
            }).click(function(f) {
                if (b(f.target).closest(".ui-menu-item a").length) {
                    f.preventDefault();
                    c.select(f)
                }
            });
            this.refresh()
        },
        refresh: function() {
            var c = this;
            this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem").children("a").addClass("ui-corner-all").attr("tabindex", -1).mouseenter(function(f) {
                c.activate(f, b(this).parent())
            }).mouseleave(function() {
                c.deactivate()
            })
        },
        activate: function(c, f) {
            this.deactivate();
            if (this.hasScroll()) {
                var g = f.offset().top - this.element.offset().top,
                    e = this.element.attr("scrollTop"),
                    a = this.element.height();
                if (g < 0) this.element.attr("scrollTop", e + g);
                else g >= a && this.element.attr("scrollTop", e + g - a + f.height())
            }
            this.active = f.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
            this._trigger("focus", c, {
                item: f
            })
        },
        deactivate: function() {
            if (this.active) {
                this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
                this._trigger("blur");
                this.active = null
            }
        },
        next: function(c) {
            this.move("next", ".ui-menu-item:first", c)
        },
        previous: function(c) {
            this.move("prev", ".ui-menu-item:last", c)
        },
        first: function() {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        last: function() {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        move: function(c, f, g) {
            if (this.active) {
                c = this.active[c + "All"](".ui-menu-item").eq(0);
                c.length ? this.activate(g, c) : this.activate(g, this.element.children(f))
            } else this.activate(g, this.element.children(f))
        },
        nextPage: function(c) {
            if (this.hasScroll())
                if (!this.active || this.last()) this.activate(c, this.element.children(".ui-menu-item:first"));
                else {
                    var f = this.active.offset().top,
                        g = this.element.height(),
                        e = this.element.children(".ui-menu-item").filter(function() {
                            var a = b(this).offset().top - f - g + b(this).height();
                            return a < 10 && a > -10
                        });
                    e.length || (e = this.element.children(".ui-menu-item:last"));
                    this.activate(c, e)
                } else this.activate(c, this.element.children(".ui-menu-item").filter(!this.active || this.last() ? ":first" : ":last"))
        },
        previousPage: function(c) {
            if (this.hasScroll())
                if (!this.active || this.first()) this.activate(c, this.element.children(".ui-menu-item:last"));
                else {
                    var f = this.active.offset().top,
                        g = this.element.height();
                    result = this.element.children(".ui-menu-item").filter(function() {
                        var e = b(this).offset().top - f + g - b(this).height();
                        return e < 10 && e > -10
                    });
                    result.length || (result = this.element.children(".ui-menu-item:first"));
                    this.activate(c, result)
                } else this.activate(c, this.element.children(".ui-menu-item").filter(!this.active || this.first() ? ":last" : ":first"))
        },
        hasScroll: function() {
            return this.element.height() < this.element.attr("scrollHeight")
        },
        select: function(c) {
            this._trigger("selected", c, {
                item: this.active
            })
        }
    })
})(jQuery);
(function(b) {
    var c, f = function(e) {
            b(":ui-button", e.target.form).each(function() {
                var a = b(this).data("button");
                setTimeout(function() {
                    a.refresh()
                }, 1)
            })
        }, g = function(e) {
            var a = e.name,
                d = e.form,
                h = b([]);
            if (a) h = d ? b(d).find("[name='" + a + "']") : b("[name='" + a + "']", e.ownerDocument).filter(function() {
                return !this.form
            });
            return h
        };
    b.widget("ui.button", {
        options: {
            disabled: null,
            text: true,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function() {
            this.element.closest("form").unbind("reset.button").bind("reset.button", f);
            if (typeof this.options.disabled !== "boolean") this.options.disabled = this.element.attr("disabled");
            this._determineButtonType();
            this.hasTitle = !! this.buttonElement.attr("title");
            var e = this,
                a = this.options,
                d = this.type === "checkbox" || this.type === "radio",
                h = "ui-state-hover" + (!d ? " ui-state-active" : "");
            if (a.label === null) a.label = this.buttonElement.html();
            if (this.element.is(":disabled")) a.disabled = true;
            this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role", "button").bind("mouseenter.button", function() {
                if (!a.disabled) {
                    b(this).addClass("ui-state-hover");
                    this === c && b(this).addClass("ui-state-active")
                }
            }).bind("mouseleave.button", function() {
                a.disabled || b(this).removeClass(h)
            }).bind("focus.button", function() {
                b(this).addClass("ui-state-focus")
            }).bind("blur.button", function() {
                b(this).removeClass("ui-state-focus")
            });
            d && this.element.bind("change.button", function() {
                e.refresh()
            });
            if (this.type === "checkbox") this.buttonElement.bind("click.button", function() {
                if (a.disabled) return false;
                b(this).toggleClass("ui-state-active");
                e.buttonElement.attr("aria-pressed", e.element[0].checked)
            });
            else if (this.type === "radio") this.buttonElement.bind("click.button", function() {
                if (a.disabled) return false;
                b(this).addClass("ui-state-active");
                e.buttonElement.attr("aria-pressed", true);
                var i = e.element[0];
                g(i).not(i).map(function() {
                    return b(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", false)
            });
            else {
                this.buttonElement.bind("mousedown.button", function() {
                    if (a.disabled) return false;
                    b(this).addClass("ui-state-active");
                    c = this;
                    b(document).one("mouseup", function() {
                        c = null
                    })
                }).bind("mouseup.button", function() {
                    if (a.disabled) return false;
                    b(this).removeClass("ui-state-active")
                }).bind("keydown.button", function(i) {
                    if (a.disabled) return false;
                    if (i.keyCode == b.ui.keyCode.SPACE || i.keyCode == b.ui.keyCode.ENTER) b(this).addClass("ui-state-active")
                }).bind("keyup.button", function() {
                    b(this).removeClass("ui-state-active")
                });
                this.buttonElement.is("a") && this.buttonElement.keyup(function(i) {
                    i.keyCode === b.ui.keyCode.SPACE && b(this).click()
                })
            }
            this._setOption("disabled", a.disabled)
        },
        _determineButtonType: function() {
            this.type = this.element.is(":checkbox") ? "checkbox" : this.element.is(":radio") ? "radio" : this.element.is("input") ? "input" : "button";
            if (this.type === "checkbox" || this.type === "radio") {
                this.buttonElement = this.element.parents().last().find("label[for=" + this.element.attr("id") + "]");
                this.element.addClass("ui-helper-hidden-accessible");
                var e = this.element.is(":checked");
                e && this.buttonElement.addClass("ui-state-active");
                this.buttonElement.attr("aria-pressed", e)
            } else this.buttonElement = this.element
        },
        widget: function() {
            return this.buttonElement
        },
        destroy: function() {
            this.element.removeClass("ui-helper-hidden-accessible");
            this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
            this.hasTitle || this.buttonElement.removeAttr("title");
            b.Widget.prototype.destroy.call(this)
        },
        _setOption: function(e, a) {
            b.Widget.prototype._setOption.apply(this, arguments);
            if (e === "disabled") a ? this.element.attr("disabled", true) : this.element.removeAttr("disabled");
            this._resetButton()
        },
        refresh: function() {
            var e = this.element.is(":disabled");
            e !== this.options.disabled && this._setOption("disabled", e);
            if (this.type === "radio") g(this.element[0]).each(function() {
                b(this).is(":checked") ? b(this).button("widget").addClass("ui-state-active").attr("aria-pressed", true) : b(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", false)
            });
            else if (this.type === "checkbox") this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", true) : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", false)
        },
        _resetButton: function() {
            if (this.type === "input") this.options.label && this.element.val(this.options.label);
            else {
                var e = this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
                    a = b("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(),
                    d = this.options.icons,
                    h = d.primary && d.secondary;
                if (d.primary || d.secondary) {
                    e.addClass("ui-button-text-icon" + (h ? "s" : d.primary ? "-primary" : "-secondary"));
                    d.primary && e.prepend("<span class='ui-button-icon-primary ui-icon " + d.primary + "'></span>");
                    d.secondary && e.append("<span class='ui-button-icon-secondary ui-icon " + d.secondary + "'></span>");
                    if (!this.options.text) {
                        e.addClass(h ? "ui-button-icons-only" : "ui-button-icon-only").removeClass("ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary");
                        this.hasTitle || e.attr("title", a)
                    }
                } else e.addClass("ui-button-text-only")
            }
        }
    });
    b.widget("ui.buttonset", {
        _create: function() {
            this.element.addClass("ui-buttonset")
        },
        _init: function() {
            this.refresh()
        },
        _setOption: function(e, a) {
            e === "disabled" && this.buttons.button("option", e, a);
            b.Widget.prototype._setOption.apply(this, arguments)
        },
        refresh: function() {
            this.buttons = this.element.find(":button, :submit, :reset, :checkbox, :radio, a, :data(button)").filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
                return b(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":visible").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end().end()
        },
        destroy: function() {
            this.element.removeClass("ui-buttonset");
            this.buttons.map(function() {
                return b(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy");
            b.Widget.prototype.destroy.call(this)
        }
    })
})(jQuery);
(function(b, c) {
    function f() {
        this.debug = false;
        this._curInst = null;
        this._keyEvent = false;
        this._disabledInputs = [];
        this._inDialog = this._datepickerShowing = false;
        this._mainDivId = "ui-datepicker-div";
        this._inlineClass = "ui-datepicker-inline";
        this._appendClass = "ui-datepicker-append";
        this._triggerClass = "ui-datepicker-trigger";
        this._dialogClass = "ui-datepicker-dialog";
        this._disableClass = "ui-datepicker-disabled";
        this._unselectableClass = "ui-datepicker-unselectable";
        this._currentClass = "ui-datepicker-current-day";
        this._dayOverClass = "ui-datepicker-days-cell-over";
        this.regional = [];
        this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ""
        };
        this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: false,
            hideIfNoPrevNext: false,
            navigationAsDateFormat: false,
            gotoCurrent: false,
            changeMonth: false,
            changeYear: false,
            yearRange: "c-10:c+10",
            showOtherMonths: false,
            selectOtherMonths: false,
            showWeek: false,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: true,
            showButtonPanel: false,
            autoSize: false
        };
        b.extend(this._defaults, this.regional[""]);
        this.dpDiv = b('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>')
    }

    function g(a, d) {
        b.extend(a, d);
        for (var h in d)
            if (d[h] == null || d[h] == c) a[h] = d[h];
        return a
    }
    b.extend(b.ui, {
        datepicker: {
            version: "1.8.6"
        }
    });
    var e = (new Date).getTime();
    b.extend(f.prototype, {
        markerClassName: "hasDatepicker",
        log: function() {
            this.debug && console.log.apply("", arguments)
        },
        _widgetDatepicker: function() {
            return this.dpDiv
        },
        setDefaults: function(a) {
            g(this._defaults, a || {});
            return this
        },
        _attachDatepicker: function(a, d) {
            var h = null;
            for (var i in this._defaults) {
                var j = a.getAttribute("date:" + i);
                if (j) {
                    h = h || {};
                    try {
                        h[i] = eval(j)
                    } catch (n) {
                        h[i] = j
                    }
                }
            }
            i = a.nodeName.toLowerCase();
            j = i == "div" || i == "span";
            if (!a.id) {
                this.uuid += 1;
                a.id = "dp" + this.uuid
            }
            var q = this._newInst(b(a), j);
            q.settings = b.extend({}, d || {}, h || {});
            if (i == "input") this._connectDatepicker(a, q);
            else j && this._inlineDatepicker(a, q)
        },
        _newInst: function(a, d) {
            return {
                id: a[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1"),
                input: a,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: d,
                dpDiv: !d ? this.dpDiv : b('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')
            }
        },
        _connectDatepicker: function(a, d) {
            var h = b(a);
            d.append = b([]);
            d.trigger = b([]);
            if (!h.hasClass(this.markerClassName)) {
                this._attachments(h, d);
                h.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function(i, j, n) {
                    d.settings[j] = n
                }).bind("getData.datepicker", function(i, j) {
                    return this._get(d, j)
                });
                this._autoSize(d);
                b.data(a, "datepicker", d)
            }
        },
        _attachments: function(a, d) {
            var h = this._get(d, "appendText"),
                i = this._get(d, "isRTL");
            d.append && d.append.remove();
            if (h) {
                d.append = b('<span class="' + this._appendClass + '">' + h + "</span>");
                a[i ? "before" : "after"](d.append)
            }
            a.unbind("focus", this._showDatepicker);
            d.trigger && d.trigger.remove();
            h = this._get(d, "showOn");
            if (h == "focus" || h == "both") a.focus(this._showDatepicker);
            if (h == "button" || h == "both") {
                h = this._get(d, "buttonText");
                var j = this._get(d, "buttonImage");
                d.trigger = b(this._get(d, "buttonImageOnly") ? b("<img/>").addClass(this._triggerClass).attr({
                    src: j,
                    alt: h,
                    title: h
                }) : b('<button type="button"></button>').addClass(this._triggerClass).html(j == "" ? h : b("<img/>").attr({
                    src: j,
                    alt: h,
                    title: h
                })));
                a[i ? "before" : "after"](d.trigger);
                d.trigger.click(function() {
                    b.datepicker._datepickerShowing && b.datepicker._lastInput == a[0] ? b.datepicker._hideDatepicker() : b.datepicker._showDatepicker(a[0]);
                    return false
                })
            }
        },
        _autoSize: function(a) {
            if (this._get(a, "autoSize") && !a.inline) {
                var d = new Date(2009, 11, 20),
                    h = this._get(a, "dateFormat");
                if (h.match(/[DM]/)) {
                    var i = function(j) {
                        for (var n = 0, q = 0, l = 0; l < j.length; l++)
                            if (j[l].length > n) {
                                n = j[l].length;
                                q = l
                            }
                        return q
                    };
                    d.setMonth(i(this._get(a, h.match(/MM/) ? "monthNames" : "monthNamesShort")));
                    d.setDate(i(this._get(a, h.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - d.getDay())
                }
                a.input.attr("size", this._formatDate(a, d).length)
            }
        },
        _inlineDatepicker: function(a, d) {
            var h = b(a);
            if (!h.hasClass(this.markerClassName)) {
                h.addClass(this.markerClassName).append(d.dpDiv).bind("setData.datepicker", function(i, j, n) {
                    d.settings[j] = n
                }).bind("getData.datepicker", function(i, j) {
                    return this._get(d, j)
                });
                b.data(a, "datepicker", d);
                this._setDate(d, this._getDefaultDate(d), true);
                this._updateDatepicker(d);
                this._updateAlternate(d)
            }
        },
        _dialogDatepicker: function(a, d, h, i, j) {
            a = this._dialogInst;
            if (!a) {
                this.uuid += 1;
                this._dialogInput = b('<input type="text" id="' + ("dp" + this.uuid) + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
                this._dialogInput.keydown(this._doKeyDown);
                b("body").append(this._dialogInput);
                a = this._dialogInst = this._newInst(this._dialogInput, false);
                a.settings = {};
                b.data(this._dialogInput[0], "datepicker", a)
            }
            g(a.settings, i || {});
            d = d && d.constructor == Date ? this._formatDate(a, d) : d;
            this._dialogInput.val(d);
            this._pos = j ? j.length ? j : [j.pageX, j.pageY] : null;
            if (!this._pos) this._pos = [document.documentElement.clientWidth / 2 - 100 + (document.documentElement.scrollLeft || document.body.scrollLeft), document.documentElement.clientHeight / 2 - 150 + (document.documentElement.scrollTop || document.body.scrollTop)];
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px");
            a.settings.onSelect = h;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            b.blockUI && b.blockUI(this.dpDiv);
            b.data(this._dialogInput[0], "datepicker", a);
            return this
        },
        _destroyDatepicker: function(a) {
            var d = b(a),
                h = b.data(a, "datepicker");
            if (d.hasClass(this.markerClassName)) {
                var i = a.nodeName.toLowerCase();
                b.removeData(a, "datepicker");
                if (i == "input") {
                    h.append.remove();
                    h.trigger.remove();
                    d.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)
                } else if (i == "div" || i == "span") d.removeClass(this.markerClassName).empty()
            }
        },
        _enableDatepicker: function(a) {
            var d = b(a),
                h = b.data(a, "datepicker");
            if (d.hasClass(this.markerClassName)) {
                var i = a.nodeName.toLowerCase();
                if (i == "input") {
                    a.disabled = false;
                    h.trigger.filter("button").each(function() {
                        this.disabled = false
                    }).end().filter("img").css({
                        opacity: "1.0",
                        cursor: ""
                    })
                } else if (i == "div" || i == "span") d.children("." + this._inlineClass).children().removeClass("ui-state-disabled");
                this._disabledInputs = b.map(this._disabledInputs, function(j) {
                    return j == a ? null : j
                })
            }
        },
        _disableDatepicker: function(a) {
            var d = b(a),
                h = b.data(a, "datepicker");
            if (d.hasClass(this.markerClassName)) {
                var i = a.nodeName.toLowerCase();
                if (i == "input") {
                    a.disabled = true;
                    h.trigger.filter("button").each(function() {
                        this.disabled = true
                    }).end().filter("img").css({
                        opacity: "0.5",
                        cursor: "default"
                    })
                } else if (i == "div" || i == "span") d.children("." + this._inlineClass).children().addClass("ui-state-disabled");
                this._disabledInputs = b.map(this._disabledInputs, function(j) {
                    return j == a ? null : j
                });
                this._disabledInputs[this._disabledInputs.length] = a
            }
        },
        _isDisabledDatepicker: function(a) {
            if (!a) return false;
            for (var d = 0; d < this._disabledInputs.length; d++)
                if (this._disabledInputs[d] == a) return true;
            return false
        },
        _getInst: function(a) {
            try {
                return b.data(a, "datepicker")
            } catch (d) {
                throw "Missing instance data for this datepicker";
            }
        },
        _optionDatepicker: function(a, d, h) {
            var i = this._getInst(a);
            if (arguments.length == 2 && typeof d == "string") return d == "defaults" ? b.extend({}, b.datepicker._defaults) : i ? d == "all" ? b.extend({}, i.settings) : this._get(i, d) : null;
            var j = d || {};
            if (typeof d == "string") {
                j = {};
                j[d] = h
            }
            if (i) {
                this._curInst == i && this._hideDatepicker();
                var n = this._getDateDatepicker(a, true);
                g(i.settings, j);
                this._attachments(b(a), i);
                this._autoSize(i);
                this._setDateDatepicker(a, n);
                this._updateDatepicker(i)
            }
        },
        _changeDatepicker: function(a, d, h) {
            this._optionDatepicker(a, d, h)
        },
        _refreshDatepicker: function(a) {
            (a = this._getInst(a)) && this._updateDatepicker(a)
        },
        _setDateDatepicker: function(a, d) {
            if (a = this._getInst(a)) {
                this._setDate(a, d);
                this._updateDatepicker(a);
                this._updateAlternate(a)
            }
        },
        _getDateDatepicker: function(a, d) {
            (a = this._getInst(a)) && !a.inline && this._setDateFromField(a, d);
            return a ? this._getDate(a) : null
        },
        _doKeyDown: function(a) {
            var d = b.datepicker._getInst(a.target),
                h = true,
                i = d.dpDiv.is(".ui-datepicker-rtl");
            d._keyEvent = true;
            if (b.datepicker._datepickerShowing) switch (a.keyCode) {
                case 9:
                    b.datepicker._hideDatepicker();
                    h = false;
                    break;
                case 13:
                    h = b("td." + b.datepicker._dayOverClass, d.dpDiv).add(b("td." + b.datepicker._currentClass, d.dpDiv));
                    h[0] ? b.datepicker._selectDay(a.target, d.selectedMonth, d.selectedYear, h[0]) : b.datepicker._hideDatepicker();
                    return false;
                case 27:
                    b.datepicker._hideDatepicker();
                    break;
                case 33:
                    b.datepicker._adjustDate(a.target, a.ctrlKey ? -b.datepicker._get(d, "stepBigMonths") : -b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 34:
                    b.datepicker._adjustDate(a.target, a.ctrlKey ? +b.datepicker._get(d, "stepBigMonths") : +b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 35:
                    if (a.ctrlKey || a.metaKey) b.datepicker._clearDate(a.target);
                    h = a.ctrlKey || a.metaKey;
                    break;
                case 36:
                    if (a.ctrlKey || a.metaKey) b.datepicker._gotoToday(a.target);
                    h = a.ctrlKey || a.metaKey;
                    break;
                case 37:
                    if (a.ctrlKey || a.metaKey) b.datepicker._adjustDate(a.target, i ? +1 : -1, "D");
                    h = a.ctrlKey || a.metaKey;
                    if (a.originalEvent.altKey) b.datepicker._adjustDate(a.target, a.ctrlKey ? -b.datepicker._get(d, "stepBigMonths") : -b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 38:
                    if (a.ctrlKey || a.metaKey) b.datepicker._adjustDate(a.target, -7, "D");
                    h = a.ctrlKey || a.metaKey;
                    break;
                case 39:
                    if (a.ctrlKey || a.metaKey) b.datepicker._adjustDate(a.target, i ? -1 : +1, "D");
                    h = a.ctrlKey || a.metaKey;
                    if (a.originalEvent.altKey) b.datepicker._adjustDate(a.target, a.ctrlKey ? +b.datepicker._get(d, "stepBigMonths") : +b.datepicker._get(d, "stepMonths"), "M");
                    break;
                case 40:
                    if (a.ctrlKey || a.metaKey) b.datepicker._adjustDate(a.target, +7, "D");
                    h = a.ctrlKey || a.metaKey;
                    break;
                default:
                    h = false
            } else if (a.keyCode == 36 && a.ctrlKey) b.datepicker._showDatepicker(this);
            else h = false;
            if (h) {
                a.preventDefault();
                a.stopPropagation()
            }
        },
        _doKeyPress: function(a) {
            var d = b.datepicker._getInst(a.target);
            if (b.datepicker._get(d, "constrainInput")) {
                d = b.datepicker._possibleChars(b.datepicker._get(d, "dateFormat"));
                var h = String.fromCharCode(a.charCode == c ? a.keyCode : a.charCode);
                return a.ctrlKey || h < " " || !d || d.indexOf(h) > -1
            }
        },
        _doKeyUp: function(a) {
            a = b.datepicker._getInst(a.target);
            if (a.input.val() != a.lastVal) try {
                if (b.datepicker.parseDate(b.datepicker._get(a, "dateFormat"), a.input ? a.input.val() : null, b.datepicker._getFormatConfig(a))) {
                    b.datepicker._setDateFromField(a);
                    b.datepicker._updateAlternate(a);
                    b.datepicker._updateDatepicker(a)
                }
            } catch (d) {
                b.datepicker.log(d)
            }
            return true
        },
        _showDatepicker: function(a) {
            a = a.target || a;
            if (a.nodeName.toLowerCase() != "input") a = b("input", a.parentNode)[0];
            if (!(b.datepicker._isDisabledDatepicker(a) || b.datepicker._lastInput == a)) {
                var d = b.datepicker._getInst(a);
                b.datepicker._curInst && b.datepicker._curInst != d && b.datepicker._curInst.dpDiv.stop(true, true);
                var h = b.datepicker._get(d, "beforeShow");
                g(d.settings, h ? h.apply(a, [a, d]) : {});
                d.lastVal = null;
                b.datepicker._lastInput = a;
                b.datepicker._setDateFromField(d);
                if (b.datepicker._inDialog) a.value = "";
                if (!b.datepicker._pos) {
                    b.datepicker._pos = b.datepicker._findPos(a);
                    b.datepicker._pos[1] += a.offsetHeight
                }
                var i = false;
                b(a).parents().each(function() {
                    i |= b(this).css("position") == "fixed";
                    return !i
                });
                if (i && b.browser.opera) {
                    b.datepicker._pos[0] -= document.documentElement.scrollLeft;
                    b.datepicker._pos[1] -= document.documentElement.scrollTop
                }
                h = {
                    left: b.datepicker._pos[0],
                    top: b.datepicker._pos[1]
                };
                b.datepicker._pos = null;
                d.dpDiv.css({
                    position: "absolute",
                    display: "block",
                    top: "-1000px"
                });
                b.datepicker._updateDatepicker(d);
                h = b.datepicker._checkOffset(d, h, i);
                d.dpDiv.css({
                    position: b.datepicker._inDialog && b.blockUI ? "static" : i ? "fixed" : "absolute",
                    display: "none",
                    left: h.left + "px",
                    top: h.top + "px"
                });
                if (!d.inline) {
                    h = b.datepicker._get(d, "showAnim");
                    var j = b.datepicker._get(d, "duration"),
                        n = function() {
                            b.datepicker._datepickerShowing = true;
                            var q = b.datepicker._getBorders(d.dpDiv);
                            d.dpDiv.find("iframe.ui-datepicker-cover").css({
                                left: -q[0],
                                top: -q[1],
                                width: d.dpDiv.outerWidth(),
                                height: d.dpDiv.outerHeight()
                            })
                        };
                    d.dpDiv.zIndex(b(a).zIndex() + 1);
                    b.effects && b.effects[h] ? d.dpDiv.show(h, b.datepicker._get(d, "showOptions"), j, n) : d.dpDiv[h || "show"](h ? j : null, n);
                    if (!h || !j) n();
                    d.input.is(":visible") && !d.input.is(":disabled") && d.input.focus();
                    b.datepicker._curInst = d
                }
            }
        },
        _updateDatepicker: function(a) {
            var d = this,
                h = b.datepicker._getBorders(a.dpDiv);
            a.dpDiv.empty().append(this._generateHTML(a)).find("iframe.ui-datepicker-cover").css({
                left: -h[0],
                top: -h[1],
                width: a.dpDiv.outerWidth(),
                height: a.dpDiv.outerHeight()
            }).end().find("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a").bind("mouseout", function() {
                b(this).removeClass("ui-state-hover");
                this.className.indexOf("ui-datepicker-prev") != -1 && b(this).removeClass("ui-datepicker-prev-hover");
                this.className.indexOf("ui-datepicker-next") != -1 && b(this).removeClass("ui-datepicker-next-hover")
            }).bind("mouseover", function() {
                if (!d._isDisabledDatepicker(a.inline ? a.dpDiv.parent()[0] : a.input[0])) {
                    b(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
                    b(this).addClass("ui-state-hover");
                    this.className.indexOf("ui-datepicker-prev") != -1 && b(this).addClass("ui-datepicker-prev-hover");
                    this.className.indexOf("ui-datepicker-next") != -1 && b(this).addClass("ui-datepicker-next-hover")
                }
            }).end().find("." + this._dayOverClass + " a").trigger("mouseover").end();
            h = this._getNumberOfMonths(a);
            var i = h[1];
            i > 1 ? a.dpDiv.addClass("ui-datepicker-multi-" + i).css("width", 17 * i + "em") : a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            a.dpDiv[(h[0] != 1 || h[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            a.dpDiv[(this._get(a, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            a == b.datepicker._curInst && b.datepicker._datepickerShowing && a.input && a.input.is(":visible") && !a.input.is(":disabled") && a.input.focus()
        },
        _getBorders: function(a) {
            var d = function(h) {
                return {
                    thin: 1,
                    medium: 2,
                    thick: 3
                }[h] || h
            };
            return [parseFloat(d(a.css("border-left-width"))), parseFloat(d(a.css("border-top-width")))]
        },
        _checkOffset: function(a, d, h) {
            var i = a.dpDiv.outerWidth(),
                j = a.dpDiv.outerHeight(),
                n = a.input ? a.input.outerWidth() : 0,
                q = a.input ? a.input.outerHeight() : 0,
                l = document.documentElement.clientWidth + b(document).scrollLeft(),
                k = document.documentElement.clientHeight + b(document).scrollTop();
            d.left -= this._get(a, "isRTL") ? i - n : 0;
            d.left -= h && d.left == a.input.offset().left ? b(document).scrollLeft() : 0;
            d.top -= h && d.top == a.input.offset().top + q ? b(document).scrollTop() : 0;
            d.left -= Math.min(d.left, d.left + i > l && l > i ? Math.abs(d.left + i - l) : 0);
            d.top -= Math.min(d.top, d.top + j > k && k > j ? Math.abs(j + q) : 0);
            return d
        },
        _findPos: function(a) {
            for (var d = this._get(this._getInst(a), "isRTL"); a && (a.type == "hidden" || a.nodeType != 1);) a = a[d ? "previousSibling" : "nextSibling"];
            a = b(a).offset();
            return [a.left, a.top]
        },
        _hideDatepicker: function(a) {
            var d = this._curInst;
            if (!(!d || a && d != b.data(a, "datepicker")))
                if (this._datepickerShowing) {
                    a = this._get(d, "showAnim");
                    var h = this._get(d, "duration"),
                        i = function() {
                            b.datepicker._tidyDialog(d);
                            this._curInst = null
                        };
                    b.effects && b.effects[a] ? d.dpDiv.hide(a, b.datepicker._get(d, "showOptions"), h, i) : d.dpDiv[a == "slideDown" ? "slideUp" : a == "fadeIn" ? "fadeOut" : "hide"](a ? h : null, i);
                    a || i();
                    if (a = this._get(d, "onClose")) a.apply(d.input ? d.input[0] : null, [d.input ? d.input.val() : "", d]);
                    this._datepickerShowing = false;
                    this._lastInput = null;
                    if (this._inDialog) {
                        this._dialogInput.css({
                            position: "absolute",
                            left: "0",
                            top: "-100px"
                        });
                        if (b.blockUI) {
                            b.unblockUI();
                            b("body").append(this.dpDiv)
                        }
                    }
                    this._inDialog = false
                }
        },
        _tidyDialog: function(a) {
            a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function(a) {
            if (b.datepicker._curInst) {
                a = b(a.target);
                a[0].id != b.datepicker._mainDivId && a.parents("#" + b.datepicker._mainDivId).length == 0 && !a.hasClass(b.datepicker.markerClassName) && !a.hasClass(b.datepicker._triggerClass) && b.datepicker._datepickerShowing && !(b.datepicker._inDialog && b.blockUI) && b.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function(a, d, h) {
            a = b(a);
            var i = this._getInst(a[0]);
            if (!this._isDisabledDatepicker(a[0])) {
                this._adjustInstDate(i, d + (h == "M" ? this._get(i, "showCurrentAtPos") : 0), h);
                this._updateDatepicker(i)
            }
        },
        _gotoToday: function(a) {
            a = b(a);
            var d = this._getInst(a[0]);
            if (this._get(d, "gotoCurrent") && d.currentDay) {
                d.selectedDay = d.currentDay;
                d.drawMonth = d.selectedMonth = d.currentMonth;
                d.drawYear = d.selectedYear = d.currentYear
            } else {
                var h = new Date;
                d.selectedDay = h.getDate();
                d.drawMonth = d.selectedMonth = h.getMonth();
                d.drawYear = d.selectedYear = h.getFullYear()
            }
            this._notifyChange(d);
            this._adjustDate(a)
        },
        _selectMonthYear: function(a, d, h) {
            a = b(a);
            var i = this._getInst(a[0]);
            i._selectingMonthYear = false;
            i["selected" + (h == "M" ? "Month" : "Year")] = i["draw" + (h == "M" ? "Month" : "Year")] = parseInt(d.options[d.selectedIndex].value, 10);
            this._notifyChange(i);
            this._adjustDate(a)
        },
        _clickMonthYear: function(a) {
            var d = this._getInst(b(a)[0]);
            d.input && d._selectingMonthYear && setTimeout(function() {
                d.input.focus()
            }, 0);
            d._selectingMonthYear = !d._selectingMonthYear
        },
        _selectDay: function(a, d, h, i) {
            var j = b(a);
            if (!(b(i).hasClass(this._unselectableClass) || this._isDisabledDatepicker(j[0]))) {
                j = this._getInst(j[0]);
                j.selectedDay = j.currentDay = b("a", i).html();
                j.selectedMonth = j.currentMonth = d;
                j.selectedYear = j.currentYear = h;
                this._selectDate(a, this._formatDate(j, j.currentDay, j.currentMonth, j.currentYear))
            }
        },
        _clearDate: function(a) {
            a = b(a);
            this._getInst(a[0]);
            this._selectDate(a, "")
        },
        _selectDate: function(a, d) {
            a = this._getInst(b(a)[0]);
            d = d != null ? d : this._formatDate(a);
            a.input && a.input.val(d);
            this._updateAlternate(a);
            var h = this._get(a, "onSelect");
            if (h) h.apply(a.input ? a.input[0] : null, [d, a]);
            else a.input && a.input.trigger("change"); if (a.inline) this._updateDatepicker(a);
            else {
                this._hideDatepicker();
                this._lastInput = a.input[0];
                typeof a.input[0] != "object" && a.input.focus();
                this._lastInput = null
            }
        },
        _updateAlternate: function(a) {
            var d = this._get(a, "altField");
            if (d) {
                var h = this._get(a, "altFormat") || this._get(a, "dateFormat"),
                    i = this._getDate(a),
                    j = this.formatDate(h, i, this._getFormatConfig(a));
                b(d).each(function() {
                    b(this).val(j)
                })
            }
        },
        noWeekends: function(a) {
            a = a.getDay();
            return [a > 0 && a < 6, ""]
        },
        iso8601Week: function(a) {
            a = new Date(a.getTime());
            a.setDate(a.getDate() + 4 - (a.getDay() || 7));
            var d = a.getTime();
            a.setMonth(0);
            a.setDate(1);
            return Math.floor(Math.round((d - a) / 864E5) / 7) + 1
        },
        parseDate: function(a, d, h) {
            if (a == null || d == null) throw "Invalid arguments";
            d = typeof d == "object" ? d.toString() : d + "";
            if (d == "") return null;
            for (var i = (h ? h.shortYearCutoff : null) || this._defaults.shortYearCutoff, j = (h ? h.dayNamesShort : null) || this._defaults.dayNamesShort, n = (h ? h.dayNames : null) || this._defaults.dayNames, q = (h ? h.monthNamesShort : null) || this._defaults.monthNamesShort, l = (h ? h.monthNames : null) || this._defaults.monthNames, k = h = -1, m = -1, o = -1, p = false, s = function(x) {
                    (x = y + 1 < a.length && a.charAt(y + 1) == x) && y++;
                    return x
                }, r = function(x) {
                    s(x);
                    x = new RegExp("^\\d{1," + (x == "@" ? 14 : x == "!" ? 20 : x == "y" ? 4 : x == "o" ? 3 : 2) + "}");
                    x = d.substring(w).match(x);
                    if (!x) throw "Missing number at position " + w;
                    w += x[0].length;
                    return parseInt(x[0], 10)
                }, u = function(x, C, J) {
                    x = s(x) ? J : C;
                    for (C = 0; C < x.length; C++)
                        if (d.substr(w, x[C].length).toLowerCase() == x[C].toLowerCase()) {
                            w += x[C].length;
                            return C + 1
                        }
                    throw "Unknown name at position " + w;
                }, v = function() {
                    if (d.charAt(w) != a.charAt(y)) throw "Unexpected literal at position " + w;
                    w++
                }, w = 0, y = 0; y < a.length; y++)
                if (p)
                    if (a.charAt(y) == "'" && !s("'")) p = false;
                    else v();
                    else switch (a.charAt(y)) {
                        case "d":
                            m = r("d");
                            break;
                        case "D":
                            u("D", j, n);
                            break;
                        case "o":
                            o = r("o");
                            break;
                        case "m":
                            k = r("m");
                            break;
                        case "M":
                            k = u("M", q, l);
                            break;
                        case "y":
                            h = r("y");
                            break;
                        case "@":
                            var B = new Date(r("@"));
                            h = B.getFullYear();
                            k = B.getMonth() + 1;
                            m = B.getDate();
                            break;
                        case "!":
                            B = new Date((r("!") - this._ticksTo1970) / 1E4);
                            h = B.getFullYear();
                            k = B.getMonth() + 1;
                            m = B.getDate();
                            break;
                        case "'":
                            if (s("'")) v();
                            else p = true;
                            break;
                        default:
                            v()
                    }
            if (h == -1) h = (new Date).getFullYear();
            else
            if (h < 100) h += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (h <= i ? 0 : -100);
            if (o > -1) {
                k = 1;
                m = o;
                do {
                    i = this._getDaysInMonth(h, k - 1);
                    if (m <= i) break;
                    k++;
                    m -= i
                } while (1)
            }
            B = this._daylightSavingAdjust(new Date(h, k - 1, m));
            if (B.getFullYear() != h || B.getMonth() + 1 != k || B.getDate() != m) throw "Invalid date";
            return B
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1E7,
        formatDate: function(a, d, h) {
            if (!d) return "";
            var i = (h ? h.dayNamesShort : null) || this._defaults.dayNamesShort,
                j = (h ? h.dayNames : null) || this._defaults.dayNames,
                n = (h ? h.monthNamesShort : null) || this._defaults.monthNamesShort;
            h = (h ? h.monthNames : null) || this._defaults.monthNames;
            var q = function(s) {
                (s = p + 1 < a.length && a.charAt(p + 1) == s) && p++;
                return s
            }, l = function(s, r, u) {
                    r = "" + r;
                    if (q(s))
                        for (; r.length < u;) r = "0" + r;
                    return r
                }, k = function(s, r, u, v) {
                    return q(s) ? v[r] : u[r]
                }, m = "",
                o = false;
            if (d)
                for (var p = 0; p < a.length; p++)
                    if (o)
                        if (a.charAt(p) == "'" && !q("'")) o = false;
                        else m += a.charAt(p);
                        else switch (a.charAt(p)) {
                            case "d":
                                m += l("d", d.getDate(), 2);
                                break;
                            case "D":
                                m += k("D", d.getDay(), i, j);
                                break;
                            case "o":
                                m += l("o", (d.getTime() - (new Date(d.getFullYear(), 0, 0)).getTime()) / 864E5, 3);
                                break;
                            case "m":
                                m += l("m", d.getMonth() + 1, 2);
                                break;
                            case "M":
                                m += k("M", d.getMonth(), n, h);
                                break;
                            case "y":
                                m += q("y") ? d.getFullYear() : (d.getYear() % 100 < 10 ? "0" : "") + d.getYear() % 100;
                                break;
                            case "@":
                                m += d.getTime();
                                break;
                            case "!":
                                m += d.getTime() * 1E4 + this._ticksTo1970;
                                break;
                            case "'":
                                if (q("'")) m += "'";
                                else o = true;
                                break;
                            default:
                                m += a.charAt(p)
                        }
            return m
        },
        _possibleChars: function(a) {
            for (var d = "", h = false, i = function(n) {
                    (n = j + 1 < a.length && a.charAt(j + 1) == n) && j++;
                    return n
                }, j = 0; j < a.length; j++)
                if (h)
                    if (a.charAt(j) == "'" && !i("'")) h = false;
                    else d += a.charAt(j);
                    else switch (a.charAt(j)) {
                        case "d":
                        case "m":
                        case "y":
                        case "@":
                            d += "0123456789";
                            break;
                        case "D":
                        case "M":
                            return null;
                        case "'":
                            if (i("'")) d += "'";
                            else h = true;
                            break;
                        default:
                            d += a.charAt(j)
                    }
            return d
        },
        _get: function(a, d) {
            return a.settings[d] !== c ? a.settings[d] : this._defaults[d]
        },
        _setDateFromField: function(a, d) {
            if (a.input.val() != a.lastVal) {
                var h = this._get(a, "dateFormat"),
                    i = a.lastVal = a.input ? a.input.val() : null,
                    j, n;
                j = n = this._getDefaultDate(a);
                var q = this._getFormatConfig(a);
                try {
                    j = this.parseDate(h, i, q) || n
                } catch (l) {
                    this.log(l);
                    i = d ? "" : i
                }
                a.selectedDay = j.getDate();
                a.drawMonth = a.selectedMonth = j.getMonth();
                a.drawYear = a.selectedYear = j.getFullYear();
                a.currentDay = i ? j.getDate() : 0;
                a.currentMonth = i ? j.getMonth() : 0;
                a.currentYear = i ? j.getFullYear() : 0;
                this._adjustInstDate(a)
            }
        },
        _getDefaultDate: function(a) {
            return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date))
        },
        _determineDate: function(a, d, h) {
            var i = function(n) {
                var q = new Date;
                q.setDate(q.getDate() + n);
                return q
            }, j = function(n) {
                    try {
                        return b.datepicker.parseDate(b.datepicker._get(a, "dateFormat"), n, b.datepicker._getFormatConfig(a))
                    } catch (q) {}
                    var l = (n.toLowerCase().match(/^c/) ? b.datepicker._getDate(a) : null) || new Date,
                        k = l.getFullYear(),
                        m = l.getMonth();
                    l = l.getDate();
                    for (var o = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, p = o.exec(n); p;) {
                        switch (p[2] || "d") {
                            case "d":
                            case "D":
                                l += parseInt(p[1], 10);
                                break;
                            case "w":
                            case "W":
                                l += parseInt(p[1], 10) * 7;
                                break;
                            case "m":
                            case "M":
                                m += parseInt(p[1], 10);
                                l = Math.min(l, b.datepicker._getDaysInMonth(k, m));
                                break;
                            case "y":
                            case "Y":
                                k += parseInt(p[1], 10);
                                l = Math.min(l, b.datepicker._getDaysInMonth(k, m));
                                break
                        }
                        p = o.exec(n)
                    }
                    return new Date(k, m, l)
                };
            if (d = (d = d == null ? h : typeof d == "string" ? j(d) : typeof d == "number" ? isNaN(d) ? h : i(d) : d) && d.toString() == "Invalid Date" ? h : d) {
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d.setMilliseconds(0)
            }
            return this._daylightSavingAdjust(d)
        },
        _daylightSavingAdjust: function(a) {
            if (!a) return null;
            a.setHours(a.getHours() > 12 ? a.getHours() + 2 : 0);
            return a
        },
        _setDate: function(a, d, h) {
            var i = !d,
                j = a.selectedMonth,
                n = a.selectedYear;
            d = this._restrictMinMax(a, this._determineDate(a, d, new Date));
            a.selectedDay = a.currentDay = d.getDate();
            a.drawMonth = a.selectedMonth = a.currentMonth = d.getMonth();
            a.drawYear = a.selectedYear = a.currentYear = d.getFullYear();
            if ((j != a.selectedMonth || n != a.selectedYear) && !h) this._notifyChange(a);
            this._adjustInstDate(a);
            if (a.input) a.input.val(i ? "" : this._formatDate(a))
        },
        _getDate: function(a) {
            return !a.currentYear || a.input && a.input.val() == "" ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay))
        },
        _generateHTML: function(a) {
            var d = new Date;
            d = this._daylightSavingAdjust(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            var h = this._get(a, "isRTL"),
                i = this._get(a, "showButtonPanel"),
                j = this._get(a, "hideIfNoPrevNext"),
                n = this._get(a, "navigationAsDateFormat"),
                q = this._getNumberOfMonths(a),
                l = this._get(a, "showCurrentAtPos"),
                k = this._get(a, "stepMonths"),
                m = q[0] != 1 || q[1] != 1,
                o = this._daylightSavingAdjust(!a.currentDay ? new Date(9999, 9, 9) : new Date(a.currentYear, a.currentMonth, a.currentDay)),
                p = this._getMinMaxDate(a, "min"),
                s = this._getMinMaxDate(a, "max");
            l = a.drawMonth - l;
            var r = a.drawYear;
            if (l < 0) {
                l += 12;
                r--
            }
            if (s) {
                var u = this._daylightSavingAdjust(new Date(s.getFullYear(), s.getMonth() - q[0] * q[1] + 1, s.getDate()));
                for (u = p && u < p ? p : u; this._daylightSavingAdjust(new Date(r, l, 1)) > u;) {
                    l--;
                    if (l < 0) {
                        l = 11;
                        r--
                    }
                }
            }
            a.drawMonth = l;
            a.drawYear = r;
            u = this._get(a, "prevText");
            u = !n ? u : this.formatDate(u, this._daylightSavingAdjust(new Date(r, l - k, 1)), this._getFormatConfig(a));
            u = this._canAdjustMonth(a, -1, r, l) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + e + ".datepicker._adjustDate('#" + a.id + "', -" + k + ", 'M');\" title=\"" + u + '"><span class="ui-icon ui-icon-circle-triangle-' + (h ? "e" : "w") + '">' + u + "</span></a>" : j ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + u + '"><span class="ui-icon ui-icon-circle-triangle-' + (h ? "e" : "w") + '">' +
                u + "</span></a>";
            var v = this._get(a, "nextText");
            v = !n ? v : this.formatDate(v, this._daylightSavingAdjust(new Date(r, l + k, 1)), this._getFormatConfig(a));
            j = this._canAdjustMonth(a, +1, r, l) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + e + ".datepicker._adjustDate('#" + a.id + "', +" + k + ", 'M');\" title=\"" + v + '"><span class="ui-icon ui-icon-circle-triangle-' + (h ? "w" : "e") + '">' + v + "</span></a>" : j ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + v + '"><span class="ui-icon ui-icon-circle-triangle-' +
                (h ? "w" : "e") + '">' + v + "</span></a>";
            k = this._get(a, "currentText");
            v = this._get(a, "gotoCurrent") && a.currentDay ? o : d;
            k = !n ? k : this.formatDate(k, v, this._getFormatConfig(a));
            n = !a.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + e + '.datepicker._hideDatepicker();">' + this._get(a, "closeText") + "</button>" : "";
            i = i ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (h ? n : "") + (this._isInRange(a, v) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' +
                e + ".datepicker._gotoToday('#" + a.id + "');\">" + k + "</button>" : "") + (h ? "" : n) + "</div>" : "";
            n = parseInt(this._get(a, "firstDay"), 10);
            n = isNaN(n) ? 0 : n;
            k = this._get(a, "showWeek");
            v = this._get(a, "dayNames");
            this._get(a, "dayNamesShort");
            var w = this._get(a, "dayNamesMin"),
                y = this._get(a, "monthNames"),
                B = this._get(a, "monthNamesShort"),
                x = this._get(a, "beforeShowDay"),
                C = this._get(a, "showOtherMonths"),
                J = this._get(a, "selectOtherMonths");
            this._get(a, "calculateWeek");
            for (var M = this._getDefaultDate(a), K = "", G = 0; G < q[0]; G++) {
                for (var N = "", H = 0; H < q[1]; H++) {
                    var O = this._daylightSavingAdjust(new Date(r, l, a.selectedDay)),
                        A = " ui-corner-all",
                        D = "";
                    if (m) {
                        D += '<div class="ui-datepicker-group';
                        if (q[1] > 1) switch (H) {
                            case 0:
                                D += " ui-datepicker-group-first";
                                A = " ui-corner-" + (h ? "right" : "left");
                                break;
                            case q[1] - 1:
                                D += " ui-datepicker-group-last";
                                A = " ui-corner-" + (h ? "left" : "right");
                                break;
                            default:
                                D += " ui-datepicker-group-middle";
                                A = "";
                                break
                        }
                        D += '">'
                    }
                    D += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + A + '">' + (/all|left/.test(A) && G == 0 ? h ? j : u : "") + (/all|right/.test(A) && G == 0 ? h ? u : j : "") + this._generateMonthYearHeader(a, l, r, p, s, G > 0 || H > 0, y, B) + '</div><table class="ui-datepicker-calendar"><thead><tr>';
                    var E = k ? '<th class="ui-datepicker-week-col">' + this._get(a, "weekHeader") + "</th>" : "";
                    for (A = 0; A < 7; A++) {
                        var z = (A + n) % 7;
                        E += "<th" + ((A + n + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + v[z] + '">' + w[z] + "</span></th>"
                    }
                    D += E + "</tr></thead><tbody>";
                    E = this._getDaysInMonth(r, l);
                    if (r == a.selectedYear && l == a.selectedMonth) a.selectedDay = Math.min(a.selectedDay, E);
                    A = (this._getFirstDayOfMonth(r, l) - n + 7) % 7;
                    E = m ? 6 : Math.ceil((A + E) / 7);
                    z = this._daylightSavingAdjust(new Date(r, l, 1 - A));
                    for (var P = 0; P < E; P++) {
                        D += "<tr>";
                        var Q = !k ? "" : '<td class="ui-datepicker-week-col">' + this._get(a, "calculateWeek")(z) + "</td>";
                        for (A = 0; A < 7; A++) {
                            var I = x ? x.apply(a.input ? a.input[0] : null, [z]) : [true, ""],
                                F = z.getMonth() != l,
                                L = F && !J || !I[0] || p && z < p || s && z > s;
                            Q += '<td class="' + ((A + n + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (F ? " ui-datepicker-other-month" : "") + (z.getTime() == O.getTime() && l == a.selectedMonth && a._keyEvent || M.getTime() == z.getTime() && M.getTime() == O.getTime() ? " " + this._dayOverClass : "") + (L ? " " + this._unselectableClass + " ui-state-disabled" : "") + (F && !C ? "" : " " + I[1] + (z.getTime() == o.getTime() ? " " + this._currentClass : "") + (z.getTime() == d.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!F || C) && I[2] ? ' title="' + I[2] + '"' : "") + (L ? "" : ' onclick="DP_jQuery_' + e + ".datepicker._selectDay('#" + a.id + "'," + z.getMonth() + "," + z.getFullYear() + ', this);return false;"') + ">" + (F && !C ? "&#xa0;" : L ? '<span class="ui-state-default">' + z.getDate() + "</span>" : '<a class="ui-state-default' + (z.getTime() == d.getTime() ? " ui-state-highlight" : "") + (z.getTime() == o.getTime() ? " ui-state-active" : "") + (F ? " ui-priority-secondary" : "") + '" href="#">' + z.getDate() + "</a>") + "</td>";
                            z.setDate(z.getDate() + 1);
                            z = this._daylightSavingAdjust(z)
                        }
                        D += Q + "</tr>"
                    }
                    l++;
                    if (l > 11) {
                        l = 0;
                        r++
                    }
                    D += "</tbody></table>" + (m ? "</div>" + (q[0] > 0 && H == q[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : "");
                    N += D
                }
                K += N
            }
            K += i + (b.browser.msie && parseInt(b.browser.version, 10) < 7 && !a.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : "");
            a._keyEvent = false;
            return K
        },
        _generateMonthYearHeader: function(a, d, h, i, j, n, q, l) {
            var k = this._get(a, "changeMonth"),
                m = this._get(a, "changeYear"),
                o = this._get(a, "showMonthAfterYear"),
                p = '<div class="ui-datepicker-title">',
                s = "";
            if (n || !k) s += '<span class="ui-datepicker-month">' + q[d] + "</span>";
            else {
                q = i && i.getFullYear() == h;
                var r = j && j.getFullYear() == h;
                s += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + e + ".datepicker._selectMonthYear('#" + a.id + "', this, 'M');\" onclick=\"DP_jQuery_" + e + ".datepicker._clickMonthYear('#" +
                    a.id + "');\">";
                for (var u = 0; u < 12; u++)
                    if ((!q || u >= i.getMonth()) && (!r || u <= j.getMonth())) s += '<option value="' + u + '"' + (u == d ? ' selected="selected"' : "") + ">" + l[u] + "</option>";
                s += "</select>"
            }
            o || (p += s + (n || !(k && m) ? "&#xa0;" : ""));
            if (n || !m) p += '<span class="ui-datepicker-year">' + h + "</span>";
            else {
                l = this._get(a, "yearRange").split(":");
                var v = (new Date).getFullYear();
                q = function(w) {
                    w = w.match(/c[+-].*/) ? h + parseInt(w.substring(1), 10) : w.match(/[+-].*/) ? v + parseInt(w, 10) : parseInt(w, 10);
                    return isNaN(w) ? v : w
                };
                d = q(l[0]);
                l = Math.max(d, q(l[1] || ""));
                d = i ? Math.max(d, i.getFullYear()) : d;
                l = j ? Math.min(l, j.getFullYear()) : l;
                for (p += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + e + ".datepicker._selectMonthYear('#" + a.id + "', this, 'Y');\" onclick=\"DP_jQuery_" + e + ".datepicker._clickMonthYear('#" + a.id + "');\">"; d <= l; d++) p += '<option value="' + d + '"' + (d == h ? ' selected="selected"' : "") + ">" + d + "</option>";
                p += "</select>"
            }
            p += this._get(a, "yearSuffix");
            if (o) p += (n || !(k && m) ? "&#xa0;" : "") + s;
            p += "</div>";
            return p
        },
        _adjustInstDate: function(a, d, h) {
            var i = a.drawYear + (h == "Y" ? d : 0),
                j = a.drawMonth + (h == "M" ? d : 0);
            d = Math.min(a.selectedDay, this._getDaysInMonth(i, j)) + (h == "D" ? d : 0);
            i = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(i, j, d)));
            a.selectedDay = i.getDate();
            a.drawMonth = a.selectedMonth = i.getMonth();
            a.drawYear = a.selectedYear = i.getFullYear();
            if (h == "M" || h == "Y") this._notifyChange(a)
        },
        _restrictMinMax: function(a, d) {
            var h = this._getMinMaxDate(a, "min");
            a = this._getMinMaxDate(a, "max");
            d = h && d < h ? h : d;
            return d = a && d > a ? a : d
        },
        _notifyChange: function(a) {
            var d = this._get(a, "onChangeMonthYear");
            if (d) d.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a])
        },
        _getNumberOfMonths: function(a) {
            a = this._get(a, "numberOfMonths");
            return a == null ? [1, 1] : typeof a == "number" ? [1, a] : a
        },
        _getMinMaxDate: function(a, d) {
            return this._determineDate(a, this._get(a, d + "Date"), null)
        },
        _getDaysInMonth: function(a, d) {
            return 32 - (new Date(a, d, 32)).getDate()
        },
        _getFirstDayOfMonth: function(a, d) {
            return (new Date(a, d, 1)).getDay()
        },
        _canAdjustMonth: function(a, d, h, i) {
            var j = this._getNumberOfMonths(a);
            h = this._daylightSavingAdjust(new Date(h, i + (d < 0 ? d : j[0] * j[1]), 1));
            d < 0 && h.setDate(this._getDaysInMonth(h.getFullYear(), h.getMonth()));
            return this._isInRange(a, h)
        },
        _isInRange: function(a, d) {
            var h = this._getMinMaxDate(a, "min");
            a = this._getMinMaxDate(a, "max");
            return (!h || d.getTime() >= h.getTime()) && (!a || d.getTime() <= a.getTime())
        },
        _getFormatConfig: function(a) {
            var d = this._get(a, "shortYearCutoff");
            d = typeof d != "string" ? d : (new Date).getFullYear() % 100 + parseInt(d, 10);
            return {
                shortYearCutoff: d,
                dayNamesShort: this._get(a, "dayNamesShort"),
                dayNames: this._get(a, "dayNames"),
                monthNamesShort: this._get(a, "monthNamesShort"),
                monthNames: this._get(a, "monthNames")
            }
        },
        _formatDate: function(a, d, h, i) {
            if (!d) {
                a.currentDay = a.selectedDay;
                a.currentMonth = a.selectedMonth;
                a.currentYear = a.selectedYear
            }
            d = d ? typeof d == "object" ? d : this._daylightSavingAdjust(new Date(i, h, d)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
            return this.formatDate(this._get(a, "dateFormat"), d, this._getFormatConfig(a))
        }
    });
    b.fn.datepicker = function(a) {
        if (!b.datepicker.initialized) {
            b(document).mousedown(b.datepicker._checkExternalClick).find("body").append(b.datepicker.dpDiv);
            b.datepicker.initialized = true
        }
        var d = Array.prototype.slice.call(arguments, 1);
        if (typeof a == "string" && (a == "isDisabled" || a == "getDate" || a == "widget")) return b.datepicker["_" + a + "Datepicker"].apply(b.datepicker, [this[0]].concat(d));
        if (a == "option" && arguments.length == 2 && typeof arguments[1] == "string") return b.datepicker["_" + a + "Datepicker"].apply(b.datepicker, [this[0]].concat(d));
        return this.each(function() {
            typeof a == "string" ? b.datepicker["_" + a + "Datepicker"].apply(b.datepicker, [this].concat(d)) : b.datepicker._attachDatepicker(this, a)
        })
    };
    b.datepicker = new f;
    b.datepicker.initialized = false;
    b.datepicker.uuid = (new Date).getTime();
    b.datepicker.version = "1.8.6";
    window["DP_jQuery_" + e] = b
})(jQuery);
(function(b, c) {
    var f = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    }, g = {
            maxHeight: true,
            maxWidth: true,
            minHeight: true,
            minWidth: true
        };
    b.widget("ui.dialog", {
        options: {
            autoOpen: true,
            buttons: {},
            closeOnEscape: true,
            closeText: "close",
            dialogClass: "",
            draggable: true,
            hide: null,
            height: "auto",
            maxHeight: false,
            maxWidth: false,
            minHeight: 150,
            minWidth: 150,
            modal: false,
            position: {
                my: "center",
                at: "center",
                of: window,
                collision: "fit",
                using: function(e) {
                    var a = b(this).css(e).offset().top;
                    a < 0 && b(this).css("top", e.top - a)
                }
            },
            resizable: true,
            show: null,
            stack: true,
            title: "",
            width: 300,
            zIndex: 1E3
        },
        _create: function() {
            this.originalTitle = this.element.attr("title");
            if (typeof this.originalTitle !== "string") this.originalTitle = "";
            this.options.title = this.options.title || this.originalTitle;
            var e = this,
                a = e.options,
                d = a.title || "&#160;",
                h = b.ui.dialog.getTitleId(e.element),
                i = (e.uiDialog = b("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all " + a.dialogClass).css({
                    zIndex: a.zIndex
                }).attr("tabIndex", -1).css("outline", 0).keydown(function(q) {
                    if (a.closeOnEscape && q.keyCode && q.keyCode === b.ui.keyCode.ESCAPE) {
                        e.close(q);
                        q.preventDefault()
                    }
                }).attr({
                    role: "dialog",
                    "aria-labelledby": h
                }).mousedown(function(q) {
                    e.moveToTop(false, q)
                });
            e.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(i);
            var j = (e.uiDialogTitlebar = b("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(i),
                n = b('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role", "button").hover(function() {
                    n.addClass("ui-state-hover")
                }, function() {
                    n.removeClass("ui-state-hover")
                }).focus(function() {
                    n.addClass("ui-state-focus")
                }).blur(function() {
                    n.removeClass("ui-state-focus")
                }).click(function(q) {
                    e.close(q);
                    return false
                }).appendTo(j);
            (e.uiDialogTitlebarCloseText = b("<span></span>")).addClass("ui-icon ui-icon-closethick").text(a.closeText).appendTo(n);
            b("<span></span>").addClass("ui-dialog-title").attr("id", h).html(d).prependTo(j);
            if (b.isFunction(a.beforeclose) && !b.isFunction(a.beforeClose)) a.beforeClose = a.beforeclose;
            j.find("*").add(j).disableSelection();
            a.draggable && b.fn.draggable && e._makeDraggable();
            a.resizable && b.fn.resizable && e._makeResizable();
            e._createButtons(a.buttons);
            e._isOpen = false;
            b.fn.bgiframe && i.bgiframe()
        },
        _init: function() {
            this.options.autoOpen && this.open()
        },
        destroy: function() {
            var e = this;
            e.overlay && e.overlay.destroy();
            e.uiDialog.hide();
            e.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");
            e.uiDialog.remove();
            e.originalTitle && e.element.attr("title", e.originalTitle);
            return e
        },
        widget: function() {
            return this.uiDialog
        },
        close: function(e) {
            var a = this,
                d;
            if (false !== a._trigger("beforeClose", e)) {
                a.overlay && a.overlay.destroy();
                a.uiDialog.unbind("keypress.ui-dialog");
                a._isOpen = false;
                if (a.options.hide) a.uiDialog.hide(a.options.hide, function() {
                    a._trigger("close", e)
                });
                else {
                    a.uiDialog.hide();
                    a._trigger("close", e)
                }
                b.ui.dialog.overlay.resize();
                if (a.options.modal) {
                    d = 0;
                    b(".ui-dialog").each(function() {
                        if (this !== a.uiDialog[0]) d = Math.max(d, b(this).css("z-index"))
                    });
                    b.ui.dialog.maxZ = d
                }
                return a
            }
        },
        isOpen: function() {
            return this._isOpen
        },
        moveToTop: function(e, a) {
            var d = this,
                h = d.options;
            if (h.modal && !e || !h.stack && !h.modal) return d._trigger("focus", a);
            if (h.zIndex > b.ui.dialog.maxZ) b.ui.dialog.maxZ = h.zIndex;
            if (d.overlay) {
                b.ui.dialog.maxZ += 1;
                d.overlay.$el.css("z-index", b.ui.dialog.overlay.maxZ = b.ui.dialog.maxZ)
            }
            e = {
                scrollTop: d.element.attr("scrollTop"),
                scrollLeft: d.element.attr("scrollLeft")
            };
            b.ui.dialog.maxZ += 1;
            d.uiDialog.css("z-index", b.ui.dialog.maxZ);
            d.element.attr(e);
            d._trigger("focus", a);
            return d
        },
        open: function() {
            if (!this._isOpen) {
                var e = this,
                    a = e.options,
                    d = e.uiDialog;
                e.overlay = a.modal ? new b.ui.dialog.overlay(e) : null;
                e._size();
                e._position(a.position);
                d.show(a.show);
                e.moveToTop(true);
                a.modal && d.bind("keypress.ui-dialog", function(h) {
                    if (h.keyCode === b.ui.keyCode.TAB) {
                        var i = b(":tabbable", this),
                            j = i.filter(":first");
                        i = i.filter(":last");
                        if (h.target === i[0] && !h.shiftKey) {
                            j.focus(1);
                            return false
                        } else if (h.target === j[0] && h.shiftKey) {
                            i.focus(1);
                            return false
                        }
                    }
                });
                b(e.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();
                e._isOpen = true;
                e._trigger("open");
                return e
            }
        },
        _createButtons: function(e) {
            var a = this,
                d = false,
                h = b("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),
                i = b("<div></div>").addClass("ui-dialog-buttonset").appendTo(h);
            a.uiDialog.find(".ui-dialog-buttonpane").remove();
            typeof e === "object" && e !== null && b.each(e, function() {
                return !(d = true)
            });
            if (d) {
                b.each(e, function(j, n) {
                    n = b.isFunction(n) ? {
                        click: n,
                        text: j
                    } : n;
                    j = b('<button type="button"></button>').attr(n, true).unbind("click").click(function() {
                        n.click.apply(a.element[0], arguments)
                    }).appendTo(i);
                    b.fn.button && j.button()
                });
                h.appendTo(a.uiDialog)
            }
        },
        _makeDraggable: function() {
            function e(j) {
                return {
                    position: j.position,
                    offset: j.offset
                }
            }
            var a = this,
                d = a.options,
                h = b(document),
                i;
            a.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function(j, n) {
                    i = d.height === "auto" ? "auto" : b(this).height();
                    b(this).height(b(this).height()).addClass("ui-dialog-dragging");
                    a._trigger("dragStart", j, e(n))
                },
                drag: function(j, n) {
                    a._trigger("drag", j, e(n))
                },
                stop: function(j, n) {
                    d.position = [n.position.left - h.scrollLeft(), n.position.top - h.scrollTop()];
                    b(this).removeClass("ui-dialog-dragging").height(i);
                    a._trigger("dragStop", j, e(n));
                    b.ui.dialog.overlay.resize()
                }
            })
        },
        _makeResizable: function(e) {
            function a(j) {
                return {
                    originalPosition: j.originalPosition,
                    originalSize: j.originalSize,
                    position: j.position,
                    size: j.size
                }
            }
            e = e === c ? this.options.resizable : e;
            var d = this,
                h = d.options,
                i = d.uiDialog.css("position");
            e = typeof e === "string" ? e : "n,e,s,w,se,sw,ne,nw";
            d.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: d.element,
                maxWidth: h.maxWidth,
                maxHeight: h.maxHeight,
                minWidth: h.minWidth,
                minHeight: d._minHeight(),
                handles: e,
                start: function(j, n) {
                    b(this).addClass("ui-dialog-resizing");
                    d._trigger("resizeStart", j, a(n))
                },
                resize: function(j, n) {
                    d._trigger("resize", j, a(n))
                },
                stop: function(j, n) {
                    b(this).removeClass("ui-dialog-resizing");
                    h.height = b(this).height();
                    h.width = b(this).width();
                    d._trigger("resizeStop", j, a(n));
                    b.ui.dialog.overlay.resize()
                }
            }).css("position", i).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")
        },
        _minHeight: function() {
            var e = this.options;
            return e.height === "auto" ? e.minHeight : Math.min(e.minHeight, e.height)
        },
        _position: function(e) {
            var a = [],
                d = [0, 0],
                h;
            if (e) {
                if (typeof e === "string" || typeof e === "object" && "0" in e) {
                    a = e.split ? e.split(" ") : [e[0], e[1]];
                    if (a.length === 1) a[1] = a[0];
                    b.each(["left", "top"], function(i, j) {
                        if (+a[i] === a[i]) {
                            d[i] = a[i];
                            a[i] = j
                        }
                    });
                    e = {
                        my: a.join(" "),
                        at: a.join(" "),
                        offset: d.join(" ")
                    }
                }
                e = b.extend({}, b.ui.dialog.prototype.options.position, e)
            } else e = b.ui.dialog.prototype.options.position;
            (h = this.uiDialog.is(":visible")) || this.uiDialog.show();
            this.uiDialog.css({
                top: 0,
                left: 0
            }).position(e);
            h || this.uiDialog.hide()
        },
        _setOptions: function(e) {
            var a = this,
                d = {}, h = false;
            b.each(e, function(i, j) {
                a._setOption(i, j);
                if (i in f) h = true;
                if (i in g) d[i] = j
            });
            h && this._size();
            this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", d)
        },
        _setOption: function(e, a) {
            var d = this,
                h = d.uiDialog;
            switch (e) {
                case "beforeclose":
                    e = "beforeClose";
                    break;
                case "buttons":
                    d._createButtons(a);
                    break;
                case "closeText":
                    d.uiDialogTitlebarCloseText.text("" + a);
                    break;
                case "dialogClass":
                    h.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all " + a);
                    break;
                case "disabled":
                    a ? h.addClass("ui-dialog-disabled") : h.removeClass("ui-dialog-disabled");
                    break;
                case "draggable":
                    var i = h.is(":data(draggable)");
                    i && !a && h.draggable("destroy");
                    !i && a && d._makeDraggable();
                    break;
                case "position":
                    d._position(a);
                    break;
                case "resizable":
                    (i = h.is(":data(resizable)")) && !a && h.resizable("destroy");
                    i && typeof a === "string" && h.resizable("option", "handles", a);
                    !i && a !== false && d._makeResizable(a);
                    break;
                case "title":
                    b(".ui-dialog-title", d.uiDialogTitlebar).html("" + (a || "&#160;"));
                    break
            }
            b.Widget.prototype._setOption.apply(d, arguments)
        },
        _size: function() {
            var e = this.options,
                a, d;
            this.element.show().css({
                width: "auto",
                minHeight: 0,
                height: 0
            });
            if (e.minWidth > e.width) e.width = e.minWidth;
            a = this.uiDialog.css({
                height: "auto",
                width: e.width
            }).height();
            d = Math.max(0, e.minHeight - a);
            if (e.height === "auto")
                if (b.support.minHeight) this.element.css({
                    minHeight: d,
                    height: "auto"
                });
                else {
                    this.uiDialog.show();
                    e = this.element.css("height", "auto").height();
                    this.uiDialog.hide();
                    this.element.height(Math.max(e, d))
                } else this.element.height(Math.max(e.height - a, 0));
            this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        }
    });
    b.extend(b.ui.dialog, {
        version: "1.8.6",
        uuid: 0,
        maxZ: 0,
        getTitleId: function(e) {
            e = e.attr("id");
            if (!e) {
                this.uuid += 1;
                e = this.uuid
            }
            return "ui-dialog-title-" + e
        },
        overlay: function(e) {
            this.$el = b.ui.dialog.overlay.create(e)
        }
    });
    b.extend(b.ui.dialog.overlay, {
        instances: [],
        oldInstances: [],
        maxZ: 0,
        events: b.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function(e) {
            return e + ".dialog-overlay"
        }).join(" "),
        create: function(e) {
            if (this.instances.length === 0) {
                setTimeout(function() {
                    b.ui.dialog.overlay.instances.length && b(document).bind(b.ui.dialog.overlay.events, function(d) {
                        if (b(d.target).zIndex() < b.ui.dialog.overlay.maxZ) return false
                    })
                }, 1);
                b(document).bind("keydown.dialog-overlay", function(d) {
                    if (e.options.closeOnEscape && d.keyCode && d.keyCode === b.ui.keyCode.ESCAPE) {
                        e.close(d);
                        d.preventDefault()
                    }
                });
                b(window).bind("resize.dialog-overlay", b.ui.dialog.overlay.resize)
            }
            var a = (this.oldInstances.pop() || b("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({
                width: this.width(),
                height: this.height()
            });
            b.fn.bgiframe && a.bgiframe();
            this.instances.push(a);
            return a
        },
        destroy: function(e) {
            this.oldInstances.push(this.instances.splice(b.inArray(e, this.instances), 1)[0]);
            this.instances.length === 0 && b([document, window]).unbind(".dialog-overlay");
            e.remove();
            var a = 0;
            b.each(this.instances, function() {
                a = Math.max(a, this.css("z-index"))
            });
            this.maxZ = a
        },
        height: function() {
            var e, a;
            if (b.browser.msie && b.browser.version < 7) {
                e = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                a = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
                return e < a ? b(window).height() + "px" : e + "px"
            } else return b(document).height() + "px"
        },
        width: function() {
            var e, a;
            if (b.browser.msie && b.browser.version < 7) {
                e = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
                a = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
                return e < a ? b(window).width() + "px" : e + "px"
            } else return b(document).width() + "px"
        },
        resize: function() {
            var e = b([]);
            b.each(b.ui.dialog.overlay.instances, function() {
                e = e.add(this)
            });
            e.css({
                width: 0,
                height: 0
            }).css({
                width: b.ui.dialog.overlay.width(),
                height: b.ui.dialog.overlay.height()
            })
        }
    });
    b.extend(b.ui.dialog.overlay.prototype, {
        destroy: function() {
            b.ui.dialog.overlay.destroy(this.$el)
        }
    })
})(jQuery);
(function(b) {
    b.ui = b.ui || {};
    var c = /left|center|right/,
        f = /top|center|bottom/,
        g = b.fn.position,
        e = b.fn.offset;
    b.fn.position = function(a) {
        if (!a || !a.of) return g.apply(this, arguments);
        a = b.extend({}, a);
        var d = b(a.of),
            h = d[0],
            i = (a.collision || "flip").split(" "),
            j = a.offset ? a.offset.split(" ") : [0, 0],
            n, q, l;
        if (h.nodeType === 9) {
            n = d.width();
            q = d.height();
            l = {
                top: 0,
                left: 0
            }
        } else if (h.setTimeout) {
            n = d.width();
            q = d.height();
            l = {
                top: d.scrollTop(),
                left: d.scrollLeft()
            }
        } else if (h.preventDefault) {
            a.at = "left top";
            n = q = 0;
            l = {
                top: a.of.pageY,
                left: a.of.pageX
            }
        } else {
            n = d.outerWidth();
            q = d.outerHeight();
            l = d.offset()
        }
        b.each(["my", "at"], function() {
            var k = (a[this] || "").split(" ");
            if (k.length === 1) k = c.test(k[0]) ? k.concat(["center"]) : f.test(k[0]) ? ["center"].concat(k) : ["center", "center"];
            k[0] = c.test(k[0]) ? k[0] : "center";
            k[1] = f.test(k[1]) ? k[1] : "center";
            a[this] = k
        });
        if (i.length === 1) i[1] = i[0];
        j[0] = parseInt(j[0], 10) || 0;
        if (j.length === 1) j[1] = j[0];
        j[1] = parseInt(j[1], 10) || 0;
        if (a.at[0] === "right") l.left += n;
        else if (a.at[0] === "center") l.left += n / 2;
        if (a.at[1] === "bottom") l.top += q;
        else if (a.at[1] === "center") l.top += q / 2;
        l.left += j[0];
        l.top += j[1];
        return this.each(function() {
            var k = b(this),
                m = k.outerWidth(),
                o = k.outerHeight(),
                p = parseInt(b.curCSS(this, "marginLeft", true)) || 0,
                s = parseInt(b.curCSS(this, "marginTop", true)) || 0,
                r = m + p + parseInt(b.curCSS(this, "marginRight", true)) || 0,
                u = o + s + parseInt(b.curCSS(this, "marginBottom", true)) || 0,
                v = b.extend({}, l),
                w;
            if (a.my[0] === "right") v.left -= m;
            else if (a.my[0] === "center") v.left -= m / 2;
            if (a.my[1] === "bottom") v.top -= o;
            else if (a.my[1] === "center") v.top -= o / 2;
            v.left = parseInt(v.left);
            v.top = parseInt(v.top);
            w = {
                left: v.left - p,
                top: v.top - s
            };
            b.each(["left", "top"], function(y, B) {
                b.ui.position[i[y]] && b.ui.position[i[y]][B](v, {
                    targetWidth: n,
                    targetHeight: q,
                    elemWidth: m,
                    elemHeight: o,
                    collisionPosition: w,
                    collisionWidth: r,
                    collisionHeight: u,
                    offset: j,
                    my: a.my,
                    at: a.at
                })
            });
            b.fn.bgiframe && k.bgiframe();
            k.offset(b.extend(v, {
                using: a.using
            }))
        })
    };
    b.ui.position = {
        fit: {
            left: function(a, d) {
                var h = b(window);
                h = d.collisionPosition.left + d.collisionWidth - h.width() - h.scrollLeft();
                a.left = h > 0 ? a.left - h : Math.max(a.left - d.collisionPosition.left, a.left)
            },
            top: function(a, d) {
                var h = b(window);
                h = d.collisionPosition.top + d.collisionHeight - h.height() - h.scrollTop();
                a.top = h > 0 ? a.top - h : Math.max(a.top - d.collisionPosition.top, a.top)
            }
        },
        flip: {
            left: function(a, d) {
                if (d.at[0] !== "center") {
                    var h = b(window);
                    h = d.collisionPosition.left + d.collisionWidth - h.width() - h.scrollLeft();
                    var i = d.my[0] === "left" ? -d.elemWidth : d.my[0] === "right" ? d.elemWidth : 0,
                        j = d.at[0] === "left" ? d.targetWidth : -d.targetWidth,
                        n = -2 * d.offset[0];
                    a.left += d.collisionPosition.left < 0 ? i + j + n : h > 0 ? i + j + n : 0
                }
            },
            top: function(a, d) {
                if (d.at[1] !== "center") {
                    var h = b(window);
                    h = d.collisionPosition.top + d.collisionHeight - h.height() - h.scrollTop();
                    var i = d.my[1] === "top" ? -d.elemHeight : d.my[1] === "bottom" ? d.elemHeight : 0,
                        j = d.at[1] === "top" ? d.targetHeight : -d.targetHeight,
                        n = -2 * d.offset[1];
                    a.top += d.collisionPosition.top < 0 ? i + j + n : h > 0 ? i + j + n : 0
                }
            }
        }
    };
    if (!b.offset.setOffset) {
        b.offset.setOffset = function(a, d) {
            if (/static/.test(b.curCSS(a, "position"))) a.style.position = "relative";
            var h = b(a),
                i = h.offset(),
                j = parseInt(b.curCSS(a, "top", true), 10) || 0,
                n = parseInt(b.curCSS(a, "left", true), 10) || 0;
            i = {
                top: d.top - i.top + j,
                left: d.left - i.left + n
            };
            "using" in d ? d.using.call(a, i) : h.css(i)
        };
        b.fn.offset = function(a) {
            var d = this[0];
            if (!d || !d.ownerDocument) return null;
            if (a) return this.each(function() {
                b.offset.setOffset(this, a)
            });
            return e.call(this)
        }
    }
})(jQuery);
(function(b, c) {
    b.widget("ui.progressbar", {
        options: {
            value: 0
        },
        min: 0,
        max: 100,
        _create: function() {
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min,
                "aria-valuemax": this.max,
                "aria-valuenow": this._value()
            });
            this.valueDiv = b("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element);
            this._refreshValue()
        },
        destroy: function() {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.valueDiv.remove();
            b.Widget.prototype.destroy.apply(this, arguments)
        },
        value: function(f) {
            if (f === c) return this._value();
            this._setOption("value", f);
            return this
        },
        _setOption: function(f, g) {
            if (f === "value") {
                this.options.value = g;
                this._refreshValue();
                this._trigger("change");
                this._value() === this.max && this._trigger("complete")
            }
            b.Widget.prototype._setOption.apply(this, arguments)
        },
        _value: function() {
            var f = this.options.value;
            if (typeof f !== "number") f = 0;
            return Math.min(this.max, Math.max(this.min, f))
        },
        _refreshValue: function() {
            var f = this.value();
            this.valueDiv.toggleClass("ui-corner-right", f === this.max).width(f + "%");
            this.element.attr("aria-valuenow", f)
        }
    });
    b.extend(b.ui.progressbar, {
        version: "1.8.6"
    })
})(jQuery);
(function(b) {
    b.widget("ui.slider", b.ui.mouse, {
        widgetEventPrefix: "slide",
        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null
        },
        _create: function() {
            var c = this,
                f = this.options;
            this._mouseSliding = this._keySliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            f.disabled && this.element.addClass("ui-slider-disabled ui-disabled");
            this.range = b([]);
            if (f.range) {
                if (f.range === true) {
                    this.range = b("<div></div>");
                    if (!f.values) f.values = [this._valueMin(), this._valueMin()];
                    if (f.values.length && f.values.length !== 2) f.values = [f.values[0], f.values[0]]
                } else this.range = b("<div></div>");
                this.range.appendTo(this.element).addClass("ui-slider-range");
                if (f.range === "min" || f.range === "max") this.range.addClass("ui-slider-range-" + f.range);
                this.range.addClass("ui-widget-header")
            }
            b(".ui-slider-handle", this.element).length === 0 && b("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
            if (f.values && f.values.length)
                for (; b(".ui-slider-handle", this.element).length < f.values.length;) b("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
            this.handles = b(".ui-slider-handle", this.element).addClass("ui-state-default ui-corner-all");
            this.handle = this.handles.eq(0);
            this.handles.add(this.range).filter("a").click(function(g) {
                g.preventDefault()
            }).hover(function() {
                f.disabled || b(this).addClass("ui-state-hover")
            }, function() {
                b(this).removeClass("ui-state-hover")
            }).focus(function() {
                if (f.disabled) b(this).blur();
                else {
                    b(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                    b(this).addClass("ui-state-focus")
                }
            }).blur(function() {
                b(this).removeClass("ui-state-focus")
            });
            this.handles.each(function(g) {
                b(this).data("index.ui-slider-handle", g)
            });
            this.handles.keydown(function(g) {
                var e = true,
                    a = b(this).data("index.ui-slider-handle"),
                    d, h, i;
                if (!c.options.disabled) {
                    switch (g.keyCode) {
                        case b.ui.keyCode.HOME:
                        case b.ui.keyCode.END:
                        case b.ui.keyCode.PAGE_UP:
                        case b.ui.keyCode.PAGE_DOWN:
                        case b.ui.keyCode.UP:
                        case b.ui.keyCode.RIGHT:
                        case b.ui.keyCode.DOWN:
                        case b.ui.keyCode.LEFT:
                            e = false;
                            if (!c._keySliding) {
                                c._keySliding = true;
                                b(this).addClass("ui-state-active");
                                d = c._start(g, a);
                                if (d === false) return
                            }
                            break
                    }
                    i = c.options.step;
                    d = c.options.values && c.options.values.length ? (h = c.values(a)) : (h = c.value());
                    switch (g.keyCode) {
                        case b.ui.keyCode.HOME:
                            h = c._valueMin();
                            break;
                        case b.ui.keyCode.END:
                            h = c._valueMax();
                            break;
                        case b.ui.keyCode.PAGE_UP:
                            h = c._trimAlignValue(d + (c._valueMax() - c._valueMin()) / 5);
                            break;
                        case b.ui.keyCode.PAGE_DOWN:
                            h = c._trimAlignValue(d - (c._valueMax() - c._valueMin()) / 5);
                            break;
                        case b.ui.keyCode.UP:
                        case b.ui.keyCode.RIGHT:
                            if (d === c._valueMax()) return;
                            h = c._trimAlignValue(d + i);
                            break;
                        case b.ui.keyCode.DOWN:
                        case b.ui.keyCode.LEFT:
                            if (d === c._valueMin()) return;
                            h = c._trimAlignValue(d - i);
                            break
                    }
                    c._slide(g, a, h);
                    return e
                }
            }).keyup(function(g) {
                var e = b(this).data("index.ui-slider-handle");
                if (c._keySliding) {
                    c._keySliding = false;
                    c._stop(g, e);
                    c._change(g, e);
                    b(this).removeClass("ui-state-active")
                }
            });
            this._refreshValue();
            this._animateOff = false
        },
        destroy: function() {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
            this._mouseDestroy();
            return this
        },
        _mouseCapture: function(c) {
            var f = this.options,
                g, e, a, d, h;
            if (f.disabled) return false;
            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();
            g = this._normValueFromMouse({
                x: c.pageX,
                y: c.pageY
            });
            e = this._valueMax() - this._valueMin() + 1;
            d = this;
            this.handles.each(function(i) {
                var j = Math.abs(g - d.values(i));
                if (e > j) {
                    e = j;
                    a = b(this);
                    h = i
                }
            });
            if (f.range === true && this.values(1) === f.min) {
                h += 1;
                a = b(this.handles[h])
            }
            if (this._start(c, h) === false) return false;
            this._mouseSliding = true;
            d._handleIndex = h;
            a.addClass("ui-state-active").focus();
            f = a.offset();
            this._clickOffset = !b(c.target).parents().andSelf().is(".ui-slider-handle") ? {
                left: 0,
                top: 0
            } : {
                left: c.pageX - f.left - a.width() / 2,
                top: c.pageY - f.top - a.height() / 2 - (parseInt(a.css("borderTopWidth"), 10) || 0) - (parseInt(a.css("borderBottomWidth"), 10) || 0) + (parseInt(a.css("marginTop"), 10) || 0)
            };
            this._slide(c, h, g);
            return this._animateOff = true
        },
        _mouseStart: function() {
            return true
        },
        _mouseDrag: function(c) {
            var f = this._normValueFromMouse({
                x: c.pageX,
                y: c.pageY
            });
            this._slide(c, this._handleIndex, f);
            return false
        },
        _mouseStop: function(c) {
            this.handles.removeClass("ui-state-active");
            this._mouseSliding = false;
            this._stop(c, this._handleIndex);
            this._change(c, this._handleIndex);
            this._clickOffset = this._handleIndex = null;
            return this._animateOff = false
        },
        _detectOrientation: function() {
            this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function(c) {
            var f;
            if (this.orientation === "horizontal") {
                f = this.elementSize.width;
                c = c.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
            } else {
                f = this.elementSize.height;
                c = c.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
            }
            f = c / f;
            if (f > 1) f = 1;
            if (f < 0) f = 0;
            if (this.orientation === "vertical") f = 1 - f;
            c = this._valueMax() - this._valueMin();
            return this._trimAlignValue(this._valueMin() + f * c)
        },
        _start: function(c, f) {
            var g = {
                handle: this.handles[f],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                g.value = this.values(f);
                g.values = this.values()
            }
            return this._trigger("start", c, g)
        },
        _slide: function(c, f, g) {
            var e;
            if (this.options.values && this.options.values.length) {
                e = this.values(f ? 0 : 1);
                if (this.options.values.length === 2 && this.options.range === true && (f === 0 && g > e || f === 1 && g < e)) g = e;
                if (g !== this.values(f)) {
                    e = this.values();
                    e[f] = g;
                    c = this._trigger("slide", c, {
                        handle: this.handles[f],
                        value: g,
                        values: e
                    });
                    this.values(f ? 0 : 1);
                    c !== false && this.values(f, g, true)
                }
            } else if (g !== this.value()) {
                c = this._trigger("slide", c, {
                    handle: this.handles[f],
                    value: g
                });
                c !== false && this.value(g)
            }
        },
        _stop: function(c, f) {
            var g = {
                handle: this.handles[f],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                g.value = this.values(f);
                g.values = this.values()
            }
            this._trigger("stop", c, g)
        },
        _change: function(c, f) {
            if (!this._keySliding && !this._mouseSliding) {
                var g = {
                    handle: this.handles[f],
                    value: this.value()
                };
                if (this.options.values && this.options.values.length) {
                    g.value = this.values(f);
                    g.values = this.values()
                }
                this._trigger("change", c, g)
            }
        },
        value: function(c) {
            if (arguments.length) {
                this.options.value = this._trimAlignValue(c);
                this._refreshValue();
                this._change(null, 0)
            }
            return this._value()
        },
        values: function(c, f) {
            var g, e, a;
            if (arguments.length > 1) {
                this.options.values[c] = this._trimAlignValue(f);
                this._refreshValue();
                this._change(null, c)
            }
            if (arguments.length)
                if (b.isArray(arguments[0])) {
                    g = this.options.values;
                    e = arguments[0];
                    for (a = 0; a < g.length; a += 1) {
                        g[a] = this._trimAlignValue(e[a]);
                        this._change(null, a)
                    }
                    this._refreshValue()
                } else return this.options.values && this.options.values.length ? this._values(c) : this.value();
                else return this._values()
        },
        _setOption: function(c, f) {
            var g, e = 0;
            if (b.isArray(this.options.values)) e = this.options.values.length;
            b.Widget.prototype._setOption.apply(this, arguments);
            switch (c) {
                case "disabled":
                    if (f) {
                        this.handles.filter(".ui-state-focus").blur();
                        this.handles.removeClass("ui-state-hover");
                        this.handles.attr("disabled", "disabled");
                        this.element.addClass("ui-disabled")
                    } else {
                        this.handles.removeAttr("disabled");
                        this.element.removeClass("ui-disabled")
                    }
                    break;
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();
                    for (g = 0; g < e; g += 1) this._change(null, g);
                    this._animateOff = false;
                    break
            }
        },
        _value: function() {
            var c = this.options.value;
            return c = this._trimAlignValue(c)
        },
        _values: function(c) {
            var f, g;
            if (arguments.length) {
                f = this.options.values[c];
                return f = this._trimAlignValue(f)
            } else {
                f = this.options.values.slice();
                for (g = 0; g < f.length; g += 1) f[g] = this._trimAlignValue(f[g]);
                return f
            }
        },
        _trimAlignValue: function(c) {
            if (c < this._valueMin()) return this._valueMin();
            if (c > this._valueMax()) return this._valueMax();
            var f = this.options.step > 0 ? this.options.step : 1,
                g = c % f;
            c = c - g;
            if (Math.abs(g) * 2 >= f) c += g > 0 ? f : -f;
            return parseFloat(c.toFixed(5))
        },
        _valueMin: function() {
            return this.options.min
        },
        _valueMax: function() {
            return this.options.max
        },
        _refreshValue: function() {
            var c = this.options.range,
                f = this.options,
                g = this,
                e = !this._animateOff ? f.animate : false,
                a, d = {}, h, i, j, n;
            if (this.options.values && this.options.values.length) this.handles.each(function(q) {
                a = (g.values(q) - g._valueMin()) / (g._valueMax() - g._valueMin()) * 100;
                d[g.orientation === "horizontal" ? "left" : "bottom"] = a + "%";
                b(this).stop(1, 1)[e ? "animate" : "css"](d, f.animate);
                if (g.options.range === true)
                    if (g.orientation === "horizontal") {
                        if (q === 0) g.range.stop(1, 1)[e ? "animate" : "css"]({
                            left: a + "%"
                        }, f.animate);
                        if (q === 1) g.range[e ? "animate" : "css"]({
                            width: a - h + "%"
                        }, {
                            queue: false,
                            duration: f.animate
                        })
                    } else {
                        if (q === 0) g.range.stop(1, 1)[e ? "animate" : "css"]({
                            bottom: a + "%"
                        }, f.animate);
                        if (q === 1) g.range[e ? "animate" : "css"]({
                            height: a - h + "%"
                        }, {
                            queue: false,
                            duration: f.animate
                        })
                    }
                h = a
            });
            else {
                i = this.value();
                j = this._valueMin();
                n = this._valueMax();
                a = n !== j ? (i - j) / (n - j) * 100 : 0;
                d[g.orientation === "horizontal" ? "left" : "bottom"] = a + "%";
                this.handle.stop(1, 1)[e ? "animate" : "css"](d, f.animate);
                if (c === "min" && this.orientation === "horizontal") this.range.stop(1, 1)[e ? "animate" : "css"]({
                    width: a + "%"
                }, f.animate);
                if (c === "max" && this.orientation === "horizontal") this.range[e ? "animate" : "css"]({
                    width: 100 - a + "%"
                }, {
                    queue: false,
                    duration: f.animate
                });
                if (c === "min" && this.orientation === "vertical") this.range.stop(1, 1)[e ? "animate" : "css"]({
                    height: a + "%"
                }, f.animate);
                if (c === "max" && this.orientation === "vertical") this.range[e ? "animate" : "css"]({
                    height: 100 - a + "%"
                }, {
                    queue: false,
                    duration: f.animate
                })
            }
        }
    });
    b.extend(b.ui.slider, {
        version: "1.8.6"
    })
})(jQuery);
(function(b, c) {
    function f() {
        return ++e
    }

    function g() {
        return ++a
    }
    var e = 0,
        a = 0;
    b.widget("ui.tabs", {
        options: {
            add: null,
            ajaxOptions: null,
            cache: false,
            cookie: null,
            collapsible: false,
            disable: null,
            disabled: [],
            enable: null,
            event: "click",
            fx: null,
            idPrefix: "ui-tabs-",
            load: null,
            panelTemplate: "<div></div>",
            remove: null,
            select: null,
            show: null,
            spinner: "<em>Loading&#8230;</em>",
            tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
        },
        _create: function() {
            this._tabify(true)
        },
        _setOption: function(d, h) {
            if (d == "selected") this.options.collapsible && h == this.options.selected || this.select(h);
            else {
                this.options[d] = h;
                this._tabify()
            }
        },
        _tabId: function(d) {
            return d.title && d.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF-]/g, "") || this.options.idPrefix + f()
        },
        _sanitizeSelector: function(d) {
            return d.replace(/:/g, "\\:")
        },
        _cookie: function() {
            var d = this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + g());
            return b.cookie.apply(null, [d].concat(b.makeArray(arguments)))
        },
        _ui: function(d, h) {
            return {
                tab: d,
                panel: h,
                index: this.anchors.index(d)
            }
        },
        _cleanup: function() {
            this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function() {
                var d = b(this);
                d.html(d.data("label.tabs")).removeData("label.tabs")
            })
        },
        _tabify: function(d) {
            function h(r, u) {
                r.css("display", "");
                !b.support.opacity && u.opacity && r[0].style.removeAttribute("filter")
            }
            var i = this,
                j = this.options,
                n = /^#.+/;
            this.list = this.element.find("ol,ul").eq(0);
            this.lis = b(" > li:has(a[href])", this.list);
            this.anchors = this.lis.map(function() {
                return b("a", this)[0]
            });
            this.panels = b([]);
            this.anchors.each(function(r, u) {
                var v = b(u).attr("href"),
                    w = v.split("#")[0],
                    y;
                if (w && (w === location.toString().split("#")[0] || (y = b("base")[0]) && w === y.href)) {
                    v = u.hash;
                    u.href = v
                }
                if (n.test(v)) i.panels = i.panels.add(i._sanitizeSelector(v));
                else if (v && v !== "#") {
                    b.data(u, "href.tabs", v);
                    b.data(u, "load.tabs", v.replace(/#.*$/, ""));
                    v = i._tabId(u);
                    u.href = "#" + v;
                    u = b("#" + v);
                    if (!u.length) {
                        u = b(j.panelTemplate).attr("id", v).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(i.panels[r - 1] || i.list);
                        u.data("destroy.tabs", true)
                    }
                    i.panels = i.panels.add(u)
                } else j.disabled.push(r)
            });
            if (d) {
                this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
                this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
                this.lis.addClass("ui-state-default ui-corner-top");
                this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom");
                if (j.selected === c) {
                    location.hash && this.anchors.each(function(r, u) {
                        if (u.hash == location.hash) {
                            j.selected = r;
                            return false
                        }
                    });
                    if (typeof j.selected !== "number" && j.cookie) j.selected = parseInt(i._cookie(), 10);
                    if (typeof j.selected !== "number" && this.lis.filter(".ui-tabs-selected").length) j.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"));
                    j.selected = j.selected || (this.lis.length ? 0 : -1)
                } else if (j.selected === null) j.selected = -1;
                j.selected = j.selected >= 0 && this.anchors[j.selected] || j.selected < 0 ? j.selected : 0;
                j.disabled = b.unique(j.disabled.concat(b.map(this.lis.filter(".ui-state-disabled"), function(r) {
                    return i.lis.index(r)
                }))).sort();
                b.inArray(j.selected, j.disabled) != -1 && j.disabled.splice(b.inArray(j.selected, j.disabled), 1);
                this.panels.addClass("ui-tabs-hide");
                this.lis.removeClass("ui-tabs-selected ui-state-active");
                if (j.selected >= 0 && this.anchors.length) {
                    b(i._sanitizeSelector(i.anchors[j.selected].hash)).removeClass("ui-tabs-hide");
                    this.lis.eq(j.selected).addClass("ui-tabs-selected ui-state-active");
                    i.element.queue("tabs", function() {
                        i._trigger("show", null, i._ui(i.anchors[j.selected], b(i._sanitizeSelector(i.anchors[j.selected].hash))))
                    });
                    this.load(j.selected)
                }
                b(window).bind("unload", function() {
                    i.lis.add(i.anchors).unbind(".tabs");
                    i.lis = i.anchors = i.panels = null
                })
            } else j.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"));
            this.element[j.collapsible ? "addClass" : "removeClass"]("ui-tabs-collapsible");
            j.cookie && this._cookie(j.selected, j.cookie);
            d = 0;
            for (var q; q = this.lis[d]; d++) b(q)[b.inArray(d, j.disabled) != -1 && !b(q).hasClass("ui-tabs-selected") ? "addClass" : "removeClass"]("ui-state-disabled");
            j.cache === false && this.anchors.removeData("cache.tabs");
            this.lis.add(this.anchors).unbind(".tabs");
            if (j.event !== "mouseover") {
                var l = function(r, u) {
                    u.is(":not(.ui-state-disabled)") && u.addClass("ui-state-" + r)
                }, k = function(r, u) {
                        u.removeClass("ui-state-" +
                            r)
                    };
                this.lis.bind("mouseover.tabs", function() {
                    l("hover", b(this))
                });
                this.lis.bind("mouseout.tabs", function() {
                    k("hover", b(this))
                });
                this.anchors.bind("focus.tabs", function() {
                    l("focus", b(this).closest("li"))
                });
                this.anchors.bind("blur.tabs", function() {
                    k("focus", b(this).closest("li"))
                })
            }
            var m, o;
            if (j.fx)
                if (b.isArray(j.fx)) {
                    m = j.fx[0];
                    o = j.fx[1]
                } else m = o = j.fx;
            var p = o ? function(r, u) {
                    b(r).closest("li").addClass("ui-tabs-selected ui-state-active");
                    u.hide().removeClass("ui-tabs-hide").animate(o, o.duration || "normal", function() {
                        h(u, o);
                        i._trigger("show", null, i._ui(r, u[0]))
                    })
                } : function(r, u) {
                    b(r).closest("li").addClass("ui-tabs-selected ui-state-active");
                    u.removeClass("ui-tabs-hide");
                    i._trigger("show", null, i._ui(r, u[0]))
                }, s = m ? function(r, u) {
                    u.animate(m, m.duration || "normal", function() {
                        i.lis.removeClass("ui-tabs-selected ui-state-active");
                        u.addClass("ui-tabs-hide");
                        h(u, m);
                        i.element.dequeue("tabs")
                    })
                } : function(r, u) {
                    i.lis.removeClass("ui-tabs-selected ui-state-active");
                    u.addClass("ui-tabs-hide");
                    i.element.dequeue("tabs")
                };
            this.anchors.bind(j.event + ".tabs", function() {
                var r = this,
                    u = b(r).closest("li"),
                    v = i.panels.filter(":not(.ui-tabs-hide)"),
                    w = b(i._sanitizeSelector(r.hash));
                if (u.hasClass("ui-tabs-selected") && !j.collapsible || u.hasClass("ui-state-disabled") || u.hasClass("ui-state-processing") || i.panels.filter(":animated").length || i._trigger("select", null, i._ui(this, w[0])) === false) {
                    this.blur();
                    return false
                }
                j.selected = i.anchors.index(this);
                i.abort();
                if (j.collapsible)
                    if (u.hasClass("ui-tabs-selected")) {
                        j.selected = -1;
                        j.cookie && i._cookie(j.selected, j.cookie);
                        i.element.queue("tabs", function() {
                            s(r, v)
                        }).dequeue("tabs");
                        this.blur();
                        return false
                    } else
                if (!v.length) {
                    j.cookie && i._cookie(j.selected, j.cookie);
                    i.element.queue("tabs", function() {
                        p(r, w)
                    });
                    i.load(i.anchors.index(this));
                    this.blur();
                    return false
                }
                j.cookie && i._cookie(j.selected, j.cookie);
                if (w.length) {
                    v.length && i.element.queue("tabs", function() {
                        s(r, v)
                    });
                    i.element.queue("tabs", function() {
                        p(r, w)
                    });
                    i.load(i.anchors.index(this))
                } else throw "jQuery UI Tabs: Mismatching fragment identifier.";
                b.browser.msie && this.blur()
            });
            this.anchors.bind("click.tabs", function() {
                return false
            })
        },
        _getIndex: function(d) {
            if (typeof d == "string") d = this.anchors.index(this.anchors.filter("[href$=" + d + "]"));
            return d
        },
        destroy: function() {
            var d = this.options;
            this.abort();
            this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs");
            this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
            this.anchors.each(function() {
                var h = b.data(this, "href.tabs");
                if (h) this.href = h;
                var i = b(this).unbind(".tabs");
                b.each(["href", "load", "cache"], function(j, n) {
                    i.removeData(n + ".tabs")
                })
            });
            this.lis.unbind(".tabs").add(this.panels).each(function() {
                b.data(this, "destroy.tabs") ? b(this).remove() : b(this).removeClass("ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-hover ui-state-focus ui-state-disabled ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide")
            });
            d.cookie && this._cookie(null, d.cookie);
            return this
        },
        add: function(d, h, i) {
            if (i === c) i = this.anchors.length;
            var j = this,
                n = this.options;
            h = b(n.tabTemplate.replace(/#\{href\}/g, d).replace(/#\{label\}/g, h));
            d = !d.indexOf("#") ? d.replace("#", "") : this._tabId(b("a", h)[0]);
            h.addClass("ui-state-default ui-corner-top").data("destroy.tabs", true);
            var q = b("#" + d);
            q.length || (q = b(n.panelTemplate).attr("id", d).data("destroy.tabs", true));
            q.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide");
            if (i >= this.lis.length) {
                h.appendTo(this.list);
                q.appendTo(this.list[0].parentNode)
            } else {
                h.insertBefore(this.lis[i]);
                q.insertBefore(this.panels[i])
            }
            n.disabled = b.map(n.disabled, function(l) {
                return l >= i ? ++l : l
            });
            this._tabify();
            if (this.anchors.length == 1) {
                n.selected = 0;
                h.addClass("ui-tabs-selected ui-state-active");
                q.removeClass("ui-tabs-hide");
                this.element.queue("tabs", function() {
                    j._trigger("show", null, j._ui(j.anchors[0], j.panels[0]))
                });
                this.load(0)
            }
            this._trigger("add", null, this._ui(this.anchors[i], this.panels[i]));
            return this
        },
        remove: function(d) {
            d = this._getIndex(d);
            var h = this.options,
                i = this.lis.eq(d).remove(),
                j = this.panels.eq(d).remove();
            if (i.hasClass("ui-tabs-selected") && this.anchors.length > 1) this.select(d + (d + 1 < this.anchors.length ? 1 : -1));
            h.disabled = b.map(b.grep(h.disabled, function(n) {
                return n != d
            }), function(n) {
                return n >= d ? --n : n
            });
            this._tabify();
            this._trigger("remove", null, this._ui(i.find("a")[0], j[0]));
            return this
        },
        enable: function(d) {
            d = this._getIndex(d);
            var h = this.options;
            if (b.inArray(d, h.disabled) != -1) {
                this.lis.eq(d).removeClass("ui-state-disabled");
                h.disabled = b.grep(h.disabled, function(i) {
                    return i != d
                });
                this._trigger("enable", null, this._ui(this.anchors[d], this.panels[d]));
                return this
            }
        },
        disable: function(d) {
            d = this._getIndex(d);
            var h = this.options;
            if (d != h.selected) {
                this.lis.eq(d).addClass("ui-state-disabled");
                h.disabled.push(d);
                h.disabled.sort();
                this._trigger("disable", null, this._ui(this.anchors[d], this.panels[d]))
            }
            return this
        },
        select: function(d) {
            d = this._getIndex(d);
            if (d == -1)
                if (this.options.collapsible && this.options.selected != -1) d = this.options.selected;
                else return this;
            this.anchors.eq(d).trigger(this.options.event + ".tabs");
            return this
        },
        load: function(d) {
            d = this._getIndex(d);
            var h = this,
                i = this.options,
                j = this.anchors.eq(d)[0],
                n = b.data(j, "load.tabs");
            this.abort();
            if (!n || this.element.queue("tabs").length !== 0 && b.data(j, "cache.tabs")) this.element.dequeue("tabs");
            else {
                this.lis.eq(d).addClass("ui-state-processing");
                if (i.spinner) {
                    var q = b("span", j);
                    q.data("label.tabs", q.html()).html(i.spinner)
                }
                this.xhr = b.ajax(b.extend({}, i.ajaxOptions, {
                    url: n,
                    success: function(l, k) {
                        b(h._sanitizeSelector(j.hash)).html(l);
                        h._cleanup();
                        i.cache && b.data(j, "cache.tabs", true);
                        h._trigger("load", null, h._ui(h.anchors[d], h.panels[d]));
                        try {
                            i.ajaxOptions.success(l, k)
                        } catch (m) {}
                    },
                    error: function(l, k) {
                        h._cleanup();
                        h._trigger("load", null, h._ui(h.anchors[d], h.panels[d]));
                        try {
                            i.ajaxOptions.error(l, k, d, j)
                        } catch (m) {}
                    }
                }));
                h.element.dequeue("tabs");
                return this
            }
        },
        abort: function() {
            this.element.queue([]);
            this.panels.stop(false, true);
            this.element.queue("tabs", this.element.queue("tabs").splice(-2, 2));
            if (this.xhr) {
                this.xhr.abort();
                delete this.xhr
            }
            this._cleanup();
            return this
        },
        url: function(d, h) {
            this.anchors.eq(d).removeData("cache.tabs").data("load.tabs", h);
            return this
        },
        length: function() {
            return this.anchors.length
        }
    });
    b.extend(b.ui.tabs, {
        version: "1.8.6"
    });
    b.extend(b.ui.tabs.prototype, {
        rotation: null,
        rotate: function(d, h) {
            var i = this,
                j = this.options,
                n = i._rotate || (i._rotate = function(q) {
                    clearTimeout(i.rotation);
                    i.rotation = setTimeout(function() {
                        var l = j.selected;
                        i.select(++l < i.anchors.length ? l : 0)
                    }, d);
                    q && q.stopPropagation()
                });
            h = i._unrotate || (i._unrotate = !h ? function(q) {
                q.clientX && i.rotate(null)
            } : function() {
                t = j.selected;
                n()
            });
            if (d) {
                this.element.bind("tabsshow", n);
                this.anchors.bind(j.event + ".tabs", h);
                n()
            } else {
                clearTimeout(i.rotation);
                this.element.unbind("tabsshow", n);
                this.anchors.unbind(j.event + ".tabs", h);
                delete this._rotate;
                delete this._unrotate
            }
            return this
        }
    })
})(jQuery);;
(function(b) {
    var m, t, u, f, D, j, E, n, z, A, q = 0,
        e = {}, o = [],
        p = 0,
        d = {}, l = [],
        G = null,
        v = new Image,
        J = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,
        W = /[^\.]\.(swf)\s*$/i,
        K, L = 1,
        y = 0,
        s = "",
        r, i, h = false,
        B = b.extend(b("<div/>")[0], {
            prop: 0
        }),
        M = b.browser.msie && b.browser.version < 7 && !window.XMLHttpRequest,
        N = function() {
            t.hide();
            v.onerror = v.onload = null;
            G && G.abort();
            m.empty()
        }, O = function() {
            if (false === e.onError(o, q, e)) {
                t.hide();
                h = false
            } else {
                e.titleShow = false;
                e.width = "auto";
                e.height = "auto";
                m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');
                F()
            }
        }, I = function() {
            var a = o[q],
                c, g, k, C, P, w;
            N();
            e = b.extend({}, b.fn.fancybox.defaults, typeof b(a).data("fancybox") == "undefined" ? e : b(a).data("fancybox"));
            w = e.onStart(o, q, e);
            if (w === false) h = false;
            else {
                if (typeof w == "object") e = b.extend(e, w);
                k = e.title || (a.nodeName ? b(a).attr("title") : a.title) || "";
                if (a.nodeName && !e.orig) e.orig = b(a).children("img:first").length ? b(a).children("img:first") : b(a);
                if (k === "" && e.orig && e.titleFromAlt) k = e.orig.attr("alt");
                c = e.href || (a.nodeName ? b(a).attr("href") : a.href) || null;
                if (/^(?:javascript)/i.test(c) || c == "#") c = null;
                if (e.type) {
                    g = e.type;
                    if (!c) c = e.content
                } else if (e.content) g = "html";
                else if (c) g = c.match(J) ? "image" : c.match(W) ? "swf" : b(a).hasClass("iframe") ? "iframe" : c.indexOf("#") === 0 ? "inline" : "ajax";
                if (g) {
                    if (g == "inline") {
                        a = c.substr(c.indexOf("#"));
                        g = b(a).length > 0 ? "inline" : "ajax"
                    }
                    e.type = g;
                    e.href = c;
                    e.title = k;
                    if (e.autoDimensions)
                        if (e.type == "html" || e.type == "inline" || e.type == "ajax") {
                            e.width = "auto";
                            e.height = "auto"
                        } else e.autoDimensions = false;
                    if (e.modal) {
                        e.overlayShow = true;
                        e.hideOnOverlayClick = false;
                        e.hideOnContentClick = false;
                        e.enableEscapeButton = false;
                        e.showCloseButton = false
                    }
                    e.padding = parseInt(e.padding, 10);
                    e.margin = parseInt(e.margin, 10);
                    m.css("padding", e.padding + e.margin);
                    b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change", function() {
                        b(this).replaceWith(j.children())
                    });
                    switch (g) {
                        case "html":
                            m.html(e.content);
                            F();
                            break;
                        case "inline":
                            if (b(a).parent().is("#fancybox-content") === true) {
                                h = false;
                                break
                            }
                            b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup", function() {
                                b(this).replaceWith(j.children())
                            }).bind("fancybox-cancel", function() {
                                b(this).replaceWith(m.children())
                            });
                            b(a).appendTo(m);
                            F();
                            break;
                        case "image":
                            h = false;
                            b.fancybox.showActivity();
                            v = new Image;
                            v.onerror = function() {
                                O()
                            };
                            v.onload = function() {
                                h = true;
                                v.onerror = v.onload = null;
                                e.width = v.width;
                                e.height = v.height;
                                b("<img />").attr({
                                    id: "fancybox-img",
                                    src: v.src,
                                    alt: e.title
                                }).appendTo(m);
                                Q()
                            };
                            v.src = c;
                            break;
                        case "swf":
                            e.scrolling = "no";
                            C = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + e.width + '" height="' + e.height + '"><param name="movie" value="' + c + '"></param>';
                            P = "";
                            b.each(e.swf, function(x, H) {
                                C += '<param name="' + x + '" value="' + H + '"></param>';
                                P += " " + x + '="' + H + '"'
                            });
                            C += '<embed src="' + c + '" type="application/x-shockwave-flash" width="' + e.width + '" height="' + e.height + '"' + P + "></embed></object>";
                            m.html(C);
                            F();
                            break;
                        case "ajax":
                            h = false;
                            b.fancybox.showActivity();
                            e.ajax.win = e.ajax.success;
                            G = b.ajax(b.extend({}, e.ajax, {
                                url: c,
                                data: e.ajax.data || {},
                                error: function(x) {
                                    x.status > 0 && O()
                                },
                                success: function(x, H, R) {
                                    if ((typeof R == "object" ? R : G).status == 200) {
                                        if (typeof e.ajax.win == "function") {
                                            w = e.ajax.win(c, x, H, R);
                                            if (w === false) {
                                                t.hide();
                                                return
                                            } else if (typeof w == "string" || typeof w == "object") x = w
                                        }
                                        m.html(x);
                                        F()
                                    }
                                }
                            }));
                            break;
                        case "iframe":
                            Q()
                    }
                } else O()
            }
        }, F = function() {
            var a = e.width,
                c = e.height;
            a = a.toString().indexOf("%") > -1 ? parseInt((b(window).width() - e.margin * 2) * parseFloat(a) / 100, 10) + "px" : a == "auto" ? "auto" : a + "px";
            c = c.toString().indexOf("%") > -1 ? parseInt((b(window).height() - e.margin * 2) * parseFloat(c) / 100, 10) + "px" : c == "auto" ? "auto" : c + "px";
            m.wrapInner('<div style="width:' + a + ";height:" + c + ";overflow: " + (e.scrolling == "auto" ? "auto" : e.scrolling == "yes" ? "scroll" : "hidden") + ';position:relative;"></div>');
            e.width = m.width();
            e.height = m.height();
            Q()
        }, Q = function() {
            var a, c;
            t.hide();
            if (f.is(":visible") && false === d.onCleanup(l, p, d)) {
                b.event.trigger("fancybox-cancel");
                h = false
            } else {
                h = true;
                b(j.add(u)).unbind();
                b(window).unbind("resize.fb scroll.fb");
                b(document).unbind("keydown.fb");
                f.is(":visible") && d.titlePosition !== "outside" && f.css("height", f.height());
                l = o;
                p = q;
                d = e;
                if (d.overlayShow) {
                    u.css({
                        "background-color": d.overlayColor,
                        opacity: d.overlayOpacity,
                        cursor: d.hideOnOverlayClick ? "pointer" : "auto",
                        height: b(document).height()
                    });
                    if (!u.is(":visible")) {
                        M && b("select:not(#fancybox-tmp select)").filter(function() {
                            return this.style.visibility !== "hidden"
                        }).css({
                            visibility: "hidden"
                        }).one("fancybox-cleanup", function() {
                            this.style.visibility = "inherit"
                        });
                        u.show()
                    }
                } else u.hide();
                i = X();
                s = d.title || "";
                y = 0;
                n.empty().removeAttr("style").removeClass();
                if (d.titleShow !== false) {
                    if (b.isFunction(d.titleFormat)) a = d.titleFormat(s, l, p, d);
                    else a = s && s.length ? d.titlePosition == "float" ? '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + s + '</td><td id="fancybox-title-float-right"></td></tr></table>' : '<div id="fancybox-title-' + d.titlePosition + '">' + s + "</div>" : false;
                    s = a;
                    if (!(!s || s === "")) {
                        n.addClass("fancybox-title-" + d.titlePosition).html(s).appendTo("body").show();
                        switch (d.titlePosition) {
                            case "inside":
                                n.css({
                                    width: i.width - d.padding * 2,
                                    marginLeft: d.padding,
                                    marginRight: d.padding
                                });
                                y = n.outerHeight(true);
                                n.appendTo(D);
                                i.height += y;
                                break;
                            case "over":
                                n.css({
                                    marginLeft: d.padding,
                                    width: i.width - d.padding * 2,
                                    bottom: d.padding
                                }).appendTo(D);
                                break;
                            case "float":
                                n.css("left", parseInt((n.width() - i.width - 40) / 2, 10) * -1).appendTo(f);
                                break;
                            default:
                                n.css({
                                    width: i.width - d.padding * 2,
                                    paddingLeft: d.padding,
                                    paddingRight: d.padding
                                }).appendTo(f)
                        }
                    }
                }
                n.hide();
                if (f.is(":visible")) {
                    b(E.add(z).add(A)).hide();
                    a = f.position();
                    r = {
                        top: a.top,
                        left: a.left,
                        width: f.width(),
                        height: f.height()
                    };
                    c = r.width == i.width && r.height == i.height;
                    j.fadeTo(d.changeFade, 0.3, function() {
                        var g = function() {
                            j.html(m.contents()).fadeTo(d.changeFade, 1, S)
                        };
                        b.event.trigger("fancybox-change");
                        j.empty().removeAttr("filter").css({
                            "border-width": d.padding,
                            width: i.width - d.padding * 2,
                            height: e.autoDimensions ? "auto" : i.height - y - d.padding * 2
                        });
                        if (c) g();
                        else {
                            B.prop = 0;
                            b(B).animate({
                                prop: 1
                            }, {
                                duration: d.changeSpeed,
                                easing: d.easingChange,
                                step: T,
                                complete: g
                            })
                        }
                    })
                } else {
                    f.removeAttr("style");
                    j.css("border-width", d.padding);
                    if (d.transitionIn == "elastic") {
                        r = V();
                        j.html(m.contents());
                        f.show();
                        if (d.opacity) i.opacity = 0;
                        B.prop = 0;
                        b(B).animate({
                            prop: 1
                        }, {
                            duration: d.speedIn,
                            easing: d.easingIn,
                            step: T,
                            complete: S
                        })
                    } else {
                        d.titlePosition == "inside" && y > 0 && n.show();
                        j.css({
                            width: i.width - d.padding * 2,
                            height: e.autoDimensions ? "auto" : i.height - y - d.padding * 2
                        }).html(m.contents());
                        f.css(i).fadeIn(d.transitionIn == "none" ? 0 : d.speedIn, S)
                    }
                }
            }
        }, Y = function() {
            if (d.enableEscapeButton || d.enableKeyboardNav) b(document).bind("keydown.fb", function(a) {
                if (a.keyCode == 27 && d.enableEscapeButton) {
                    a.preventDefault();
                    b.fancybox.close()
                } else if ((a.keyCode == 37 || a.keyCode == 39) && d.enableKeyboardNav && a.target.tagName !== "INPUT" && a.target.tagName !== "TEXTAREA" && a.target.tagName !== "SELECT") {
                    a.preventDefault();
                    b.fancybox[a.keyCode == 37 ? "prev" : "next"]()
                }
            });
            if (d.showNavArrows) {
                if (d.cyclic && l.length > 1 || p !== 0) z.show();
                if (d.cyclic && l.length > 1 || p != l.length - 1) A.show()
            } else {
                z.hide();
                A.hide()
            }
        }, S = function() {
            if (!b.support.opacity) {
                j.get(0).style.removeAttribute("filter");
                f.get(0).style.removeAttribute("filter")
            }
            e.autoDimensions && j.css("height", "auto");
            f.css("height", "auto");
            s && s.length && n.show();
            d.showCloseButton && E.show();
            Y();
            d.hideOnContentClick && j.bind("click", b.fancybox.close);
            d.hideOnOverlayClick && u.bind("click", b.fancybox.close);
            b(window).bind("resize.fb", b.fancybox.resize);
            d.centerOnScroll && b(window).bind("scroll.fb", b.fancybox.center);
            if (d.type == "iframe") b('<iframe id="fancybox-frame" name="fancybox-frame' + (new Date).getTime() + '" frameborder="0" hspace="0" ' + (b.browser.msie ? 'allowtransparency="true""' : "") + ' scrolling="' + e.scrolling + '" src="' + d.href + '"></iframe>').appendTo(j);
            f.show();
            h = false;
            b.fancybox.center();
            d.onComplete(l, p, d);
            var a, c;
            if (l.length - 1 > p) {
                a = l[p + 1].href;
                if (typeof a !== "undefined" && a.match(J)) {
                    c = new Image;
                    c.src = a
                }
            }
            if (p > 0) {
                a = l[p - 1].href;
                if (typeof a !== "undefined" && a.match(J)) {
                    c = new Image;
                    c.src = a
                }
            }
        }, T = function(a) {
            var c = {
                width: parseInt(r.width + (i.width - r.width) * a, 10),
                height: parseInt(r.height + (i.height - r.height) * a, 10),
                top: parseInt(r.top + (i.top - r.top) * a, 10),
                left: parseInt(r.left + (i.left - r.left) * a, 10)
            };
            if (typeof i.opacity !== "undefined") c.opacity = a < 0.5 ? 0.5 : a;
            f.css(c);
            j.css({
                width: c.width - d.padding * 2,
                height: c.height - y * a - d.padding * 2
            })
        }, U = function() {
            return [b(window).width() - d.margin * 2, b(window).height() - d.margin * 2, b(document).scrollLeft() + d.margin, b(document).scrollTop() + d.margin]
        }, X = function() {
            var a = U(),
                c = {}, g = d.autoScale,
                k = d.padding * 2;
            c.width = d.width.toString().indexOf("%") > -1 ? parseInt(a[0] * parseFloat(d.width) / 100, 10) : d.width + k;
            c.height = d.height.toString().indexOf("%") > -1 ? parseInt(a[1] * parseFloat(d.height) / 100, 10) : d.height + k;
            if (g && (c.width > a[0] || c.height > a[1]))
                if (e.type == "image" || e.type == "swf") {
                    g = d.width / d.height;
                    if (c.width > a[0]) {
                        c.width = a[0];
                        c.height = parseInt((c.width - k) / g + k, 10)
                    }
                    if (c.height > a[1]) {
                        c.height = a[1];
                        c.width = parseInt((c.height - k) * g + k, 10)
                    }
                } else {
                    c.width = Math.min(c.width, a[0]);
                    c.height = Math.min(c.height, a[1])
                }
            c.top = parseInt(Math.max(a[3] - 20, a[3] + (a[1] - c.height - 40) * 0.5), 10);
            c.left = parseInt(Math.max(a[2] - 20, a[2] + (a[0] - c.width - 40) * 0.5), 10);
            return c
        }, V = function() {
            var a = e.orig ? b(e.orig) : false,
                c = {};
            if (a && a.length) {
                c = a.offset();
                c.top += parseInt(a.css("paddingTop"), 10) || 0;
                c.left += parseInt(a.css("paddingLeft"), 10) || 0;
                c.top += parseInt(a.css("border-top-width"), 10) || 0;
                c.left += parseInt(a.css("border-left-width"), 10) || 0;
                c.width = a.width();
                c.height = a.height();
                c = {
                    width: c.width + d.padding * 2,
                    height: c.height + d.padding * 2,
                    top: c.top - d.padding - 20,
                    left: c.left - d.padding - 20
                }
            } else {
                a = U();
                c = {
                    width: d.padding * 2,
                    height: d.padding * 2,
                    top: parseInt(a[3] + a[1] * 0.5, 10),
                    left: parseInt(a[2] + a[0] * 0.5, 10)
                }
            }
            return c
        }, Z = function() {
            if (t.is(":visible")) {
                b("div", t).css("top", L * -40 + "px");
                L = (L + 1) % 12
            } else clearInterval(K)
        };
    b.fn.fancybox = function(a) {
        if (!b(this).length) return this;
        b(this).data("fancybox", b.extend({}, a, b.metadata ? b(this).metadata() : {})).unbind("click.fb").bind("click.fb", function(c) {
            c.preventDefault();
            if (!h) {
                h = true;
                b(this).blur();
                o = [];
                q = 0;
                c = b(this).attr("rel") || "";
                if (!c || c == "" || c === "nofollow") o.push(this);
                else {
                    o = b("a[rel=" + c + "], area[rel=" + c + "]");
                    q = o.index(this)
                }
                I()
            }
        });
        return this
    };
    b.fancybox = function(a, c) {
        var g;
        if (!h) {
            h = true;
            g = typeof c !== "undefined" ? c : {};
            o = [];
            q = parseInt(g.index, 10) || 0;
            if (b.isArray(a)) {
                for (var k = 0, C = a.length; k < C; k++)
                    if (typeof a[k] == "object") b(a[k]).data("fancybox", b.extend({}, g, a[k]));
                    else a[k] = b({}).data("fancybox", b.extend({
                        content: a[k]
                    }, g));
                o = jQuery.merge(o, a)
            } else {
                if (typeof a == "object") b(a).data("fancybox", b.extend({}, g, a));
                else a = b({}).data("fancybox", b.extend({
                    content: a
                }, g));
                o.push(a)
            } if (q > o.length || q < 0) q = 0;
            I()
        }
    };
    b.fancybox.showActivity = function() {
        clearInterval(K);
        t.show();
        K = setInterval(Z, 66)
    };
    b.fancybox.hideActivity = function() {
        t.hide()
    };
    b.fancybox.next = function() {
        return b.fancybox.pos(p +
            1)
    };
    b.fancybox.prev = function() {
        return b.fancybox.pos(p - 1)
    };
    b.fancybox.pos = function(a) {
        if (!h) {
            a = parseInt(a);
            o = l;
            if (a > -1 && a < l.length) {
                q = a;
                I()
            } else if (d.cyclic && l.length > 1) {
                q = a >= l.length ? 0 : l.length - 1;
                I()
            }
        }
    };
    b.fancybox.cancel = function() {
        if (!h) {
            h = true;
            b.event.trigger("fancybox-cancel");
            N();
            e.onCancel(o, q, e);
            h = false
        }
    };
    b.fancybox.close = function() {
        function a() {
            u.fadeOut("fast");
            n.empty().hide();
            f.hide();
            b.event.trigger("fancybox-cleanup");
            j.empty();
            d.onClosed(l, p, d);
            l = e = [];
            p = q = 0;
            d = e = {};
            h = false
        }
        if (!(h || f.is(":hidden"))) {
            h = true;
            if (d && false === d.onCleanup(l, p, d)) h = false;
            else {
                N();
                b(E.add(z).add(A)).hide();
                b(j.add(u)).unbind();
                b(window).unbind("resize.fb scroll.fb");
                b(document).unbind("keydown.fb");
                j.find("iframe").attr("src", M && /^https/i.test(window.location.href || "") ? "javascript:void(false)" : "about:blank");
                d.titlePosition !== "inside" && n.empty();
                f.stop();
                if (d.transitionOut == "elastic") {
                    r = V();
                    var c = f.position();
                    i = {
                        top: c.top,
                        left: c.left,
                        width: f.width(),
                        height: f.height()
                    };
                    if (d.opacity) i.opacity = 1;
                    n.empty().hide();
                    B.prop = 1;
                    b(B).animate({
                        prop: 0
                    }, {
                        duration: d.speedOut,
                        easing: d.easingOut,
                        step: T,
                        complete: a
                    })
                } else f.fadeOut(d.transitionOut == "none" ? 0 : d.speedOut, a)
            }
        }
    };
    b.fancybox.resize = function() {
        u.is(":visible") && u.css("height", b(document).height());
        b.fancybox.center(true)
    };
    b.fancybox.center = function(a) {
        var c, g;
        if (!h) {
            g = a === true ? 1 : 0;
            c = U();
            !g && (f.width() > c[0] || f.height() > c[1]) || f.stop().animate({
                top: parseInt(Math.max(c[3] - 20, c[3] + (c[1] - j.height() - 40) * 0.5 - d.padding)),
                left: parseInt(Math.max(c[2] - 20, c[2] + (c[0] - j.width() - 40) * 0.5 -
                    d.padding))
            }, typeof a == "number" ? a : 200)
        }
    };
    b.fancybox.init = function() {
        if (!b("#fancybox-wrap").length) {
            b("body").append(m = b('<div id="fancybox-tmp"></div>'), t = b('<div id="fancybox-loading"><div></div></div>'), u = b('<div id="fancybox-overlay"></div>'), f = b('<div id="fancybox-wrap"></div>'));
            D = b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);
            D.append(j = b('<div id="fancybox-content"></div>'), E = b('<a id="fancybox-close"></a>'), n = b('<div id="fancybox-title"></div>'), z = b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'), A = b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));
            E.click(b.fancybox.close);
            t.click(b.fancybox.cancel);
            z.click(function(a) {
                a.preventDefault();
                b.fancybox.prev()
            });
            A.click(function(a) {
                a.preventDefault();
                b.fancybox.next()
            });
            b.fn.mousewheel && f.bind("mousewheel.fb", function(a, c) {
                if (h) a.preventDefault();
                else if (b(a.target).get(0).clientHeight == 0 || b(a.target).get(0).scrollHeight === b(a.target).get(0).clientHeight) {
                    a.preventDefault();
                    b.fancybox[c > 0 ? "prev" : "next"]()
                }
            });
            b.support.opacity || f.addClass("fancybox-ie");
            if (M) {
                t.addClass("fancybox-ie6");
                f.addClass("fancybox-ie6");
                b('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || "") ? "javascript:void(false)" : "about:blank") + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D)
            }
        }
    };
    b.fn.fancybox.defaults = {
        padding: 10,
        margin: 40,
        opacity: false,
        modal: false,
        cyclic: false,
        scrolling: "auto",
        width: 560,
        height: 340,
        autoScale: true,
        autoDimensions: true,
        centerOnScroll: false,
        ajax: {},
        swf: {
            wmode: "transparent"
        },
        hideOnOverlayClick: true,
        hideOnContentClick: false,
        overlayShow: true,
        overlayOpacity: 0.7,
        overlayColor: "#777",
        titleShow: true,
        titlePosition: "float",
        titleFormat: null,
        titleFromAlt: false,
        transitionIn: "fade",
        transitionOut: "fade",
        speedIn: 300,
        speedOut: 300,
        changeSpeed: 300,
        changeFade: "fast",
        easingIn: "swing",
        easingOut: "swing",
        showCloseButton: true,
        showNavArrows: true,
        enableEscapeButton: true,
        enableKeyboardNav: true,
        onStart: function() {},
        onCancel: function() {},
        onComplete: function() {},
        onCleanup: function() {},
        onClosed: function() {},
        onError: function() {}
    };
    b(document).ready(function() {
        b.fancybox.init()
    })
})(jQuery);
jQuery.cookie = function(key, value, options) {
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        value = String(value);
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    options = value || {};
    var result, decode = options.raw ? function(s) {
            return s;
        } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

function intToHex(i) {
    var hex = parseInt(i).toString(16);
    return (hex.length < 2) ? "0" + hex : hex;
}

function hsvToRgb(h, s, v) {
    var s = s / 100,
        v = v / 100;
    var hi = Math.floor((h / 60) % 6);
    var f = (h / 60) - hi;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var rgb = [];
    switch (hi) {
        case 0:
            rgb = [v, t, p];
            break;
        case 1:
            rgb = [q, v, p];
            break;
        case 2:
            rgb = [p, v, t];
            break;
        case 3:
            rgb = [p, q, v];
            break;
        case 4:
            rgb = [t, p, v];
            break;
        case 5:
            rgb = [v, p, q];
            break;
    }
    var r = Math.min(255, Math.round(rgb[0] * 256)),
        g = Math.min(255, Math.round(rgb[1] * 256)),
        b = Math.min(255, Math.round(rgb[2] * 256));
    return [r, g, b];
}

function rgbToHsv(r, g, b) {
    var r = (r / 255),
        g = (g / 255),
        b = (b / 255);
    var min = Math.min(Math.min(r, g), b),
        max = Math.max(Math.max(r, g), b),
        delta = max - min;
    var value = max,
        saturation, hue;
    if (max == min) {
        hue = 0;
    } else if (max == r) {
        hue = (60 * ((g - b) / (max - min))) % 360;
    } else if (max == g) {
        hue = 60 * ((b - r) / (max - min)) + 120;
    } else if (max == b) {
        hue = 60 * ((r - g) / (max - min)) + 240;
    }
    if (hue < 0) {
        hue += 360;
    }
    if (max == 0) {
        saturation = 0;
    } else {
        saturation = 1 - (min / max);
    }
    return [Math.round(hue), Math.round(saturation * 100), Math.round(value * 100)];
}
(function($) {
    $.fn.tipTip = function(options) {
        var defaults = {
            activation: "hover",
            keepAlive: false,
            maxWidth: "200px",
            edgeOffset: 3,
            defaultPosition: "bottom",
            delay: 400,
            fadeIn: 200,
            fadeOut: 200,
            attribute: "title",
            content: false,
            enter: function() {},
            exit: function() {}
        };
        var opts = $.extend(defaults, options);
        if ($("#tiptip_holder").length <= 0) {
            var tiptip_holder = $('<div id="tiptip_holder" style="max-width:' + opts.maxWidth + ';"></div>');
            var tiptip_content = $('<div id="tiptip_content"></div>');
            var tiptip_arrow = $('<div id="tiptip_arrow"></div>');
            $("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>')))
        } else {
            var tiptip_holder = $("#tiptip_holder");
            var tiptip_content = $("#tiptip_content");
            var tiptip_arrow = $("#tiptip_arrow")
        }
        return this.each(function() {
            var org_elem = $(this);
            if (opts.content) {
                var org_title = opts.content
            } else {
                var org_title = org_elem.attr(opts.attribute)
            } if (org_title != "") {
                if (!opts.content) {
                    org_elem.removeAttr(opts.attribute)
                }
                var timeout = false;
                if (opts.activation == "hover") {
                    org_elem.hover(function() {
                        active_tiptip()
                    }, function() {
                        if (!opts.keepAlive) {
                            deactive_tiptip()
                        }
                    });
                    if (opts.keepAlive) {
                        tiptip_holder.hover(function() {}, function() {
                            deactive_tiptip()
                        })
                    }
                } else if (opts.activation == "focus") {
                    org_elem.focus(function() {
                        active_tiptip()
                    }).blur(function() {
                        deactive_tiptip()
                    })
                } else if (opts.activation == "click") {
                    org_elem.click(function() {
                        active_tiptip();
                        return false
                    }).hover(function() {}, function() {
                        if (!opts.keepAlive) {
                            deactive_tiptip()
                        }
                    });
                    if (opts.keepAlive) {
                        tiptip_holder.hover(function() {}, function() {
                            deactive_tiptip()
                        })
                    }
                }

                function active_tiptip() {
                    opts.enter.call(this);
                    tiptip_content.html(org_title);
                    tiptip_holder.hide().removeAttr("class").css("margin", "0");
                    tiptip_arrow.removeAttr("style");
                    var top = parseInt(org_elem.offset()['top']);
                    var left = parseInt(org_elem.offset()['left']);
                    var org_width = parseInt(org_elem.outerWidth());
                    var org_height = parseInt(org_elem.outerHeight());
                    var tip_w = tiptip_holder.outerWidth();
                    var tip_h = tiptip_holder.outerHeight();
                    var w_compare = Math.round((org_width - tip_w) / 2);
                    var h_compare = Math.round((org_height - tip_h) / 2);
                    var marg_left = Math.round(left + w_compare);
                    var marg_top = Math.round(top + org_height + opts.edgeOffset);
                    var t_class = "";
                    var arrow_top = "";
                    var arrow_left = Math.round(tip_w - 12) / 2;
                    if (opts.defaultPosition == "bottom") {
                        t_class = "_bottom"
                    } else if (opts.defaultPosition == "top") {
                        t_class = "_top"
                    } else if (opts.defaultPosition == "left") {
                        t_class = "_left"
                    } else if (opts.defaultPosition == "right") {
                        t_class = "_right"
                    }
                    var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
                    var left_compare = (tip_w + left) > parseInt($(window).width());
                    if ((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + opts.edgeOffset + 5))) {
                        t_class = "_right";
                        arrow_top = Math.round(tip_h - 13) / 2;
                        arrow_left = -12;
                        marg_left = Math.round(left + org_width + opts.edgeOffset);
                        marg_top = Math.round(top + h_compare)
                    } else if ((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)) {
                        t_class = "_left";
                        arrow_top = Math.round(tip_h - 13) / 2;
                        arrow_left = Math.round(tip_w);
                        marg_left = Math.round(left - (tip_w + opts.edgeOffset + 5));
                        marg_top = Math.round(top + h_compare)
                    }
                    var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
                    var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0;
                    if (top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)) {
                        if (t_class == "_top" || t_class == "_bottom") {
                            t_class = "_top"
                        } else {
                            t_class = t_class + "_top"
                        }
                        arrow_top = tip_h;
                        marg_top = Math.round(top - (tip_h + 5 + opts.edgeOffset))
                    } else if (bottom_compare | (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)) {
                        if (t_class == "_top" || t_class == "_bottom") {
                            t_class = "_bottom"
                        } else {
                            t_class = t_class + "_bottom"
                        }
                        arrow_top = -12;
                        marg_top = Math.round(top + org_height + opts.edgeOffset)
                    }
                    if (t_class == "_right_top" || t_class == "_left_top") {
                        marg_top = marg_top + 5
                    } else if (t_class == "_right_bottom" || t_class == "_left_bottom") {
                        marg_top = marg_top - 5
                    }
                    if (t_class == "_left_top" || t_class == "_left_bottom") {
                        marg_left = marg_left + 5
                    }
                    tiptip_arrow.css({
                        "margin-left": arrow_left + "px",
                        "margin-top": arrow_top + "px"
                    });
                    tiptip_holder.css({
                        "margin-left": marg_left + "px",
                        "margin-top": marg_top + "px"
                    }).attr("class", "tip" + t_class);
                    if (timeout) {
                        clearTimeout(timeout)
                    }
                    timeout = setTimeout(function() {
                        tiptip_holder.stop(true, true).fadeIn(opts.fadeIn)
                    }, opts.delay)
                }

                function deactive_tiptip() {
                    opts.exit.call(this);
                    if (timeout) {
                        clearTimeout(timeout)
                    }
                    tiptip_holder.fadeOut(opts.fadeOut)
                }
            }
        })
    }
})(jQuery);
(function($) {
    var defaults = {
        common: {
            type: 'line',
            lineColor: '#00f',
            fillColor: '#cdf',
            defaultPixelsPerValue: 3,
            width: 'auto',
            height: 'auto',
            composite: false,
            tagValuesAttribute: 'values',
            tagOptionsPrefix: 'spark',
            enableTagOptions: false
        },
        line: {
            spotColor: '#f80',
            spotRadius: 1.5,
            minSpotColor: '#f80',
            maxSpotColor: '#f80',
            lineWidth: 1,
            normalRangeMin: undefined,
            normalRangeMax: undefined,
            normalRangeColor: '#ccc',
            drawNormalOnTop: false,
            chartRangeMin: undefined,
            chartRangeMax: undefined,
            chartRangeMinX: undefined,
            chartRangeMaxX: undefined
        },
        bar: {
            barColor: '#00f',
            negBarColor: '#f44',
            zeroColor: undefined,
            nullColor: undefined,
            zeroAxis: undefined,
            barWidth: 4,
            barSpacing: 1,
            chartRangeMax: undefined,
            chartRangeMin: undefined,
            chartRangeClip: false,
            colorMap: undefined
        },
        tristate: {
            barWidth: 4,
            barSpacing: 1,
            posBarColor: '#6f6',
            negBarColor: '#f44',
            zeroBarColor: '#999',
            colorMap: {}
        },
        discrete: {
            lineHeight: 'auto',
            thresholdColor: undefined,
            thresholdValue: 0,
            chartRangeMax: undefined,
            chartRangeMin: undefined,
            chartRangeClip: false
        },
        bullet: {
            targetColor: 'red',
            targetWidth: 3,
            performanceColor: 'blue',
            rangeColors: ['#D3DAFE', '#A8B6FF', '#7F94FF'],
            base: undefined
        },
        pie: {
            sliceColors: ['#f00', '#0f0', '#00f']
        },
        box: {
            raw: false,
            boxLineColor: 'black',
            boxFillColor: '#cdf',
            whiskerColor: 'black',
            outlierLineColor: '#333',
            outlierFillColor: 'white',
            medianColor: 'red',
            showOutliers: true,
            outlierIQR: 1.5,
            spotRadius: 1.5,
            target: undefined,
            targetColor: '#4a2',
            chartRangeMax: undefined,
            chartRangeMin: undefined
        }
    };
    var VCanvas_base, VCanvas_canvas, VCanvas_vml;
    $.fn.simpledraw = function(width, height, use_existing) {
        if (use_existing && this[0].VCanvas) {
            return this[0].VCanvas;
        }
        if (width === undefined) {
            width = $(this).innerWidth();
        }
        if (height === undefined) {
            height = $(this).innerHeight();
        }
        if ($.browser.hasCanvas) {
            return new VCanvas_canvas(width, height, this);
        } else if ($.browser.msie) {
            return new VCanvas_vml(width, height, this);
        } else {
            return false;
        }
    };
    var pending = [];
    $.fn.sparkline = function(uservalues, userOptions) {
        return this.each(function() {
            var options = new $.fn.sparkline.options(this, userOptions);
            var render = function() {
                var values, width, height;
                if (uservalues === 'html' || uservalues === undefined) {
                    var vals = this.getAttribute(options.get('tagValuesAttribute'));
                    if (vals === undefined || vals === null) {
                        vals = $(this).html();
                    }
                    values = vals.replace(/(^\s*<!--)|(-->\s*$)|\s+/g, '').split(',');
                } else {
                    values = uservalues;
                }
                width = options.get('width') == 'auto' ? values.length * options.get('defaultPixelsPerValue') : options.get('width');
                if (options.get('height') == 'auto') {
                    if (!options.get('composite') || !this.VCanvas) {
                        var tmp = document.createElement('span');
                        tmp.innerHTML = 'a';
                        $(this).html(tmp);
                        height = $(tmp).innerHeight();
                        $(tmp).remove();
                    }
                } else {
                    height = options.get('height');
                }
                $.fn.sparkline[options.get('type')].call(this, values, options, width, height);
            };
            if (($(this).html() && $(this).is(':hidden')) || ($.fn.jquery < "1.3.0" && $(this).parents().is(':hidden')) || !$(this).parents('body').length) {
                pending.push([this, render]);
            } else {
                render.call(this);
            }
        });
    };
    $.fn.sparkline.defaults = defaults;
    $.sparkline_display_visible = function() {
        for (var i = pending.length - 1; i >= 0; i--) {
            var el = pending[i][0];
            if ($(el).is(':visible') && !$(el).parents().is(':hidden')) {
                pending[i][1].call(el);
                pending.splice(i, 1);
            }
        }
    };
    var UNSET_OPTION = {};
    var normalizeValue = function(val) {
        switch (val) {
            case 'undefined':
                val = undefined;
                break;
            case 'null':
                val = null;
                break;
            case 'true':
                val = true;
                break;
            case 'false':
                val = false;
                break;
            default:
                var nf = parseFloat(val);
                if (val == nf) {
                    val = nf;
                }
        }
        return val;
    };
    $.fn.sparkline.options = function(tag, userOptions) {
        var extendedOptions;
        this.userOptions = userOptions = userOptions || {};
        this.tag = tag;
        this.tagValCache = {};
        var defaults = $.fn.sparkline.defaults;
        var base = defaults.common;
        this.tagOptionsPrefix = userOptions.enableTagOptions && (userOptions.tagOptionsPrefix || base.tagOptionsPrefix);
        var tagOptionType = this.getTagSetting('type');
        if (tagOptionType === UNSET_OPTION) {
            extendedOptions = defaults[userOptions.type || base.type];
        } else {
            extendedOptions = defaults[tagOptionType];
        }
        this.mergedOptions = $.extend({}, base, extendedOptions, userOptions);
    };
    $.fn.sparkline.options.prototype.getTagSetting = function(key) {
        var val, i, prefix = this.tagOptionsPrefix;
        if (prefix === false || prefix === undefined) {
            return UNSET_OPTION;
        }
        if (this.tagValCache.hasOwnProperty(key)) {
            val = this.tagValCache.key;
        } else {
            val = this.tag.getAttribute(prefix + key);
            if (val === undefined || val === null) {
                val = UNSET_OPTION;
            } else if (val.substr(0, 1) == '[') {
                val = val.substr(1, val.length - 2).split(',');
                for (i = val.length; i--;) {
                    val[i] = normalizeValue(val[i].replace(/(^\s*)|(\s*$)/g, ''));
                }
            } else if (val.substr(0, 1) == '{') {
                var pairs = val.substr(1, val.length - 2).split(',');
                val = {};
                for (i = pairs.length; i--;) {
                    var keyval = pairs[i].split(':', 2);
                    val[keyval[0].replace(/(^\s*)|(\s*$)/g, '')] = normalizeValue(keyval[1].replace(/(^\s*)|(\s*$)/g, ''));
                }
            } else {
                val = normalizeValue(val);
            }
            this.tagValCache.key = val;
        }
        return val;
    };
    $.fn.sparkline.options.prototype.get = function(key) {
        var tagOption = this.getTagSetting(key);
        if (tagOption !== UNSET_OPTION) {
            return tagOption;
        }
        return this.mergedOptions[key];
    };
    $.fn.sparkline.line = function(values, options, width, height) {
        var xvalues = [],
            yvalues = [],
            yminmax = [];
        for (var i = 0; i < values.length; i++) {
            var val = values[i];
            var isstr = typeof(values[i]) == 'string';
            var isarray = typeof(values[i]) == 'object' && values[i] instanceof Array;
            var sp = isstr && values[i].split(':');
            if (isstr && sp.length == 2) {
                xvalues.push(Number(sp[0]));
                yvalues.push(Number(sp[1]));
                yminmax.push(Number(sp[1]));
            } else if (isarray) {
                xvalues.push(val[0]);
                yvalues.push(val[1]);
                yminmax.push(val[1]);
            } else {
                xvalues.push(i);
                if (values[i] === null || values[i] == 'null') {
                    yvalues.push(null);
                } else {
                    yvalues.push(Number(val));
                    yminmax.push(Number(val));
                }
            }
        }
        if (options.get('xvalues')) {
            xvalues = options.get('xvalues');
        }
        var maxy = Math.max.apply(Math, yminmax);
        var maxyval = maxy;
        var miny = Math.min.apply(Math, yminmax);
        var minyval = miny;
        var maxx = Math.max.apply(Math, xvalues);
        var minx = Math.min.apply(Math, xvalues);
        var normalRangeMin = options.get('normalRangeMin');
        var normalRangeMax = options.get('normalRangeMax');
        if (normalRangeMin !== undefined) {
            if (normalRangeMin < miny) {
                miny = normalRangeMin;
            }
            if (normalRangeMax > maxy) {
                maxy = normalRangeMax;
            }
        }
        if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < miny)) {
            miny = options.get('chartRangeMin');
        }
        if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > maxy)) {
            maxy = options.get('chartRangeMax');
        }
        if (options.get('chartRangeMinX') !== undefined && (options.get('chartRangeClipX') || options.get('chartRangeMinX') < minx)) {
            minx = options.get('chartRangeMinX');
        }
        if (options.get('chartRangeMaxX') !== undefined && (options.get('chartRangeClipX') || options.get('chartRangeMaxX') > maxx)) {
            maxx = options.get('chartRangeMaxX');
        }
        var rangex = maxx - minx === 0 ? 1 : maxx - minx;
        var rangey = maxy - miny === 0 ? 1 : maxy - miny;
        var vl = yvalues.length - 1;
        if (vl < 1) {
            this.innerHTML = '';
            return;
        }
        var target = $(this).simpledraw(width, height, options.get('composite'));
        if (target) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;
            var canvas_top = 0;
            var canvas_left = 0;
            var spotRadius = options.get('spotRadius');
            if (spotRadius && (canvas_width < (spotRadius * 4) || canvas_height < (spotRadius * 4))) {
                spotRadius = 0;
            }
            if (spotRadius) {
                if (options.get('minSpotColor') || (options.get('spotColor') && yvalues[vl] == miny)) {
                    canvas_height -= Math.ceil(spotRadius);
                }
                if (options.get('maxSpotColor') || (options.get('spotColor') && yvalues[vl] == maxy)) {
                    canvas_height -= Math.ceil(spotRadius);
                    canvas_top += Math.ceil(spotRadius);
                }
                if (options.get('minSpotColor') || options.get('maxSpotColor') && (yvalues[0] == miny || yvalues[0] == maxy)) {
                    canvas_left += Math.ceil(spotRadius);
                    canvas_width -= Math.ceil(spotRadius);
                }
                if (options.get('spotColor') || (options.get('minSpotColor') || options.get('maxSpotColor') && (yvalues[vl] == miny || yvalues[vl] == maxy))) {
                    canvas_width -= Math.ceil(spotRadius);
                }
            }
            canvas_height--;
            var drawNormalRange = function() {
                if (normalRangeMin !== undefined) {
                    var ytop = canvas_top + Math.round(canvas_height - (canvas_height * ((normalRangeMax - miny) / rangey)));
                    var height = Math.round((canvas_height * (normalRangeMax - normalRangeMin)) / rangey);
                    target.drawRect(canvas_left, ytop, canvas_width, height, undefined, options.get('normalRangeColor'));
                }
            };
            if (!options.get('drawNormalOnTop')) {
                drawNormalRange();
            }
            var path = [];
            var paths = [path];
            var x, y, vlen = yvalues.length;
            for (i = 0; i < vlen; i++) {
                x = xvalues[i];
                y = yvalues[i];
                if (y === null) {
                    if (i) {
                        if (yvalues[i - 1] !== null) {
                            path = [];
                            paths.push(path);
                        }
                    }
                } else {
                    if (y < miny) {
                        y = miny;
                    }
                    if (y > maxy) {
                        y = maxy;
                    }
                    if (!path.length) {
                        path.push([canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + canvas_height]);
                    }
                    path.push([canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((y - miny) / rangey)))]);
                }
            }
            var lineshapes = [];
            var fillshapes = [];
            var plen = paths.length;
            for (i = 0; i < plen; i++) {
                path = paths[i];
                if (!path.length) {
                    continue;
                }
                if (options.get('fillColor')) {
                    path.push([path[path.length - 1][0], canvas_top + canvas_height - 1]);
                    fillshapes.push(path.slice(0));
                    path.pop();
                }
                if (path.length > 2) {
                    path[0] = [path[0][0], path[1][1]];
                }
                lineshapes.push(path);
            }
            plen = fillshapes.length;
            for (i = 0; i < plen; i++) {
                target.drawShape(fillshapes[i], undefined, options.get('fillColor'));
            }
            if (options.get('drawNormalOnTop')) {
                drawNormalRange();
            }
            plen = lineshapes.length;
            for (i = 0; i < plen; i++) {
                target.drawShape(lineshapes[i], options.get('lineColor'), undefined, options.get('lineWidth'));
            }
            if (spotRadius && options.get('spotColor')) {
                target.drawCircle(canvas_left + Math.round(xvalues[xvalues.length - 1] * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((yvalues[vl] - miny) / rangey))), spotRadius, undefined, options.get('spotColor'));
            }
            if (maxy != minyval) {
                if (spotRadius && options.get('minSpotColor')) {
                    x = xvalues[$.inArray(minyval, yvalues)];
                    target.drawCircle(canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((minyval - miny) / rangey))), spotRadius, undefined, options.get('minSpotColor'));
                }
                if (spotRadius && options.get('maxSpotColor')) {
                    x = xvalues[$.inArray(maxyval, yvalues)];
                    target.drawCircle(canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((maxyval - miny) / rangey))), spotRadius, undefined, options.get('maxSpotColor'));
                }
            }
        } else {
            this.innerHTML = '';
        }
    };
    $.fn.sparkline.bar = function(values, options, width, height) {
        width = (values.length * options.get('barWidth')) + ((values.length - 1) * options.get('barSpacing'));
        var num_values = [];
        for (var i = 0, vlen = values.length; i < vlen; i++) {
            if (values[i] == 'null' || values[i] === null) {
                values[i] = null;
            } else {
                values[i] = Number(values[i]);
                num_values.push(Number(values[i]));
            }
        }
        var max = Math.max.apply(Math, num_values),
            min = Math.min.apply(Math, num_values);
        if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < min)) {
            min = options.get('chartRangeMin');
        }
        if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > max)) {
            max = options.get('chartRangeMax');
        }
        var zeroAxis = options.get('zeroAxis');
        if (zeroAxis === undefined) {
            zeroAxis = min < 0;
        }
        var range = max - min === 0 ? 1 : max - min;
        var colorMapByIndex, colorMapByValue;
        if ($.isArray(options.get('colorMap'))) {
            colorMapByIndex = options.get('colorMap');
            colorMapByValue = null;
        } else {
            colorMapByIndex = null;
            colorMapByValue = options.get('colorMap');
        }
        var target = $(this).simpledraw(width, height, options.get('composite'));
        if (target) {
            var color, canvas_height = target.pixel_height,
                yzero = min < 0 && zeroAxis ? canvas_height - Math.round(canvas_height * (Math.abs(min) / range)) - 1 : canvas_height - 1;
            for (i = values.length; i--;) {
                var x = i * (options.get('barWidth') + options.get('barSpacing')),
                    y, val = values[i];
                if (val === null) {
                    if (options.get('nullColor')) {
                        color = options.get('nullColor');
                        val = (zeroAxis && min < 0) ? 0 : min;
                        height = 1;
                        y = (zeroAxis && min < 0) ? yzero : canvas_height - height;
                    } else {
                        continue;
                    }
                } else {
                    if (val < min) {
                        val = min;
                    }
                    if (val > max) {
                        val = max;
                    }
                    color = (val < 0) ? options.get('negBarColor') : options.get('barColor');
                    if (zeroAxis && min < 0) {
                        height = Math.round(canvas_height * ((Math.abs(val) / range))) + 1;
                        y = (val < 0) ? yzero : yzero - height;
                    } else {
                        height = Math.round(canvas_height * ((val - min) / range)) + 1;
                        y = canvas_height - height;
                    }
                    if (val === 0 && options.get('zeroColor') !== undefined) {
                        color = options.get('zeroColor');
                    }
                    if (colorMapByValue && colorMapByValue[val]) {
                        color = colorMapByValue[val];
                    } else if (colorMapByIndex && colorMapByIndex.length > i) {
                        color = colorMapByIndex[i];
                    }
                    if (color === null) {
                        continue;
                    }
                }
                target.drawRect(x, y, options.get('barWidth') - 1, height - 1, color, color);
            }
        } else {
            this.innerHTML = '';
        }
    };
    $.fn.sparkline.tristate = function(values, options, width, height) {
        values = $.map(values, Number);
        width = (values.length * options.get('barWidth')) + ((values.length - 1) * options.get('barSpacing'));
        var colorMapByIndex, colorMapByValue;
        if ($.isArray(options.get('colorMap'))) {
            colorMapByIndex = options.get('colorMap');
            colorMapByValue = null;
        } else {
            colorMapByIndex = null;
            colorMapByValue = options.get('colorMap');
        }
        var target = $(this).simpledraw(width, height, options.get('composite'));
        if (target) {
            var canvas_height = target.pixel_height,
                half_height = Math.round(canvas_height / 2);
            for (var i = values.length; i--;) {
                var x = i * (options.get('barWidth') + options.get('barSpacing')),
                    y, color;
                if (values[i] < 0) {
                    y = half_height;
                    height = half_height - 1;
                    color = options.get('negBarColor');
                } else if (values[i] > 0) {
                    y = 0;
                    height = half_height - 1;
                    color = options.get('posBarColor');
                } else {
                    y = half_height - 1;
                    height = 2;
                    color = options.get('zeroBarColor');
                }
                if (colorMapByValue && colorMapByValue[values[i]]) {
                    color = colorMapByValue[values[i]];
                } else if (colorMapByIndex && colorMapByIndex.length > i) {
                    color = colorMapByIndex[i];
                }
                if (color === null) {
                    continue;
                }
                target.drawRect(x, y, options.get('barWidth') - 1, height - 1, color, color);
            }
        } else {
            this.innerHTML = '';
        }
    };
    $.fn.sparkline.discrete = function(values, options, width, height) {
        values = $.map(values, Number);
        width = options.get('width') == 'auto' ? values.length * 2 : width;
        var interval = Math.floor(width / values.length);
        var target = $(this).simpledraw(width, height, options.get('composite'));
        if (target) {
            var canvas_height = target.pixel_height,
                line_height = options.get('lineHeight') == 'auto' ? Math.round(canvas_height * 0.3) : options.get('lineHeight'),
                pheight = canvas_height - line_height,
                min = Math.min.apply(Math, values),
                max = Math.max.apply(Math, values);
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < min)) {
                min = options.get('chartRangeMin');
            }
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > max)) {
                max = options.get('chartRangeMax');
            }
            var range = max - min;
            for (var i = values.length; i--;) {
                var val = values[i];
                if (val < min) {
                    val = min;
                }
                if (val > max) {
                    val = max;
                }
                var x = (i * interval),
                    ytop = Math.round(pheight - pheight * ((val - min) / range));
                target.drawLine(x, ytop, x, ytop + line_height, (options.get('thresholdColor') && val < options.get('thresholdValue')) ? options.get('thresholdColor') : options.get('lineColor'));
            }
        } else {
            this.innerHTML = '';
        }
    };
    $.fn.sparkline.bullet = function(values, options, width, height) {
        values = $.map(values, Number);
        width = options.get('width') == 'auto' ? '4.0em' : width;
        var target = $(this).simpledraw(width, height, options.get('composite'));
        if (target && values.length > 1) {
            var canvas_width = target.pixel_width - Math.ceil(options.get('targetWidth') / 2),
                canvas_height = target.pixel_height,
                min = Math.min.apply(Math, values),
                max = Math.max.apply(Math, values);
            if (options.get('base') === undefined) {
                min = min < 0 ? min : 0;
            } else {
                min = options.get('base');
            }
            var range = max - min;
            for (var i = 2, vlen = values.length; i < vlen; i++) {
                var rangeval = values[i],
                    rangewidth = Math.round(canvas_width * ((rangeval - min) / range));
                target.drawRect(0, 0, rangewidth - 1, canvas_height - 1, options.get('rangeColors')[i - 2], options.get('rangeColors')[i - 2]);
            }
            var perfval = values[1],
                perfwidth = Math.round(canvas_width * ((perfval - min) / range));
            target.drawRect(0, Math.round(canvas_height * 0.3), perfwidth - 1, Math.round(canvas_height * 0.4) - 1, options.get('performanceColor'), options.get('performanceColor'));
            var targetval = values[0],
                x = Math.round(canvas_width * ((targetval - min) / range) - (options.get('targetWidth') / 2)),
                targettop = Math.round(canvas_height * 0.10),
                targetheight = canvas_height - (targettop * 2);
            target.drawRect(x, targettop, options.get('targetWidth') - 1, targetheight - 1, options.get('targetColor'), options.get('targetColor'));
        } else {
            this.innerHTML = '';
        }
    };
    $.fn.sparkline.pie = function(values, options, width, height) {
        values = $.map(values, Number);
        width = options.get('width') == 'auto' ? height : width;
        var target = $(this).simpledraw(width, height, options.get('composite'));
        if (target && values.length > 1) {
            var canvas_width = target.pixel_width,
                canvas_height = target.pixel_height,
                radius = Math.floor(Math.min(canvas_width, canvas_height) / 2),
                total = 0,
                next = 0,
                circle = 2 * Math.PI;
            for (var i = values.length; i--;) {
                total += values[i];
            }
            if (options.get('offset')) {
                next += (2 * Math.PI) * (options.get('offset') / 360);
            }
            var vlen = values.length;
            for (i = 0; i < vlen; i++) {
                var start = next;
                var end = next;
                if (total > 0) {
                    end = next + (circle * (values[i] / total));
                }
                target.drawPieSlice(radius, radius, radius, start, end, undefined, options.get('sliceColors')[i % options.get('sliceColors').length]);
                next = end;
            }
        }
    };
    var quartile = function(values, q) {
        if (q == 2) {
            var vl2 = Math.floor(values.length / 2);
            return values.length % 2 ? values[vl2] : (values[vl2] + values[vl2 + 1]) / 2;
        } else {
            var vl4 = Math.floor(values.length / 4);
            return values.length % 2 ? (values[vl4 * q] + values[vl4 * q + 1]) / 2 : values[vl4 * q];
        }
    };
    $.fn.sparkline.box = function(values, options, width, height) {
        values = $.map(values, Number);
        width = options.get('width') == 'auto' ? '4.0em' : width;
        var minvalue = options.get('chartRangeMin') === undefined ? Math.min.apply(Math, values) : options.get('chartRangeMin'),
            maxvalue = options.get('chartRangeMax') === undefined ? Math.max.apply(Math, values) : options.get('chartRangeMax'),
            target = $(this).simpledraw(width, height, options.get('composite')),
            vlen = values.length,
            lwhisker, loutlier, q1, q2, q3, rwhisker, routlier;
        if (target && values.length > 1) {
            var canvas_width = target.pixel_width,
                canvas_height = target.pixel_height;
            if (options.get('raw')) {
                if (options.get('showOutliers') && values.length > 5) {
                    loutlier = values[0];
                    lwhisker = values[1];
                    q1 = values[2];
                    q2 = values[3];
                    q3 = values[4];
                    rwhisker = values[5];
                    routlier = values[6];
                } else {
                    lwhisker = values[0];
                    q1 = values[1];
                    q2 = values[2];
                    q3 = values[3];
                    rwhisker = values[4];
                }
            } else {
                values.sort(function(a, b) {
                    return a - b;
                });
                q1 = quartile(values, 1);
                q2 = quartile(values, 2);
                q3 = quartile(values, 3);
                var iqr = q3 - q1;
                if (options.get('showOutliers')) {
                    lwhisker = undefined;
                    rwhisker = undefined;
                    for (var i = 0; i < vlen; i++) {
                        if (lwhisker === undefined && values[i] > q1 - (iqr * options.get('outlierIQR'))) {
                            lwhisker = values[i];
                        }
                        if (values[i] < q3 + (iqr * options.get('outlierIQR'))) {
                            rwhisker = values[i];
                        }
                    }
                    loutlier = values[0];
                    routlier = values[vlen - 1];
                } else {
                    lwhisker = values[0];
                    rwhisker = values[vlen - 1];
                }
            }
            var unitsize = canvas_width / (maxvalue - minvalue + 1),
                canvas_left = 0;
            if (options.get('showOutliers')) {
                canvas_left = Math.ceil(options.get('spotRadius'));
                canvas_width -= 2 * Math.ceil(options.get('spotRadius'));
                unitsize = canvas_width / (maxvalue - minvalue + 1);
                if (loutlier < lwhisker) {
                    target.drawCircle((loutlier - minvalue) * unitsize + canvas_left, canvas_height / 2, options.get('spotRadius'), options.get('outlierLineColor'), options.get('outlierFillColor'));
                }
                if (routlier > rwhisker) {
                    target.drawCircle((routlier - minvalue) * unitsize + canvas_left, canvas_height / 2, options.get('spotRadius'), options.get('outlierLineColor'), options.get('outlierFillColor'));
                }
            }
            target.drawRect(Math.round((q1 - minvalue) * unitsize + canvas_left), Math.round(canvas_height * 0.1), Math.round((q3 - q1) * unitsize), Math.round(canvas_height * 0.8), options.get('boxLineColor'), options.get('boxFillColor'));
            target.drawLine(Math.round((lwhisker - minvalue) * unitsize + canvas_left), Math.round(canvas_height / 2), Math.round((q1 - minvalue) * unitsize + canvas_left), Math.round(canvas_height / 2), options.get('lineColor'));
            target.drawLine(Math.round((lwhisker - minvalue) * unitsize + canvas_left), Math.round(canvas_height / 4), Math.round((lwhisker - minvalue) * unitsize + canvas_left), Math.round(canvas_height - canvas_height / 4), options.get('whiskerColor'));
            target.drawLine(Math.round((rwhisker - minvalue) * unitsize + canvas_left), Math.round(canvas_height / 2), Math.round((q3 - minvalue) * unitsize + canvas_left), Math.round(canvas_height / 2), options.get('lineColor'));
            target.drawLine(Math.round((rwhisker - minvalue) * unitsize + canvas_left), Math.round(canvas_height / 4), Math.round((rwhisker - minvalue) * unitsize + canvas_left), Math.round(canvas_height - canvas_height / 4), options.get('whiskerColor'));
            target.drawLine(Math.round((q2 - minvalue) * unitsize + canvas_left), Math.round(canvas_height * 0.1), Math.round((q2 - minvalue) * unitsize + canvas_left), Math.round(canvas_height * 0.9), options.get('medianColor'));
            if (options.get('target')) {
                var size = Math.ceil(options.get('spotRadius'));
                target.drawLine(Math.round((options.get('target') - minvalue) * unitsize + canvas_left), Math.round((canvas_height / 2) - size), Math.round((options.get('target') - minvalue) * unitsize + canvas_left), Math.round((canvas_height / 2) + size), options.get('targetColor'));
                target.drawLine(Math.round((options.get('target') - minvalue) * unitsize + canvas_left - size), Math.round(canvas_height / 2), Math.round((options.get('target') - minvalue) * unitsize + canvas_left + size), Math.round(canvas_height / 2), options.get('targetColor'));
            }
        } else {
            this.innerHTML = '';
        }
    };
    if ($.browser.msie && !document.namespaces.v) {
        document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
    }
    if ($.browser.hasCanvas === undefined) {
        var t = document.createElement('canvas');
        $.browser.hasCanvas = t.getContext !== undefined;
    }
    VCanvas_base = function(width, height, target) {};
    VCanvas_base.prototype = {
        init: function(width, height, target) {
            this.width = width;
            this.height = height;
            this.target = target;
            if (target[0]) {
                target = target[0];
            }
            target.VCanvas = this;
        },
        drawShape: function(path, lineColor, fillColor, lineWidth) {
            alert('drawShape not implemented');
        },
        drawLine: function(x1, y1, x2, y2, lineColor, lineWidth) {
            return this.drawShape([
                [x1, y1],
                [x2, y2]
            ], lineColor, lineWidth);
        },
        drawCircle: function(x, y, radius, lineColor, fillColor) {
            alert('drawCircle not implemented');
        },
        drawPieSlice: function(x, y, radius, startAngle, endAngle, lineColor, fillColor) {
            alert('drawPieSlice not implemented');
        },
        drawRect: function(x, y, width, height, lineColor, fillColor) {
            alert('drawRect not implemented');
        },
        getElement: function() {
            return this.canvas;
        },
        _insert: function(el, target) {
            $(target).html(el);
        }
    };
    VCanvas_canvas = function(width, height, target) {
        return this.init(width, height, target);
    };
    VCanvas_canvas.prototype = $.extend(new VCanvas_base(), {
        _super: VCanvas_base.prototype,
        init: function(width, height, target) {
            this._super.init(width, height, target);
            this.canvas = document.createElement('canvas');
            if (target[0]) {
                target = target[0];
            }
            target.VCanvas = this;
            $(this.canvas).css({
                display: 'inline-block',
                width: width,
                height: height,
                verticalAlign: 'top'
            });
            this._insert(this.canvas, target);
            this.pixel_height = $(this.canvas).height();
            this.pixel_width = $(this.canvas).width();
            this.canvas.width = this.pixel_width;
            this.canvas.height = this.pixel_height;
            $(this.canvas).css({
                width: this.pixel_width,
                height: this.pixel_height
            });
        },
        _getContext: function(lineColor, fillColor, lineWidth) {
            var context = this.canvas.getContext('2d');
            if (lineColor !== undefined) {
                context.strokeStyle = lineColor;
            }
            context.lineWidth = lineWidth === undefined ? 1 : lineWidth;
            if (fillColor !== undefined) {
                context.fillStyle = fillColor;
            }
            return context;
        },
        drawShape: function(path, lineColor, fillColor, lineWidth) {
            var context = this._getContext(lineColor, fillColor, lineWidth);
            context.beginPath();
            context.moveTo(path[0][0] + 0.5, path[0][1] + 0.5);
            for (var i = 1, plen = path.length; i < plen; i++) {
                context.lineTo(path[i][0] + 0.5, path[i][1] + 0.5);
            }
            if (lineColor !== undefined) {
                context.stroke();
            }
            if (fillColor !== undefined) {
                context.fill();
            }
        },
        drawCircle: function(x, y, radius, lineColor, fillColor) {
            var context = this._getContext(lineColor, fillColor);
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            if (lineColor !== undefined) {
                context.stroke();
            }
            if (fillColor !== undefined) {
                context.fill();
            }
        },
        drawPieSlice: function(x, y, radius, startAngle, endAngle, lineColor, fillColor) {
            var context = this._getContext(lineColor, fillColor);
            context.beginPath();
            context.moveTo(x, y);
            context.arc(x, y, radius, startAngle, endAngle, false);
            context.lineTo(x, y);
            context.closePath();
            if (lineColor !== undefined) {
                context.stroke();
            }
            if (fillColor) {
                context.fill();
            }
        },
        drawRect: function(x, y, width, height, lineColor, fillColor) {
            return this.drawShape([
                [x, y],
                [x + width, y],
                [x + width, y + height],
                [x, y + height],
                [x, y]
            ], lineColor, fillColor);
        }
    });
    VCanvas_vml = function(width, height, target) {
        return this.init(width, height, target);
    };
    VCanvas_vml.prototype = $.extend(new VCanvas_base(), {
        _super: VCanvas_base.prototype,
        init: function(width, height, target) {
            this._super.init(width, height, target);
            if (target[0]) {
                target = target[0];
            }
            target.VCanvas = this;
            this.canvas = document.createElement('span');
            $(this.canvas).css({
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                width: width,
                height: height,
                margin: '0px',
                padding: '0px',
                verticalAlign: 'top'
            });
            this._insert(this.canvas, target);
            this.pixel_height = $(this.canvas).height();
            this.pixel_width = $(this.canvas).width();
            this.canvas.width = this.pixel_width;
            this.canvas.height = this.pixel_height;
            var groupel = '<v:group coordorigin="0 0" coordsize="' + this.pixel_width + ' ' + this.pixel_height + '"' + ' style="position:absolute;top:0;left:0;width:' + this.pixel_width + 'px;height=' + this.pixel_height + 'px;"></v:group>';
            this.canvas.insertAdjacentHTML('beforeEnd', groupel);
            this.group = $(this.canvas).children()[0];
        },
        drawShape: function(path, lineColor, fillColor, lineWidth) {
            var vpath = [];
            for (var i = 0, plen = path.length; i < plen; i++) {
                vpath[i] = '' + (path[i][0]) + ',' + (path[i][1]);
            }
            var initial = vpath.splice(0, 1);
            lineWidth = lineWidth === undefined ? 1 : lineWidth;
            var stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="' + lineWidth + '" strokeColor="' + lineColor + '" ';
            var fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';
            var closed = vpath[0] == vpath[vpath.length - 1] ? 'x ' : '';
            var vel = '<v:shape coordorigin="0 0" coordsize="' + this.pixel_width + ' ' + this.pixel_height + '" ' +
                stroke +
                fill + ' style="position:absolute;left:0px;top:0px;height:' + this.pixel_height + 'px;width:' + this.pixel_width + 'px;padding:0px;margin:0px;" ' + ' path="m ' + initial + ' l ' + vpath.join(', ') + ' ' + closed + 'e">' + ' </v:shape>';
            this.group.insertAdjacentHTML('beforeEnd', vel);
        },
        drawCircle: function(x, y, radius, lineColor, fillColor) {
            x -= radius + 1;
            y -= radius + 1;
            var stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="1" strokeColor="' + lineColor + '" ';
            var fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';
            var vel = '<v:oval ' +
                stroke +
                fill + ' style="position:absolute;top:' + y + 'px; left:' + x + 'px; width:' + (radius * 2) + 'px; height:' + (radius * 2) + 'px"></v:oval>';
            this.group.insertAdjacentHTML('beforeEnd', vel);
        },
        drawPieSlice: function(x, y, radius, startAngle, endAngle, lineColor, fillColor) {
            if (startAngle == endAngle) {
                return;
            }
            if ((endAngle - startAngle) == (2 * Math.PI)) {
                startAngle = 0.0;
                endAngle = (2 * Math.PI);
            }
            var startx = x + Math.round(Math.cos(startAngle) * radius);
            var starty = y + Math.round(Math.sin(startAngle) * radius);
            var endx = x + Math.round(Math.cos(endAngle) * radius);
            var endy = y + Math.round(Math.sin(endAngle) * radius);
            if (startx == endx && starty == endy && (endAngle - startAngle) < Math.PI) {
                return;
            }
            var vpath = [x - radius, y - radius, x + radius, y + radius, startx, starty, endx, endy];
            var stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="1" strokeColor="' + lineColor + '" ';
            var fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';
            var vel = '<v:shape coordorigin="0 0" coordsize="' + this.pixel_width + ' ' + this.pixel_height + '" ' +
                stroke +
                fill + ' style="position:absolute;left:0px;top:0px;height:' + this.pixel_height + 'px;width:' + this.pixel_width + 'px;padding:0px;margin:0px;" ' + ' path="m ' + x + ',' + y + ' wa ' + vpath.join(', ') + ' x e">' + ' </v:shape>';
            this.group.insertAdjacentHTML('beforeEnd', vel);
        },
        drawRect: function(x, y, width, height, lineColor, fillColor) {
            return this.drawShape([
                [x, y],
                [x, y + height],
                [x + width, y + height],
                [x + width, y],
                [x, y]
            ], lineColor, fillColor);
        }
    });
})(jQuery);
(function(B) {
    B.color = {};
    B.color.make = function(F, E, C, D) {
        var G = {};
        G.r = F || 0;
        G.g = E || 0;
        G.b = C || 0;
        G.a = D != null ? D : 1;
        G.add = function(J, I) {
            for (var H = 0; H < J.length; ++H) {
                G[J.charAt(H)] += I
            }
            return G.normalize()
        };
        G.scale = function(J, I) {
            for (var H = 0; H < J.length; ++H) {
                G[J.charAt(H)] *= I
            }
            return G.normalize()
        };
        G.toString = function() {
            if (G.a >= 1) {
                return "rgb(" + [G.r, G.g, G.b].join(",") + ")"
            } else {
                return "rgba(" + [G.r, G.g, G.b, G.a].join(",") + ")"
            }
        };
        G.normalize = function() {
            function H(J, K, I) {
                return K < J ? J : (K > I ? I : K)
            }
            G.r = H(0, parseInt(G.r), 255);
            G.g = H(0, parseInt(G.g), 255);
            G.b = H(0, parseInt(G.b), 255);
            G.a = H(0, G.a, 1);
            return G
        };
        G.clone = function() {
            return B.color.make(G.r, G.b, G.g, G.a)
        };
        return G.normalize()
    };
    B.color.extract = function(D, C) {
        var E;
        do {
            E = D.css(C).toLowerCase();
            if (E != "" && E != "transparent") {
                break
            }
            D = D.parent()
        } while (!B.nodeName(D.get(0), "body"));
        if (E == "rgba(0, 0, 0, 0)") {
            E = "transparent"
        }
        return B.color.parse(E)
    };
    B.color.parse = function(F) {
        var E, C = B.color.make;
        if (E = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)) {
            return C(parseInt(E[1], 10), parseInt(E[2], 10), parseInt(E[3], 10))
        }
        if (E = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)) {
            return C(parseInt(E[1], 10), parseInt(E[2], 10), parseInt(E[3], 10), parseFloat(E[4]))
        }
        if (E = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)) {
            return C(parseFloat(E[1]) * 2.55, parseFloat(E[2]) * 2.55, parseFloat(E[3]) * 2.55)
        }
        if (E = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)) {
            return C(parseFloat(E[1]) * 2.55, parseFloat(E[2]) * 2.55, parseFloat(E[3]) * 2.55, parseFloat(E[4]))
        }
        if (E = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)) {
            return C(parseInt(E[1], 16), parseInt(E[2], 16), parseInt(E[3], 16))
        }
        if (E = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)) {
            return C(parseInt(E[1] + E[1], 16), parseInt(E[2] + E[2], 16), parseInt(E[3] + E[3], 16))
        }
        var D = B.trim(F).toLowerCase();
        if (D == "transparent") {
            return C(255, 255, 255, 0)
        } else {
            E = A[D] || [0, 0, 0];
            return C(E[0], E[1], E[2])
        }
    };
    var A = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
    }
})(jQuery);
(function($) {
    function Plot(placeholder, data_, options_, plugins) {
        var series = [],
            options = {
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1,
                    labelFormatter: null,
                    labelBoxBorderColor: "#ccc",
                    container: null,
                    position: "ne",
                    margin: 5,
                    backgroundColor: null,
                    backgroundOpacity: 0.85
                },
                xaxis: {
                    show: null,
                    position: "bottom",
                    mode: null,
                    color: null,
                    tickColor: null,
                    transform: null,
                    inverseTransform: null,
                    min: null,
                    max: null,
                    autoscaleMargin: null,
                    ticks: null,
                    tickFormatter: null,
                    labelWidth: null,
                    labelHeight: null,
                    reserveSpace: null,
                    tickLength: null,
                    alignTicksWithAxis: null,
                    tickDecimals: null,
                    tickSize: null,
                    minTickSize: null,
                    monthNames: null,
                    timeformat: null,
                    twelveHourClock: false
                },
                yaxis: {
                    autoscaleMargin: 0.02,
                    position: "left"
                },
                xaxes: [],
                yaxes: [],
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2,
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle"
                    },
                    lines: {
                        lineWidth: 2,
                        fill: false,
                        fillColor: null,
                        steps: false
                    },
                    bars: {
                        show: false,
                        lineWidth: 2,
                        barWidth: 1,
                        fill: true,
                        fillColor: null,
                        align: "left",
                        horizontal: false
                    },
                    shadowSize: 3
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454",
                    backgroundColor: null,
                    borderColor: null,
                    tickColor: null,
                    labelMargin: 5,
                    axisMargin: 8,
                    borderWidth: 2,
                    minBorderMargin: null,
                    markings: null,
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true,
                    mouseActiveRadius: 10
                },
                hooks: {}
            }, canvas = null,
            overlay = null,
            eventHolder = null,
            ctx = null,
            octx = null,
            xaxes = [],
            yaxes = [],
            plotOffset = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, canvasWidth = 0,
            canvasHeight = 0,
            plotWidth = 0,
            plotHeight = 0,
            hooks = {
                processOptions: [],
                processRawData: [],
                processDatapoints: [],
                drawSeries: [],
                draw: [],
                bindEvents: [],
                drawOverlay: [],
                shutdown: []
            }, plot = this;
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() {
            return placeholder;
        };
        plot.getCanvas = function() {
            return canvas;
        };
        plot.getPlotOffset = function() {
            return plotOffset;
        };
        plot.width = function() {
            return plotWidth;
        };
        plot.height = function() {
            return plotHeight;
        };
        plot.offset = function() {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function() {
            return series;
        };
        plot.getAxes = function() {
            var res = {}, i;
            $.each(xaxes.concat(yaxes), function(_, axis) {
                if (axis)
                    res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis;
            });
            return res;
        };
        plot.getXAxes = function() {
            return xaxes;
        };
        plot.getYAxes = function() {
            return yaxes;
        };
        plot.c2p = canvasToAxisCoords;
        plot.p2c = axisToCanvasCoords;
        plot.getOptions = function() {
            return options;
        };
        plot.highlight = highlight;
        plot.unhighlight = unhighlight;
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return {
                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left),
                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top)
            };
        };
        plot.shutdown = shutdown;
        plot.resize = function() {
            getCanvasDimensions();
            resizeCanvas(canvas);
            resizeCanvas(overlay);
        };
        plot.hooks = hooks;
        initPlugins(plot);
        parseOptions(options_);
        setupCanvases();
        setData(data_);
        setupGrid();
        draw();
        bindEvents();

        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i)
                hook[i].apply(this, args);
        }

        function initPlugins() {
            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }

        function parseOptions(opts) {
            var i;
            $.extend(true, options, opts);
            if (options.xaxis.color == null)
                options.xaxis.color = options.grid.color;
            if (options.yaxis.color == null)
                options.yaxis.color = options.grid.color;
            if (options.xaxis.tickColor == null)
                options.xaxis.tickColor = options.grid.tickColor;
            if (options.yaxis.tickColor == null)
                options.yaxis.tickColor = options.grid.tickColor;
            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            if (options.grid.tickColor == null)
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            for (i = 0; i < Math.max(1, options.xaxes.length); ++i)
                options.xaxes[i] = $.extend(true, {}, options.xaxis, options.xaxes[i]);
            for (i = 0; i < Math.max(1, options.yaxes.length); ++i)
                options.yaxes[i] = $.extend(true, {}, options.yaxis, options.yaxes[i]);
            if (options.xaxis.noTicks && options.xaxis.ticks == null)
                options.xaxis.ticks = options.xaxis.noTicks;
            if (options.yaxis.noTicks && options.yaxis.ticks == null)
                options.yaxis.ticks = options.yaxis.noTicks;
            if (options.x2axis) {
                options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis);
                options.xaxes[1].position = "top";
            }
            if (options.y2axis) {
                options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis);
                options.yaxes[1].position = "right";
            }
            if (options.grid.coloredAreas)
                options.grid.markings = options.grid.coloredAreas;
            if (options.grid.coloredAreasColor)
                options.grid.markingsColor = options.grid.coloredAreasColor;
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize != null)
                options.series.shadowSize = options.shadowSize;
            for (i = 0; i < options.xaxes.length; ++i)
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            for (i = 0; i < options.yaxes.length; ++i)
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];
            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);
            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            series = parseData(d);
            fillInSeriesOptions();
            processData();
        }

        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);
                if (d[i].data != null) {
                    s.data = d[i].data;
                    delete d[i].data;
                    $.extend(true, s, d[i]);
                    d[i].data = s.data;
                } else
                    s.data = d[i];
                res.push(s);
            }
            return res;
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a == "object")
                a = a.n;
            if (typeof a != "number")
                a = 1;
            return a;
        }

        function allAxes() {
            return $.grep(xaxes.concat(yaxes), function(a) {
                return a;
            });
        }

        function canvasToAxisCoords(pos) {
            var res = {}, i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used)
                    res["x" + axis.n] = axis.c2p(pos.left);
            }
            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used)
                    res["y" + axis.n] = axis.c2p(pos.top);
            }
            if (res.x1 !== undefined)
                res.x = res.x1;
            if (res.y1 !== undefined)
                res.y = res.y1;
            return res;
        }

        function axisToCanvasCoords(pos) {
            var res = {}, i, axis, key;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "x";
                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }
            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "y";
                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }
            return res;
        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1])
                axes[number - 1] = {
                    n: number,
                    direction: axes == xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis)
                };
            return axes[number - 1];
        }

        function fillInSeriesOptions() {
            var i;
            var neededColors = series.length,
                usedColors = [],
                assignedColors = [];
            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    --neededColors;
                    if (typeof sc == "number")
                        assignedColors.push(sc);
                    else
                        usedColors.push($.color.parse(series[i].color));
                }
            }
            for (i = 0; i < assignedColors.length; ++i) {
                neededColors = Math.max(neededColors, assignedColors[i] + 1);
            }
            var colors = [],
                variation = 0;
            i = 0;
            while (colors.length < neededColors) {
                var c;
                if (options.colors.length == i)
                    c = $.color.make(100, 100, 100);
                else
                    c = $.color.parse(options.colors[i]);
                var sign = variation % 2 == 1 ? -1 : 1;
                c.scale('rgb', 1 + sign * Math.ceil(variation / 2) * 0.2)
                colors.push(c);
                ++i;
                if (i >= options.colors.length) {
                    i = 0;
                    ++variation;
                }
            }
            var colori = 0,
                s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                } else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s)
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                fakeInfinity = Number.MAX_VALUE,
                i, j, k, m, length, s, points, ps, x, y, axis, val, f, p;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min != -fakeInfinity)
                    axis.datamin = min;
                if (max > axis.datamax && max != fakeInfinity)
                    axis.datamax = max;
            }
            $.each(allAxes(), function(_, axis) {
                axis.datamin = topSentry;
                axis.datamax = bottomSentry;
                axis.used = false;
            });
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = {
                    points: []
                };
                executeHooks(hooks.processRawData, [s, s.data, s.datapoints]);
            }
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                var data = s.data,
                    format = s.datapoints.format;
                if (!format) {
                    format = [];
                    format.push({
                        x: true,
                        number: true,
                        required: true
                    });
                    format.push({
                        y: true,
                        number: true,
                        required: true
                    });
                    if (s.bars.show || (s.lines.show && s.lines.fill)) {
                        format.push({
                            y: true,
                            number: true,
                            required: false,
                            defaultValue: 0
                        });
                        if (s.bars.horizontal) {
                            delete format[format.length - 1].y;
                            format[format.length - 1].x = true;
                        }
                    }
                    s.datapoints.format = format;
                }
                if (s.datapoints.pointsize != null)
                    continue;
                s.datapoints.pointsize = format.length;
                ps = s.datapoints.pointsize;
                points = s.datapoints.points;
                insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;
                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];
                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];
                            if (f) {
                                if (f.number && val != null) {
                                    val = +val;
                                    if (isNaN(val))
                                        val = null;
                                    else if (val == Infinity)
                                        val = fakeInfinity;
                                    else if (val == -Infinity)
                                        val = -fakeInfinity;
                                }
                                if (val == null) {
                                    if (f.required)
                                        nullify = true;
                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }
                            points[k + m] = val;
                        }
                    }
                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                if (f.x)
                                    updateAxis(s.xaxis, val, val);
                                if (f.y)
                                    updateAxis(s.yaxis, val, val);
                            }
                            points[k + m] = null;
                        }
                    } else {
                        if (insertSteps && k > 0 && points[k - ps] != null && points[k - ps] != points[k] && points[k - ps + 1] != points[k + 1]) {
                            for (m = 0; m < ps; ++m)
                                points[k + ps + m] = points[k + m];
                            points[k + 1] = points[k - ps + 1];
                            k += ps;
                        }
                    }
                }
            }
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                executeHooks(hooks.processDatapoints, [s, s.datapoints]);
            }
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points, ps = s.datapoints.pointsize;
                var xmin = topSentry,
                    ymin = topSentry,
                    xmax = bottomSentry,
                    ymax = bottomSentry;
                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;
                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f || val == fakeInfinity || val == -fakeInfinity)
                            continue;
                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }
                if (s.bars.show) {
                    var delta = s.bars.align == "left" ? 0 : -s.bars.barWidth / 2;
                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    } else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }
                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }
            $.each(allAxes(), function(_, axis) {
                if (axis.datamin == topSentry)
                    axis.datamin = null;
                if (axis.datamax == bottomSentry)
                    axis.datamax = null;
            });
        }

        function makeCanvas(skipPositioning, cls) {
            var c = document.createElement('canvas');
            c.className = cls;
            c.width = canvasWidth;
            c.height = canvasHeight;
            if (!skipPositioning)
                $(c).css({
                    position: 'absolute',
                    left: 0,
                    top: 0
                });
            $(c).appendTo(placeholder);
            if (!c.getContext)
                c = window.G_vmlCanvasManager.initElement(c);
            c.getContext("2d").save();
            return c;
        }

        function getCanvasDimensions() {
            canvasWidth = placeholder.width();
            canvasHeight = placeholder.height();
            if (canvasWidth <= 0 || canvasHeight <= 0)
                throw "Invalid dimensions for plot, width = " + canvasWidth + ", height = " + canvasHeight;
        }

        function resizeCanvas(c) {
            if (c.width != canvasWidth)
                c.width = canvasWidth;
            if (c.height != canvasHeight)
                c.height = canvasHeight;
            var cctx = c.getContext("2d");
            cctx.restore();
            cctx.save();
        }

        function setupCanvases() {
            var reused, existingCanvas = placeholder.children("canvas.base"),
                existingOverlay = placeholder.children("canvas.overlay");
            if (existingCanvas.length == 0 || existingOverlay == 0) {
                placeholder.html("");
                placeholder.css({
                    padding: 0
                });
                if (placeholder.css("position") == 'static')
                    placeholder.css("position", "relative");
                getCanvasDimensions();
                canvas = makeCanvas(true, "base");
                overlay = makeCanvas(false, "overlay");
                reused = false;
            } else {
                canvas = existingCanvas.get(0);
                overlay = existingOverlay.get(0);
                reused = true;
            }
            ctx = canvas.getContext("2d");
            octx = overlay.getContext("2d");
            eventHolder = $([overlay, canvas]);
            if (reused) {
                placeholder.data("plot").shutdown();
                plot.resize();
                octx.clearRect(0, 0, canvasWidth, canvasHeight);
                eventHolder.unbind();
                placeholder.children().not([canvas, overlay]).remove();
            }
            placeholder.data("plot", plot);
        }

        function bindEvents() {
            if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);
                eventHolder.mouseleave(onMouseLeave);
            }
            if (options.grid.clickable)
                eventHolder.click(onClick);
            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function shutdown() {
            if (redrawTimeout)
                clearTimeout(redrawTimeout);
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);
            executeHooks(hooks.shutdown, [eventHolder]);
        }

        function setTransformationHelpers(axis) {
            function identity(x) {
                return x;
            }
            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;
            if (axis.direction == "x") {
                s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                m = Math.min(t(axis.max), t(axis.min));
            } else {
                s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }
            if (t == identity)
                axis.p2c = function(p) {
                    return (p - m) * s;
                };
            else
                axis.p2c = function(p) {
                    return (t(p) - m) * s;
                }; if (!it)
                axis.c2p = function(c) {
                    return m + c / s;
                };
            else
                axis.c2p = function(c) {
                    return it(m + c / s);
                };
        }

        function measureTickLabels(axis) {
            var opts = axis.options,
                i, ticks = axis.ticks || [],
                labels = [],
                l, w = opts.labelWidth,
                h = opts.labelHeight,
                dummyDiv;

            function makeDummyDiv(labels, width) {
                return $('<div style="position:absolute;top:-10000px;' + width + 'font-size:smaller">' + '<div class="' + axis.direction + 'Axis ' + axis.direction + axis.n + 'Axis">' + labels.join("") + '</div></div>').appendTo(placeholder);
            }
            if (axis.direction == "x") {
                if (w == null)
                    w = Math.floor(canvasWidth / (ticks.length > 0 ? ticks.length : 1));
                if (h == null) {
                    labels = [];
                    for (i = 0; i < ticks.length; ++i) {
                        l = ticks[i].label;
                        if (l)
                            labels.push('<div class="tickLabel" style="float:left;width:' + w + 'px">' + l + '</div>');
                    }
                    if (labels.length > 0) {
                        labels.push('<div style="clear:left"></div>');
                        dummyDiv = makeDummyDiv(labels, "width:10000px;");
                        h = dummyDiv.height();
                        dummyDiv.remove();
                    }
                }
            } else if (w == null || h == null) {
                for (i = 0; i < ticks.length; ++i) {
                    l = ticks[i].label;
                    if (l)
                        labels.push('<div class="tickLabel">' + l + '</div>');
                }
                if (labels.length > 0) {
                    dummyDiv = makeDummyDiv(labels, "");
                    if (w == null)
                        w = dummyDiv.children().width();
                    if (h == null)
                        h = dummyDiv.find("div.tickLabel").height();
                    dummyDiv.remove();
                }
            }
            if (w == null)
                w = 0;
            if (h == null)
                h = 0;
            axis.labelWidth = w;
            axis.labelHeight = h;
        }

        function allocateAxisBoxFirstPhase(axis) {
            var lw = axis.labelWidth,
                lh = axis.labelHeight,
                pos = axis.options.position,
                tickLength = axis.options.tickLength,
                axismargin = options.grid.axisMargin,
                padding = options.grid.labelMargin,
                all = axis.direction == "x" ? xaxes : yaxes,
                index;
            var samePosition = $.grep(all, function(a) {
                return a && a.options.position == pos && a.reserveSpace;
            });
            if ($.inArray(axis, samePosition) == samePosition.length - 1)
                axismargin = 0;
            if (tickLength == null)
                tickLength = "full";
            var sameDirection = $.grep(all, function(a) {
                return a && a.reserveSpace;
            });
            var innermost = $.inArray(axis, sameDirection) == 0;
            if (!innermost && tickLength == "full")
                tickLength = 5;
            if (!isNaN(+tickLength))
                padding += +tickLength;
            if (axis.direction == "x") {
                lh += padding;
                if (pos == "bottom") {
                    plotOffset.bottom += lh + axismargin;
                    axis.box = {
                        top: canvasHeight - plotOffset.bottom,
                        height: lh
                    };
                } else {
                    axis.box = {
                        top: plotOffset.top + axismargin,
                        height: lh
                    };
                    plotOffset.top += lh + axismargin;
                }
            } else {
                lw += padding;
                if (pos == "left") {
                    axis.box = {
                        left: plotOffset.left + axismargin,
                        width: lw
                    };
                    plotOffset.left += lw + axismargin;
                } else {
                    plotOffset.right += lw + axismargin;
                    axis.box = {
                        left: canvasWidth - plotOffset.right,
                        width: lw
                    };
                }
            }
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.box.padding = padding;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
            if (axis.direction == "x") {
                axis.box.left = plotOffset.left;
                axis.box.width = plotWidth;
            } else {
                axis.box.top = plotOffset.top;
                axis.box.height = plotHeight;
            }
        }

        function setupGrid() {
            var i, axes = allAxes();
            $.each(axes, function(_, axis) {
                axis.show = axis.options.show;
                if (axis.show == null)
                    axis.show = axis.used;
                axis.reserveSpace = axis.show || axis.options.reserveSpace;
                setRange(axis);
            });
            allocatedAxes = $.grep(axes, function(axis) {
                return axis.reserveSpace;
            });
            plotOffset.left = plotOffset.right = plotOffset.top = plotOffset.bottom = 0;
            if (options.grid.show) {
                $.each(allocatedAxes, function(_, axis) {
                    setupTickGeneration(axis);
                    setTicks(axis);
                    snapRangeToTicks(axis, axis.ticks);
                    measureTickLabels(axis);
                });
                for (i = allocatedAxes.length - 1; i >= 0; --i)
                    allocateAxisBoxFirstPhase(allocatedAxes[i]);
                var minMargin = options.grid.minBorderMargin;
                if (minMargin == null) {
                    minMargin = 0;
                    for (i = 0; i < series.length; ++i)
                        minMargin = Math.max(minMargin, series[i].points.radius + series[i].points.lineWidth / 2);
                }
                for (var a in plotOffset) {
                    plotOffset[a] += options.grid.borderWidth;
                    plotOffset[a] = Math.max(minMargin, plotOffset[a]);
                }
            }
            plotWidth = canvasWidth - plotOffset.left - plotOffset.right;
            plotHeight = canvasHeight - plotOffset.bottom - plotOffset.top;
            $.each(axes, function(_, axis) {
                setTransformationHelpers(axis);
            });
            if (options.grid.show) {
                $.each(allocatedAxes, function(_, axis) {
                    allocateAxisBoxSecondPhase(axis);
                });
                insertAxisLabels();
            }
            insertLegend();
        }

        function setRange(axis) {
            var opts = axis.options,
                min = +(opts.min != null ? opts.min : axis.datamin),
                max = +(opts.max != null ? opts.max : axis.datamax),
                delta = max - min;
            if (delta == 0.0) {
                var widen = max == 0 ? 1 : 0.01;
                if (opts.min == null)
                    min -= widen;
                if (opts.max == null || opts.min != null)
                    max += widen;
            } else {
                var margin = opts.autoscaleMargin;
                if (margin != null) {
                    if (opts.min == null) {
                        min -= delta * margin;
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (opts.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        function setupTickGeneration(axis) {
            var opts = axis.options;
            var noTicks;
            if (typeof opts.ticks == "number" && opts.ticks > 0)
                noTicks = opts.ticks;
            else
                noTicks = 0.3 * Math.sqrt(axis.direction == "x" ? canvasWidth : canvasHeight);
            var delta = (axis.max - axis.min) / noTicks,
                size, generator, unit, formatter, i, magn, norm;
            if (opts.mode == "time") {
                var timeUnitSize = {
                    "second": 1000,
                    "minute": 60 * 1000,
                    "hour": 60 * 60 * 1000,
                    "day": 24 * 60 * 60 * 1000,
                    "month": 30 * 24 * 60 * 60 * 1000,
                    "year": 365.2425 * 24 * 60 * 60 * 1000
                };
                var spec = [
                    [1, "second"],
                    [2, "second"],
                    [5, "second"],
                    [10, "second"],
                    [30, "second"],
                    [1, "minute"],
                    [2, "minute"],
                    [5, "minute"],
                    [10, "minute"],
                    [30, "minute"],
                    [1, "hour"],
                    [2, "hour"],
                    [4, "hour"],
                    [8, "hour"],
                    [12, "hour"],
                    [1, "day"],
                    [2, "day"],
                    [3, "day"],
                    [0.25, "month"],
                    [0.5, "month"],
                    [1, "month"],
                    [2, "month"],
                    [3, "month"],
                    [6, "month"],
                    [1, "year"]
                ];
                var minSize = 0;
                if (opts.minTickSize != null) {
                    if (typeof opts.tickSize == "number")
                        minSize = opts.tickSize;
                    else
                        minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
                }
                for (var i = 0; i < spec.length - 1; ++i)
                    if (delta < (spec[i][0] * timeUnitSize[spec[i][1]] + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2 && spec[i][0] * timeUnitSize[spec[i][1]] >= minSize)
                        break;
                size = spec[i][0];
                unit = spec[i][1];
                if (unit == "year") {
                    magn = Math.pow(10, Math.floor(Math.log(delta / timeUnitSize.year) / Math.LN10));
                    norm = (delta / timeUnitSize.year) / magn;
                    if (norm < 1.5)
                        size = 1;
                    else if (norm < 3)
                        size = 2;
                    else if (norm < 7.5)
                        size = 5;
                    else
                        size = 10;
                    size *= magn;
                }
                axis.tickSize = opts.tickSize || [size, unit];
                generator = function(axis) {
                    var ticks = [],
                        tickSize = axis.tickSize[0],
                        unit = axis.tickSize[1],
                        d = new Date(axis.min);
                    var step = tickSize * timeUnitSize[unit];
                    if (unit == "second")
                        d.setUTCSeconds(floorInBase(d.getUTCSeconds(), tickSize));
                    if (unit == "minute")
                        d.setUTCMinutes(floorInBase(d.getUTCMinutes(), tickSize));
                    if (unit == "hour")
                        d.setUTCHours(floorInBase(d.getUTCHours(), tickSize));
                    if (unit == "month")
                        d.setUTCMonth(floorInBase(d.getUTCMonth(), tickSize));
                    if (unit == "year")
                        d.setUTCFullYear(floorInBase(d.getUTCFullYear(), tickSize));
                    d.setUTCMilliseconds(0);
                    if (step >= timeUnitSize.minute)
                        d.setUTCSeconds(0);
                    if (step >= timeUnitSize.hour)
                        d.setUTCMinutes(0);
                    if (step >= timeUnitSize.day)
                        d.setUTCHours(0);
                    if (step >= timeUnitSize.day * 4)
                        d.setUTCDate(1);
                    if (step >= timeUnitSize.year)
                        d.setUTCMonth(0);
                    var carry = 0,
                        v = Number.NaN,
                        prev;
                    do {
                        prev = v;
                        v = d.getTime();
                        ticks.push(v);
                        if (unit == "month") {
                            if (tickSize < 1) {
                                d.setUTCDate(1);
                                var start = d.getTime();
                                d.setUTCMonth(d.getUTCMonth() + 1);
                                var end = d.getTime();
                                d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
                                carry = d.getUTCHours();
                                d.setUTCHours(0);
                            } else
                                d.setUTCMonth(d.getUTCMonth() + tickSize);
                        } else if (unit == "year") {
                            d.setUTCFullYear(d.getUTCFullYear() + tickSize);
                        } else
                            d.setTime(v + step);
                    } while (v < axis.max && v != prev);
                    return ticks;
                };
                formatter = function(v, axis) {
                    var d = new Date(v);
                    if (opts.timeformat != null)
                        return $.plot.formatDate(d, opts.timeformat, opts.monthNames);
                    var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
                    var span = axis.max - axis.min;
                    var suffix = (opts.twelveHourClock) ? " %p" : "";
                    if (t < timeUnitSize.minute)
                        fmt = "%h:%M:%S" + suffix;
                    else if (t < timeUnitSize.day) {
                        if (span < 2 * timeUnitSize.day)
                            fmt = "%h:%M" + suffix;
                        else
                            fmt = "%b %d %h:%M" + suffix;
                    } else if (t < timeUnitSize.month)
                        fmt = "%b %d";
                    else if (t < timeUnitSize.year) {
                        if (span < timeUnitSize.year)
                            fmt = "%b";
                        else
                            fmt = "%b %y";
                    } else
                        fmt = "%y";
                    return $.plot.formatDate(d, fmt, opts.monthNames);
                };
            } else {
                var maxDec = opts.tickDecimals;
                var dec = -Math.floor(Math.log(delta) / Math.LN10);
                if (maxDec != null && dec > maxDec)
                    dec = maxDec;
                magn = Math.pow(10, -dec);
                norm = delta / magn;
                if (norm < 1.5)
                    size = 1;
                else if (norm < 3) {
                    size = 2;
                    if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                        size = 2.5;
                        ++dec;
                    }
                } else if (norm < 7.5)
                    size = 5;
                else
                    size = 10;
                size *= magn;
                if (opts.minTickSize != null && size < opts.minTickSize)
                    size = opts.minTickSize;
                axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec);
                axis.tickSize = opts.tickSize || size;
                generator = function(axis) {
                    var ticks = [];
                    var start = floorInBase(axis.min, axis.tickSize),
                        i = 0,
                        v = Number.NaN,
                        prev;
                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push(v);
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };
                formatter = function(v, axis) {
                    return v.toFixed(axis.tickDecimals);
                };
            }
            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis != axis) {
                    var niceTicks = generator(axis);
                    if (niceTicks.length > 0) {
                        if (opts.min == null)
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        if (opts.max == null && niceTicks.length > 1)
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                    }
                    generator = function(axis) {
                        var ticks = [],
                            v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);
                            ticks.push(v);
                        }
                        return ticks;
                    };
                    if (axis.mode != "time" && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(delta) / Math.LN10) + 1),
                            ts = generator(axis);
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec))))
                            axis.tickDecimals = extraDec;
                    }
                }
            }
            axis.tickGenerator = generator;
            if ($.isFunction(opts.tickFormatter))
                axis.tickFormatter = function(v, axis) {
                    return "" + opts.tickFormatter(v, axis);
                };
            else
                axis.tickFormatter = formatter;
        }

        function setTicks(axis) {
            var oticks = axis.options.ticks,
                ticks = [];
            if (oticks == null || (typeof oticks == "number" && oticks > 0))
                ticks = axis.tickGenerator(axis);
            else if (oticks) {
                if ($.isFunction(oticks))
                    ticks = oticks({
                        min: axis.min,
                        max: axis.max
                    });
                else
                    ticks = oticks;
            }
            var i, v;
            axis.ticks = [];
            for (i = 0; i < ticks.length; ++i) {
                var label = null;
                var t = ticks[i];
                if (typeof t == "object") {
                    v = +t[0];
                    if (t.length > 1)
                        label = t[1];
                } else
                    v = +t; if (label == null)
                    label = axis.tickFormatter(v, axis);
                if (!isNaN(v))
                    axis.ticks.push({
                        v: v,
                        label: label
                    });
            }
        }

        function snapRangeToTicks(axis, ticks) {
            if (axis.options.autoscaleMargin && ticks.length > 0) {
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, ticks[0].v);
                if (axis.options.max == null && ticks.length > 1)
                    axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            var grid = options.grid;
            if (grid.show && grid.backgroundColor)
                drawBackground();
            if (grid.show && !grid.aboveData)
                drawGrid();
            for (var i = 0; i < series.length; ++i) {
                executeHooks(hooks.drawSeries, [ctx, series[i]]);
                drawSeries(series[i]);
            }
            executeHooks(hooks.draw, [ctx]);
            if (grid.show && grid.aboveData)
                drawGrid();
        }

        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = allAxes();
            for (i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis";
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }
            if (!ranges[key]) {
                axis = coord == "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }
            return {
                from: from,
                to: to,
                axis: axis
            };
        }

        function drawBackground() {
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
            ctx.fillRect(0, 0, plotWidth, plotHeight);
            ctx.restore();
        }

        function drawGrid() {
            var i;
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            var markings = options.grid.markings;
            if (markings) {
                if ($.isFunction(markings)) {
                    var axes = plot.getAxes();
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;
                    markings = markings(axes);
                }
                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max || yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;
                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);
                    if (xrange.from == xrange.to && yrange.from == yrange.to)
                        continue;
                    xrange.from = xrange.axis.p2c(xrange.from);
                    xrange.to = xrange.axis.p2c(xrange.to);
                    yrange.from = yrange.axis.p2c(yrange.from);
                    yrange.to = yrange.axis.p2c(yrange.to);
                    if (xrange.from == xrange.to || yrange.from == yrange.to) {
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = m.lineWidth || options.grid.markingsLineWidth;
                        ctx.moveTo(xrange.from, yrange.from);
                        ctx.lineTo(xrange.to, yrange.to);
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to, xrange.to - xrange.from, yrange.from - yrange.to);
                    }
                }
            }
            var axes = allAxes(),
                bw = options.grid.borderWidth;
            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j],
                    box = axis.box,
                    t = axis.tickLength,
                    x, y, xoff, yoff;
                if (!axis.show || axis.ticks.length == 0)
                    continue
                ctx.strokeStyle = axis.options.tickColor || $.color.parse(axis.options.color).scale('a', 0.22).toString();
                ctx.lineWidth = 1;
                if (axis.direction == "x") {
                    x = 0;
                    if (t == "full")
                        y = (axis.position == "top" ? 0 : plotHeight);
                    else
                        y = box.top - plotOffset.top + (axis.position == "top" ? box.height : 0);
                } else {
                    y = 0;
                    if (t == "full")
                        x = (axis.position == "left" ? 0 : plotWidth);
                    else
                        x = box.left - plotOffset.left + (axis.position == "left" ? box.width : 0);
                }
                if (!axis.innermost) {
                    ctx.beginPath();
                    xoff = yoff = 0;
                    if (axis.direction == "x")
                        xoff = plotWidth;
                    else
                        yoff = plotHeight; if (ctx.lineWidth == 1) {
                        x = Math.floor(x) + 0.5;
                        y = Math.floor(y) + 0.5;
                    }
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                    ctx.stroke();
                }
                ctx.beginPath();
                for (i = 0; i < axis.ticks.length; ++i) {
                    var v = axis.ticks[i].v;
                    xoff = yoff = 0;
                    if (v < axis.min || v > axis.max || (t == "full" && bw > 0 && (v == axis.min || v == axis.max)))
                        continue;
                    if (axis.direction == "x") {
                        x = axis.p2c(v);
                        yoff = t == "full" ? -plotHeight : t;
                        if (axis.position == "top")
                            yoff = -yoff;
                    } else {
                        y = axis.p2c(v);
                        xoff = t == "full" ? -plotWidth : t;
                        if (axis.position == "left")
                            xoff = -xoff;
                    }
                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x")
                            x = Math.floor(x) + 0.5;
                        else
                            y = Math.floor(y) + 0.5;
                    }
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                }
                ctx.stroke();
            }
            if (bw) {
                ctx.lineWidth = bw;
                ctx.strokeStyle = options.grid.borderColor;
                ctx.strokeRect(-bw / 2, -bw / 2, plotWidth + bw, plotHeight + bw);
            }
            ctx.restore();
        }

        function insertAxisLabels() {
            placeholder.find(".tickLabels").remove();
            var html = ['<div class="tickLabels" style="font-size:smaller">'];
            var axes = allAxes();
            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j],
                    box = axis.box;
                if (!axis.show)
                    continue;
                html.push('<div class="' + axis.direction + 'Axis ' + axis.direction + axis.n + 'Axis" style="color:' + axis.options.color + '">');
                for (var i = 0; i < axis.ticks.length; ++i) {
                    var tick = axis.ticks[i];
                    if (!tick.label || tick.v < axis.min || tick.v > axis.max)
                        continue;
                    var pos = {}, align;
                    if (axis.direction == "x") {
                        align = "center";
                        pos.left = Math.round(plotOffset.left + axis.p2c(tick.v) - axis.labelWidth / 2);
                        if (axis.position == "bottom")
                            pos.top = box.top + box.padding;
                        else
                            pos.bottom = canvasHeight - (box.top + box.height - box.padding);
                    } else {
                        pos.top = Math.round(plotOffset.top + axis.p2c(tick.v) - axis.labelHeight / 2);
                        if (axis.position == "left") {
                            pos.right = canvasWidth - (box.left + box.width - box.padding)
                            align = "right";
                        } else {
                            pos.left = box.left + box.padding;
                            align = "left";
                        }
                    }
                    pos.width = axis.labelWidth;
                    var style = ["position:absolute", "text-align:" + align];
                    for (var a in pos)
                        style.push(a + ":" + pos[a] + "px")
                    html.push('<div class="tickLabel" style="' + style.join(';') + '">' + tick.label + '</div>');
                }
                html.push('</div>');
            }
            html.push('</div>');
            placeholder.append(html.join(""));
        }

        function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }

        function drawSeriesLines(series) {
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null,
                    prevy = null;
                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps],
                        y1 = points[i - ps + 1],
                        x2 = points[i],
                        y2 = points[i + 1];
                    if (x1 == null || x2 == null)
                        continue;
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue;
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    } else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    } else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    } else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    } else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }
                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);
                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    i = 0,
                    top, areaOpen = false,
                    ypos = 1,
                    segmentStart = 0,
                    segmentEnd = 0;
                while (true) {
                    if (ps > 0 && i > points.length + ps)
                        break;
                    i += ps;
                    var x1 = points[i - ps],
                        y1 = points[i - ps + ypos],
                        x2 = points[i],
                        y2 = points[i + ypos];
                    if (areaOpen) {
                        if (ps > 0 && x1 != null && x2 == null) {
                            segmentEnd = i;
                            ps = -ps;
                            ypos = 2;
                            continue;
                        }
                        if (ps < 0 && i == segmentStart + ps) {
                            ctx.fill();
                            areaOpen = false;
                            ps = -ps;
                            ypos = 1;
                            i = segmentStart = segmentEnd + ps;
                            continue;
                        }
                    }
                    if (x1 == null || x2 == null)
                        continue;
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    } else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    } else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }
                    if (!areaOpen) {
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        continue;
                    } else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        continue;
                    }
                    var x1old = x1,
                        x2old = x2;
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    } else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    } else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }
                    if (x1 != x1old) {
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1));
                    }
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                    if (x2 != x2old) {
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2));
                    }
                }
            }
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";
            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            if (lw > 0 && sw > 0) {
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                var angle = Math.PI / 18;
                plotLine(series.datapoints, Math.sin(angle) * (lw / 2 + sw / 2), Math.cos(angle) * (lw / 2 + sw / 2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw / 2;
                plotLine(series.datapoints, Math.sin(angle) * (lw / 2 + sw / 4), Math.cos(angle) * (lw / 2 + sw / 4), series.xaxis, series.yaxis);
            }
            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }
            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
            function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                var points = datapoints.points,
                    ps = datapoints.pointsize;
                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i],
                        y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;
                    ctx.beginPath();
                    x = axisx.p2c(x);
                    y = axisy.p2c(y) + offset;
                    if (symbol == "circle")
                        ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                    else
                        symbol(ctx, x, y, radius, shadow);
                    ctx.closePath();
                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            var lw = series.points.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius,
                symbol = series.points.symbol;
            if (lw > 0 && sw > 0) {
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w / 2, true, series.xaxis, series.yaxis, symbol);
                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w / 2, true, series.xaxis, series.yaxis, symbol);
            }
            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius, getFillStyle(series.points, series.color), 0, false, series.xaxis, series.yaxis, symbol);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, offset, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth) {
            var left, right, bottom, top, drawLeft, drawRight, drawTop, drawBottom, tmp;
            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            } else {
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }
            if (right < axisx.min || left > axisx.max || top < axisy.min || bottom > axisy.max)
                return;
            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }
            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }
            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }
            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }
            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);
            if (fillStyleCallback) {
                c.beginPath();
                c.moveTo(left, bottom);
                c.lineTo(left, top);
                c.lineTo(right, top);
                c.lineTo(right, bottom);
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fill();
            }
            if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
                c.beginPath();
                c.moveTo(left, bottom + offset);
                if (drawLeft)
                    c.lineTo(left, top + offset);
                else
                    c.moveTo(left, top + offset); if (drawTop)
                    c.lineTo(right, top + offset);
                else
                    c.moveTo(right, top + offset); if (drawRight)
                    c.lineTo(right, bottom + offset);
                else
                    c.moveTo(right, bottom + offset); if (drawBottom)
                    c.lineTo(left, bottom + offset);
                else
                    c.moveTo(left, bottom + offset);
                c.stroke();
            }
        }

        function drawSeriesBars(series) {
            function plotBars(datapoints, barLeft, barRight, offset, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize;
                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, offset, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, series.bars.lineWidth);
                }
            }
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;
            var barLeft = series.bars.align == "left" ? 0 : -series.bars.barWidth / 2;
            var fillStyleCallback = series.bars.fill ? function(bottom, top) {
                    return getFillStyle(series.bars, series.color, bottom, top);
                } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, 0, fillStyleCallback, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function getFillStyle(filloptions, seriesColor, bottom, top) {
            var fill = filloptions.fill;
            if (!fill)
                return null;
            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);
            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }

        function insertLegend() {
            placeholder.find(".legend").remove();
            if (!options.legend.show)
                return;
            var fragments = [],
                rowStarted = false,
                lf = options.legend.labelFormatter,
                s, label;
            for (var i = 0; i < series.length; ++i) {
                s = series[i];
                label = s.label;
                if (!label)
                    continue;
                if (i % options.legend.noColumns == 0) {
                    if (rowStarted)
                        fragments.push('</tr>');
                    fragments.push('<tr>');
                    rowStarted = true;
                }
                if (lf)
                    label = lf(label, s);
                fragments.push('<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + s.color + ';overflow:hidden"></div></div></td>' + '<td class="legendLabel">' + label + '</td>');
            }
            if (rowStarted)
                fragments.push('</tr>');
            if (fragments.length == 0)
                return;
            var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + '</table>';
            if (options.legend.container != null)
                $(options.legend.container).html(table);
            else {
                var pos = "",
                    p = options.legend.position,
                    m = options.legend.margin;
                if (m[0] == null)
                    m = [m, m];
                if (p.charAt(0) == "n")
                    pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
                else if (p.charAt(0) == "s")
                    pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
                if (p.charAt(1) == "e")
                    pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
                else if (p.charAt(1) == "w")
                    pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
                var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos + ';') + '</div>').appendTo(placeholder);
                if (options.legend.backgroundOpacity != 0.0) {
                    var c = options.legend.backgroundColor;
                    if (c == null) {
                        c = options.grid.backgroundColor;
                        if (c && typeof c == "string")
                            c = $.color.parse(c);
                        else
                            c = $.color.extract(legend, 'background-color');
                        c.a = 1;
                        c = c.toString();
                    }
                    var div = legend.children();
                    $('<div style="position:absolute;width:' + div.width() + 'px;height:' + div.height() + 'px;' + pos + 'background-color:' + c + ';"> </div>').prependTo(legend).css('opacity', options.legend.backgroundOpacity);
                }
            }
        }
        var highlights = [],
            redrawTimeout = null;

        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null,
                foundPoint = false,
                i, j;
            for (i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(series[i]))
                    continue;
                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    ps = s.datapoints.pointsize,
                    mx = axisx.c2p(mouseX),
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;
                if (axisx.options.inverseTransform)
                    maxx = Number.MAX_VALUE;
                if (axisy.options.inverseTransform)
                    maxy = Number.MAX_VALUE;
                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j],
                            y = points[j + 1];
                        if (x == null)
                            continue;
                        if (x - mx > maxx || x - mx < -maxx || y - my > maxy || y - my < -maxy)
                            continue;
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy;
                        if (dist < smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }
                if (s.bars.show && !item) {
                    var barLeft = s.bars.align == "left" ? 0 : -s.bars.barWidth / 2,
                        barRight = barLeft + s.bars.barWidth;
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j],
                            y = points[j + 1],
                            b = points[j + 2];
                        if (x == null)
                            continue;
                        if (series[i].bars.horizontal ? (mx <= Math.max(b, x) && mx >= Math.min(b, x) && my >= y + barLeft && my <= y + barRight) : (mx >= x + barLeft && mx <= x + barRight && my >= Math.min(b, y) && my <= Math.max(b, y)))
                            item = [i, j / ps];
                    }
                }
            }
            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;
                return {
                    datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                    dataIndex: j,
                    series: series[i],
                    seriesIndex: i
                };
            }
            return null;
        }

        function onMouseMove(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e, function(s) {
                    return s["hoverable"] != false;
                });
        }

        function onMouseLeave(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e, function(s) {
                    return false;
                });
        }

        function onClick(e) {
            triggerClickHoverEvent("plotclick", e, function(s) {
                return s["clickable"] != false;
            });
        }

        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = eventHolder.offset(),
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top,
                pos = canvasToAxisCoords({
                    left: canvasX,
                    top: canvasY
                });
            pos.pageX = event.pageX;
            pos.pageY = event.pageY;
            var item = findNearbyItem(canvasX, canvasY, seriesFilter);
            if (item) {
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top);
            }
            if (options.grid.autoHighlight) {
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname && !(item && h.series == item.series && h.point[0] == item.datapoint[0] && h.point[1] == item.datapoint[1]))
                        unhighlight(h.series, h.point);
                }
                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }
            placeholder.trigger(eventname, [pos, item]);
        }

        function triggerRedrawOverlay() {
            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, 30);
        }

        function drawOverlay() {
            redrawTimeout = null;
            octx.save();
            octx.clearRect(0, 0, canvasWidth, canvasHeight);
            octx.translate(plotOffset.left, plotOffset.top);
            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];
                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();
            executeHooks(hooks.drawOverlay, [octx]);
        }

        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];
            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }
            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({
                    series: s,
                    point: point,
                    auto: auto
                });
                triggerRedrawOverlay();
            } else if (!auto)
                highlights[i].auto = false;
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
            }
            if (typeof s == "number")
                s = series[s];
            if (typeof point == "number")
                point = s.data[point];
            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);
                triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0] && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }

        function drawPointHighlight(series, point) {
            var x = point[0],
                y = point[1],
                axisx = series.xaxis,
                axisy = series.yaxis;
            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;
            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = $.color.parse(series.color).scale('a', 0.5).toString();
            var radius = 1.5 * pointRadius,
                x = axisx.p2c(x),
                y = axisy.p2c(y);
            octx.beginPath();
            if (series.points.symbol == "circle")
                octx.arc(x, y, radius, 0, 2 * Math.PI, false);
            else
                series.points.symbol(octx, x, y, radius, false);
            octx.closePath();
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = $.color.parse(series.color).scale('a', 0.5).toString();
            var fillStyle = $.color.parse(series.color).scale('a', 0.5).toString();
            var barLeft = series.bars.align == "left" ? 0 : -series.bars.barWidth / 2;
            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth, 0, function() {
                return fillStyle;
            }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec == "string")
                return spec;
            else {
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);
                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null)
                            co = co.scale('rgb', c.brightness)
                        if (c.opacity != null)
                            co.a *= c.opacity;
                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }
                return gradient;
            }
        }
    }
    $.plot = function(placeholder, data, options) {
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        return plot;
    };
    $.plot.version = "0.7";
    $.plot.plugins = [];
    $.plot.formatDate = function(d, fmt, monthNames) {
        var leftPad = function(n) {
            n = "" + n;
            return n.length == 1 ? "0" + n : n;
        };
        var r = [];
        var escape = false,
            padNext = false;
        var hours = d.getUTCHours();
        var isAM = hours < 12;
        if (monthNames == null)
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (fmt.search(/%p|%P/) != -1) {
            if (hours > 12) {
                hours = hours - 12;
            } else if (hours == 0) {
                hours = 12;
            }
        }
        for (var i = 0; i < fmt.length; ++i) {
            var c = fmt.charAt(i);
            if (escape) {
                switch (c) {
                    case 'h':
                        c = "" + hours;
                        break;
                    case 'H':
                        c = leftPad(hours);
                        break;
                    case 'M':
                        c = leftPad(d.getUTCMinutes());
                        break;
                    case 'S':
                        c = leftPad(d.getUTCSeconds());
                        break;
                    case 'd':
                        c = "" + d.getUTCDate();
                        break;
                    case 'm':
                        c = "" + (d.getUTCMonth() + 1);
                        break;
                    case 'y':
                        c = "" + d.getUTCFullYear();
                        break;
                    case 'b':
                        c = "" + monthNames[d.getUTCMonth()];
                        break;
                    case 'p':
                        c = (isAM) ? ("" + "am") : ("" + "pm");
                        break;
                    case 'P':
                        c = (isAM) ? ("" + "AM") : ("" + "PM");
                        break;
                    case '0':
                        c = "";
                        padNext = true;
                        break;
                }
                if (c && padNext) {
                    c = leftPad(c);
                    padNext = false;
                }
                r.push(c);
                if (!padNext)
                    escape = false;
            } else {
                if (c == "%")
                    escape = true;
                else
                    r.push(c);
            }
        }
        return r.join("");
    };

    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }
})(jQuery);
(function($) {
    var options = {
        series: {
            stack: null
        }
    };

    function init(plot) {
        function findMatchingSeries(s, allseries) {
            var res = null
            for (var i = 0; i < allseries.length; ++i) {
                if (s == allseries[i])
                    break;
                if (allseries[i].stack == s.stack)
                    res = allseries[i];
            }
            return res;
        }

        function stackData(plot, s, datapoints) {
            if (s.stack == null)
                return;
            var other = findMatchingSeries(s, plot.getData());
            if (!other)
                return;
            var ps = datapoints.pointsize,
                points = datapoints.points,
                otherps = other.datapoints.pointsize,
                otherpoints = other.datapoints.points,
                newpoints = [],
                px, py, intery, qx, qy, bottom, withlines = s.lines.show,
                horizontal = s.bars.horizontal,
                withbottom = ps > 2 && (horizontal ? datapoints.format[2].x : datapoints.format[2].y),
                withsteps = withlines && s.lines.steps,
                fromgap = true,
                keyOffset = horizontal ? 1 : 0,
                accumulateOffset = horizontal ? 0 : 1,
                i = 0,
                j = 0,
                l;
            while (true) {
                if (i >= points.length)
                    break;
                l = newpoints.length;
                if (points[i] == null) {
                    for (m = 0; m < ps; ++m)
                        newpoints.push(points[i + m]);
                    i += ps;
                } else if (j >= otherpoints.length) {
                    if (!withlines) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                    }
                    i += ps;
                } else if (otherpoints[j] == null) {
                    for (m = 0; m < ps; ++m)
                        newpoints.push(null);
                    fromgap = true;
                    j += otherps;
                } else {
                    px = points[i + keyOffset];
                    py = points[i + accumulateOffset];
                    qx = otherpoints[j + keyOffset];
                    qy = otherpoints[j + accumulateOffset];
                    bottom = 0;
                    if (px == qx) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                        newpoints[l + accumulateOffset] += qy;
                        bottom = qy;
                        i += ps;
                        j += otherps;
                    } else if (px > qx) {
                        if (withlines && i > 0 && points[i - ps] != null) {
                            intery = py + (points[i - ps + accumulateOffset] - py) * (qx - px) / (points[i - ps + keyOffset] - px);
                            newpoints.push(qx);
                            newpoints.push(intery + qy);
                            for (m = 2; m < ps; ++m)
                                newpoints.push(points[i + m]);
                            bottom = qy;
                        }
                        j += otherps;
                    } else {
                        if (fromgap && withlines) {
                            i += ps;
                            continue;
                        }
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                        if (withlines && j > 0 && otherpoints[j - otherps] != null)
                            bottom = qy + (otherpoints[j - otherps + accumulateOffset] - qy) * (px - qx) / (otherpoints[j - otherps + keyOffset] - qx);
                        newpoints[l + accumulateOffset] += bottom;
                        i += ps;
                    }
                    fromgap = false;
                    if (l != newpoints.length && withbottom)
                        newpoints[l + 2] += bottom;
                }
                if (withsteps && l != newpoints.length && l > 0 && newpoints[l] != null && newpoints[l] != newpoints[l - ps] && newpoints[l + 1] != newpoints[l - ps + 1]) {
                    for (m = 0; m < ps; ++m)
                        newpoints[l + ps + m] = newpoints[l + m];
                    newpoints[l + 1] = newpoints[l - ps + 1];
                }
            }
            datapoints.points = newpoints;
        }
        plot.hooks.processDatapoints.push(stackData);
    }
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stack',
        version: '1.2'
    });
})(jQuery);
(function($) {
    function init(plot) {
        var canvas = null;
        var target = null;
        var maxRadius = null;
        var centerLeft = null;
        var centerTop = null;
        var total = 0;
        var redraw = true;
        var redrawAttempts = 10;
        var shrink = 0.95;
        var legendWidth = 0;
        var processed = false;
        var raw = false;
        var highlights = [];
        plot.hooks.processOptions.push(checkPieEnabled);
        plot.hooks.bindEvents.push(bindEvents);

        function checkPieEnabled(plot, options) {
            if (options.series.pie.show) {
                options.grid.show = false;
                if (options.series.pie.label.show == 'auto')
                    if (options.legend.show)
                        options.series.pie.label.show = false;
                    else
                        options.series.pie.label.show = true;
                if (options.series.pie.radius == 'auto')
                    if (options.series.pie.label.show)
                        options.series.pie.radius = 3 / 4;
                    else
                        options.series.pie.radius = 1;
                if (options.series.pie.tilt > 1)
                    options.series.pie.tilt = 1;
                if (options.series.pie.tilt < 0)
                    options.series.pie.tilt = 0;
                plot.hooks.processDatapoints.push(processDatapoints);
                plot.hooks.drawOverlay.push(drawOverlay);
                plot.hooks.draw.push(draw);
            }
        }

        function bindEvents(plot, eventHolder) {
            var options = plot.getOptions();
            if (options.series.pie.show && options.grid.hoverable)
                eventHolder.unbind('mousemove').mousemove(onMouseMove);
            if (options.series.pie.show && options.grid.clickable)
                eventHolder.unbind('click').click(onClick);
        }

        function alertObject(obj) {
            var msg = '';

            function traverse(obj, depth) {
                if (!depth)
                    depth = 0;
                for (var i = 0; i < obj.length; ++i) {
                    for (var j = 0; j < depth; j++)
                        msg += '\t';
                    if (typeof obj[i] == "object") {
                        msg += '' + i + ':\n';
                        traverse(obj[i], depth + 1);
                    } else {
                        msg += '' + i + ': ' + obj[i] + '\n';
                    }
                }
            }
            traverse(obj);
            alert(msg);
        }

        function calcTotal(data) {
            for (var i = 0; i < data.length; ++i) {
                var item = parseFloat(data[i].data[0][1]);
                if (item)
                    total += item;
            }
        }

        function processDatapoints(plot, series, data, datapoints) {
            if (!processed) {
                processed = true;
                canvas = plot.getCanvas();
                target = $(canvas).parent();
                options = plot.getOptions();
                plot.setData(combine(plot.getData()));
            }
        }

        function setupPie() {
            legendWidth = target.children().filter('.legend').children().width();
            maxRadius = Math.min(canvas.width, (canvas.height / options.series.pie.tilt)) / 2;
            centerTop = (canvas.height / 2) + options.series.pie.offset.top;
            centerLeft = (canvas.width / 2);
            if (options.series.pie.offset.left == 'auto')
                if (options.legend.position.match('w'))
                    centerLeft += legendWidth / 2;
                else
                    centerLeft -= legendWidth / 2;
                else
                    centerLeft += options.series.pie.offset.left;
            if (centerLeft < maxRadius)
                centerLeft = maxRadius;
            else if (centerLeft > canvas.width - maxRadius)
                centerLeft = canvas.width - maxRadius;
        }

        function fixData(data) {
            for (var i = 0; i < data.length; ++i) {
                if (typeof(data[i].data) == 'number')
                    data[i].data = [
                        [1, data[i].data]
                    ];
                else if (typeof(data[i].data) == 'undefined' || typeof(data[i].data[0]) == 'undefined') {
                    if (typeof(data[i].data) != 'undefined' && typeof(data[i].data.label) != 'undefined')
                        data[i].label = data[i].data.label;
                    data[i].data = [
                        [1, 0]
                    ];
                }
            }
            return data;
        }

        function combine(data) {
            data = fixData(data);
            calcTotal(data);
            var combined = 0;
            var numCombined = 0;
            var color = options.series.pie.combine.color;
            var newdata = [];
            for (var i = 0; i < data.length; ++i) {
                data[i].data[0][1] = parseFloat(data[i].data[0][1]);
                if (!data[i].data[0][1])
                    data[i].data[0][1] = 0;
                if (data[i].data[0][1] / total <= options.series.pie.combine.threshold) {
                    combined += data[i].data[0][1];
                    numCombined++;
                    if (!color)
                        color = data[i].color;
                } else {
                    newdata.push({
                        data: [
                            [1, data[i].data[0][1]]
                        ],
                        color: data[i].color,
                        label: data[i].label,
                        angle: (data[i].data[0][1] * (Math.PI * 2)) / total,
                        percent: (data[i].data[0][1] / total * 100)
                    });
                }
            }
            if (numCombined > 0)
                newdata.push({
                    data: [
                        [1, combined]
                    ],
                    color: color,
                    label: options.series.pie.combine.label,
                    angle: (combined * (Math.PI * 2)) / total,
                    percent: (combined / total * 100)
                });
            return newdata;
        }

        function draw(plot, newCtx) {
            if (!target) return;
            ctx = newCtx;
            setupPie();
            var slices = plot.getData();
            var attempts = 0;
            while (redraw && attempts < redrawAttempts) {
                redraw = false;
                if (attempts > 0)
                    maxRadius *= shrink;
                attempts += 1;
                clear();
                if (options.series.pie.tilt <= 0.8)
                    drawShadow();
                drawPie();
            }
            if (attempts >= redrawAttempts) {
                clear();
                target.prepend('<div class="error">Could not draw pie with labels contained inside canvas</div>');
            }
            if (plot.setSeries && plot.insertLegend) {
                plot.setSeries(slices);
                plot.insertLegend();
            }

            function clear() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                target.children().filter('.pieLabel, .pieLabelBackground').remove();
            }

            function drawShadow() {
                var shadowLeft = 5;
                var shadowTop = 15;
                var edge = 10;
                var alpha = 0.02;
                if (options.series.pie.radius > 1)
                    var radius = options.series.pie.radius;
                else
                    var radius = maxRadius * options.series.pie.radius; if (radius >= (canvas.width / 2) - shadowLeft || radius * options.series.pie.tilt >= (canvas.height / 2) - shadowTop || radius <= edge)
                    return;
                ctx.save();
                ctx.translate(shadowLeft, shadowTop);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#000';
                ctx.translate(centerLeft, centerTop);
                ctx.scale(1, options.series.pie.tilt);
                for (var i = 1; i <= edge; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
                    ctx.fill();
                    radius -= i;
                }
                ctx.restore();
            }

            function drawPie() {
                startAngle = Math.PI * options.series.pie.startAngle;
                if (options.series.pie.radius > 1)
                    var radius = options.series.pie.radius;
                else
                    var radius = maxRadius * options.series.pie.radius;
                ctx.save();
                ctx.translate(centerLeft, centerTop);
                ctx.scale(1, options.series.pie.tilt);
                ctx.save();
                var currentAngle = startAngle;
                for (var i = 0; i < slices.length; ++i) {
                    slices[i].startAngle = currentAngle;
                    drawSlice(slices[i].angle, slices[i].color, true);
                }
                ctx.restore();
                ctx.save();
                ctx.lineWidth = options.series.pie.stroke.width;
                currentAngle = startAngle;
                for (var i = 0; i < slices.length; ++i)
                    drawSlice(slices[i].angle, options.series.pie.stroke.color, false);
                ctx.restore();
                drawDonutHole(ctx);
                if (options.series.pie.label.show)
                    drawLabels();
                ctx.restore();

                function drawSlice(angle, color, fill) {
                    if (angle <= 0)
                        return;
                    if (fill)
                        ctx.fillStyle = color;
                    else {
                        ctx.strokeStyle = color;
                        ctx.lineJoin = 'round';
                    }
                    ctx.beginPath();
                    if (Math.abs(angle - Math.PI * 2) > 0.000000001)
                        ctx.moveTo(0, 0);
                    else if ($.browser.msie)
                        angle -= 0.0001;
                    ctx.arc(0, 0, radius, currentAngle, currentAngle + angle, false);
                    ctx.closePath();
                    currentAngle += angle;
                    if (fill)
                        ctx.fill();
                    else
                        ctx.stroke();
                }

                function drawLabels() {
                    var currentAngle = startAngle;
                    if (options.series.pie.label.radius > 1)
                        var radius = options.series.pie.label.radius;
                    else
                        var radius = maxRadius * options.series.pie.label.radius;
                    for (var i = 0; i < slices.length; ++i) {
                        if (slices[i].percent >= options.series.pie.label.threshold * 100)
                            drawLabel(slices[i], currentAngle, i);
                        currentAngle += slices[i].angle;
                    }

                    function drawLabel(slice, startAngle, index) {
                        if (slice.data[0][1] == 0)
                            return;
                        var lf = options.legend.labelFormatter,
                            text, plf = options.series.pie.label.formatter;
                        if (lf)
                            text = lf(slice.label, slice);
                        else
                            text = slice.label; if (plf)
                            text = plf(text, slice);
                        var halfAngle = ((startAngle + slice.angle) + startAngle) / 2;
                        var x = centerLeft + Math.round(Math.cos(halfAngle) * radius);
                        var y = centerTop + Math.round(Math.sin(halfAngle) * radius) * options.series.pie.tilt;
                        var html = '<span class="pieLabel" id="pieLabel' + index + '" style="position:absolute;top:' + y + 'px;left:' + x + 'px;">' + text + "</span>";
                        target.append(html);
                        var label = target.children('#pieLabel' + index);
                        var labelTop = (y - label.height() / 2);
                        var labelLeft = (x - label.width() / 2);
                        label.css('top', labelTop);
                        label.css('left', labelLeft);
                        if (0 - labelTop > 0 || 0 - labelLeft > 0 || canvas.height - (labelTop + label.height()) < 0 || canvas.width - (labelLeft + label.width()) < 0)
                            redraw = true;
                        if (options.series.pie.label.background.opacity != 0) {
                            var c = options.series.pie.label.background.color;
                            if (c == null) {
                                c = slice.color;
                            }
                            var pos = 'top:' + labelTop + 'px;left:' + labelLeft + 'px;';
                            $('<div class="pieLabelBackground" style="position:absolute;width:' + label.width() + 'px;height:' + label.height() + 'px;' + pos + 'background-color:' + c + ';"> </div>').insertBefore(label).css('opacity', options.series.pie.label.background.opacity);
                        }
                    }
                }
            }
        }

        function drawDonutHole(layer) {
            if (options.series.pie.innerRadius > 0) {
                layer.save();
                innerRadius = options.series.pie.innerRadius > 1 ? options.series.pie.innerRadius : maxRadius * options.series.pie.innerRadius;
                layer.globalCompositeOperation = 'destination-out';
                layer.beginPath();
                layer.fillStyle = options.series.pie.stroke.color;
                layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
                layer.fill();
                layer.closePath();
                layer.restore();
                layer.save();
                layer.beginPath();
                layer.strokeStyle = options.series.pie.stroke.color;
                layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
                layer.stroke();
                layer.closePath();
                layer.restore();
            }
        }

        function isPointInPoly(poly, pt) {
            for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
                ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) && (c = !c);
            return c;
        }

        function findNearbySlice(mouseX, mouseY) {
            var slices = plot.getData(),
                options = plot.getOptions(),
                radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;
            for (var i = 0; i < slices.length; ++i) {
                var s = slices[i];
                if (s.pie.show) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.arc(0, 0, radius, s.startAngle, s.startAngle + s.angle, false);
                    ctx.closePath();
                    x = mouseX - centerLeft;
                    y = mouseY - centerTop;
                    if (ctx.isPointInPath) {
                        if (ctx.isPointInPath(mouseX - centerLeft, mouseY - centerTop)) {
                            ctx.restore();
                            return {
                                datapoint: [s.percent, s.data],
                                dataIndex: 0,
                                series: s,
                                seriesIndex: i
                            };
                        }
                    } else {
                        p1X = (radius * Math.cos(s.startAngle));
                        p1Y = (radius * Math.sin(s.startAngle));
                        p2X = (radius * Math.cos(s.startAngle + (s.angle / 4)));
                        p2Y = (radius * Math.sin(s.startAngle + (s.angle / 4)));
                        p3X = (radius * Math.cos(s.startAngle + (s.angle / 2)));
                        p3Y = (radius * Math.sin(s.startAngle + (s.angle / 2)));
                        p4X = (radius * Math.cos(s.startAngle + (s.angle / 1.5)));
                        p4Y = (radius * Math.sin(s.startAngle + (s.angle / 1.5)));
                        p5X = (radius * Math.cos(s.startAngle + s.angle));
                        p5Y = (radius * Math.sin(s.startAngle + s.angle));
                        arrPoly = [
                            [0, 0],
                            [p1X, p1Y],
                            [p2X, p2Y],
                            [p3X, p3Y],
                            [p4X, p4Y],
                            [p5X, p5Y]
                        ];
                        arrPoint = [x, y];
                        if (isPointInPoly(arrPoly, arrPoint)) {
                            ctx.restore();
                            return {
                                datapoint: [s.percent, s.data],
                                dataIndex: 0,
                                series: s,
                                seriesIndex: i
                            };
                        }
                    }
                    ctx.restore();
                }
            }
            return null;
        }

        function onMouseMove(e) {
            triggerClickHoverEvent('plothover', e);
        }

        function onClick(e) {
            triggerClickHoverEvent('plotclick', e);
        }

        function triggerClickHoverEvent(eventname, e) {
            var offset = plot.offset(),
                canvasX = parseInt(e.pageX - offset.left),
                canvasY = parseInt(e.pageY - offset.top),
                item = findNearbySlice(canvasX, canvasY);
            if (options.grid.autoHighlight) {
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname && !(item && h.series == item.series))
                        unhighlight(h.series);
                }
            }
            if (item)
                highlight(item.series, eventname);
            var pos = {
                pageX: e.pageX,
                pageY: e.pageY
            };
            target.trigger(eventname, [pos, item]);
        }

        function highlight(s, auto) {
            if (typeof s == "number")
                s = series[s];
            var i = indexOfHighlight(s);
            if (i == -1) {
                highlights.push({
                    series: s,
                    auto: auto
                });
                plot.triggerRedrawOverlay();
            } else if (!auto)
                highlights[i].auto = false;
        }

        function unhighlight(s) {
            if (s == null) {
                highlights = [];
                plot.triggerRedrawOverlay();
            }
            if (typeof s == "number")
                s = series[s];
            var i = indexOfHighlight(s);
            if (i != -1) {
                highlights.splice(i, 1);
                plot.triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s)
                    return i;
            }
            return -1;
        }

        function drawOverlay(plot, octx) {
            var options = plot.getOptions();
            var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;
            octx.save();
            octx.translate(centerLeft, centerTop);
            octx.scale(1, options.series.pie.tilt);
            for (i = 0; i < highlights.length; ++i)
                drawHighlight(highlights[i].series);
            drawDonutHole(octx);
            octx.restore();

            function drawHighlight(series) {
                if (series.angle < 0) return;
                octx.fillStyle = "rgba(255, 255, 255, " + options.series.pie.highlight.opacity + ")";
                octx.beginPath();
                if (Math.abs(series.angle - Math.PI * 2) > 0.000000001)
                    octx.moveTo(0, 0);
                octx.arc(0, 0, radius, series.startAngle, series.startAngle + series.angle, false);
                octx.closePath();
                octx.fill();
            }
        }
    }
    var options = {
        series: {
            pie: {
                show: false,
                radius: 'auto',
                innerRadius: 0,
                startAngle: 3 / 2,
                tilt: 1,
                offset: {
                    top: 0,
                    left: 'auto'
                },
                stroke: {
                    color: '#FFF',
                    width: 1
                },
                label: {
                    show: 'auto',
                    formatter: function(label, slice) {
                        return '<div style="font-size:x-small;text-align:center;padding:2px;color:' + slice.color + ';">' + label + '<br/>' + Math.round(slice.percent) + '%</div>';
                    },
                    radius: 1,
                    background: {
                        color: null,
                        opacity: 0
                    },
                    threshold: 0
                },
                combine: {
                    threshold: -1,
                    color: null,
                    label: 'Other'
                },
                highlight: {
                    opacity: 0.5
                }
            }
        }
    };
    $.plot.plugins.push({
        init: init,
        options: options,
        name: "pie",
        version: "1.0"
    });
})(jQuery);
(function(jQuery) {
    jQuery.extend(jQuery.support, {
        "rgba": supportsRGBA()
    });
    jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i, attr) {
        jQuery.fx.step[attr] = function(fx) {
            var tuples = [];
            if (!fx.colorInit) {
                fx.start = getColor(fx.elem, attr);
                fx.end = getRGB(fx.end);
                fx.alphavalue = {
                    start: 4 === fx.start.length,
                    end: 4 === fx.end.length
                };
                if (!fx.alphavalue.start) {
                    fx.start.push(1);
                }
                if (!fx.alphavalue.end) {
                    fx.end.push(1);
                }
                if (jQuery.support.rgba && (!fx.alphavalue.start && fx.alphavalue.end) || (fx.alphavalue.start && fx.alphavalue.end) || (fx.alphavalue.start && !fx.alphavalue.end)) {
                    fx.colorModel = 'rgba';
                } else {
                    fx.colorModel = 'rgb';
                }
                fx.colorInit = true;
            }
            tuples.push(Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0));
            tuples.push(Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0));
            tuples.push(Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0));
            if (fx.colorModel == 'rgba') {
                tuples.push(Math.max(Math.min(parseFloat((fx.pos * (fx.end[3] - fx.start[3])) + fx.start[3]), 1), 0).toFixed(2));
            }
            fx.elem.style[attr] = fx.colorModel + "(" + tuples.join(",") + ")";
        };
    });

    function getRGB(color) {
        var result, ret, ralpha = '(?:,\\s*((?:1|0)(?:\\.0+)?|(?:0?\\.[0-9]+))\\s*)?\\)',
            rrgbdecimal = new RegExp('rgb(a)?\\(\\s*([0-9]{1,3})\\s*,\\s*([0-9]{1,3})\\s*,\\s*([0-9]{1,3})\\s*' + ralpha),
            rrgbpercent = new RegExp('rgb(a)?\\(\\s*([0-9]+(?:\\.[0-9]+)?)\\%\\s*,\\s*([0-9]+(?:\\.[0-9]+)?)\\%\\s*,\\s*([0-9]+(?:\\.[0-9]+)?)\\%\\s*' + ralpha);
        if (color && color.constructor == Array && color.length >= 3 && color.length <= 4) {
            return color;
        }
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) {
            return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
        }
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) {
            return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
        }
        if (result = rrgbdecimal.exec(color)) {
            ret = [parseInt(result[2]), parseInt(result[3]), parseInt(result[4])];
            if (result[1] && result[5]) {
                ret.push(parseFloat(result[5]));
            }
            return ret;
        }
        if (result = rrgbpercent.exec(color)) {
            ret = [parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55, parseFloat(result[4]) * 2.55];
            if (result[1] && result[5]) {
                ret.push(parseFloat(result[5]));
            }
            return ret;
        }
        return colors[jQuery.trim(color).toLowerCase()];
    }

    function getColor(elem, attr) {
        var color;
        do {
            color = jQuery.curCSS(elem, attr);
            if (color != '' && color != 'transparent' || jQuery.nodeName(elem, "body"))
                break;
            attr = "backgroundColor";
        } while (elem = elem.parentNode);
        return getRGB(color);
    };

    function supportsRGBA() {
        var $script = jQuery('script:first'),
            color = $script.css('color'),
            result = false;
        if (/^rgba/.test(color)) {
            result = true;
        } else {
            try {
                result = (color != $script.css('color', 'rgba(0, 0, 0, 0.5)').css('color'));
                $script.css('color', color);
            } catch (e) {};
        }
        return result;
    };
    var colors = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: (jQuery.support.rgba) ? [0, 0, 0, 0] : [255, 255, 255]
    };
})(jQuery);

function ReconnectingWebSocket(url, protocols) {
    protocols = protocols || [];
    this.debug = false;
    this.reconnectInterval = 1000;
    this.timeoutInterval = 2000;
    var self = this;
    var ws;
    var forcedClose = false;
    var timedOut = false;
    this.url = url;
    this.protocols = protocols;
    this.readyState = WebSocket.CONNECTING;
    this.URL = url;
    this.onopen = function(event) {};
    this.onclose = function(event) {};
    this.onconnecting = function(event) {};
    this.onmessage = function(event) {};
    this.onerror = function(event) {};

    function connect(reconnectAttempt) {
        ws = new WebSocket(url, protocols);
        self.onconnecting();
        if (self.debug || ReconnectingWebSocket.debugAll) {
            console.debug('ReconnectingWebSocket', 'attempt-connect', url);
        }
        var localWs = ws;
        var timeout = setTimeout(function() {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'connection-timeout', url);
            }
            timedOut = true;
            localWs.close();
            timedOut = false;
        }, self.timeoutInterval);
        ws.onopen = function(event) {
            clearTimeout(timeout);
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'onopen', url);
            }
            self.readyState = WebSocket.OPEN;
            reconnectAttempt = false;
            self.onopen(event);
        };
        ws.onclose = function(event) {
            clearTimeout(timeout);
            ws = null;
            if (forcedClose) {
                self.readyState = WebSocket.CLOSED;
                self.onclose(event);
            } else {
                self.readyState = WebSocket.CONNECTING;
                self.onconnecting();
                if (!reconnectAttempt && !timedOut) {
                    if (self.debug || ReconnectingWebSocket.debugAll) {
                        console.debug('ReconnectingWebSocket', 'onclose', url);
                    }
                    self.onclose(event);
                }
                setTimeout(function() {
                    connect(true);
                }, self.reconnectInterval);
            }
        };
        ws.onmessage = function(event) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'onmessage', url, event.data);
            }
            self.onmessage(event);
        };
        ws.onerror = function(event) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'onerror', url, event);
            }
            self.onerror(event);
        };
    }
    connect(url);
    this.send = function(data) {
        if (ws) {
            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'send', url, data);
            }
            return ws.send(data);
        } else {
            throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
        }
    };
    this.close = function() {
        if (ws) {
            forcedClose = true;
            ws.close();
        }
    };
    this.refresh = function() {
        if (ws) {
            ws.close();
        }
    };
}
ReconnectingWebSocket.debugAll = false;

function Tree() {
    this.createNode = function() {
        return {
            "children": {},
            "fns": []
        };
    }
    this._tree = this.createNode();
    this.getFns = function(path) {
        var next_node;
        var tree = this._tree;
        var fns = [];
        var path = path.slice();
        while (next_node = path.shift()) {
            if (next_node in tree["children"]) {
                tree = tree["children"][next_node];
            } else {
                break;
            }
            for (k in tree["fns"])
                fns.push(tree["fns"][k]);
        }
        return fns;
    }
    this.walk = function(tree, path, create) {
        var next_node;
        var path = path.slice();
        while (next_node = path.shift()) {
            if (next_node in tree["children"]) {
                tree = tree["children"][next_node];
            } else if (create) {
                tree = tree["children"][next_node] = this.createNode();
            } else {
                return false;
            }
        }
        return tree;
    }
    this.removeChild = function(path, obj) {
        var node = this.walk(this._tree, path, false);
        if (node) {
            var new_fns = [];
            for (k in node["fns"])
                if (node["fns"][k] != obj)
                    new_fns.push(node["fns"][k]);
            node["fns"] = new_fns;
        }
    }
    this.addChild = function(path, obj) {
        var node = this.walk(this._tree, path, true);
        node["fns"].push(obj);
    }
}

function ChartSocket(host, port) {
    this._subscriptions = {};
    this._blobs = {};
    this._tree = new Tree();
    this.sock = null;
    var app = this;
    this.debug = false;
    this.host = null;
    this.port = null;
    this.log = function(s) {
        if (this.debug)
            console.log(s);
    }
    this.connect = function() {
        sock = new ReconnectingWebSocket("ws://" + app.host + ":" + port + "/ws")
        sock.onopen = app.onConnect;
        sock.onmessage = app.onMessage;
        sock.onclose = app.onClose;
        var old = app.sock;
        app.sock = sock;
        if (old)
            old.close();
    }
    this.close = function() {
        this.sock.close();
    }
    this.onConnect = function() {
        app.log("connected");
        app.updateSubscriptions();
    }
    this.onClose = function() {
        for (k in app._subscriptions) {
            app._subscriptions[k] = false;
        }
        app.log("disconnected");
    }
    this.onMessage = function(event) {
        var msg = event.data;
        app.log("message " + msg);
        if (msg == "x-reload") {
            window.location.reload();
            return;
        }
        data = JSON.parse(msg);
        if ("channel" in data && "payload" in data)
            app.emit(data["channel"], data["payload"]);
    }
    this.sendCmd = function(action, channel) {
        if (this.sock == null)
            return;
        if (this.sock.readyState != WebSocket.OPEN)
            return;
        var obj = {
            "action": action,
            "channel": channel
        };
        var ret = this.sock.send(JSON.stringify(obj));
    }
    this.subscribe = function(channel) {
        this.sendCmd("subscribe", channel);
    }
    this.unsubscribe = function(channel) {
        this.sendCmd("unsubscribe", channel);
    }
    this.updateSubscriptions = function() {
        if (this.sock == null)
            return;
        if (this.sock.readyState != WebSocket.OPEN)
            return;
        for (k in this._subscriptions) {
            if (this._subscriptions[k] == false) {
                this.subscribe(k);
                this._subscriptions[k] = true;
            }
        }
    }
    this.parseChannel = function(s) {
        var path = s.split(".");
        return path;
    }
    this.emit = function(name, args) {
        var path = this.parseChannel(name);
        if (path[0] == 'blob') {
            var id = this._blobs[name];
            var blob = jQuery('#' + id);
            blob.html(args);
            blob.effect('highlight', {}, 1000);
        }
        var fns = this._tree.getFns(path);
        for (f in fns) {
            fns[f].apply(this, [name, args === undefined ? [] : args]);
        }
    }
    this.addEvent = function(name, fn) {
        var path = this.parseChannel(name);
        this._tree.addChild(path, fn);
        this._subscriptions[name] = false;
        this.updateSubscriptions();
    }
    this.removeEvent = function(name, fn) {
        var path = this.parseChannel(name);
        this._tree.removeChild(path, fn);
    }
    this.addBlob = function(id, name) {
        this._subscriptions[name] = false;
        this._blobs[name] = id;
    }
    this.init = function(host, port) {
        this.host = host;
        this.port = port;
    }
    if (host == null) {
        host = window.location.hostname;
    }
    this.init(host, port);
}
jQuery.effects.highlight_nobg = function(o) {
    return this.queue(function() {
        var el = jQuery(this),
            props = ['backgroundColor', 'opacity'];
        var mode = jQuery.effects.setMode(el, o.options.mode || 'show');
        var color = o.options.color || "rgba(255,255,153,1)";
        var oldColor = el.css("backgroundColor");
        jQuery.effects.save(el, props);
        el.css({
            backgroundColor: color
        });
        var animation = {
            "backgroundColor": oldColor
        };
        el.animate(animation, {
            queue: false,
            duration: o.duration,
            easing: o.options.easing,
            complete: function() {
                jQuery.effects.restore(el, props);
                if (mode == "show" && jQuery.browser.msie) this.style.removeAttribute('filter');
                if (o.callback) o.callback.apply(this, arguments);
                el.dequeue();
            }
        });
    });
};
(function(g, j) {
    var b = function(a) {
        return new i(a)
    };
    b.version = "0.1.3";
    var c = g.fxSetup || {
        rates: {},
        base: ""
    };
    b.rates = c.rates;
    b.base = c.base;
    b.settings = {
        from: c.from || b.base,
        to: c.to || b.base
    };
    var h = b.convert = function(a, e) {
        if ("object" === typeof a && a.length) {
            for (var d = 0; d < a.length; d++) a[d] = h(a[d], e);
            return a
        }
        e = e || {};
        if (!e.from) e.from = b.settings.from;
        if (!e.to) e.to = b.settings.to;
        var d = e.to,
            c = e.from,
            f = b.rates;
        f[b.base] = 1;
        if (!f[d] || !f[c]) throw "fx error";
        d = c === b.base ? f[d] : d === b.base ? 1 / f[c] : f[d] * (1 / f[c]);
        return a * d
    }, i = function(a) {
            "string" === typeof a ? (this._v = parseFloat(a.replace(/[^0-9-.]/g, "")), this._fx = a.replace(/([^A-Za-z])/g, "")) : this._v = a
        }, c = b.prototype = i.prototype;
    c.convert = function() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift(this._v);
        return h.apply(b, a)
    };
    c.from = function(a) {
        a = b(h(this._v, {
            from: a,
            to: b.base
        }));
        a._fx = b.base;
        return a
    };
    c.to = function(a) {
        return h(this._v, {
            from: this._fx ? this._fx : b.settings.from,
            to: a
        })
    };
    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) exports = module.exports = b;
        exports.fx = fx
    } else "function" === typeof define && define.amd ? define([], function() {
        return b
    }) : (b.noConflict = function(a) {
        return function() {
            g.fx = a;
            b.noConflict = j;
            return b
        }
    }(g.fx), g.fx = b)
})(this);