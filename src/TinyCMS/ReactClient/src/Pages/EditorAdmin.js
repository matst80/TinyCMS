import React from 'react';
import { setEditComponent, componentRegistry, createLinkWrapper } from 'react-cms-link';
import './Editor.css';

const CMSLogo = ({ size = 48 }) => (<svg style={{ width: size, height: size }} aria-hidden="true" data-prefix="fal" data-icon="cubes" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M388 219V107.9c0-15-9.3-28.4-23.4-33.7l-96-36c-8.1-3.1-17.1-3.1-25.3 0l-96 36c-14.1 5.3-23.4 18.7-23.4 33.7V219L23.4 256.7C9.3 262 0 275.4 0 290.4v101.3c0 13.6 7.7 26.1 19.9 32.2l96 48c10.1 5.1 22.1 5.1 32.2 0L256 418l107.9 54c10.1 5.1 22.1 5.1 32.2 0l96-48c12.2-6.1 19.9-18.6 19.9-32.2V290.4c0-15-9.3-28.4-23.4-33.7L388 219zm-123.8 38.4V159l107.2-46.5v106.7L317 239.6l-52.8 17.8zm-123.7-163L256 51l115.5 43.3v.2l-115.5 50-115.5-50v-.1zM247.8 159v98.4L195 239.6l-54.5-20.4V112.5L247.8 159zm-124 298.4L16.5 403.8V295.1l107.2 46.5v115.8zm123.7-53.6l-107.2 53.6V341.6l107.2-46.5v108.7zm0-126.7l-115.5 50-115.5-50v-.2L131 234l107.6 39.6 8.9 3.3v.2zm124.3 180.3l-107.2-53.6V295.1l107.2 46.5v115.8zm123.7-53.6l-107.2 53.6V341.6l107.2-46.5v108.7zm0-126.7l-115.5 50L264.5 277v-.2l8.9-3.3L381 234l114.5 42.9v.2z"></path></svg>);
const ExpandIcon = ({ size = 20 }) => (<svg style={{ width: size, height: size }} aria-hidden="true" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>);
const MinusIcon = ({ size = 20 }) => (<svg style={{ width: size, height: size }} aria-hidden="true" data-prefix="fas" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>)
const CircleIcon = ({ size = 20 }) => (<svg style={{ width: size, height: size }} aria-hidden="true" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"></path></svg>)

export const TreeNode = createLinkWrapper(class TreeNodeBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen || false,
            noEditor: true
        };
    }
    generatePreview = () => {
        const { id, type } = this.props;
        if (componentRegistry.hasComponent({ type })) {
            this.preview = componentRegistry.getComponent(type, { key: id, id: id });
            this.forceUpdate();
        }
        else {
            console.log('no preview component found', type);
        }
    }
    toggleOpen = () => {
        //this.setOpen(!this.state.isOpen);
        this.setState({ isOpen: !this.state.isOpen });
    }
    componentDidMount() {
        const { id, parentId } = this.props;

        this.item.addEventListener('dragstart', (e) => {
            var startData = {
                oldParentId: parentId,
                id
            };
            e.dataTransfer.setData("text", JSON.stringify(startData));
            e.stopPropagation();
        });
        this.item.addEventListener('dragenter', (e) => {
            this.item.style.backgroundColor = 'yellow';
            this.enterTime = Date.now();
            e.preventDefault();
        });
        this.item.addEventListener('dragleave', (e) => {
            this.item.style.backgroundColor = null;
            e.preventDefault();
        });
        this.item.addEventListener('dragover', (e) => {
            if (this.enterTime && this.enterTime < (Date.now() - 500)) {
                this.setState({ isOpen: true });
            }
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
        });

        this.list.addEventListener('dragleave', (e) => {
            this.list.style.backgroundColor = null;
            e.preventDefault();
        });
        this.list.addEventListener('dragover', (e) => {
            this.list.style.backgroundColor = 'orange';
            e.preventDefault();
            e.stopPropagation();
        });
        this.list.addEventListener('drop', (e) => {
            var data = e.dataTransfer.getData("text");
            console.log('new parent', id, data);
            this.list.style.backgroundColor = null;
            this.item.style.backgroundColor = null;
            e.preventDefault();
            e.stopPropagation();
        });
    }
    openEditor = () => {
        const { id } = this.props;
        setEditComponent(null, id);
    }
    render() {
        const { name, id, nodes = [] } = this.props;
        const hasNodes = !!nodes.length;
        const { isOpen } = this.state;

        const children = isOpen ? nodes.map(({ id }) => {
            return (<TreeNode key={id} id={id} />);
        }) : [];

        return (
            <li>
                <div className="treenode">
                    <span className="treeicon" onClick={this.toggleOpen}>
                        {hasNodes ? (
                            isOpen ? <MinusIcon size={16} /> : <ExpandIcon size={16} />
                        ) : <CircleIcon size={16} />
                        }
                    </span>
                    <span draggable={true} ref={item => this.item = item} onClick={this.openEditor}>
                        {name || id}
                    </span>
                </div>
                <div className="quicklinks"><a onClick={this.generatePreview}>Preview</a> | <a>Delete</a>{this.preview}</div>
                <ul ref={list => this.list = list}>{children}</ul>
            </li>);
    }
}, ({ name, id, type, children, parentId }) => ({ name, id, type, nodes: children || [], parentId }));

export class EditorAdmin extends React.Component {
    render() {
        return (
            <div>
                <div id="editortop">
                    <span className="leftpart">
                        <span className="cmslogo">
                            <CMSLogo size={32} />
                        </span>
                    </span>
                </div>
                <div id="flexeditor">
                    <div id="editorleft">
                        lefta
                    </div>
                    <div id="editorcontent">
                        <ul className="tree"><TreeNode key="root" id="root" isOpen={true} /></ul>
                    </div>
                </div>
            </div>
        );
    }
}

