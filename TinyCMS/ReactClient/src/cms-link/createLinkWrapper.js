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
        renderToolbar = () => {
            const selectedTools = defaultTools.map(({ toolCallback, title }, idx) => {
                return (<button key={idx} className="btn btn-secondary" onClick={() => toolCallback(this, this.linkedId)}>{title}</button>)
            })
            return (
                <div key="editTools" className="btn-group editor-tools">{selectedTools}</div>
            );
        }
        render() {
            const props = { ...this.sessionData, ...this.props, ...this.linked };
            if (options.children) {
                props.children = this.renderChildren().concat([this.renderToolbar()]);
            }
            return (<WrappedComponent {...props} />);
        }
    }
}