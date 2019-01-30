import React from 'react';
import { componentRegistry, CMSLink, createLinkWrapper } from 'react-cms-link';
import { ObjectEditor } from '../src/ObjectEditor';

export const Simple = createLinkWrapper(class SimpleBase extends React.Component {
    render() {
        const { name, id, children } = this.props;
        return (
            <div>
                <h2>{name || id}</h2>
                {children}
            </div>
        );
    }
}, ({ name, id }) => ({ name, id }));

const App = () => (
    <Router>
        <CMSLink url={'ws://localhost:5000/ws'}>
            <Simple id="root" />
            <ObjectEditor />
        </CMSLink>
    </Router >
);

export default App;