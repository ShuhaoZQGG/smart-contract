import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Eye, Variable, Download, AlertCircle, Check, MessageCircle, GitMerge } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { edgeFunctions } from '../services/edgeFunctions';
import { useAuth } from '../contexts/AuthContext';
import { AdvancedVariables } from './AdvancedVariables';
import { ConflictResolution } from './ConflictResolution';
import { TemplateComments } from './TemplateComments';

interface VariableInfo {
  name: string;
  display_name: string;
  data_type: string;
  position: number;
  is_required: boolean;
}

const TemplateEditorEnhanced: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState<'variables' | 'comments' | 'conflicts'>('variables');

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
  }, [content]);

  const loadTemplate = async () => {
    if (!templateId) return;

    try {
      setIsLoading(true);

      // Load template details
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      setTemplateName(template.name);

      // Load latest template version
      const { data: version } = await supabase
        .from('template_versions')
        .select('content')
        .eq('template_id', templateId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      if (version) {
        const templateContent = typeof version.content === 'string' 
          ? version.content 
          : version.content.text || '';
        setContent(templateContent);
        setOriginalContent(templateContent);
      }

      // Load variables
      const templateVariables = await edgeFunctions.getTemplateVariables(templateId);
      setVariables(templateVariables);

      // Initialize preview values
      const initialValues: Record<string, any> = {};
      templateVariables.forEach(v => {
        initialValues[v.name] = v.data_type === 'date' 
          ? new Date().toISOString().split('T')[0]
          : v.data_type === 'number' 
          ? '0'
          : `[${v.display_name}]`;
      });
      setPreviewValues(initialValues);

    } catch (error: any) {
      showMessage('error', `Failed to load template: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (isAutoSave = false) => {
    if (!templateId || !user) return;

    try {
      setIsSaving(true);

      // Process template with Edge Function
      const result = await edgeFunctions.processTemplate(
        templateId,
        content,
        user.id
      );

      if (result.success) {
        setOriginalContent(content);
        setVariables(result.variables || []);
        
        if (!isAutoSave) {
          showMessage('success', 'Template saved successfully!');
        }
      } else {
        throw new Error('Failed to save template');
      }
    } catch (error: any) {
      showMessage('error', `Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = () => {
    const varName = prompt('Enter variable name (use underscore for spaces):');
    if (varName) {
      const formattedName = varName.toLowerCase().replace(/\s+/g, '_');
      insertAtCursor(`{{${formattedName}}}`);
    }
  };

  const insertAtCursor = (text: string) => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    
    const newContent = before + text + after;
    setContent(newContent);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const extractVariables = useCallback(async () => {
    try {
      const result = await edgeFunctions.extractVariables(content);
      if (result.success) {
        setVariables(result.variables);
        
        // Update preview values for new variables
        const newPreviewValues = { ...previewValues };
        result.variables.forEach(v => {
          if (!newPreviewValues[v.name]) {
            newPreviewValues[v.name] = `[${v.display_name}]`;
          }
        });
        setPreviewValues(newPreviewValues);
        
        showMessage('success', `Found ${result.count} variables`);
      }
    } catch (error: any) {
      showMessage('error', `Failed to extract variables: ${error.message}`);
    }
  }, [content, previewValues]);

  const generatePreview = () => {
    let previewContent = content;
    Object.entries(previewValues).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      previewContent = previewContent.replace(regex, String(value));
    });
    return previewContent;
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGenerateDocument = async () => {
    if (!templateId || !user) return;

    try {
      const result = await edgeFunctions.generateDocument({
        templateId,
        variableValues: previewValues,
        userId: user.id,
        outputFormat: 'docx',
      });

      if (result.success && result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
        showMessage('success', 'Document generated successfully!');
      }
    } catch (error: any) {
      showMessage('error', `Failed to generate document: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{templateName}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {isSaving ? 'Saving...' : 'All changes saved automatically'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => extractVariables()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <Variable size={20} />
                <span>Extract Variables</span>
              </button>
              <button
                onClick={insertVariable}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Variable size={20} />
                <span>Insert Variable</span>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <Eye size={20} />
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex">
          <div className={showPreview ? 'w-1/2 border-r' : 'w-full'}>
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-6 text-gray-800 font-mono text-sm resize-none focus:outline-none"
              placeholder="Start typing your template here... Use {{variable_name}} to insert variables."
              spellCheck={false}
            />
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 bg-white">
              <div className="border-b px-6 py-3 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Preview</h3>
              </div>
              <div className="p-6 whitespace-pre-wrap font-sans">
                {generatePreview()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar with Tabs */}
      <div className="w-96 bg-white border-l flex flex-col">
        {/* Tab Navigation */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('variables')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'variables'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Variable size={16} />
                Variables
              </div>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'comments'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                Comments
              </div>
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'conflicts'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <GitMerge size={16} />
                Conflicts
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'variables' && (
            <AdvancedVariables
              templateId={templateId || ''}
              variables={variables.map((v, idx) => ({
                ...v,
                id: `var-${idx}`,
                data_type: 'text' as const,
                default_value: ''
              }))}
              onVariableUpdate={(updatedVars) => {
                // Handle variable updates
                console.log('Variables updated:', updatedVars);
              }}
            />
          )}

          {activeTab === 'comments' && templateId && (
            <TemplateComments
              templateId={templateId}
              onCommentAdded={(comment) => {
                showMessage('success', 'Comment added successfully');
              }}
            />
          )}

          {activeTab === 'conflicts' && templateId && (
            <ConflictResolution
              templateId={templateId}
              onConflictResolved={(conflictId, resolution) => {
                showMessage('success', 'Conflict resolved successfully');
              }}
            />
          )}
        </div>

        {/* Preview Values Section - Only show when Variables tab is active */}
        {activeTab === 'variables' && variables.length > 0 && (
          <div className="border-t p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Preview Values</h3>
            <div className="space-y-3">
              {variables.map((variable) => (
                <div key={variable.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable.display_name}
                  </label>
                  <input
                    type={variable.data_type === 'number' ? 'number' : variable.data_type === 'date' ? 'date' : 'text'}
                    value={previewValues[variable.name] || ''}
                    onChange={(e) => setPreviewValues({
                      ...previewValues,
                      [variable.name]: e.target.value
                    })}
                    className="w-full px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${variable.display_name.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Document Button */}
        {activeTab === 'variables' && (
          <div className="p-6 border-t">
          <button
            onClick={handleGenerateDocument}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>Generate Document</span>
          </button>
          </div>
        )}
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default TemplateEditorEnhanced;