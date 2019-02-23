import React, {
    Component
} from 'react';
import {
    componentRegistry
} from 'react-cms-link';
import {
    withDragHandle
} from './LinkedCol';
import {
    onAuthenticationChanged
} from 'cmslink';
import { BrowserRouter as Router, Link } from "react-router-dom";


const ComponentPlaceholder = withDragHandle(({
    id
}) => {
    (
        <div>{id}</div>
    )
}, false, false, {
    createNew: true
});

export default class EditorPanel extends Component {
    constructor(props) {
        super(props);
        var components = componentRegistry.getComponents();
        this.isEditor = false;
        this.state = {
            showComponents: false,
            components: Object.keys(components)
        };
        onAuthenticationChanged((state) => {
            this.isEditor = state.valid;
            if (this._mounted)
                this.forceUpdate();
        })
    }
    render() {
        if (!this.isEditor) {
            return null;
        }
        const {
            components,
            showComponents
        } = this.state;
        const list = components.map(type => {
            return (
                <ComponentPlaceholder key={type} id={type} />
            );
        })
        return (
            <div className="tc-top-bar">
                <div className="tc-bar">
                    <div className="tc-creatnew tc-dropdown"><span onClick={() => this.setState ({ showComponents: !showComponents })}>Create new</span>
                        {showComponents && (
                        <div className="tc-droplist">
                            {list}
                        </div>
                        )}
                    </div>
                </div>
                <div className="tc-bar">
                    <Link to="/edit" className="menu-top-item">Tree editor</Link>
                </div>
                <div className="tc-bar">
                    <input placeholder="Search" />
                </div>
            </div>
        );
    }
}