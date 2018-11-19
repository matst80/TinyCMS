import React from 'react';
import { createLinkWrapper } from '../createLinkWrapper';

export default createLinkWrapper(({ id, title, ingress, children }) => (
    <section>
        <a name={id} />
        <h2>{title}</h2>
        <p>{ingress}</p>
        <div>{children}</div>
    </section>
), ({ title, ingress }) => ({ title, ingress }));

