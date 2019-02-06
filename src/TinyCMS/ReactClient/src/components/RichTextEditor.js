/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, ContentState, convertFromHTML, RichUtils, getDefaultKeyBinding, convertToRaw, AtomicBlockUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { createLinkWrapper } from "react-cms-link";
import Transition from 'react-transition-group/Transition';
import { withDragHandle } from '../cms-link/Components/LinkedCol';

const CodeBlock = (props) => {
  console.log(props);

  //const { src } = entity.getData();
  return (<div className="code-block"><pre>hej</pre></div>);
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
}

const duration = 200;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
  marginRight: -150
}

const transitionStyles = {
  entering: { opacity: 0, marginRight: -150 },
  entered: { opacity: 1, marginRight: 0 },
};

const Audio = (props) => {
  return <audio controls src={props.src} />;
};
const Image = (props) => {
  return <img src={props.src} />;
};
const Video = (props) => {
  return <video controls src={props.src} />;
};
const Media = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const { src } = entity.getData();
  const type = entity.getType();
  let media;
  if (type === 'audio') {
    media = <Audio src={src} />;
  } else if (type === 'video') {
    media = <Video src={src} />;
  }
  else
    media = <Image src={src} />;

  return media;
};

export default createLinkWrapper(withDragHandle(class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: false
    };

    this.onChange = (editorState) => {
      const content = editorState.getCurrentContent();
      //const raw = convertToRaw(content);
      var html = stateToHTML(content);
      const showToolbar = editorState.getSelection().getHasFocus();

      this.props.store({ value: html });
      this.setState({ editorState, showToolbar });
    }

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.addMedia = this._addMedia.bind(this);
    this.handleStartEditing = this._handleStartEditing.bind(this);
  }
  _handleStartEditing() {
    let { value } = this.props;
    if (value) {
      if (value == '<p><br></p>')
        value = '<p>Empty textblock<br/></p>';
      const blocks = convertFromHTML(value);
      const newContentsState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
      this.setState({ editorState: EditorState.createWithContent(newContentsState) });
    }
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _addMedia(e) {
    e.preventDefault();
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: 'https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity }
    );
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      )
    });
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */,
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return false;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType),
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle),
    );
  }
  render() {
    const { editorState, showToolbar } = this.state;
    const { value } = this.props;
    
    return editorState ? (
      <div className="rich-editor">
        <Transition
          unmountOnExit
          in={showToolbar}
          timeout={duration}>
          {(state) => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }} className="RichEditor-controls-container">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              {/* <div onClick={this.addMedia}>add image</div> */}
            </div>
          )}
        </Transition>
        {/* {value} */}
        {/* <Editor
          blockStyleFn={getBlockStyle}
          blockRendererFn={mediaBlockRenderer}
          customStyleMap={styleMap}
          editorState={editorState}
          stripPastedStyles
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.mapKeyToEditorCommand}
          onChange={this.onChange}
        /> */}
        <Editor
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    ) : <div contentEditable onClick={this.handleStartEditing} dangerouslySetInnerHTML={{ __html: value }} />;
  }
}, true), ({ value }) => ({ value }));

// const blockRenderMap = Immutable.Map({
//   'StyledCodeBlock': {
//     // element is used during paste or html conversion to auto match your component;
//     // it is also retained as part of this.props.children and not stripped out
//     element: 'code',
//     wrapper: <CodeBlock />,
//   }
// });

// keep support for other draft default block types and add our myCustomBlock type
//const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap)

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  if (!block)
    return null;
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
  //{ label: 'Styled code', style: 'StyledCodeBlock' }
];

const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
