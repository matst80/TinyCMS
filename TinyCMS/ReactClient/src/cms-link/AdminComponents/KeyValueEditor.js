import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import ObjectPropertyEditor from './ObjectPropertyEditor';

import { render } from 'react-dom';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';


const convertToArray = (data) => {
    return Object.values(data);
}

const SortableItem = SortableElement(({ value: { name, value, onChange } }) =>
    <KeyValueEditor
        showLabel={false}
        name={name}
        value={value}
        onChange={onChange} />
);

const SortableList = SortableContainer(({ items }) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${value.name}`} index={index} value={value} />
            ))}
        </ul>
    );
});

export class ArrayEditor extends Component {

    handleChange = (dataToStore) => {
        const data = { ...this.props.data, ...dataToStore };
        this.props.onChange(convertToArray(data));
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        console.log('sorted');
    }
    render() {
        const { data } = this.props;
        const properties = [];
        const items = data.map((value, name) => {
            return { name, value, onChange: this.handleChange };
        });
        return (
            <div className="array-editor">
                <SortableList helperClass="property-sorter" items={items} onSortEnd={this.onSortEnd} />
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