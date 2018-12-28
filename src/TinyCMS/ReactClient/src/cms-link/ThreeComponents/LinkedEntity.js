import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { Entity } from 'aframe-react';

const LinkedEntity = (props) => (
    <Entity {...props}>
        {props.children}
    </Entity>
);

export default createLinkWrapper(LinkedEntity, ({ primitive, text, radius, position, width, height, rotation, color }) => ({ primitive, text, radius, position, width, height, rotation, color }));
