import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Eye, Variable, Download, AlertCircle, Check, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { edgeFunctions } from '../services/edgeFunctions';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeCollaboration } from '../hooks/useRealtimeCollaboration';
import CollaborationPresence from './CollaborationPresence';
import LexicalEditor from './LexicalEditor/LexicalEditor';

interface VariableInfo {
  name: string;
  display_name: string;
  data_type: string;
  position: number;
  is_required: boolean;
}

const TemplateEditorCollaborative: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { user } = useAuth();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [variables, setVariables] = useState<VariableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showCollaboration, setShowCollaboration] = useState(true);

  // Real-time collaboration hook
  const {
    activeUsers,
    otherUsers,
    isConnected,
    broadcastEdit,
    updateCursor,
    updateSelection,
  } = useRealtimeCollaboration({
    templateId: templateId || '',
    onContentChange: (newContent) => {
      setContent(newContent);
      extractVariables(newContent);
    },
    onEditReceived: (edit) => {
      // Show notification for remote edits
      if (edit.userId !== user?.id) {
        const userInfo = otherUsers.find(u => u.id === edit.userId);
        showNotification(`${userInfo?.name || 'Someone'} made changes`, 'info');
      }
    },
  });

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  useEffect(() => {
    // Auto-save functionality
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (content !== originalContent && content.length > 0) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 30000); // Auto-save after 30 seconds of inactivity
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, originalContent]);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);

      // Load template metadata
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      setTemplateName(template.name);

      // Load latest template version
      const { data: version, error: versionError } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', templateId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      if (!versionError && version) {
        const templateContent = version.content?.text || '';
        setContent(templateContent);
        setOriginalContent(templateContent);
        setVariables(version.variables || []);
      } else {
        // No version exists yet, start with empty content
        setContent('');
        setOriginalContent('');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      showNotification('Failed to load template', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const extractVariables = (text: string) => {
    const regex = /\{\{(\w+)\}\}/g;
    const foundVariables: VariableInfo[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const varName = match[1];
      if (!foundVariables.find(v => v.name === varName)) {
        foundVariables.push({
          name: varName,
          display_name: varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          data_type: 'text',
          position: match.index,
          is_required: true,
        });
      }
    }

    setVariables(foundVariables);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    extractVariables(value);
    
    // Broadcast changes to other collaborators
    if (isConnected) {
      broadcastEdit(value);
    }
  };

  const handleSave = async (isAutoSave = false) => {
    if (!user || !templateId) {
      showNotification('Please log in to save changes', 'error');
      return;
    }

    try {
      setIsSaving(true);

      // Get current version number
      const { data: currentVersion } = await supabase
        .from('template_versions')
        .select('version_number')
        .eq('template_id', templateId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const newVersionNumber = currentVersion ? currentVersion.version_number + 1 : 1;

      // Save new version
      const { error: versionError } = await supabase
        .from('template_versions')
        .insert({
          template_id: templateId,
          version_number: newVersionNumber,
          content: { text: content },
          variables: variables,
          created_by: user.id,
        });

      if (versionError) throw versionError;

      // Update template's updated_at
      const { error: updateError } = await supabase
        .from('templates')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', templateId);

      if (updateError) throw updateError;

      setOriginalContent(content);
      
      if (!isAutoSave) {
        showNotification('Template saved successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      showNotification('Failed to save template', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = () => {
    const varName = prompt('Enter variable name (use underscore for spaces):');
    if (varName && /^\w+$/.test(varName)) {
      const variable = `{{${varName}}}`;
      
      if (editorRef.current) {
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        const newContent = content.slice(0, start) + variable + content.slice(end);
        handleContentChange(newContent);
        
        // Set cursor position after the inserted variable
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.selectionStart = start + variable.length;
            editorRef.current.selectionEnd = start + variable.length;
            editorRef.current.focus();
          }
        }, 0);
      }
    } else if (varName) {
      showNotification('Invalid variable name. Use only letters, numbers, and underscores.', 'error');
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isConnected && editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateCursor(x, y);
    }
  }, [isConnected, updateCursor]);

  const handleSelectionChange = useCallback(() => {
    if (isConnected && editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      if (start !== end) {
        updateSelection(start, end);
      }
    }
  }, [isConnected, updateSelection]);

  const generatePreview = () => {
    if (variables.length === 0) {
      showNotification('No variables to preview', 'error');
      return;
    }
    
    // Initialize preview values with sample data
    const sampleValues: Record<string, any> = {};
    variables.forEach(v => {
      sampleValues[v.name] = `[${v.display_name}]`;
    });
    setPreviewValues(sampleValues);
    setShowPreview(true);
  };

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setMessage({ type: type === 'info' ? 'success' : type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const renderPreview = () => {
    let previewContent = content;
    Object.entries(previewValues).forEach(([key, value]) => {
      previewContent = previewContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
    return previewContent;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with collaboration presence */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Template Editor</h1>
          <p className="text-gray-600 mt-2">{templateName}</p>
        </div>
        
        {showCollaboration && (
          <CollaborationPresence 
            users={otherUsers} 
            isConnected={isConnected} 
          />
        )}
      </div>

      {/* Message notifications */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || content === originalContent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <button
              onClick={insertVariable}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Variable size={18} />
              Insert Variable
            </button>
            
            <button
              onClick={generatePreview}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Eye size={18} />
              Preview
            </button>

            <button
              onClick={() => setShowCollaboration(!showCollaboration)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showCollaboration 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Users size={18} />
              {showCollaboration ? 'Collaboration On' : 'Collaboration Off'}
            </button>
          </div>

          {/* Auto-save indicator */}
          {content !== originalContent && (
            <span className="text-sm text-gray-500">Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Main editor area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Content Editor</h2>
            
            {/* Use Lexical Editor for rich text editing */}
            <div className="border border-gray-300 rounded-lg p-4 min-h-[500px]">
              <LexicalEditor
                initialContent={content}
                onChange={handleContentChange}
                placeholder="Start typing your template content..."
              />
            </div>

            {/* Fallback textarea for plain text editing */}
            {false && (
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onMouseMove={handleMouseMove}
                onSelect={handleSelectionChange}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"
                placeholder="Start typing your template content. Use {{variable_name}} to insert variables."
              />
            )}
          </div>
        </div>

        {/* Variables panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Variables ({variables.length})</h2>
            
            {variables.length > 0 ? (
              <ul className="space-y-2">
                {variables.map((variable, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{`{{${variable.name}}}`}</div>
                    <div className="text-sm text-gray-600 mt-1">{variable.display_name}</div>
                    <div className="text-xs text-gray-500 mt-1">Type: {variable.data_type}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                No variables yet. Insert variables using {`{{ variable_name }}`} syntax or use the Insert Variable button.
              </p>
            )}
          </div>

          {/* Active collaborators */}
          {showCollaboration && otherUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <h2 className="text-lg font-semibold mb-4">Active Collaborators</h2>
              <ul className="space-y-2">
                {otherUsers.map((user) => (
                  <li key={user.id} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      {user.cursor && (
                        <div className="text-xs text-gray-500">Active</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Template Preview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {variables.map((variable) => (
                <div key={variable.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable.display_name}
                  </label>
                  <input
                    type="text"
                    value={previewValues[variable.name] || ''}
                    onChange={(e) => setPreviewValues({
                      ...previewValues,
                      [variable.name]: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Preview Output:</h3>
              <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {renderPreview()}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEditorCollaborative;