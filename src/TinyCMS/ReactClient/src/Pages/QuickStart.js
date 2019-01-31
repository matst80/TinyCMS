import React from 'react';
import { createLinkWrapper } from "react-cms-link";
import { NavigationHeader } from '../components/NavigationHeader';

export default createLinkWrapper(class QuickStart extends React.Component {
    render() {
        const { name, sections, children } = this.props;
        return (
            <div>
                <NavigationHeader id="cocategories" />
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
            </div>
        );
    }
},
    ({ name, children }) => ({ name, children, sections: (children || []).filter(d => d.type === 'section') }));