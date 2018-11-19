import React from 'react';
import { Route } from "react-router-dom";
import { LinkedComponent } from "./LinkedComponent";
import { renderMergedProps } from '../helpers';
import { componentRegistry } from '../connection';

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
            children: children
                .filter(node => node.type === 'page')
                .map(({ url, id, templateId }) => ({ url, id, templateId }))
        }));
    }
    render() {
        const { children = [] } = this.linked;
        return children.map(({ url, id, templateId = 'linkedchild' }) => (
            <PropsRoute key={id} path={url} template={templateId} id={id} />
        ));
    }
}