/* eslint-disable no-debugger */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { withLinkSelector } from 'react-cms-link';

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

const fileWithLink = ({ name }) => {
    return (<div className="tc-file" key={name}><a href={path + name}>{name}</a></div>);
}

const fileWithAction = ({ name, handleAction }) => {
    return (<div className="tc-file" key={name}><a onClick={handleAction}>{name}</a></div>);
}

export default class FileBrowser extends React.Component {
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
        const path = this.state.path + this.dirName.value;
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
        var dirs = directories.map(({ name }) => {
            return (<div className="tc-dir" key={name} onClick={() => { this.fetchPath(path + name + '/') }}>{name}</div>);
        });
        var items = files.map(fileWithLink);
        return (
            <div className="tc-filebrowser">
                <div className="tc-crumbs">{crumbs}</div>
                {dirs}
                {items}
                <input ref={(el) => { this.dirName = el }} /> <span onClick={this.createDir}>Create dir</span>
                <FileUploader path={path} onChange={this.refresh} />
            </div>
        );
    }
}