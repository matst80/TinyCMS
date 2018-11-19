import React from 'react';
import { Link } from "react-router-dom";
import { LinkedComponent } from '../Components/LinkedComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                <ul>
                    {generateNodes(children)}
                </ul>)
            : (children.length
                ? <span>({children.length})</span>
                : <span></span>);
        return (
            <li>
                <span className="treeicon" onClick={this.toggleOpen}><FontAwesomeIcon color="#283248" icon={children.length ? 'plus-square' : 'square'} /></span><Link to={'/edit/' + id}>{nodeName}</Link>
                {nodes}
            </li>);
    }
}

export class EditNodeTree extends LinkedComponent {
    render() {
        const { children = [] } = this.linked;
        return (
            <ul className="clt">
                {generateNodes(children)}
            </ul>
        );
    }
}
