import React, { Component } from 'react';
import { createLinkWrapper } from "react-cms-link";

export default createLinkWrapper(class LinkedRow extends Component {
    render() {
        const { children = [] } = this.props;
        return (
            <div className="row">
                {children}
            </div>);
    }
});
