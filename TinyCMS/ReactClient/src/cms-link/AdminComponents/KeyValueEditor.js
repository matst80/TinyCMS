import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import ObjectPropertyEditor from './ObjectPropertyEditor';

const convertToArray = (data) => {
    return Object.values(data);
}

export class ArrayEditor extends Component {

    handleChange = (dataToStore) => {
        const data = { ...this.props.data, ...dataToStore };
        this.props.onChange(convertToArray(data));
    }
    render() {
        const { data } = this.props;
        const properties = [];
        data.map((value, name) => {


            // for (var name in data) {
            //const value = data[name];
            console.log('render', name, value);
            properties.push((
                <KeyValueEditor
                    showLabel={false}
                    key={'array' + name}
                    name={name}
                    value={value}
                    onChange={this.handleChange} />
            ));
            //}
        });
        return (
            <div className="array-editor">
                {properties}
            </div>
        );
    }
}

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: props.data };
    }
    render() {
        const { color } = this.state;
        const { onChange } = this.props;
        console.log('render picker');
        return (<CirclePicker
            color={color}
            onChangeComplete={(data) => { this.setState({ color: data.hex }); console.log(data); onChange && onChange(data.hex) }}
        />);
    }
}

const editors = {
    colorPicker: (name, value, onChange) => { }
}

export default class KeyValueEditor extends Component {
    renderEditor = () => {
        const { value, onChange, type, editor, name } = this.props;
        const valueType = typeof (value);

        if (valueType === 'object') {
            if (Array.isArray(value))
                return (<ArrayEditor key={name} data={value} onChange={(data) => { onChange && onChange({ [name]: data }) }} />);
            else
                return (<ObjectPropertyEditor key={name} data={value} onChange={(data) => { onChange && onChange({ [name]: data }) }} />);
        }
        else if (editor === 'colorPicker') {
            return (<ColorPicker key={name} data={value} onChange={(data) => { onChange && onChange({ [name]: data }) }} />)
        }
        else if (editor === 'multiline') {
            return (<textarea key={name} className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />);
        }
        return (<input key={name} className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />)
    }
    render() {
        const { name, showLabel = true } = this.props;
        return (<div className="form-group" key={name}>
            {showLabel && (<label htmlFor={name}>{name}</label>)}
            {this.renderEditor()}
        </div>)
    }
}