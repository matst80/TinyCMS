import React, { Component } from 'react';
import EditNodeTree from './TreeNode';
import { onAuthenticationChanged } from 'cmslink';
import '../style/editor.scss';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        onAuthenticationChanged((state) => {
            this.isEditor = state.valid;
            if (this._mounted)
                this.forceUpdate();
        })
    }
    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    render() {
        return this.isEditor
            ? (<div className="editor">
                <EditNodeTree />
            </div>)
            : (<h2>You need to be signed in</h2>);

    }
}

