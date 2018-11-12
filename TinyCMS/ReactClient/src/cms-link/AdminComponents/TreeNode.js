import React from 'react';
import { Link } from "react-router-dom";
import { LinkedComponent } from '../Components/LinkedComponent';

const generateNodes = (children) => (children.map(node => (
    <TreeNode key={node.id} id={node.id} type={node.type} />
)));

export class TreeNode extends LinkedComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.connect(({ name, children }) => {
            return { name, children };
        })
    }
    toggleOpen = () => {
        this.setState(s => {
            return { isOpen: !s.isOpen }
        });
    }
    render() {
        const { id, type } = this.props;
        const { isOpen } = this.state;
        const { name, children = [] } = this.linked;
        const nodeName = name || type || id;
        const nodes = isOpen
            ? (
                <ul className="list-group">
                    {generateNodes(children)}
                </ul>)
            : (children.length
                ? <span className="badge badge-primary badge-pill" onClick={this.toggleOpen}>{children.length}</span>
                : <span></span>);
        return (
            <li className="list-group-item">
                <Link to={'/edit/' + id}>{nodeName}</Link>
                {nodes}
            </li>);
    }
}

export class EditNodeTree extends LinkedComponent {
    render() {
        const { children = [] } = this.linked;
        return (
            <ul className="list-group">
                {generateNodes(children)}
            </ul>
        );
    }
}
