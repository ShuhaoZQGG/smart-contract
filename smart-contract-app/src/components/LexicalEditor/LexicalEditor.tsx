import React, { useEffect, useState, useCallback } from 'react';
import { $getRoot, $getSelection, $createParagraphNode, $createTextNode, COMMAND_PRIORITY_LOW } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { 
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  LexicalComposer,
  InitialConfigType
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode as LexicalListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import ToolbarPlugin from './ToolbarPlugin';
import VariablePlugin from './VariablePlugin';
import { Variable } from '../../types';

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onVariablesChange?: (variables: Variable[]) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
    variable: 'editor-text-variable',
  },
  code: 'editor-code',
  table: 'editor-table',
  tableCell: 'editor-table-cell',
  tableRow: 'editor-table-row',
};

function Placeholder({ placeholder }: { placeholder: string }) {
  return <div className="editor-placeholder">{placeholder}</div>;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  initialContent = '',
  onChange,
  onVariablesChange,
  placeholder = 'Start typing or paste your document content...',
  readOnly = false,
  autoSave = true,
  autoSaveInterval = 30000, // 30 seconds
}) => {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const initialConfig: InitialConfigType = {
    namespace: 'TemplateEditor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListItemNode,
      LexicalListNode,
      LinkNode,
      CodeNode,
      TableNode,
      TableRowNode,
      TableCellNode,
      HorizontalRuleNode,
    ],
    editable: !readOnly,
  };

  const handleChange = useCallback((editorState: any) => {
    editorState.read(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      if (onChange) {
        onChange(content);
      }
    });
  }, [onChange]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onChange) return;

    const interval = setInterval(() => {
      // Trigger save by calling onChange with current content
      // The parent component should handle the actual save logic
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, onChange]);

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-inner">
          <ToolbarPlugin />
          <div className="editor-input-wrapper">
            <RichTextPlugin
              contentEditable={
                <div ref={onRef} className="editor-anchor">
                  <ContentEditable className="editor-input" />
                </div>
              }
              placeholder={<Placeholder placeholder={placeholder} />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin />
            <AutoFocusPlugin />
            <VariablePlugin onVariablesChange={onVariablesChange} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;