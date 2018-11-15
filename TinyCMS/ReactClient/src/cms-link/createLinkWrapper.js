import React from 'react';
import { LinkedComponent } from "./Components/LinkedComponent";
import { setEditComponent } from './connection';

const defaultTools = [
    {
        toolCallback: (parentId) => {

        },
        title: 'Add'
    },
    {
        toolCallback: (element, parentId) => {
            setEditComponent(element, parentId);
        },
        title: 'Edit'
    }
];

export function createLinkWrapper(WrappedComponent, connect = () => ({}), connectState = () => ({}), options = { children: true }) {
    return class extends LinkedComponent {
        constructor(props) {
            super(props);
            this.sessionFilter = connectState;
            this.filterFunction = (data) => {
                return (options.children)
                    ? { ...connect(data), children: data.children }
                    : connect(data);
            }
        }

        render() {
            
            const props = { ...this.sessionData, ...this.props, ...this.linked };
            
            if (options.children) {
                props.children = this.renderChildren();
            }
            return (<WrappedComponent {...props} />);
        }
    }
}