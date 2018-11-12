import React, { Component } from 'react';
import { getCurrentLink, componentRegistry } from '../connection';

const defaultTools = [
    {
        toolCallback: (parentId) => {

        },
        title: 'Add'
    },
    {
        toolCallback: (parentId) => {

        },
        title: 'Edit'
    }
];

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
    renderToolbar = () => {
        const selectedTools = defaultTools.map(({ toolCallback, title }, idx) => {
            return (<button key={idx} className="btn btn-secondary" onClick={() => toolCallback(this.linkedId)}>{title}</button>)
        })
        return (
            <div className="btn-group editor-tools">{selectedTools}</div>
        );
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
        this._listener = getCurrentLink().listenTo(id, customCallback || this.gotLinkData);
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
        getCurrentLink().send(`-${jsonData}`);
    }
    store = (valueObject, isNew) => {
        const idToWatch = this.linkedId;
        const sendObject = isNew ? valueObject : { id: idToWatch, ...valueObject };
        const jsonData = JSON.stringify(sendObject);
        const command = isNew ? '+' : '=';
        console.log('sending:', jsonData);
        getCurrentLink().send(`${command}${jsonData}`)
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

export class LinkedChildComponent extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children }) => ({ children }));
    }
    render() {
        return this.renderChildren();
    }
}