import React from 'react';
import { Route } from "react-router-dom";
import { LinkedComponent, componentRegistry } from 'react-cms-link';
import { renderMergedProps } from '../helpers';

export const PropsRoute = ({ template, ...rest }) => {
    return (
        <Route {...rest} render={routeProps => {
            return renderMergedProps(componentRegistry.getValue(template), routeProps, rest);
        }} />
    );
}

export default class LinkedRoutes extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children = {} }) => ({
            links: children
                .filter(node => node.type === 'page' && !!node.url)
                .map(({ url, id, templateId }) => ({ url, id, templateId }))
        }));
    }
    render() {
        const { links = [] } = this.linked;
        return links.map(({ url, id, templateId = 'linkedchild' }) => (
            <PropsRoute key={id} path={url} template={templateId} id={id} />
        ));
    }
}