import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { DropContainer } from '../cms-link/Components/LinkedCol';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { getCurrentLink } from 'cmslink';

const toDate = (ts) => new Date(ts * 1000).toDateString();

const iconStyle = { width: 20, height: 16 };

class BlogPostBase extends React.Component {
    add = (type = 'text') => {
        const { id } = this.props;
        const addString = '+' + JSON.stringify({ parentId: id, type });
        getCurrentLink().send(addString);
    }
    getEditorMenu = (defaultButton) => {
        return [
            defaultButton,
            (<span key="blogtools" className="tc-toolgroup">
                <span onClick={() => this.add('image')}>
                    <svg style={iconStyle} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.822-7.178 16-16 16H48c-8.822 0-16-7.178-16-16V112c0-8.822 7.178-16 16-16h416c8.822 0 16 7.178 16 16v288zM112 232c30.928 0 56-25.072 56-56s-25.072-56-56-56-56 25.072-56 56 25.072 56 56 56zm0-80c13.234 0 24 10.766 24 24s-10.766 24-24 24-24-10.766-24-24 10.766-24 24-24zm207.029 23.029L224 270.059l-31.029-31.029c-9.373-9.373-24.569-9.373-33.941 0l-88 88A23.998 23.998 0 0 0 64 344v28c0 6.627 5.373 12 12 12h360c6.627 0 12-5.373 12-12v-92c0-6.365-2.529-12.47-7.029-16.971l-88-88c-9.373-9.372-24.569-9.372-33.942 0zM416 352H96v-4.686l80-80 48 48 112-112 80 80V352z" /></svg>
                </span>
                <span onClick={() => this.add('text')}>
                    <svg style={iconStyle} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 416h-26.7L275.5 42.7c-2.2-6.4-8.3-10.7-15.1-10.7h-72.8c-6.8 0-12.9 4.3-15.1 10.7L42.7 416H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h136c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-24l26.6-80.8h138.2l26.6 80.8H296c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h136c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM174.4 268.3l42-124.1c4.3-15.2 6.6-28.2 7.6-34.6.8 6.5 2.9 19.5 7.7 34.7l41.3 124z" /></svg>
                </span>
                <span onClick={() => this.add('code')}>
                    <svg style={iconStyle} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M208 32h-88a56 56 0 0 0-56 56v77.49a40 40 0 0 1-11.72 28.29L7 239a24 24 0 0 0 0 34l45.24 45.24A40 40 0 0 1 64 346.52V424a56 56 0 0 0 56 56h88a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-88a8 8 0 0 1-8-8v-77.48a88.06 88.06 0 0 0-25.78-62.24L57.93 256l28.29-28.28A88.06 88.06 0 0 0 112 165.48V88a8 8 0 0 1 8-8h88a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zm361 207l-45.25-45.24A40.07 40.07 0 0 1 512 165.48V88a56 56 0 0 0-56-56h-88a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h88a8 8 0 0 1 8 8v77.48a88 88 0 0 0 25.78 62.24L518.06 256l-28.28 28.28A88 88 0 0 0 464 346.52V424a8 8 0 0 1-8 8h-88a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h88a56 56 0 0 0 56-56v-77.49a40 40 0 0 1 11.72-28.29L569 273a24 24 0 0 0 0-34z" /></svg>
                </span>
            </span>)
        ];
    }
    render() {
        const { id, title, created, children } = this.props;
        return (
            <div>
                <h2><Link to={`/blog/${id}`}>{title}</Link></h2>
                <span>{created}</span>
                <DropContainer targetId={id}>
                    {children}
                </DropContainer>
            </div>
        );
    }
}

const selector =
    ({ id, title, created, edited, tags }) =>
        ({ id, title, created: toDate(created), edited, tags });

export default createLinkWrapper(BlogPostBase, selector);
