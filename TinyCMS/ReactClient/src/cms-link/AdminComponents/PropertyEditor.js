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
        schemaHelper.getAll().then(allTypes => {
            this.allTypes = allTypes;
            if (this._mounted)
                 this.forceUpdate();
            // else
            //     this.state = { ...this.state, allTypes };
        });
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
            //if (this._mounted) {
                //this.setState({ data, isLoading: true, isNew: false, type: data.type });
            
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
    createNew = () => {
        const { type } = this.state;
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
        if (!this.data || !this.allTypes || !this.schema)
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
                        <button type="button" className="btn btn-secondary" onClick={this.createNew}>New</button>
                        <select defaultValue={type} onChange={({ target: { value } }) => this.setState({ type: value })}>
                            {this.allTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export class ObjectEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        setEditorLink((element, id) => {
            console.log('update element');
            this.linkedElement = element;
            this.linkedId = id;
            if (this._mounted) {
                this.setState({ isOpen: true });
                this.forceUpdate();
            }
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
            }}>X</span> {nodeId}
            <PropertyEditor match={{ params: { nodeId } }} />
        </div>);
    }
}