import React, { Component } from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { withDragHandle } from './LinkedCol';

export default createLinkWrapper(withDragHandle(
    class LinkedImage extends Component {
        componentDidMount() {
            this.img.addEventListener('load', () => {
                this.img.classList.add('fade-enter-active');
            }, false);
        }
        handleBrowse = () => {
            console.log('select image');
        }

        getEditorMenu = (defaultButton) => {
            return [
                defaultButton,
                (
                    <span onClick={this.handleBrowse}><svg style={{ width: 20, height: 16 }} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm16 336c0 8.822-7.178 16-16 16H48c-8.822 0-16-7.178-16-16V112c0-8.822 7.178-16 16-16h416c8.822 0 16 7.178 16 16v288zM112 232c30.928 0 56-25.072 56-56s-25.072-56-56-56-56 25.072-56 56 25.072 56 56 56zm0-80c13.234 0 24 10.766 24 24s-10.766 24-24 24-24-10.766-24-24 10.766-24 24-24zm207.029 23.029L224 270.059l-31.029-31.029c-9.373-9.373-24.569-9.373-33.941 0l-88 88A23.998 23.998 0 0 0 64 344v28c0 6.627 5.373 12 12 12h360c6.627 0 12-5.373 12-12v-92c0-6.365-2.529-12.47-7.029-16.971l-88-88c-9.373-9.372-24.569-9.372-33.942 0zM416 352H96v-4.686l80-80 48 48 112-112 80 80V352z" /></svg></span>
                )
            ];
        }

        render() {
            const { url, alt } = this.props;
            return (
                <img src={url} alt={alt} ref={(el) => this.img = el} className="fade-enter" />
            );
        }
    }),
    ({ url, width, height, alt }) => ({ url, width, height, alt }),
    () => ({}),
    { children: false }
);
