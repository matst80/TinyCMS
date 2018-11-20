import React, { Component } from 'react';
import ObjectPropertyEditor from './ObjectPropertyEditor';

const convertToArray = (data) => {
    return Object.values(data);
}

export class ArrayEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { data: { ...props.data } };
    }
    handleChange = (dataToStore) => {
        const data = { ...this.state.data, ...dataToStore };
        this.setState({ data });
        this.props.onChange(convertToArray(data));
    }
    render() {
        const { data } = this.state;
        const properties = [];
        for (var name in data) {

            const value = data[name];

            properties.push((
                <KeyValueEditor
                    showLabel={false}
                    key={name}
                    name={name}
                    value={value}
                    onChange={this.handleChange} />
            ));

        }
        return (
            <div className="array-editor">
                {properties}
            </div>
        );
    }
}

export default class KeyValueEditor extends Component {
    renderEditor = () => {
        const { value, onChange, type, editor, name } = this.props;
        const valueType = typeof (value);

        if (valueType == 'object') {
            if (Array.isArray(value))    
            return (<ArrayEditor data={value} onChange={(data) => { console.log(name,data); onChange && onChange({ [name]: data }) }} />);
            else
                return (<ObjectPropertyEditor data={value} onChange={(data) => { onChange && onChange({ [name]: data }) }} />);
        }
        else if (editor === 'multiline') {
            return (<textarea className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />);
        }
        return (<input className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />)
    }
    render() {
        const { name, showLabel = true } = this.props;
        return (<div className="form-group" key={name}>
            {showLabel && (<label htmlFor={name}>{name}</label>)}
            {this.renderEditor()}
        </div>)
    }
}