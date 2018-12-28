var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (win) {

    var w = {};

    win.cmslink = w;

    var cachedData = function cachedData() {
        try {
            var data = localStorage.getItem('__nodes');
            if (data && data.length) return JSON.parse(data);
        } catch (err) {
            console.log('load error');
            return {};
        }
    };

    var setCache = function setCache(nodes) {
        localStorage.setItem('__nodes', JSON.stringify(nodes));
    };

    w.createLink = function (settings, onStatusChange) {
        var url = settings.url;

        var socket = new WebSocket(url);
        var nodeCache = cachedData() || {};

        var listeners = {};

        var triggerStatusChange = function triggerStatusChange(data) {
            if (typeof onStatusChange === 'function') onStatusChange(data);
        };

        var triggerListeners = function triggerListeners(id, data) {
            var listenersForId = listeners[id];
            if (listenersForId) listenersForId.forEach(function (listener) {
                if (!listener.stopped) {
                    listener.callback(data);
                }
            });
        };

        var parseNodesToCache = function parseNodesToCache(data) {
            var id = data.id,
                children = data.children;

            if (id) {
                nodeCache[id] = data;
                triggerListeners(id, data);
            }
            if (children) {
                children.map(function (child) {
                    return parseNodesToCache(child, id);
                });
            }
        };

        var connected = false;
        var tryingToConnect = void 0;
        var reconnectTime = 500;

        var reconnect = function reconnect() {
            console.warn('requesting reconnect');
            connected = false;
            triggerStatusChange({ connected: connected, reconnecting: true });
            if (tryingToConnect) clearTimeout(tryingToConnect);
            tryingToConnect = setTimeout(function () {

                socket = null;
                socket = new WebSocket(url);
                connect();
            }, reconnectTime += 500);
        };

        var debounceStatus = function debounceStatus(data) {
            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

            triggerStatusChange(_extends({}, data, { connected: connected }));
            setTimeout(function () {
                triggerStatusChange({ connected: connected });
            }, time);
        };

        var connect = function connect() {
            triggerStatusChange({ connecting: true, connected: connected });
            socket.onopen = function (event) {
                reconnectTime = 500;
                connected = true;
                triggerStatusChange({ connected: connected });
                console.log('sending token', lastToken);
                socket.send('##' + lastToken + '##');
                socket.send('?root');
                sendToServer();
                // Object.keys(nodeCache).forEach((cachedId) => {
                //     if (cachedId !== "root")
                //         send('?' + cachedId);
                // });
            };
            socket.onerror = reconnect;
            socket.onclose = reconnect;
            socket.onmessage = function (event) {
                debounceStatus({ data: true });

                var jsonData = JSON.parse(event.data);

                parseNodesToCache(jsonData);
                setCache(nodeCache);
            };
        };

        var queue = [];

        var sendToServer = function sendToServer() {
            if (queue.length && connected) {
                var toSend = queue.shift();
                debounceStatus({ sending: true });
                socket.send(toSend);
                sendToServer();
            }
        };

        var send = function send(data) {
            queue.push(data);
            sendToServer();
        };

        var fakeNode = function fakeNode(node) {
            console.log('render temp node', node);
            triggerListeners(node.id, _extends({}, node, { __fake: true }));
        };

        var ret = {
            fakeNode: fakeNode,
            send: send,
            getById: function getById(id) {
                send('?' + id);
            },
            listenTo: function listenTo(id, callback) {
                var ret = {
                    id: id,
                    stopped: false,
                    stop: function stop() {
                        ret.stopped = true;
                    },
                    resume: function resume() {
                        ret.stopped = false;
                    },
                    remove: function remove() {
                        var idx = listeners[id].indexOf(ret);
                        listeners[id].splice(idx, 1);
                    },
                    callback: callback
                };
                if (!listeners[id]) {
                    listeners[id] = [ret];
                } else listeners[id].push(ret);
                if (nodeCache[id]) {
                    if (!ret.stopped) callback(nodeCache[id]);
                } else send('?' + id);
                return ret;
            }
        };

        var lastToken = w.getToken().token;

        w.onAuthenticationChanged(function (data) {
            if (data && data.token) lastToken = data.token;
            send('!!' + lastToken + '!!');
        });

        connect();

        win.currentLink = ret;
        return ret;
    };

    w.getCurrentLink = function () {
        return win.currentLink;
    };

    var storageKey = '_cmsState';
    var sessionListeners = [];

    var currentState = {};
    var storedSessionString = localStorage.getItem(storageKey);
    if (storedSessionString && storedSessionString.length) {
        currentState = JSON.parse(storedSessionString);
    }

    w.sessionChanged = function (callback) {
        var ret = {
            stopped: false,
            stop: function stop() {
                ret.stopped = true;
            },
            resume: function resume() {
                ret.stopped = false;
            },
            remove: function remove() {
                var idx = sessionListeners.indexOf(ret);
                sessionListeners.splice(idx, 1);
            },
            callback: callback
        };
        sessionListeners.push(ret);
        setTimeout(function () {
            callback(currentState);
        }, 10);
        return ret;
    };

    var triggerSessionChange = function triggerSessionChange(data) {
        currentState = data;
        sessionListeners.forEach(function (_ref) {
            var stopped = _ref.stopped,
                callback = _ref.callback;

            if (!stopped) callback(data);
        });
        localStorage.setItem(storageKey, JSON.stringify(data));
    };
    w.setSession = function (data) {
        if (typeof data == 'function') {
            data = data(currentState);
        }
        var newSession = _extends({}, currentState, data);

        triggerSessionChange(newSession);
    };

    w.schemaHelper = {
        getSchema: function getSchema(type) {
            return fetch('/api/schema/' + type + '/').then(function (res) {
                return res.json();
            });
        },
        getAll: function getAll() {
            return fetch('/api/schema/').then(function (res) {
                return res.json();
            });
        }
    };

    var handleUserWithToken = function handleUserWithToken(user) {
        console.log('handle user auth status', user);
        if (user && user.token) {
            localStorage.setItem('currentUserToken', user.token);
        }
        isValidToken(user.token);
        return user;
    };

    w.getToken = function () {
        var token = localStorage.getItem('currentUserToken');
        return isValidToken(token);
    };

    var isValidToken = function isValidToken(token) {
        var ret = { valid: false };
        if (token && token.length) {
            var parts = token.split('.');
            var decodedHeader = atob(parts[0]);
            var header = JSON.parse(decodedHeader);
            var decodedData = atob(parts[1]);
            var data = JSON.parse(decodedData);
            //console.log(data, data.exp, (Date.now() / 1000));
            ret = { valid: data.exp > Date.now() / 1000, header: header, data: data, token: token };
        }
        compareAuthState(ret);
        return ret;
    };

    var compareAuthState = function compareAuthState(newState) {
        if (lastState !== newState.valid) {
            lastState = newState.valid;
            authListeners.map(function (cb) {
                return cb(newState);
            });
        }
    };

    var authListeners = [];
    var hasStartedListener = false;
    var lastState = false;

    w.onAuthenticationChanged = function (onAuthChanged) {
        if (authListeners.indexOf(onAuthChanged) === -1) authListeners.push(onAuthChanged);
        onAuthChanged(w.getToken());
        if (!hasStartedListener) {
            hasStartedListener = true;
            setInterval(function () {
                w.hasValidToken();
            }, 3600 * 1000);
        }
    };

    w.isAdmin = function () {
        return w.hasValidToken();
    };

    w.hasValidToken = function () {
        return w.getToken().valid;
    };

    w.signInWithToken = function (token) {
        return fetch('/api/signInWithToken/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        }).then(function (d) {
            return d.json();
        }).then(handleUserWithToken);
    };
})(window);