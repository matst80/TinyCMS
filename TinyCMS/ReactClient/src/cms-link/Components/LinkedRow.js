import React, { Component } from 'react';
import { createLinkWrapper } from "../createLinkWrapper";

export const LinkedRow = createLinkWrapper(class extends Component {
    render() {
        const { children = [] } = this.props;
        return (
            <div className="row">
                {children}
            </div>);
    }
});
