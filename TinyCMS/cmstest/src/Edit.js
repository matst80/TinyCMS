import React, { Component } from 'react';
import { LinkedComponent, schemaHelper } from './cms-link';
import { Route, Link } from "react-router-dom";
import { Editor, EditorState, ContentState } from 'draft-js';
import './Edit.css';

class TreeNode extends LinkedComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.connect(({ name, children }) => {
            return { name, children };
        })
    }
    render() {
        const { id, type } = this.props;
        const { isOpen } = this.state;
        const { children = [] } = this.linked;
        const nodes = isOpen ? (<ul>
            {children.map(node => (<TreeNode key={node.id} id={node.id} type={node.type} />))}
        </ul>) : (<span>&nbsp;{children.length}</span>);
        return (
            <li>
                <span onClick={() => {
                    this.setState(s => {
                        return { isOpen: !s.isOpen }
                    })
                }}>{id}</span>
                <Link to={'/edit/' + id}>edit</Link>
                {nodes}
            </li>);
    }
}

class KeyValueEditor extends Component {
    render() {
        const { name, value, onChange } = this.props;
        return (<div className="nodeproperty" key={name}>
            <label htmlFor={name}>{name}</label>
            <input id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />
        </div>)
    }
}

const EXCLUDED_PROPS = ['children', 'type', 'id', 'parentId'];

class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        const editorState = EditorState.createWithContent(ContentState.createFromText(props.value));

        this.state = { editorState };
        this.onChange = (editorState) => this.setState({ editorState });
    }
    render() {
        return (
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
        );

    }
}

class PropertyEditor extends LinkedComponent {
    constructor(props) {
        const { match: { params: { nodeId } } } = props;
        super(props);
        this.state = { isLoading: true, data: false, schema: false, dataToStore: {} };
        this.changeNode(nodeId);
    }
    componentDidUpdate(prevProps) {
        const { match: { params: { nodeId } } } = this.props;
        const { match: { params } } = prevProps;
        if (nodeId != params.nodeId) {
            this.changeNode(nodeId);
        }
    }
    changeNode = (nodeId) => {
        this.setupListener(nodeId, (data) => {
            this.setState({ data: data, isLoading: true });
            schemaHelper.getSchema(data.type).then(schema => {
                this.setState({ schema, isLoading: false });
            })
        });
    }
    handleChange = (objectToStore) => {
        const { dataToStore } = this.state;
        this.setState({ dataToStore: { ...dataToStore, ...objectToStore } });
    }
    save = () => {
        const { dataToStore } = this.state;
        this.store(dataToStore);
        this.setState({ dataToStore: {} });
    }
    render() {
        const { match: { params: { nodeId } } } = this.props;
        const { isLoading, schema, data, dataToStore } = this.state;
        const canSave = !!Object.keys(dataToStore).length;
        const properties = [];
        if (isLoading)
            return (<div className="loading"><span>&nbsp;</span></div>);

        for (var name in schema.properties) {
            const schemaData = schema.properties[name];
            const value = data[name];
            if (schemaData.editor === 'multiline') {
                properties.push(<MyEditor key={nodeId + name} value={value} />)
            }
            else {
                if (EXCLUDED_PROPS.indexOf(name) === -1)
                    properties.push((<KeyValueEditor key={nodeId + name} name={name} value={value} onChange={this.handleChange} />));
            }
        }
        return (
            <div className="nodeeditor"><span>editor: {nodeId}</span>
                {properties}
                <div className="editor-tools">{canSave && (<button onClick={this.save}>Save</button>)}</div>
            </div>
        );
    }
}

export class Edit extends Component {
    render() {
        const { match } = this.props;
        console.log('render edit', match, `${match.path}/:nodeId`);
        return (<div className="editor">
            <div className="leftbar">
                <EditNodeTree id="root" />
            </div>
            <div className="content">
                <Route path={`${match.path}:nodeId`} component={PropertyEditor} />
                <Route
                    exact
                    path={match.path}
                    render={() => <h3>Please select a node.</h3>}
                />
            </div>
        </div>);
    }
}

class EditNodeTree extends LinkedComponent {
    render() {
        const { children = [] } = this.linked;
        return (<ul>
            {children.map(node => (<TreeNode key={node.id} id={node.id} type={node.type} />))}
        </ul>)
    }
}

