
import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkNode } from '@lexical/link'; // Import LinkNode
import { ListNode, ListItemNode } from '@lexical/list'; // Import List Nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text'; // Import from rich-text
import { CodeNode } from '@lexical/code'; // Import from code
import { deserializeEditorState } from '../utils/lexicalUtils';

// Define the editor config for the renderer
const editorConfig = {
  namespace: 'OnyiIgboRenderer',
  theme: {
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'editor-paragraph', // Use the same styles as editor
    link: 'editor-link',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
      underlineStrikethrough: 'editor-text-underlineStrikethrough',
      code: 'editor-text-code',
    },
    list: {
      ul: 'editor-list-ul',
      ol: 'editor-list-ol',
      listitem: 'editor-listitem',
    },
    quote: 'editor-blockquote',
  },
  onError(error: Error) {
    console.error(error);
  },
  // Ensure all node types that can be in the serialized content are registered
  nodes: [
    LinkNode,
    ListNode,
    ListItemNode,
    HeadingNode,
    QuoteNode,
    CodeNode,
  ],
};

// Custom error boundary for Lexical
function LexicalErrorBoundary({ onError }: { onError: (error: Error) => void }) {
  // Use ErrorBoundary from @lexical/react if it becomes available via importmap
  // For now, a simple one
  return null; // A proper error boundary needs to be implemented or imported
}

interface LexicalRendererProps {
  content: string; // The Lexical JSON string to render
}

const LexicalRenderer: React.FC<LexicalRendererProps> = ({ content }) => {
  const initialConfig = {
    ...editorConfig,
    editorState: deserializeEditorState(content), // Load content from JSON string
    readOnly: true, // Crucial for a renderer
  };

  return (
    <div className="editor-shell">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-editor" />}
            placeholder={null} // No placeholder for renderer
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin /> {/* History plugin is generally harmless in read-only mode */}
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalRenderer;
