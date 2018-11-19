import React, { Component } from 'react';
import { createLinkWrapper } from '../createLinkWrapper';

export default createLinkWrapper(
    class LinkedImage extends Component {
        render() {
            const { url, alt } = this.props;
            return (
                <img src={url} alt={alt} />
            );
        }
    },
    ({ url, width, height, alt }) => ({ url, width, height, alt }),
    () => ({}),
    { children: false }
);
