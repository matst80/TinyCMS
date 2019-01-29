import React from 'react';
import { Link } from "react-router-dom";
import { createLinkWrapper } from 'react-cms-link';

const hasUrl = (node) => Boolean(node.url);

export default createLinkWrapper(class RouteLink extends React.Component {
    render() {
        const { children = [] } = this.props;
        return children.filter(hasUrl).map(({ name, url, id }) => (
            <Link className="nav-item nav-link" key={id} to={url}>{name}</Link>
        ));
    }
},
    ({ children }) => ({ children }), null, { children: false });
