var debug = require('debug')("ex-fx:rws"),
    WebSocket = require('ws');

module.exports = ReconnectingWebSocket;

function ReconnectingWebSocket(url, protocols) {
    protocols = protocols || [];
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
        debug('ReconnectingWebSocket', 'attempt-connect', url);
        var localWs = ws;
        var timeout = setTimeout(function() {
            debug('ReconnectingWebSocket', 'connection-timeout', url);
            timedOut = true;
            localWs.close();
            timedOut = false;
        }, self.timeoutInterval);
        ws.onopen = function(event) {
            clearTimeout(timeout);
            debug('ReconnectingWebSocket', 'onopen', url);
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
                    debug('ReconnectingWebSocket', 'onclose', url);
                    self.onclose(event);
                }
                setTimeout(function() {
                    connect(true);
                }, self.reconnectInterval);
            }
        };
        ws.onmessage = function(event) {
            debug('ReconnectingWebSocket', 'onmessage', url, event.data);
            self.onmessage(event);
        };
        ws.onerror = function(event) {
            debug('ReconnectingWebSocket', 'onerror', url, event);
            self.onerror(event);
        };
    }

    connect(url);
    this.send = function(data) {
        if (ws) {
            debug('ReconnectingWebSocket', 'send', url, data);
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