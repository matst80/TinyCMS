
import React, { Component } from 'react';
import { createLink } from '../connection';

export class CMSLink extends Component {
    constructor(props) {
        super(props);
        createLink({ url: props.url });
    }
    render() {
        return this.props.children;
    }
}
