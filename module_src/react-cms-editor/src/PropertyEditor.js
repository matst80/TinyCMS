import React from 'react';
import { LinkedComponent } from 'react-cms-link';
import { schemaHelper } from 'cmslink';
import KeyValueEditor from './KeyValueEditor';


const EXCLUDED_PROPS = ['children', 'type', 'id', 'parentId'];

export default class PropertyEditor extends LinkedComponent {
    constructor(props) {
        const { match: { params: { nodeId } } } = props;
        super(props);
        this.state = { isNew: false };
        this.isNew = true;
        this.dataToStore = {};
        this.changeNode = this.changeNode.bind(this);
        this.getSchema = this.getSchema.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.openParent = this.openParent.bind(this);
        this.createNew = this.createNew.bind(this);
        this.changeNode(nodeId);
    }
    changeNode(nodeId) {
        const restoreData = { id: this.nodeId, ...this.data };
        console.log('restoring', restoreData);
        this.fakeSend(restoreData);
        this.nodeId = nodeId;
        this.setupListener(nodeId, (data) => {
            if (!data.__fake) {
                this.data = data;
                this.isNew = false;
                this.dataToStore = {};
                this.getSchema(data.type);
            }
        });
    }
    getSchema(type) {
        schemaHelper.getSchema(type).then(schema => {
            this.schema = schema;
            if (this._mounted) {
                this.forceUpdate();
            }
        });
    }
    handleChange(objectToStore) {
        const dataToStore = this.dataToStore;
        const propertiesBefore = !!Object.keys(dataToStore).length;
        this.dataToStore = { ...dataToStore, ...objectToStore };
        const propertiesAfter = !!Object.keys(this.dataToStore).length;
        this.fakeSend({ ...this.data, ...this.dataToStore });
        if (this._mounted && propertiesBefore !== propertiesAfter)
            this.forceUpdate();
    }
    save() {
        this.store(this.dataToStore, this.isNew);
    }
    openParent() {
        const { parentId } = this.data;
        if (parentId && parentId.length) {
            this.changeNode(parentId);
        }
    }
    createNew(type) {
        const startData = { type, parentId: this.nodeId };
        this.isNew = true;
        this.data = startData;
        this.dataToStore = startData;
        this.getSchema(type);
    }
    render() {
        const nodeId = this.nodeId;
        const { type } = this.state;
        const hasParent = this.data && this.data.parentId;
        const canSave = !!Object.keys(this.dataToStore || {}).length;
        const properties = [];
        if (!this.data || !this.schema)
            return (<div className="loading"><span>Loading...</span></div>);

        for (var name in this.schema.properties) {
            const schemaData = this.schema.properties[name];
            const value = this.data[name];

            if (EXCLUDED_PROPS.indexOf(name) === -1 || this.isNew)
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
                    <span className="card-subtitle mb-2 text-muted">Id {nodeId}</span>
                    <span className="card-subtitle mb-2 text-muted">Type {type}</span>
                    <h3 className="card-title">Properties</h3>

                    {properties}
                    <div className="editor-tools">
                        {canSave && (<button key={'save'} type="button" className="btn btn-primary" onClick={this.save}>Save</button>)}
                        {hasParent && <button type="button" className="btn btn-secondary" onClick={this.openParent}>Edit parent</button>}
                        <button type="button" className="btn btn-warning" onClick={this.delete}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}



