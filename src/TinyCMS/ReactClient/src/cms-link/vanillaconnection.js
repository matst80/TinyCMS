(function (win) {
    
    var w = {};

    win.cmslink = w;

    const cachedData = () => {
        try {
            var data = localStorage.getItem('__nodes');
            if (data && data.length)
                return JSON.parse(data);
        }
        catch (err) {
            console.log('load error');
            return {};
        }

    }

    const setCache = (nodes) => {
        localStorage.setItem('__nodes', JSON.stringify(nodes));
    }

    w.createLink = (settings, onStatusChange) => {
        const { url } = settings;
        let socket = new WebSocket(url);
        const nodeCache = cachedData() || {};

        const listeners = {};

        const triggerStatusChange = (data) => {
            if (typeof (onStatusChange) === 'function')
                onStatusChange(data);
        }

        const triggerListeners = (id, data) => {
            const listenersForId = listeners[id];
            if (listenersForId)
                listenersForId.forEach(listener => {
                    if (!listener.stopped) {
                        listener.callback(data);
                    }
                });
        }

        const parseNodesToCache = (data) => {
            const { id, children } = data;
            if (id) {
                nodeCache[id] = data;
                triggerListeners(id, data);
            }
            if (children) {
                children.map(child => parseNodesToCache(child, id));
            }
        }

        let connected = false;
        let tryingToConnect;
        let reconnectTime = 500;

        const reconnect = () => {
            console.warn('requesting reconnect');
            connected = false;
            triggerStatusChange({ connected: connected, reconnecting: true });
            if (tryingToConnect)
                clearTimeout(tryingToConnect);
            tryingToConnect = setTimeout(() => {

                socket = null;
                socket = new WebSocket(url);
                connect();
            }, reconnectTime += 500);
        }

        const debounceStatus = (data, time = 200) => {
            triggerStatusChange({ ...data, connected });
            setTimeout(() => {
                triggerStatusChange({ connected });
            }, time);
        }

        const connect = () => {
            triggerStatusChange({ connecting: true, connected });
            socket.onopen = (event) => {
                reconnectTime = 500;
                connected = true;
                triggerStatusChange({ connected });
                console.log('sending token', lastToken);
                socket.send('##' + lastToken + '##');
                socket.send('?root');
                sendToServer();
                // Object.keys(nodeCache).forEach((cachedId) => {
                //     if (cachedId !== "root")
                //         send('?' + cachedId);
                // });
            }
            socket.onerror = reconnect;
            socket.onclose = reconnect;
            socket.onmessage = (event) => {
                debounceStatus({ data: true });

                const jsonData = JSON.parse(event.data);

                parseNodesToCache(jsonData);
                setCache(nodeCache);
            }
        }

        const queue = [];

        const sendToServer = () => {
            if (queue.length && connected) {
                const toSend = queue.shift();
                debounceStatus({ sending: true });
                socket.send(toSend);
                sendToServer();
            }
        }

        const send = (data) => {
            queue.push(data);
            sendToServer();
        }

        const fakeNode = (node) => {
            console.log('render temp node', node);
            triggerListeners(node.id, { ...node, __fake: true });
        }

        const ret = {
            fakeNode,
            send,
            getById: (id) => {
                send(`?${id}`);
            },
            listenTo: (id, callback) => {
                const ret = {
                    id,
                    stopped: false,
                    stop: () => { ret.stopped = true; },
                    resume: () => { ret.stopped = false; },
                    remove: () => {
                        var idx = listeners[id].indexOf(ret);
                        listeners[id].splice(idx, 1);
                    },
                    callback
                };
                if (!listeners[id]) {
                    listeners[id] = [ret]
                }
                else
                    listeners[id].push(ret);
                if (nodeCache[id]) {
                    if (!ret.stopped)
                        callback(nodeCache[id]);
                }
                else
                    send(`?${id}`);
                return ret;
            }
        }

        let lastToken = w.getToken().token;

        w.onAuthenticationChanged((data) => {
            if (data && data.token)
                lastToken = data.token;
            send('!!' + lastToken + '!!');
        });

        connect();

        win.currentLink = ret;
        return ret;
    }

    w.getCurrentLink = () => {
        return win.currentLink;
    }

    const storageKey = '_cmsState';
    const sessionListeners = [];

    var currentState = {};
    const storedSessionString = localStorage.getItem(storageKey);
    if (storedSessionString && storedSessionString.length) {
        currentState = JSON.parse(storedSessionString);
    }

    w.sessionChanged = (callback) => {
        var ret = {
            stopped: false,
            stop: () => { ret.stopped = true; },
            resume: () => { ret.stopped = false; },
            remove: () => {
                var idx = sessionListeners.indexOf(ret);
                sessionListeners.splice(idx, 1);
            },
            callback
        };
        sessionListeners.push(ret);
        setTimeout(() => {
            callback(currentState);
        }, 10);
        return ret;
    }

    const triggerSessionChange = (data) => {
        currentState = data;
        sessionListeners.forEach(({ stopped, callback }) => {
            if (!stopped)
                callback(data);
        });
        localStorage.setItem(storageKey, JSON.stringify(data));
    }
    w.setSession = (data) => {
        if (typeof (data) == 'function') {
            data = data(currentState);
        }
        const newSession = { ...currentState, ...data };

        triggerSessionChange(newSession);
    }

    w.schemaHelper = {
        getSchema: (type) => {
            return fetch(`/api/schema/${type}/`).then(res => res.json());
        },
        getAll: () => {
            return fetch(`/api/schema/`).then(res => res.json());
        }
    };

    const handleUserWithToken = (user) => {
        console.log('handle user auth status', user);
        if (user && user.token) {
            localStorage.setItem('currentUserToken', user.token);
        }
        isValidToken(user.token);
        return user;
    }

    w.getToken = () => {
        var token = localStorage.getItem('currentUserToken');
        return isValidToken(token);
    }

    const isValidToken = (token) => {
        let ret = { valid: false };
        if (token && token.length) {
            var parts = token.split('.');
            const decodedHeader = atob(parts[0]);
            const header = JSON.parse(decodedHeader);
            const decodedData = atob(parts[1]);
            const data = JSON.parse(decodedData);
            //console.log(data, data.exp, (Date.now() / 1000));
            ret = { valid: data.exp > (Date.now() / 1000), header, data, token };
        }
        compareAuthState(ret);
        return ret;
    }

    const compareAuthState = (newState) => {
        if (lastState !== newState.valid) {
            lastState = newState.valid;
            authListeners.map(cb => cb(newState));
        }
    }

    const authListeners = [];
    var hasStartedListener = false;
    var lastState = false;

    w.onAuthenticationChanged = (onAuthChanged) => {
        if (authListeners.indexOf(onAuthChanged) === -1)
            authListeners.push(onAuthChanged);
        onAuthChanged(w.getToken());
        if (!hasStartedListener) {
            hasStartedListener = true;
            setInterval(() => {
                w.hasValidToken();
            }, 3600 * 1000);
        }
    }

    w.isAdmin = () => {
        return w.hasValidToken();
    }

    w.hasValidToken = () => {
        return w.getToken().valid;
    }

    w.signInWithToken = (token) => {
        return fetch('/api/signInWithToken/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        }).then(d => d.json()).then(handleUserWithToken);
    }

})(window);