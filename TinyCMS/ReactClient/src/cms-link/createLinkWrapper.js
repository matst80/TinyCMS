import React from 'react';
import { LinkedComponent } from "./Components/LinkedComponent";

export function createLinkWrapper(WrappedComponent, connect = () => ({}), options = { children: true }) {
    return class extends LinkedComponent {
        constructor(props) {
            super(props);
            this.filterFunction = (data) => {
                return (options.children)
                    ? { ...connect(data), children: data.children }
                    : connect(data);
            }
        }
        render() {
            const props = { ...this.props, ...this.linked };
            if (options.children)
                props.children = this.renderChildren();
            return (<WrappedComponent {...props} />);
        }
    }
}