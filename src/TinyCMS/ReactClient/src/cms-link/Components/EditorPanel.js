import React, { Component } from 'react';
import { componentRegistry } from 'react-cms-link';
import { withDragHandle } from './LinkedCol';


const ComponentPlaceholder = withDragHandle(({ id }) => {
    return (
        <div>{id}</div>
    );
}, false, false, { createNew: true });

export default class EditorPanel extends Component {
    constructor(props) {
        super(props);
        var components = componentRegistry.getComponents();
        this.state = {
            components: Object.keys(components)
        };
    }
    render() {
        const { components } = this.state;
        const list = components.map(type => {
            return (
                <ComponentPlaceholder key={type} id={type} />
            );
        })
        return (
            <div className="tc-top-bar">
                <div className="tc-bar">
                    <div className="tc-creatnew tc-dropdown"><span>Create new</span>
                        <div className="tc-droplist">
                            {list}
                        </div>
                    </div>
                </div>
                <div className="tc-bar">
                    <input placeholder="Search" />
                </div>
            </div>
        );
    }
}
