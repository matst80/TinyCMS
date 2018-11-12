import React, { Component } from 'react';

export class KeyValueEditor extends Component {
    render() {
        const { name, value, onChange } = this.props;
        return (<div className="form-group" key={name}>
            <label htmlFor={name}>{name}</label>
            <input className="form-control" id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />
        </div>)
    }
}