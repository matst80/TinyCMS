import React from 'react';
import { createLinkWrapper } from "../cms-link/createLinkWrapper";

export default createLinkWrapper(class QuickStart extends React.Component {
    render() {
        const { name, sections } = this.props;
        return (
            <div className="container">
                <h1>{name}</h1>
                <ul className="sectionLinks">
                    {(sections || []).map(({ id, title }) => (
                        <li><a key={id} href={`#${id}`}>{title}</a></li>
                    ))}
                </ul>
                {this.props.children}
            </div>
        );
    }
},
    ({ name, children = [] }) => ({ name, sections: children.filter(d => d.type === 'section') }));