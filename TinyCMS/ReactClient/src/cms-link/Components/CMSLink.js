
import React from 'react';
import { createLink } from '../connection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class CMSLink extends React.Component {
    constructor(props) {
        super(props);
        this.connectionText = 'Connecting...';
        createLink({ url: props.url }, (data) => {
            this.currentStatus = data;
            this.updateText(data);
            if (this._mounted)
                this.forceUpdate();
        });
    }
    updateText = (data) => {
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
    renderConnectionStatus = () => {
        const { connected, reconnecting, connecting } = this.currentStatus;
        const icon = connected ? 'wifi' : 'spinner';
        const spinning = reconnecting || connecting;
        return (<div key="cmslink-status" className="connection-status"><span className="status-icon"><FontAwesomeIcon icon={icon} spin={spinning} /></span><span>{this.connectionText}</span></div>);
    }
    render() {
        return [...this.props.children, this.renderConnectionStatus()];
    }
}
