/* eslint-disable react/display-name */
/* eslint-disable no-debugger */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import moment from 'moment';
import { withLinkSelector } from 'react-cms-link';
import Transition from 'react-transition-group/Transition';

const duration = 500;

const transitionStyles = {
    entering: { opacity: 0},
    entered: { opacity: 1},
};

const CloseDialogIcon = ({size=40})=> (
    <svg style={{width:size, height:size}} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path></svg>
);

export class ModalDialog extends React.Component {
    componentDidUpdate(prevProps) {
        const { isOpen } = this.props;
        const body = document.getElementsByTagName('body')[0];
        if (prevProps.isOpen !== isOpen) {
            if (isOpen)
                body.classList.add('tc-noscroll');
            else 
                body.classList.remove('tc-noscroll');
        }
    }
    render() {
        const { isOpen, children, onClose } = this.props;
        return (
        <Transition
            unmountOnExit
            in={isOpen}
            timeout={duration}
        >
            {(state) => (
                <div className="tc-modaldialog" style={{
                    ...transitionStyles[state]
                }}>
                    <div className="tc-dialog-close" onClick={onClose}>
                        <CloseDialogIcon />
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            )}
            </Transition>
        );
    }
}

class FileUploader extends React.Component {
    componentDidMount() {
        var handleUpload = this.handleUpload.bind(this);
        this.fileUpload.addEventListener('change', function (e) {
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                handleUpload(e, file);
            }
        }, false);
    }
    handleUpload(e, file) {
        const { path, onChange } = this.props;

        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
            xhr.upload.onprogress = function (e) {
                var done = e.position || e.loaded, total = e.totalSize || e.total;
                console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
            };
        }
        xhr.onreadystatechange = function (e) {
            if (4 == this.readyState) {
                console.log('xhr upload complete');
                onChange && onChange(file);
            }
        };
        xhr.open('post', path + file.name, true);

        var formData = new FormData();
        formData.append("file", file, file.name);
        xhr.send(formData);

    }
    render() {
        const { path } = this.props;
        return (
            <div data-path={path}>
                <input type="file" multiple ref={(el) => this.fileUpload = el} />
            </div>
        );
    }
}

// const createDialog = (DialogContents, options) => {
//     const dialog = (<ModalDialog contents={DialogContents} />)
//     return () => {

//     };
// }

const FolderIcon = () => (<svg style={{ width: 16, height: 16 }} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 128H272l-54.63-54.63c-6-6-14.14-9.37-22.63-9.37H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm0 272H48V112h140.12l54.63 54.63c6 6 14.14 9.37 22.63 9.37H464v224z" /></svg>)

const fileWithLink = (path, handleAction) => ({ name, size, created, modified }) => {
    const link = handleAction ? (<a onClick={() => handleAction(path + name)}>{name}</a>) : (<a href={path + name}>{name}</a>);
    return (
        <tr key={name}>
            <td>&nbsp;</td>
            <td>{link}</td>
            <td>{size} kb</td>
            <td>{moment(created * 1000).fromNow()}</td>
            <td>{moment(modified * 1000).fromNow()}</td>
        </tr>
    );
}


export class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
        const path = props.dir || 'files/';
        this.state = { path, directories: [], files: [] };
        this.fetchPath(path);
    }
    refresh = () => {
        this.fetchPath(this.state.path);
    }
    fetchPath = (path) => {
        console.log('load path', path);
        fetch(path).then(data => data.json()).then(data => {
            console.log('setpath:', path);
            this.setState({ ...data, path });
        });
    }
    createDir = () => {
        const path = this.state.path + this.dirName.value + '/';
        fetch(path, { method: 'POST' }).then(res => res.json()).then(data => {
            this.setState({ ...data, path });
        })
    }
    render() {
        const { directories, files } = this.state;
        const { path } = this.state;
        const { onSelect } = this.props;
        const pathParts = path.split('/');
        var base = '';
        var crumbs = pathParts.map((p, i) => {
            if (p && p.length) {
                base += p + '/';
                const curr = base;
                return (<a key={i} onClick={() => this.fetchPath(curr)}>{p}</a>);
            }
            return null;
        });

        const itemRender = fileWithLink(path, onSelect);

        var dirs = directories.map(({ name }) => {
            return (
                <tr key={name}>
                    <td><FolderIcon /></td>
                    <td onClick={() => { this.fetchPath(path + name + '/') }}>{name}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            );
            //return (<div className="tc-dir" key={name} onClick={() => { this.fetchPath(path + name + '/') }}><FolderIcon />{name}</div>);
        });
        var items = files.map(itemRender);
        return (
            <div className="tc-filebrowser">
                <div className="tc-crumbs">{crumbs}</div>
                <table>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Created</th>
                            <th>Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dirs}
                        {items}
                    </tbody>
                </table>
                <input ref={(el) => { this.dirName = el }} /> <span onClick={this.createDir}>Create dir</span>
                <FileUploader path={path} onChange={this.refresh} />
            </div>
        );
    }
}