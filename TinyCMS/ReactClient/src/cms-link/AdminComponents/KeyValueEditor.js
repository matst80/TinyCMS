import React, { Component } from 'react';

export default class KeyValueEditor extends Component {
    renderEditor = () => {
        const { value, onChange, type, editor, name } = this.props;
        console.log(type, editor);
        if (editor === 'multiline') {
            return (<textarea className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />);
        }
        return (<input className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />)
    }
    render() {
        const { name } = this.props;
        return (<div className="form-group" key={name}>
            <label htmlFor={name}>{name}</label>
            {this.renderEditor()}
        </div>)
    }
}