import React from 'react';
import { Link } from "react-router-dom";
import { LinkedComponent } from 'react-cms-link';

export default class RouteLinks extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children }) => ({
            pages: children.filter(node => node.type === 'page' && !!node.url)
        }));
    }
    render() {
        const { pages = [] } = this.linked;
        return pages.map(({ name, url, id }) => (
            <Link className="nav-item nav-link" key={id} to={url}>{name}</Link>
        ));
    }
}
