import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import '../../../node_modules/react-sortable-tree/style.css';
import { getCurrentLink, setEditComponent } from '../connection';

const shorten = (text, length = 40) => {
    if (!text || !text.length)
        return '';
    var append = text.length > length ? '...' : '';
    return text.substring(0, Math.min(text.length, length)) + append;
}

let currentTree = [];

const convertNode = (node) => {
    const { name, value, text, type, id, expanded } = node;
    return {
        ...node,
        title: shorten(name || value || text || type || id),
        children: (node.children || []).map(convertNode)
    }
}

const handleChange = (data) => {

    return data;
}

const getExpanded = (ids, nodes) => {
    nodes.filter(d => d.expanded).forEach(d => {
        if (d.children)
            getExpanded(ids, d.children);
        ids.push(d.id);
    });
}

const setExpanded = (ids, nodes) => {
    nodes.forEach(d => {
        if (ids.indexOf(d.id) !== -1) {
            d.expanded = true;
        }
        if (d.children)
            setExpanded(ids, d.children);
    })
}

const mergeExpanded = (data, currentData) => {
    var ids = []
    getExpanded(ids, currentData);
    setExpanded(ids, data);
    return data;
}

const listeners = [];

const treeChange = (cb) => {
    if (!listeners.length) {
        getCurrentLink().listenTo('root', (node) => {
            currentTree = node.children.map(convertNode);
            listeners.forEach(d => d(currentTree));
        });
    }
    listeners.push(cb);
    cb(currentTree);

}

export class EditNodeTree extends Component {
    constructor(props) {
        super(props);
        this.state = { treeData: [] };
        treeChange((treeData) => {
            if (this._mounted)
                this.setState({ treeData: mergeExpanded(treeData, this.state.treeData) });
            else {
                this.state = { treeData };
            }
        })
    }
    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    handleMove(moveArgs) {
        const { nextParentNode, node, nextPath, treeData } = moveArgs;

        var selNode = treeData;
        for (var j = 0; j < nextPath.length - 1; j++) {
            var id = nextPath[j];
            selNode = selNode.find(d => d.id == id).children;
        }

        var newIndex = selNode.indexOf(node);
        
        const moveData = {
            parentId: nextParentNode ? nextParentNode.id : "root",
            oldParentId: node.parentId,
            newIndex,
            id: node.id
        };
        
        getCurrentLink().send('>' + JSON.stringify(moveData));
    }
    render() {
        return (
            <div className="container" style={{ height: 900 }}>
                <SortableTree
                    generateNodeProps={({node}) => {
                        return {
                            buttons: [
                                <button onClick={() => {
                                    setEditComponent(null, node.id);
                                }}>Edit</button>
                            ]
                        }
                    }}
                    getNodeKey={({ node }) => { return node.id }}
                    treeData={this.state.treeData}
                    onMoveNode={this.handleMove}
                    onChange={treeData => { this.setState(handleChange({ treeData })); }}
                />
            </div>
        );
    }
}


