import React from 'react';
import { Link } from "react-router-dom";
import { LinkedComponent } from "./LinkedComponent";

export class RouteLinks extends LinkedComponent {
    constructor(props) {
        super(props);
        this.connect(({ children }) => ({
            children: children.filter(node => node.type === 'page')
        }));
    }
    render() {
        const { children = [] } = this.linked;
        return children.map(({ name, url, id }) => (<Link className="nav-item nav-link" key={id} to={url}>{name}</Link>))
    }
}
