import React from 'react';
import { LinkedComponent } from 'react-cms-link';

export default class LinkedText extends LinkedComponent {
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
        }} dangerouslySetInnerHTML={{ __html: value }} />);
    }
}
