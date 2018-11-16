import React from 'react';
import { LinkedComponent } from './LinkedComponent';

export class LinkedText extends LinkedComponent {
    constructor(props) {
        super(props);

        this.connect(({ value }) => {
            return { value };
        })
    }
    render() {
        const { value } = this.linked;
        return (<div contentEditable onBlur={(e) => {
            this.store({ value: e.target.innerHTML });
        }}>{value}</div>);
    }
}
