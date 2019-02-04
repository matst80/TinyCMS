import React, { Component } from 'react';
import { createLinkWrapper } from "react-cms-link";
import { DropContainer } from './LinkedCol';

export default createLinkWrapper(class LinkedRow extends Component {
    render() {
        const { children = [], id } = this.props;
        return (
            <DropContainer targetId={id} className="row">
                {children}
            </DropContainer>
        );
    }
}, ({ id }) => ({ id }));
