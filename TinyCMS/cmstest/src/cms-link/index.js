import React, { Component } from 'react';

var currentLink = null;

export const createLink = (settings) => {
    const { url } = settings;
    const socket = new WebSocket(url);
    const nodeCache = {};

    const listeners = {};

    const triggerListeners = (id, data) => {
        const listenersForId = listeners[id];
        if (listenersForId)
            listenersForId.map(listener => {
                if (!listener.stopped) {
                    listener.callback(data);
                }
            })
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

export const schemaHelper = {
    getSchema: (type) => {
        return fetch(`http://localhost:5000/schema/${type}/`).then(res => res.json());
    }
};

const LinkContext = React.createContext({});

export class CMSLink extends Component {
    static contextType = LinkContext;
    constructor(props) {
        super(props);
        createLink({ url: props.url });
    }
    render() {
        return this.props.children;
    }
}

export class LinkedComponent extends Component {
    constructor(props, linkId) {
        super(props);
        this.linked = {};

        let idToWatch = props.id;
        if (typeof (linkId) === "string")
            idToWatch = linkId;
        if (idToWatch) {
            this.setupListener(idToWatch);
        }
    }
    gotLinkData = (data) => {
        const linkedData = this.filterProperties(data);
        if (this.isChanged(this.linked, linkedData)) {
            this.linked = linkedData;
            if (this._mounted)
                this.forceUpdate()
        }
    }
    setupListener = (id, customCallback) => {
        this._listener && this._listener.remove();
        this.linkedId = id;
        this.linked = {};
        this._listener = currentLink.listenTo(id, customCallback || this.gotLinkData);
    }
    isChanged = (a, b) => {
        if (a === b)
            return false;
        if (a === undefined && b !== undefined)
            return true;
        if (b === undefined && a !== undefined)
            return true;
        return (JSON.stringify(a) !== JSON.stringify(b));
    }
    connect = (filterFunction) => {
        this.filterFunction = filterFunction;
    }
    filterProperties = (props) => {
        if (this.filterFunction)
            return this.filterFunction(props);
        return props;
    }
    store(valueObject) {
        const idToWatch = this.linkedId;
        const sendObject = { ...valueObject, id: idToWatch };
        const jsonstring = JSON.stringify(sendObject);
        console.log('sending:', jsonstring);
        currentLink.send(`=${jsonstring}`)
    }
    resumeLink = () => {
        this._mounted = true;
        this._listener && this._listener.resume();
    }
    stopLink = () => {
        this._mounted = false;
        this._listener && this._listener.stop();
    }
    componentDidMount() {
        this.resumeLink();
    }
    componentWillUnmount() {
        this.stopLink();
    }
}

export const getLink = () => {
    return currentLink;
};