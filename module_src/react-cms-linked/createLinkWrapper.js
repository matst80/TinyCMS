import React from 'react';
import LinkedComponent from "./Components/LinkedComponent";

export function createLinkWrapper(WrappedComponent, connect = () => ({}), connectState = () => ({}), options = { children: true }) {
    if (typeof WrappedComponent !== "function" && WrappedComponent !== null) {
        return null;
    }
    class Wrapper extends LinkedComponent {
        constructor(props) {
            super(props);
            this.sessionFilter = connectState;
            this.filterFunction = (data) => {
                return (options.children)
                    ? { ...connect(data), children: data.children }
                    : connect(data);
            }
        }
        componentDidUpdate() {
            if (this.props.id && this.props.id != this.linkedId) {
                this.setupListener(this.props.id);
            }
        }
        render() {
            const props = {
                ...this.sessionData,
                ...this.props,
                ...this.linked,
                store: this.store,
                setupListener: this.setupListener
            };

            if (options.children) {
                props.children = this.renderChildren();
            }
            return (<WrappedComponent {...props} />);
        }
    }
    return ret;
}