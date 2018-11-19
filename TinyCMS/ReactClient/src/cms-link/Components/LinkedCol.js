import React, { Component } from 'react';
import { createLinkWrapper } from "../createLinkWrapper";

export default createLinkWrapper(class ColBase extends Component {
    render() {
        const { children = [], className } = this.props;
        return (
            <div className={className}>
                {children}
            </div>);
    }
}, ({ className }) => ({ className }));
