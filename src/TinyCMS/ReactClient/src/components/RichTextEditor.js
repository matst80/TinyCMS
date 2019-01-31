import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, ContentState, convertFromHTML, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { createLinkWrapper } from "react-cms-link";

export default createLinkWrapper(class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.onChange = (editorState) => {
      const content = editorState.getCurrentContent();
      var html = stateToHTML(content);
      console.log(html);
      //this.props.store(html);
      this.setState({ editorState });
    }

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value != prevProps.value) {
      const blocks = convertFromHTML(value);
      console.log('blocks', blocks);
      const newContentsState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
      this.setState({ editorState: EditorState.createWithContent(newContentsState) });
    }
  }
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
      />
    );
  }
}, ({ value }) => ({ value }));