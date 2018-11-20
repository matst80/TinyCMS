import React, { Component } from 'react';
import { EditNodeTree } from './TreeNode';
//import { Route } from "react-router-dom";
//import { PropertyEditor } from './PropertyEditor';
import '../Style/Editor.css';
import { onAuthenticationChanged } from '../connection';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        onAuthenticationChanged((state) => {
            console.log(state);
            this.isEditor = state.valid;
            this.forceUpdate();
        })
    }
    render() {
        //const { match } = this.props;
        return (<div className="container editor">
            <div className="row">
                {/* <div className="col-4 leftbar"> */}
                {this.isEditor ? (<EditNodeTree id="root" />) : (<h2>You need to be signed in</h2>)}

                {/* </div>
                <div className="content col-8">
                    <Route path={`${match.path}:nodeId`} component={PropertyEditor} />
                    <Route
                        exact
                        path={match.path}
                        render={() => <h3>Please select a node.</h3>}
                    />
                </div> */}
            </div>
        </div>);
    }
}

