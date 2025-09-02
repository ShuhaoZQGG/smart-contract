import React, { useState, useEffect, useCallback } from 'react';
import { 
  $getRoot, 
  $getSelection, 
  $createTextNode, 
  $createParagraphNode, 
  CLEAR_EDITOR_COMMAND,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  TextNode
} from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { 
  ListNode, 
  ListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND
} from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  Code,
  Quote,
  Table,
  Variable,
  Undo,
  Redo,
  Save,
  Eye,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VariableInfo {
  name: string;
  display_name: string;
  data_type: string;
  position: number;
  is_required: boolean;
}

interface LexicalTemplateEditorProps {
  templateId?: string;
  initialContent?: string;
  onSave?: (content: string, variables: VariableInfo[]) => Promise<void>;
  onVariablesChange?: (variables: VariableInfo[]) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

// Custom variable node for template variables
class VariableNode extends TextNode {
  __variable: string;

  static getType(): string {
    return 'variable';
  }

  static clone(node: VariableNode): VariableNode {
    return new VariableNode(node.__variable, node.__key);
  }

  constructor(variable: string, key?: string) {
    const text = `{{${variable}}}`;
    super(text, key);
    this.__variable = variable;
  }

  createDOM(config: any): HTMLElement {
    const element = super.createDOM(config);
    element.className = 'template-variable bg-blue-100 text-blue-700 px-1 rounded font-mono';
    element.dataset.variable = this.__variable;
    return element;
  }

  updateDOM(): boolean {
    return false;
  }
}

// Toolbar component
const Toolbar: React.FC<{ onInsertVariable: () => void }> = ({ onInsertVariable }) => {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatCode = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if (selection) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
      });
    }
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
      <button
        onClick={formatBold}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={formatItalic}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={formatUnderline}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        onClick={formatCode}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={insertLink}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Insert Link"
      >
        <Link className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Align Left"
      >
        <Quote className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={undo}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        className="p-2 hover:bg-gray-200 rounded transition-colors"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={onInsertVariable}
        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        title="Insert Variable"
      >
        <Variable className="w-4 h-4" />
        Insert Variable
      </button>
    </div>
  );
};

const LexicalTemplateEditor: React.FC<LexicalTemplateEditorProps> = ({
  templateId,
  initialContent = '',
  onSave,
  onVariablesChange,
  autoSave = true,
  autoSaveInterval = 30000
}) => {
  const [variables, setVariables] = useState<VariableInfo[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const initialConfig = {
    namespace: 'TemplateEditor',
    theme: {
      paragraph: 'mb-2',
      heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-2',
      },
      list: {
        ul: 'list-disc ml-6',
        ol: 'list-decimal ml-6',
        listitem: 'mb-1'
      },
      link: 'text-blue-600 underline hover:text-blue-800',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        code: 'bg-gray-100 px-1 rounded font-mono text-sm'
      },
      code: 'bg-gray-100 p-3 rounded font-mono text-sm block',
      quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-700'
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      VariableNode
    ],
    onError: (error: Error) => {
      console.error('Lexical error:', error);
      setMessage({ type: 'error', text: 'Editor error: ' + error.message });
    }
  };

  const extractVariables = (content: string): VariableInfo[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const foundVariables: VariableInfo[] = [];
    let match;
    let position = 0;

    while ((match = regex.exec(content)) !== null) {
      const varName = match[1];
      if (!foundVariables.find(v => v.name === varName)) {
        foundVariables.push({
          name: varName,
          display_name: varName.replace(/_/g, ' '),
          data_type: 'text',
          position: position++,
          is_required: true
        });
      }
    }

    return foundVariables;
  };

  const handleChange = useCallback((editorState: any, editor: any) => {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      setPreviewContent(htmlString);
      
      const textContent = $getRoot().getTextContent();
      const extractedVars = extractVariables(textContent);
      setVariables(extractedVars);
      
      if (onVariablesChange) {
        onVariablesChange(extractedVars);
      }
    });
  }, [onVariablesChange]);

  const insertVariable = () => {
    const variableName = prompt('Enter variable name (use underscore for spaces, e.g., client_name):');
    if (variableName && /^\w+$/.test(variableName)) {
      // Variable insertion will be handled by the editor
      const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (editor) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const variableText = `{{${variableName}}}`;
          const variableSpan = document.createElement('span');
          variableSpan.className = 'template-variable bg-blue-100 text-blue-700 px-1 rounded font-mono';
          variableSpan.textContent = variableText;
          range.insertNode(variableSpan);
          range.collapse(false);
        }
      }
    } else if (variableName) {
      setMessage({ type: 'error', text: 'Variable name can only contain letters, numbers, and underscores' });
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
      const content = editor ? editor.innerText : '';
      await onSave(content, variables);
      setLastSaved(new Date());
      setMessage({ type: 'success', text: 'Template saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save template' });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const interval = setInterval(() => {
      handleSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, variables]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Template Editor</h2>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mx-4 mt-4 p-3 rounded flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex">
          {/* Editor Section */}
          <div className={showPreview ? 'w-1/2 border-r' : 'w-full'}>
            <LexicalComposer initialConfig={initialConfig}>
              <Toolbar onInsertVariable={insertVariable} />
              <div className="relative min-h-[400px]">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="p-4 min-h-[400px] focus:outline-none" />
                  }
                  placeholder={
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                      {"Start typing your template here. Use {{variable_name}} for variables..."}
                    </div>
                  }
                  ErrorBoundary={({ children, onError }) => (
                    <div className="p-4 border border-red-300 bg-red-50 rounded">
                      <p className="text-red-600">Something went wrong.</p>
                      {children}
                    </div>
                  )}
                />
                <OnChangePlugin onChange={handleChange} />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <ListPlugin />
                <LinkPlugin />
                <MarkdownShortcutPlugin />
                <TabIndentationPlugin />
              </div>
            </LexicalComposer>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="w-1/2 p-4">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          )}
        </div>

        {/* Variables Panel */}
        {variables.length > 0 && (
          <div className="border-t p-4">
            <h3 className="text-lg font-semibold mb-3">Template Variables</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {variables.map((variable) => (
                <div
                  key={variable.name}
                  className="bg-blue-50 border border-blue-200 rounded px-3 py-2 flex items-center justify-between"
                >
                  <span className="font-mono text-sm text-blue-700">
                    {`{{${variable.name}}}`}
                  </span>
                  {variable.is_required && (
                    <span className="text-xs text-red-500 ml-2">*</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LexicalTemplateEditor;