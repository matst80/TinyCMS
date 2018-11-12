import { renderMergedProps } from "./helpers";

var currentLink = null;

const registeredComponents = {
};

export const componentRegistry = ((registry) => ({
    setComponents: (templates) => {
        for (var key in templates) {
            registry[key] = templates[key];
        }
    },
    getComponent: (type, props) => {
        return renderMergedProps(registry[type], props);
    },
    getValue: (type) => registry[type],
    hasComponent: (data) => {
        if (data.type)
            return !!registry[data.type];
        return !!registry[data];
    }
}))(registeredComponents);


export const createLink = (settings) => {
    const { url } = settings;
    const socket = new WebSocket(url);
    const nodeCache = {};

    const listeners = {};

    const triggerListeners = (id, data) => {
        const listenersForId = listeners[id];
        if (listenersForId)
            listenersForId.forEach(listener => {
                if (!listener.stopped) {
                    listener.callback(data);
                }
            });
    }

    const parseNodesToCache = (data, parentId) => {
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

    const reconnect = () => {
        connected = false;
        setTimeout(() => {
            connect();
        }, 500);
    }

    const connect = () => {
        socket.onopen = (event) => {
            connected = true;
            console.log('connected', event);
            socket.send('?root');
            sendToServer();
        }
        socket.onerror = reconnect;
        socket.onclose = reconnect;
        socket.onmessage = (event) => {
            //console.log('gotmessage', event);
            const jsonData = JSON.parse(event.data);
            //console.log('json', jsonData);
            parseNodesToCache(jsonData);
            //console.log(nodeCache);
        }
    }

    const queue = [];

    const sendToServer = () => {
        if (queue.length && connected) {
            const toSend = queue.shift();
            socket.send(toSend);
            sendToServer();
        }
    }

    const send = (data) => {
        queue.push(data);
        sendToServer();
    }

    const ret = {
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

    connect();
    currentLink = ret;
    return ret;
}

export const getCurrentLink = () => {
    return currentLink;
}

export const schemaHelper = {
    getSchema: (type) => {
        return fetch(`http://localhost:5000/schema/${type}/`).then(res => res.json());
    },
    getAll: () => {
        return fetch(`http://localhost:5000/schema/`).then(res => res.json());
    }
};


