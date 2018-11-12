import React from 'react';
import { LinkedComponent } from '../Components/LinkedComponent';
import { schemaHelper } from '../connection';
import { KeyValueEditor } from './KeyValueEditor';

const EXCLUDED_PROPS = ['children', 'type', 'id', 'parentId'];

export class PropertyEditor extends LinkedComponent {
    constructor(props) {
        const { match: { params: { nodeId } } } = props;
        super(props);
        this.state = { isLoading: true, data: false, schema: false, dataToStore: {}, isNew: false };
        this.changeNode(nodeId);
        schemaHelper.getAll().then(allTypes => this.setState({ allTypes }));
    }
    componentDidUpdate(prevProps) {
        const { match: { params: { nodeId } } } = this.props;
        const { match: { params } } = prevProps;
        if (nodeId !== params.nodeId) {
            this.changeNode(nodeId);
        }
    }
    changeNode = (nodeId) => {
        this.setupListener(nodeId, (data) => {
            this.setState({ data: data, isLoading: true, isNew: false, type: data.type });
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
        const { dataToStore, isNew } = this.state;
        this.store(dataToStore, isNew);
        this.setState({ dataToStore: {} });
    }
    createNew = () => {
        const { type, data: { id } } = this.state;
        const startData = { type, parentId: id };
        this.setState({ dataToStore: startData, isNew: true, data: startData, isLoading: true });
        schemaHelper.getSchema(type).then(schema => {
            this.setState({ schema, isLoading: false });
        })
    }
    render() {
        const { match: { params: { nodeId } } } = this.props;
        const { isLoading, schema, data, dataToStore, isNew, allTypes, type } = this.state;
        const canSave = !!Object.keys(dataToStore).length;
        const properties = [];
        if (isLoading)
            return (<div className="loading"><span>Loading...</span></div>);

        for (var name in schema.properties) {
            const schemaData = schema.properties[name];
            const value = data[name];

            if (EXCLUDED_PROPS.indexOf(name) === -1 || isNew)
                properties.push((
                    <KeyValueEditor
                        key={nodeId + name}
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
                            {allTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}