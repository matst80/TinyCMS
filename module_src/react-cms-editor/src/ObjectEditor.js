import React from 'react';
import PropertyEditor from './PropertyEditor';
import NodeSelector from './NodeSelector';
import { setEditorLink } from 'react-cms-link';
import { onAuthenticationChanged } from 'cmslink';


const closeIcon = (<svg aria-hidden="true" style={{ width: 20, height: 20 }} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>);

const isReactNode = (dom) => {
    for (var key in dom) {
        if (key.startsWith("__reactInternalInstance$")) {
            var compInternals = dom[key];
            var owner = compInternals._debugOwner;
            if (owner && owner.memoizedProps && owner.memoizedProps.id) {
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

const isExcluded = (data) => {

    if (data.owner &&
        data.owner.stateNode &&
        data.owner.stateNode.state &&
        data.owner.stateNode.state.noEditor)
        return true;

    return false;
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
            div.innerHTML = '<span><svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:20px;height:16px"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg></span>';
            document.body.appendChild(div);
            target._editorNode = div;
            div.className = 'editor-button-overlay';
            var pos = target.node.getBoundingClientRect();
            var scrollPos = window.scrollY;
            var topAdd = (pos.top > 30) ? 30 : 0;
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

                if (currentTarget && lastTarget.node !== currentTarget.node && !isExcluded(currentTarget)) {
                    fixButtons(currentTarget);
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
                {closeIcon}
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
console.log('after loaded objecteditor');