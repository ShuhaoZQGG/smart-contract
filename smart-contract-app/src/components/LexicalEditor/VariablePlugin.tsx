import { useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createTextNode, TextNode } from 'lexical';
import { Variable } from '../../types';

interface VariablePluginProps {
  onVariablesChange?: (variables: Variable[]) => void;
}

export default function VariablePlugin({ onVariablesChange }: VariablePluginProps) {
  const [editor] = useLexicalComposerContext();

  const extractVariables = useCallback(() => {
    const variables: Variable[] = [];
    const variableSet = new Set<string>();

    editor.getEditorState().read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      
      // Extract variables using regex pattern {{variable_name}}
      const variablePattern = /\{\{([^}]+)\}\}/g;
      let match;
      
      while ((match = variablePattern.exec(textContent)) !== null) {
        const variableName = match[1].trim();
        if (!variableSet.has(variableName)) {
          variableSet.add(variableName);
          variables.push({
            id: `var_${variableName}`,
            name: variableName,
            displayName: variableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            dataType: 'text',
            isRequired: true,
            position: variables.length,
          });
        }
      }
    });

    return variables;
  }, [editor]);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(() => {
      if (onVariablesChange) {
        const variables = extractVariables();
        onVariablesChange(variables);
      }
    });

    // Transform text nodes to highlight variables
    const removeTextNodeTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      const text = textNode.getTextContent();
      const variablePattern = /\{\{([^}]+)\}\}/g;
      
      // Only apply styling if the text contains variables and isn't already styled
      if (variablePattern.test(text) && !textNode.hasFormat('code')) {
        // Mark as styled to prevent infinite recursion
        const currentFormat = textNode.getFormat();
        if ((currentFormat & 16) === 0) { // Check if not already formatted
          textNode.setFormat(currentFormat | 16); // Custom format for variables
        }
      }
    });

    return () => {
      removeUpdateListener();
      removeTextNodeTransform();
    };
  }, [editor, onVariablesChange, extractVariables]);

  return null;
}