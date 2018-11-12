import React from 'react';
import { LinkedComponent } from './LinkedComponent';
// import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
// import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
// import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

// const inlineToolbarPlugin = createInlineToolbarPlugin();
// const { InlineToolbar } = inlineToolbarPlugin;

//const plugins = [inlineToolbarPlugin];

export class LinkedText extends LinkedComponent {
    constructor(props) {
        super(props);
        //this.state = { editorState: createEditorStateWithText('Loading') };
        this.connect(({ value }) => {
            // if (this._mounted)
            //     this.setState({ editorState: createEditorStateWithText(value) });
            // else
            //     this.state = { editorState: createEditorStateWithText(value) };
            // console.log(value);
            return { value };
        })
    }
    onChange = (editorState) => this.setState({ editorState });
    focus = () => this.editor.focus();
    render() {
        //const { editorState } = this.state;
        const { value } = this.linked;
        console.log(value);
        return (<span>{value}</span>);
            // <div onClick={this.focus}>
            //     <Editor
            //         editorState={editorState}
            //         plugins={plugins}
            //         ref={(element) => { this.editor = element; }}
            //         onChange={this.onChange} />
            //     <InlineToolbar />
            // </div>
        
    }
}
