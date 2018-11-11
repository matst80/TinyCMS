import React from 'react';
import { LinkedComponent } from './index';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from 'draft-js-buttons';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

const inlineToolbarPlugin = createInlineToolbarPlugin({
    structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        CodeButton,
        UnorderedListButton,
        OrderedListButton,
        BlockquoteButton,
        CodeBlockButton,
        HeadlineOneButton,
        HeadlineTwoButton,
        HeadlineThreeButton
    ]
});
const { InlineToolbar } = inlineToolbarPlugin;

const plugins = [inlineToolbarPlugin];

export class LinkedText extends LinkedComponent {
    constructor(props) {
        super(props);
        this.state = { editorState: createEditorStateWithText('Loading') };
        this.connect(({ value }) => {
            this.setState({ editorState: createEditorStateWithText(value) });
            return { value };
        })
    }
    onChange = (editorState) => this.setState({ editorState });
    focus = () => this.editor.focus();
    render() {
        const { editorState } = this.state;
        return (
            <div onClick={this.focus}>
                <Editor
                    editorState={editorState}
                    plugins={plugins}
                    ref={(element) => { this.editor = element; }}
                    onChange={this.onChange} />
                <InlineToolbar />
            </div>
        );
    }
}
