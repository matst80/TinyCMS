
import React from 'react';
import { createLink } from 'cmslink';

const wifiIcon = (<svg style={{ width: 20, height: 20 }} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"></path></svg>);
const spinnerIcon = (<svg style={{ width: 20, height: 20 }} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>);

export default class CMSLink extends React.Component {
    constructor(props) {
        super(props);
        this.connectionText = 'Connecting...';
        this.updateText = this.updateText.bind(this);
        createLink({ url: props.url }, (data) => {
            this.currentStatus = data;
            this.updateText(data);
            if (this._mounted)
                this.forceUpdate();
        });
    }
    updateText(data) {
        var text = 'Connecting...';
        if (data.connected) {
            text = 'Connected!';
            if (data.data) {
                text += ' got data';
            }
        }
        else {
            text = 'Disconnected!';
        }
        if (data.reconnecting)
            text = 'Reconnecting...';
        this.connectionText = text;
    }
    componentDidMount() {
        this._mounted = true;
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    render() {
        const { connected, reconnecting, connecting } = this.currentStatus;
        const icon = connected ? wifiIcon : spinnerIcon;
        const spinning = reconnecting || connecting;
        return [...this.props.children, (<div key="cmslink-status" className="connection-status">
            <span className={"status-icon" + (spinning ? ' spinning' : '')}>{icon}</span>
            <span>{this.connectionText}</span>
        </div>)];
    }
}
