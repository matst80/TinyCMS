import React from 'react';
import { LinkedComponent } from '../Components/LinkedComponent';
import { schemaHelper, setEditorLink } from '../connection';
import { KeyValueEditor } from './KeyValueEditor';

const EXCLUDED_PROPS = ['children', 'type', 'id', 'parentId'];

export class PropertyEditor extends LinkedComponent {
    constructor(props) {
        const { match: { params: { nodeId } } } = props;
        super(props);
        this.state = { dataToStore: {}, isNew: false };
        this.isNew = true;
        this.changeNode(nodeId);
    }
    componentDidUpdate() {
        const { match: { params: { nodeId } } } = this.props;
        if (this.nodeId !== nodeId) {
            this.changeNode(nodeId);
        }
    }
    changeNode = (nodeId) => {
        this.nodeId = nodeId;
        this.setupListener(nodeId, (data) => {
            this.data = data;
            this.isNew = false;

            this.getSchema(data.type);
        });
    }
    getSchema = (type) => {
        schemaHelper.getSchema(type).then(schema => {
            this.schema = schema;
            if (this._mounted)
                this.forceUpdate();
        });
    }
    handleChange = (objectToStore) => {
        const { dataToStore } = this.state;
        this.setState({ dataToStore: { ...dataToStore, ...objectToStore } });
    }
    save = () => {
        const { dataToStore } = this.state;
        this.store(dataToStore, this.isNew);
        this.setState({ dataToStore: {} });
    }
    createNew = (type) => {
        //const { type } = this.state;
        const startData = { type, parentId: this.nodeId };
        this.isNew = true;
        this.data = startData;
        this.setState({ dataToStore: startData });
        this.getSchema(type);
    }
    render() {
        const nodeId = this.nodeId;
        const { dataToStore, type } = this.state;
        const canSave = !!Object.keys(dataToStore).length;
        const properties = [];
        if (!this.data || !this.schema)
            return (<div className="loading"><span>Loading...</span></div>);

        for (var name in this.schema.properties) {
            const schemaData = this.schema.properties[name];
            const value = this.data[name];

            if (EXCLUDED_PROPS.indexOf(name) === -1 || this.isNew)
                properties.push((
                    <KeyValueEditor
                        key={nodeId + name + value}
                        name={name}
                        value={value}
                        onChange={this.handleChange}
                        type={type}
                        editor={schemaData.editor} />
                ));

        }
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Properties</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Id {nodeId}</h6>
                    {properties}
                    <div className="editor-tools">
                        {canSave && (<button type="button" className="btn btn-primary" onClick={this.save}>Save</button>)}
                        <button type="button" className="btn btn-warning" onClick={this.delete}>Delete</button>
                        {/* <button type="button" className="btn btn-secondary" onClick={this.createNewSibling}>New sibling</button>
                        <button type="button" className="btn btn-secondary" onClick={this.createNewChild}>New child</button> */}

                    </div>
                </div>
            </div>
        );
    }
}

const isReactNode = (dom) => {
    for (var key in dom) {
        if (key.startsWith("__reactInternalInstance$")) {
            var compInternals = dom[key];
            var owner = compInternals._debugOwner;
            if (owner.memoizedProps && owner.memoizedProps.id) {
                return { node: owner.child.stateNode, owner, id: owner.memoizedProps.id };
            }
        }
    }
    return false;
}

const findReactNode = (node) => {
    if (!node)
        return null;
    const instance = isReactNode(node);
    if (instance)
        return { node, ...instance };
    else {
        if (node.tagName !== 'BODY')
            return findReactNode(node.parentNode);
    }
    return null;
}

export class NodeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        schemaHelper.getAll().then(allTypes => {
            this.allTypes = allTypes;
            if (this._mounted)
                this.forceUpdate();
            // else
            //     this.state = { ...this.state, allTypes };
        });
    }
    open = (onChange) => {
        this.onChange = onChange;
        this.setState({ isOpen: true });
    }
    selectNode = (nodeType) => {
        const onNodeSelected = this.onChange;
        //schemaHelper.getSchema(nodeType).then(schemaData => {
        if (onNodeSelected) {
            onNodeSelected(nodeType);
            this.setState({ isOpen: false });
        }
        //});
    }
    render() {
        const { isOpen } = this.state;
        if (!isOpen)
            return null;
        const nodes = (this.allTypes || []).map(nodeType => {
            return (<div key={nodeType} onClick={_ => this.selectNode(nodeType)}>{nodeType}</div>);
        });
        return (<div class="nodeselector">
            {nodes}
        </div>);
    }
}

export class ObjectEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };

        var lastHoverTarget = false;
        var lastTarget = false;

        const fixButtons = (target) => {
            const div = document.createElement('div');
            div.innerHTML = '<span>Edit</span>';
            document.body.appendChild(div);
            target._editorNode = div;
            div.className = 'editor-button-overlay';
            var pos = target.node.getBoundingClientRect();
            var topAdd = (pos.height < 40) ? 30 : 0;

            div.style.top = pos.top - topAdd + 'px';
            div.style.left = pos.left + 'px';
            div.addEventListener('click', () => {
                this.changeTarget(target.node, target.id);
            });
            if (lastTarget && lastTarget._editorNode) {
                document.body.removeChild(lastTarget._editorNode);
            }
            lastTarget = target;
        }

        window.document.addEventListener('mouseover', (e) => {

            if (e.target !== lastHoverTarget) {
                lastHoverTarget = e.target;
                const currentTarget = findReactNode(e.target);
                if (currentTarget && lastTarget != currentTarget) {
                    console.log(currentTarget);
                    fixButtons(currentTarget);
                }

            }
        });

        setEditorLink(this.changeTarget);
    }
    changeTarget = (element, id) => {
        console.log('update element');
        this.linkedId = id;
        if (this._mounted) {
            this.setState({ isOpen: true });
            this.forceUpdate();
        }
    }
    createNewChild = () => {
        this.nodeSelector.open((type) => {
            this.editor.createNew(type);
        });
    }
    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    render() {
        const nodeId = this.linkedId;
        const { isOpen } = this.state;
        if (!nodeId || !isOpen)
            return null;
        return (<div className="popupeditor">
            <span onClick={() => {
                this.setState({ isOpen: false });
            }}>X</span>
            <div>{nodeId}</div>
            <PropertyEditor ref={elm => { this.editor = elm }} match={{ params: { nodeId } }} />
            {/* <button type="button" className="btn btn-secondary" onClick={this.createNewSibling}>New sibling</button> */}
            <button type="button" className="btn btn-secondary" onClick={this.createNewChild}>New child</button>
            <NodeSelector ref={elm => { this.nodeSelector = elm }} />
        </div>);
    }
}