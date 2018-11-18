import React from 'react';
import { LinkedComponent } from './LinkedComponent';
import { createLinkWrapper } from '../createLinkWrapper';

export const Header = createLinkWrapper(({ text }) => (<h1>{text}</h1>), ({ text }) => ({ text }));

export const Section = createLinkWrapper(({ id, title, ingress, children }) => (
    <section>
        <a name={id} />
        <h2>{title}</h2>
        <p>{ingress}</p>
        <div>{children}</div>
    </section>
), ({ title, ingress }) => ({ title, ingress }));

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
        }} dangerouslySetInnerHTML={{ __html: value }} />);
    }
}
