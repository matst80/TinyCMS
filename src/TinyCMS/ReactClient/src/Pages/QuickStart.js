import React from 'react';
import { createLinkWrapper } from "react-cms-link";

export default createLinkWrapper(class QuickStart extends React.Component {
    render() {
        const { name, sections, children } = this.props;
        return (
            <div className="container">
                <h1>{name}</h1>
                {sections &&
                    (<ul className="sectionLinks">
                        {sections.map(({ id, title }) => (
                            <li key={id}><a href={`#${id}`}>{title}</a></li>
                        ))}
                    </ul>)}
                {children}
            </div>
        );
    }
},
    ({ name, children }) => ({ name, children, sections: (children || []).filter(d => d.type === 'section') }));