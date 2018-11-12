import React, { Component } from 'react';
import { Route } from "react-router-dom";
import { EditNodeTree } from './TreeNode';
import { PropertyEditor } from './PropertyEditor';
import '../Style/Editor.css';

export class Editor extends Component {
    render() {
        const { match } = this.props;
        return (<div className="container editor">
            <div className="row">
                <div className="col-4 leftbar">
                    <EditNodeTree id="root" />
                </div>
                <div className="content col-8">
                    <Route path={`${match.path}:nodeId`} component={PropertyEditor} />
                    <Route
                        exact
                        path={match.path}
                        render={() => <h3>Please select a node.</h3>}
                    />
                </div>
            </div>
        </div>);
    }
}

