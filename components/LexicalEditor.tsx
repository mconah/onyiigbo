import React, { useState, useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_CRITICAL, FORMAT_TEXT_COMMAND, EditorState } from 'lexical';
import { $getSelection, $isRangeSelection } from 'lexical';
import { LinkNode, TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text'; // Correct import for HeadingNode, QuoteNode
import { CodeNode } from '@lexical/code';
import { mergeRegister } from '@lexical/utils';
import { deserializeEditorState, serializeEditorState } from '../utils/lexicalUtils'; // Assuming these exist
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
} from 'lexical';


// Placeholder Lexical Editor config
const editorConfig = {
  namespace: 'OnyiIgboEditor',
  theme: {
    ltr: 'ltr',
    rtl: 'rtl',
    placeholder: 'editor-placeholder',
    paragraph: 'editor-paragraph',
    link: 'editor-link',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      ListNode,
      ListItemNode,
      LinkNode,
    ],
  },
  editorState: null,
  onError: (error) => {
    console.error(error);
  },
};

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
              setIsLink(true);
            } else {
              setIsLink(false);
            }
          }
        });
      })
    );
  }, [editor]);

  return (
    <div className="toolbar">
      <button onClick={() => formatText('bold')}>Bold</button>
      <button onClick={() => formatText('italic')}>Italic</button>
      <button onClick={() => formatText('underline')}>Underline</button>
      <button onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}>UL</button>
      <button onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}>OL</button>
      <button onClick={insertLink}>Link</button>
    </div>
  );
};

const LexicalEditor = ({ initialEditorState, onEditorStateChange }) => {
  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    if (initialEditorState) {
      const initialState = deserializeEditorState(initialEditorState);
      setEditorState(initialState);
    }
  }, [initialEditorState]);

  const handleChange = (newState) => {
    const serializedState = serializeEditorState(newState);
    onEditorStateChange(serializedState);
  };

  const initialConfig = {
    ...editorConfig,
    editorState: editorState,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div className="editor-placeholder">Enter some text...</div>}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
