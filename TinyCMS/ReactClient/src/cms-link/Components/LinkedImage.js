import React, { Component } from 'react';
import { createLinkWrapper } from '../createLinkWrapper';


export const LinkedImage = createLinkWrapper(
    class extends Component {
        render() {
            const { url, alt } = this.props;
            return (
                <img src={url} alt={alt} />
            );
        }
    },
    ({ url, width, height, alt }) => ({ url, width, height, alt }),
    { children: false }
);
