

import React from 'react';
import { createLinkWrapper } from './createLinkWrapper';
import CMSLink from './Components/CMSLink';
import LinkedComponent from './Components/LinkedComponent';
import {
    renderMergedProps,
    componentRegistry,
    setEditComponent,
    setEditorLink
} from './connection';

const routeSelector = (prp = 'id') => (props) => {
    if (props.match && props.match.params)
        return props.match.params[prp];
};

const withLinkSelector = (WrappedComponent, idSelector = routeSelector(), onLinkChange) => {
    return class WithLinkSelector extends React.Component {
        constructor(props) {
            super(props);
            this.linkId = idSelector(props);
            this.scrollToTop = this.scrollToTop.bind(this);
        }

        componentDidUpdate(prevProps) {
            var currentId = idSelector(this.props);
            var oldId = idSelector(prevProps);
            if (currentId != oldId) {
                this.linkId = currentId;
                this.scrollToTop();
                if (onLinkChange) {
                    onLinkChange(currentId);
                }
                this.forceUpdate();
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }

        render() {
            const props = {
                ...this.props,
                id: this.linkId
            };
            return (
                <WrappedComponent {...props} />
            );
        }
    }
}

const isOfType = (type) => (item) => {
    return item.type == type;
}

const isNotOfType = (type) => (item) => {
    return item.type != type;
}

export {
    isOfType,
    isNotOfType,
    routeSelector,
    withLinkSelector,
    renderMergedProps,
    componentRegistry,
    setEditComponent,
    setEditorLink,
    createLinkWrapper,
    LinkedComponent,
    CMSLink
}
