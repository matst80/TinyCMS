import React from 'react';
//import { Link } from "react-router-dom";
import { LinkedComponent } from '../Components/LinkedComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const generateNodes = (children) => (children.map(node => (
    <TreeNode key={node.id} id={node.id} type={node.type} />
)));

const shorten = (text, length = 40) => {
    if (!text || !text.length)
        return '';
    var append = text.length > length ? '...' : '';
    return text.substring(0, Math.min(text.length, length)) + append;
}

export class TreeNode extends LinkedComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: !!props.isOpen };
        this.connect(({ name, value, text, children }) => {
            return { name, value, text, children };
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
        const { name, value, text, children = [] } = this.linked;
        const nodeName = shorten(name || value || text || type || id);
        const nodes = isOpen
            ? (<ul>
                {generateNodes(children)}
            </ul>)
            : (<span></span>);
        return (
            <li>
                <div className="tree-node" onClick={this.toggleOpen}>
                    <span className="treeicon"><FontAwesomeIcon color="#ccc" icon={children.length ? 'plus-square' : 'square'} /></span>
                    {/* <Link to={'/edit/' + id}>{nodeName}</Link> */}
                    <div className="treeData">
                        <span>{nodeName}</span>
                    </div>
                </div>
                {nodes}
            </li>);
    }
}

export class EditNodeTree extends LinkedComponent {
    render() {
        return (
            <ul className="clt">
                <TreeNode id={this.linkedId} isOpen />
            </ul>
        );
    }
}
