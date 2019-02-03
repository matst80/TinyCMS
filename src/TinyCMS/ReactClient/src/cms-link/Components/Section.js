import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { DropContainer } from './LinkedCol';

export default createLinkWrapper(({ id, title, ingress, children }) => (
    <section>
        <a name={id} />
        <h2>{title}</h2>
        <p>{ingress}</p>
        <DropContainer targetId={id}>
            {children}
        </DropContainer>
    </section>
), ({ title, ingress }) => ({ title, ingress }));

