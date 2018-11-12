
import React from 'react';
import { createLink } from '../connection';

export class CMSLink extends React.Component {
    constructor(props) {
        super(props);
        createLink({ url: props.url });
    }
    render() {
        return this.props.children;
    }
}
