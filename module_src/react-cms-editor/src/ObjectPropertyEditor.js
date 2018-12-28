import React from 'react';
import KeyValueEditor from './KeyValueEditor';

export default class ObjectPropertyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: { ...props.data } };
        this.handleChange = this.handleChange.bind();
    }
    handleChange(objectToStore) {
        const data = { ...this.state.data, ...objectToStore };
        this.setState({ data });
        this.props.onChange(data)
    }
    render() {
        const { data } = this.state;
        const properties = [];
        for (var name in data) {

            const value = data[name];

            properties.push((
                <KeyValueEditor
                    key={name + value}
                    name={name}
                    value={value}
                    onChange={this.handleChange} />
            ));

        }
        return (
            <div className="card">
                <h3 className="card-title">{this.props.title || 'Properties'}</h3>
                {properties}
            </div>
        );
    }
}