import React from 'react';
import { createLinkWrapper } from "react-cms-link";

export const Contract = createLinkWrapper(class ContractBase extends React.Component {
    render() {
        const { contractName, children } = this.props;
        return (
            <div>
                <h2>{contractName}</h2>
                {children}
            </div>
        );
    }
}, ({ contractName }) => ({ contractName }));

export const ContractSite = createLinkWrapper(class ContractSiteBase extends React.Component {
    render() {
        const { name, children, code } = this.props;
        return (
            <div>
                <h2>{name}</h2>
                <span>{code}</span>
                {children}
            </div>
        );
    }
}, ({ name, code }) => ({ name, code }));