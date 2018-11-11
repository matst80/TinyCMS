import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import { Editor, EditorState, ContentState } from 'draft-js';

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
}

const PropsRoute = ({ component, ...rest }) => {
    return (
        <Route {...rest} render={routeProps => {
            return renderMergedProps(component, routeProps, rest);
        }} />
    );
}

var currentLink = null;

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

export const schemaHelper = {
    getSchema: (type) => {
        return fetch(`http://localhost:5000/schema/${type}/`).then(res => res.json());
    },
    getAll: () => {
        return fetch(`http://localhost:5000/schema/`).then(res => res.json());
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
    renderChildren = () => {
        const { children = [] } = this.linked;
        return children
            .filter(componentRegistry.hasComponent)
            .map(({ id, type }) =>
                componentRegistry.getComponent(type, { key: id, id: id })
            );
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
    delete = () => {
        const jsonData = JSON.stringify({ id: this.linkedId });
        console.log('sending delete:', jsonData);
        currentLink.send(`-${jsonData}`);
    }
    store = (valueObject, isNew) => {
        const idToWatch = this.linkedId;
        const sendObject = isNew ? valueObject : { id: idToWatch, ...valueObject };
        const jsonData = JSON.stringify(sendObject);
        const command = isNew ? '+' : '=';
        console.log('sending:', jsonData);
        currentLink.send(`${command}${jsonData}`)
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

export class LinkedRoutes extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children }) => ({
            children: children
                .filter(node => node.type === 'page')
                .map(({ url, id, templateId }) => ({ url, id, templateId }))
        }));
    }
    render() {
        const { children = [] } = this.linked;
        return children.map(({ url, id, templateId = 'linkedchild' }) => (
            <PropsRoute key={id} path={url} component={registerdComponents[templateId]} id={id} />
        ));
    }
}

export class PageRouteLinks extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children }) => ({ children: children.filter(node => node.type === 'page') }));
    }
    render() {
        const { children = [] } = this.linked;
        return children.map(({ name, url, id }) => (<Link className="nav-item nav-link" key={id} to={url}>{name}</Link>))

    }
}

export class LinkedChildComponent extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children }) => ({ children: children.filter(node => node.type !== 'page') }));
    }

    render() {
        return this.renderChildren();
    }
}

export class LinkedImage extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ url, width, height, alt }) => ({ url, width, height, alt }));
    }
    render() {
        const { url, width, height, alt } = this.linked;
        return (
            <img src={url} alt={alt} />
        );
    }
}

const registerdComponents = {
    linkedchild: LinkedChildComponent
};

export const componentRegistry = {
    setComponents: (templates) => {
        for (var key in templates) {
            registerdComponents[key] = templates[key];
        }
    },
    getComponent: (type, props) => {
        return renderMergedProps(registerdComponents[type], props);
    },
    hasComponent: (data) => {
        if (data.type)
            return !!registerdComponents[data.type];
        return !!registerdComponents[data];
    }
}


export const getLink = () => {
    return currentLink;
};