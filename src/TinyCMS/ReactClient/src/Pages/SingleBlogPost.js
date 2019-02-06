import React from 'react';
import { createLinkWrapper, withLinkSelector, routeSelector } from 'react-cms-link';
import BlogPost from '../components/BlogPost';

const routeMatch = routeSelector();

export default withLinkSelector(createLinkWrapper(class SingleBlogPostBase extends React.Component {
    render() {
        const { id } = this.props;
        return (
            <div>
                <div className="container">
                    <BlogPost key={id} id={id} showAll />
                </div>
            </div>
        );
    }
},
    ({ id }) => ({ id }), null, { children: false }), routeMatch);
