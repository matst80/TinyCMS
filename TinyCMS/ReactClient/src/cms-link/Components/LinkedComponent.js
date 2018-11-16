import React from 'react';
import { getCurrentLink, componentRegistry, sessionChanged } from '../connection';

export class LinkedComponent extends React.Component {
    constructor(props, linkId) {
        super(props);
        this.linked = {};

        let idToWatch = props.id;
        if (typeof (linkId) === "string")
            idToWatch = linkId;
        if (idToWatch) {
            this.setupListener(idToWatch);
        }
        this._stateListener = sessionChanged((session) => {
            const sessionData = this.sessionFilter ? this.sessionFilter(session) : { ...session };
            if (this.isChanged(this.sessionData,sessionData)) {
                this.sessionData = sessionData;
                if (this._mounted)
                    this.forceUpdate();
            }
        });
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
        this._stateListener && this._stateListener.resume();
    }
    stopLink = () => {
        this._mounted = false;
        this._listener && this._listener.stop();
        this._stateListener && this._stateListener.stop();
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