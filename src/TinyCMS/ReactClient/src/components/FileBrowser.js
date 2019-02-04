/* eslint-disable no-debugger */
/* eslint-disable react/no-multi-comp */
import React from 'react';

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
        const { path } = this.props;

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

export default class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
        const path = props.dir || '/files/';
        this.state = { path, directories: [], files: [] };
        this.fetchPath(path);
    }
    fetchPath = (path) => {
        fetch(path).then(data => data.json()).then(data => {
            console.log('setpath:', path);
            this.setState({ ...data, path });
        });
    }
    render() {
        const { directories, files } = this.state;
        const { path } = this.state;
        var dirs = directories.map(({ name }) => {
            return (<div key={name} onClick={() => { this.fetchPath(path + name + '/') }}>{name}</div>);
        });
        var items = files.map(({ name }) => {
            return (<div key={name}><a href={path + name}>{name}</a></div>);
        });
        return (
            <div>
                {dirs}
                {items}
                <FileUploader path={path} />
            </div>
        );
    }
}