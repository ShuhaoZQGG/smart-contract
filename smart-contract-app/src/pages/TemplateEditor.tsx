import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Save, Eye, Settings, Plus, X } from 'lucide-react'
import LexicalEditor from '../components/LexicalEditor/LexicalEditor'
import '../components/LexicalEditor/LexicalEditor.css'
import { Variable } from '../types'

interface TemplateVariable {
  id?: string
  name: string
  display_name: string
  data_type: string
  is_required: boolean
  default_value: string
}

const TemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const editorRef = useRef<HTMLTextAreaElement>(null)
  
  const [template, setTemplate] = useState<any>(null)
  const [content, setContent] = useState('')
  const [variables, setVariables] = useState<TemplateVariable[]>([])
  const [showVariablePanel, setShowVariablePanel] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    fetchTemplate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchTemplate = async () => {
    try {
      // Fetch template
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (templateError) throw templateError
      setTemplate(templateData)

      // Fetch template version if exists
      const { data: versionData } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single()

      if (versionData?.content) {
        setContent(versionData.content.text || '')
      }

      // Fetch variables
      const { data: variablesData } = await supabase
        .from('variables')
        .select('*')
        .eq('template_id', id)
        .order('position')

      setVariables(variablesData || [])
    } catch (error) {
      console.error('Error fetching template:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditorChange = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleVariablesChange = useCallback((newVariables: Variable[]) => {
    // Map Lexical variables to template variables
    const templateVars = newVariables.map(v => {
      const existing = variables.find(tv => tv.name === v.name)
      return existing || {
        name: v.name,
        display_name: v.displayName,
        data_type: v.dataType || 'text',
        is_required: v.isRequired || true,
        default_value: v.defaultValue || ''
      }
    })
    setVariables(templateVars)
  }, [variables])

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g
    const matches = text.match(regex) || []
    return Array.from(new Set(matches.map(m => m.replace(/\{\{|\}\}/g, ''))))
  }

  const saveTemplate = async () => {
    setSaving(true)
    try {
      // Get current version number
      const { data: versionData } = await supabase
        .from('template_versions')
        .select('version_number')
        .eq('template_id', id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single()

      const newVersionNumber = (versionData?.version_number || 0) + 1

      // Save new version
      const { error: versionError } = await supabase
        .from('template_versions')
        .insert({
          template_id: id,
          version_number: newVersionNumber,
          content: { text: content },
          variables: extractVariables(content)
        })

      if (versionError) throw versionError

      // Update or create variables
      for (const variable of variables) {
        if (variable.id) {
          await supabase
            .from('variables')
            .update({
              display_name: variable.display_name,
              data_type: variable.data_type,
              is_required: variable.is_required,
              default_value: variable.default_value
            })
            .eq('id', variable.id)
        } else {
          await supabase
            .from('variables')
            .insert({
              template_id: id,
              name: variable.name,
              display_name: variable.display_name,
              data_type: variable.data_type,
              is_required: variable.is_required,
              default_value: variable.default_value
            })
        }
      }

      setLastSaved(new Date())
      alert('Template saved successfully!')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template')
    } finally {
      setSaving(false)
    }
  }

  const updateVariable = (index: number, field: keyof TemplateVariable, value: any) => {
    const newVariables = [...variables]
    newVariables[index] = { ...newVariables[index], [field]: value }
    setVariables(newVariables)
  }

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content && !saving) {
        saveTemplate()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [content, saving])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">
              Template: {template?.name || 'Untitled'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {lastSaved ? `Auto-saved ${lastSaved.toLocaleTimeString()} ✓` : 'Auto-save enabled'}
            </span>
            <button
              onClick={saveTemplate}
              disabled={saving}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Editor */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow h-full">
            <LexicalEditor
              initialContent={content}
              onChange={handleEditorChange}
              onVariablesChange={handleVariablesChange}
              placeholder="Start typing your template here. Use {{variable_name}} to insert variables..."
              autoSave={true}
              autoSaveInterval={30000}
            />
          </div>
        </div>

        {/* Variables Panel */}
        {showVariablePanel && (
          <div className="w-80 bg-white shadow-lg p-6 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Variables ({variables.length})</h2>
              <button
                onClick={() => setShowVariablePanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {variables.map((variable, index) => (
                <div key={variable.name} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-mono text-sm text-primary mb-2">
                    {`{{${variable.name}}}`}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={variable.display_name}
                      onChange={(e) => updateVariable(index, 'display_name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded"
                      placeholder="Display name"
                    />
                    <select
                      value={variable.data_type}
                      onChange={(e) => updateVariable(index, 'data_type', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={variable.is_required}
                        onChange={(e) => updateVariable(index, 'is_required', e.target.checked)}
                        id={`required-${index}`}
                      />
                      <label htmlFor={`required-${index}`} className="text-sm">
                        Required
                      </label>
                    </div>
                    <input
                      type="text"
                      value={variable.default_value}
                      onChange={(e) => updateVariable(index, 'default_value', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded"
                      placeholder="Default value"
                    />
                  </div>
                </div>
              ))}
              
              {variables.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No variables yet. Insert variables using the {`{{}}`} button.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateEditor