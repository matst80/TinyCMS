/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import ObjectPropertyEditor from './ObjectPropertyEditor';
import { WithContext as ReactTags } from 'react-tag-input';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ModalDialog, FileBrowser } from '../components/FileBrowser';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class TagInputEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.value || [],
            suggestions: []
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
        this.handleChange([...this.state.tags, tag]);
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
            {items.map((value, index) => {
                console.log('idx name:', index, value);
                return (

                    <SortableItem key={`item-${value.name}`} index={index} value={value} />
                );
            })
            }
        </ul>
    );
});

export class ArrayEditor extends Component {

    handleChange = (dataToStore) => {
        const data = { ...this.props.data, ...dataToStore };
        this.props.onChange(convertToArray(data));
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        const { data, onChange } = this.props;
        const ret = [...data];
        const toMove = ret.splice(oldIndex, 1)[0];
        ret.splice(newIndex, 0, toMove);
        console.log('sorted', ret);
        onChange(ret);
    }
    render() {
        const { data } = this.props;
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

        return (<CirclePicker
            color={color}
            onChangeComplete={(data) => { this.setState({ color: data.hex }); console.log(data); onChange && onChange(data.hex) }}
        />);
    }
}

class FilePickerEditor extends React.Component {
    state = {
        isOpen: false
    }
    fileSelected = (file) => {
        console.log('file selected',file);
        this.setState({isOpen:false});
        this.props.onChange(file);
    }
    render() {
        const { isOpen } = this.state;
        const { data } = this.props;
        console.log('props',this.props);
        return (
            <div>
                <span onClick={()=>{
                    this.setState({isOpen:!isOpen});
                }}>Open picker ({data})</span>
                <ModalDialog isOpen={isOpen} onClose={()=>{this.setState({isOpen:false})}}>
                    <div className="tc-dialoginner">
                        <h1>Choose file</h1>
                        <FileBrowser onSelect={this.fileSelected} />
                    </div>
                </ModalDialog>
            </div>
        );
    }
}

const editors = {
    default: ({ name, value, onChange }) => (<input key={name} className="tcForm" id={name} defaultValue={value} onChange={({ target }) => { onChange(target.value) }} />),
    url: ({ name, value, onChange }) => (<FilePickerEditor key={name} data={value} onChange={onChange} />),
    tageditor: ({ name, value, onChange }) => (<TagInputEditor value={value} key={name} onChange={onChange} />), //<TagInputEditor value={value} key={name} onChange={onChange} />
    multiline: ({ name, value, onChange }) => (<textarea key={name} className="tcForm" id={name} defaultValue={value} onChange={({ target }) => { onChange(target.value) }} />),
    arrayeditor: ({ name, value, onChange }) => (<ArrayEditor key={name} data={value} onChange={onChange} />),
    colorPicker: ({ name, value, onChange }) => (<ColorPicker key={name} data={value} onChange={onChange} />),
    objectEditorType: ({ name, value, onChange }) => (<ObjectPropertyEditor key={name} data={value} onChange={onChange} />)
}

export const registerEditor = (editorType, EditorControl) => {
    editors[editorType] = EditorControl;
}

const Ucfirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

        if (!registerdEditor) {
            console.log('editor not found',editor);
            registerdEditor = editors.default;
            if (valueType === 'object') {
                registerdEditor = Array.isArray(value) ? editors.arrayeditor : editors.objectEditorType;
            }
        }

        return React.createElement(registerdEditor, { ...createParams });

    }
    render() {
        const { name, showLabel = true } = this.props;
        return (<div className="form-group" key={name}>
            {showLabel && (<label htmlFor={name}>{Ucfirst(name)}</label>)}
            {this.renderEditor()}
        </div>)
    }
}