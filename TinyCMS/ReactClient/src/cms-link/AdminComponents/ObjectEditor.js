import React from 'react';
import PropertyEditor from './PropertyEditor';
import NodeSelector from './NodeSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setEditorLink, onAuthenticationChanged } from '../connection';

export const isReactNode = (dom) => {
    for (var key in dom) {
        if (key.startsWith("__reactInternalInstance$")) {
            var compInternals = dom[key];
            var owner = compInternals._debugOwner;
            if (owner.memoizedProps && owner.memoizedProps.id) {
                return { node: owner.child.stateNode, owner, id: owner.memoizedProps.id };
            }
        }
    }
    return false;
}

export const findReactNode = (node) => {
    if (!node)
        return null;
    const instance = isReactNode(node);
    if (instance)
        return { node, ...instance };
    else {
        if (node.tagName !== 'BODY')
            return findReactNode(node.parentNode);
    }
    return null;
}

export default class ObjectEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };

        var lastHoverTarget = false;
        var lastTarget = false;

        onAuthenticationChanged((state) => {
            this.isEditor = state.valid;
            if (this._mounted)
                this.forceUpdate();
        })
        

        const fixButtons = (target) => {
            const div = document.createElement('div');
            div.innerHTML = '<span>Edit</span>';
            document.body.appendChild(div);
            target._editorNode = div;
            div.className = 'editor-button-overlay';
            var pos = target.node.getBoundingClientRect();
            var scrollPos = window.scrollY;
            var topAdd = (pos.top > 90) ? 30 : 0;
            div.style.top = pos.top - topAdd + scrollPos + 'px';
            div.style.left = pos.left + 'px';
            target.node.classList.add('editor-outline');
            setTimeout(() => {
                div.classList.add('show');
            }, 50);
            div.addEventListener('click', () => {
                this.changeTarget(target.node, target.id);
            });
            if (lastTarget && lastTarget._editorNode) {
                lastTarget.node.classList.remove('editor-outline');
                document.body.removeChild(lastTarget._editorNode);
            }
            lastTarget = target;
        }

        window.document.addEventListener('mouseover', (e) => {
            if (!this.isEditor)
                return;
            if (e.target !== lastHoverTarget) {
                lastHoverTarget = e.target;
                const currentTarget = findReactNode(e.target);
                if (currentTarget && lastTarget.node !== currentTarget.node) {
                    fixButtons(currentTarget);
                    //console.log(currentTarget);
                }
            }
        });

        setEditorLink(this.changeTarget);
    }
    changeTarget = (element, id) => {
        //console.log('update element');
        this.linkedId = id;
        if (this.editor)
            this.editor.changeNode(id);
        if (this._mounted) {
            this.setState({ isOpen: true });
            this.forceUpdate();
        }
    }
    createNewChild = () => {
        this.nodeSelector.open((type) => {
            this.editor.createNew(type);
        });
    }
    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    render() {
        const nodeId = this.linkedId;
        const { isOpen } = this.state;
        if (!this.isEditor)
            return null;
        if (!nodeId || !isOpen)
            return null;
        return (<div className="popupeditor">
            <span
                className="close-editor"
                onClick={() => {
                    this.setState({ isOpen: false });
                }}>
                <FontAwesomeIcon icon="times" />
            </span>
            <PropertyEditor ref={elm => { this.editor = elm }} match={{ params: { nodeId } }} />
            {/* <button type="button" className="btn btn-secondary" onClick={this.createNewSibling}>New sibling</button> */}
            <div className="card">
                <button type="button" className="btn btn-secondary" onClick={this.createNewChild}>New child</button>
            </div>
            <NodeSelector ref={elm => { this.nodeSelector = elm }} />
        </div>);
    }
}