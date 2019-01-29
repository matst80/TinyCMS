import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import ObjectPropertyEditor from './ObjectPropertyEditor';
import { WithContext as ReactTags } from 'react-tag-input';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class TagInputEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.value,
            suggestions:[]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }
    handleChange(tags) {
        this.setState({ tags });
        this.props.onChange(tags);
    }
    handleDelete(i) {
        const { tags } = this.state;
        this.handleChange(tags.filter((tag, index) => index !== i));
    }

    handleAddition(tag) {
        this.handleChange([...state.tags, tag]);
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.handleChange(newTags);
    }
    render() {
        const { tags, suggestions } = this.state;
        return (
            <div>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters} />
            </div>
        )
    }
}

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
    default: ({ name, value, onChange }) => (<input key={name} className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange(target.value) }} />),
    tageditor: ({ name, value, onChange }) => (<TagInputEditor value={value} key={name} onChange={onChange} />),
    multiline: ({ name, value, onChange }) => (<textarea key={name} className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange(target.value) }} />),
    arrayeditor: ({ name, value, onChange }) => (<ArrayEditor key={name} data={value} onChange={onChange} />),
    colorPicker: ({ name, value, onChange }) => (<ColorPicker key={name} data={value} onChange={onChange} />),
    objectEditorType: ({ name, value, onChange }) => (<ObjectPropertyEditor key={name} data={value} onChange={onChange} />)
}

export const registerEditor = (editorType, EditorControl) => {
    editors[editorType] = EditorControl;
}

export class KeyValueEditor extends Component {

    renderEditor = () => {
        const { value, onChange, type, editor, name } = this.props;
        const valueType = typeof (value);
        const createParams = {
            name,
            value,
            type,
            onChange: (data) => {
                onChange && onChange({ [name]: data })
            }
        };

        var registerdEditor = editors[editor];
        console.log(valueType, editor, registerEditor);

        if (!registerdEditor) {
            registerdEditor = editors.default;
            if (valueType === 'object') {
                registerdEditor = Array.isArray(value) ? editors.arrayeditor : editors.objectEditorType;
            }
        }
        return React.createElement(registerdEditor, createParams);

    }
    render() {
        const { name, showLabel = true } = this.props;
        return (<div className="form-group" key={name}>
            {showLabel && (<label htmlFor={name}>{name}</label>)}
            {this.renderEditor()}
        </div>)
    }
}