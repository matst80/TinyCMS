import React from 'react';
import { getCurrentLink, sessionChanged } from 'cmslink';
import { componentRegistry } from '../connection';

const compare = (a, b) => {
    if (a === b)
        return false;
    if (a === undefined && b !== undefined)
        return true;
    if (b === undefined && a !== undefined)
        return true;
    return (JSON.stringify(a) !== JSON.stringify(b));
}

export default class LinkedComponent extends React.Component {
    constructor(props) {
        super(props);
        this.linked = {};

        this.gotLinkData = this.gotLinkData.bind(this);
        this.renderChildren = this.renderChildren.bind(this);
        this.setupListener = this.setupListener.bind(this);
        this.isChanged = this.isChanged.bind(this);
        this.connect = this.connect.bind(this);
        this.filterProperties = this.filterProperties.bind(this);
        this.delete = this.delete.bind(this);
        this.connect = this.connect.bind(this);
        this.fakeSend = this.fakeSend.bind(this);
        this.store = this.store.bind(this);
        this.resumeLink = this.resumeLink.bind(this);
        this.stopLink = this.stopLink.bind(this);

        let idToWatch = props.id;
        if (idToWatch) {
            this.setupListener(idToWatch);
        }
        this._stateListener = sessionChanged((session) => {
            try {
                const sessionData = this.sessionFilter ? this.sessionFilter(session) : { ...session };
                if (this.isChanged(this.sessionData, sessionData)) {
                    this.sessionData = sessionData;
                    if (this._mounted)
                        this.forceUpdate();
                }
            } catch (err) {
                console.warn('set session failed', err);
            }
        });

    }
    gotLinkData(data) {
        const linkedData = this.filterProperties(data);
        if (this.isChanged(this.linked, linkedData)) {
            this.linked = linkedData;
            if (this._mounted)
                this.forceUpdate()
        }
    }
    renderChildren(maxNoi = 255) {
        const { children = [] } = this.linked;
        const withComponent = children
            .filter(componentRegistry.hasComponent);
        return withComponent
            .splice(0, Math.min(maxNoi, withComponent.length))
            .map(({ id, type }) =>
                componentRegistry.getComponent(type, { key: id, id: id })
            );
    }
    setupListener(id, customCallback) {
        this._listener && this._listener.remove();
        //this.sessionData = null; // Session should probably be same after relinking
        this.linkedId = id;
        this.linked = {};
        this._listener = getCurrentLink().listenTo(id, customCallback || this.gotLinkData);
    }
    isChanged(a, b) {
        return compare(a, b);
    }
    connect(filterFunction) {
        this.filterFunction = filterFunction;
    }
    filterProperties(props) {
        if (this.filterFunction)
            return this.filterFunction(props);
        return props;
    }
    delete() {
        const jsonData = JSON.stringify({ id: this.linkedId });
        getCurrentLink().send(`-${jsonData}`);
    }
    fakeSend(newValue) {
        const idToWatch = this.linkedId;
        getCurrentLink().fakeNode({ id: idToWatch, ...this.linked, ...newValue });
    }
    store(valueObject, isNew) {
        const idToWatch = this.linkedId;
        const sendObject = isNew ? valueObject : { id: idToWatch, ...valueObject };
        const jsonData = JSON.stringify(sendObject);
        const command = isNew ? '+' : '=';
        getCurrentLink().send(`${command}${jsonData}`)
    }
    resumeLink() {
        this._mounted = true;
        this._listener && this._listener.resume();
        this._stateListener && this._stateListener.resume();
    }
    stopLink() {
        this._mounted = false;
        this._listener && this._listener.stop();
        this._stateListener && this._stateListener.stop();
    }
    render() {
        return (<div>{children}</div>);
    }
    componentDidMount() {
        this.resumeLink();
    }
    componentWillUnmount() {
        this.stopLink();
    }
}