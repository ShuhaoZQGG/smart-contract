import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Variable {
  id?: string
  name: string
  display_name: string
  data_type: 'text' | 'number' | 'date' | 'boolean' | 'email'
  default_value: string
  is_required: boolean
  position: number
}

export default function TemplateEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [templateName, setTemplateName] = useState('')
  const [content, setContent] = useState('')
  const [variables, setVariables] = useState<Variable[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTemplate()
      fetchVariables()
    }
  }, [id])

  const fetchTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setTemplateName(data.name)
      
      const { data: versionData } = await supabase
        .from('template_versions')
        .select('content')
        .eq('template_id', id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single()

      if (versionData?.content) {
        setContent(versionData.content)
      }
    } catch (error) {
      console.error('Error fetching template:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVariables = async () => {
    try {
      const { data, error } = await supabase
        .from('variables')
        .select('*')
        .eq('template_id', id)
        .order('position')

      if (error) throw error
      setVariables(data || [])
    } catch (error) {
      console.error('Error fetching variables:', error)
    }
  }

  const handleInsertVariable = () => {
    const varName = prompt('Enter variable name (e.g., client_name):')
    if (!varName) return

    const variable = `{{${varName}}}`
    setContent(content + variable)
    
    if (!variables.find(v => v.name === varName)) {
      setVariables([...variables, {
        name: varName,
        display_name: varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        data_type: 'text',
        default_value: '',
        is_required: true,
        position: variables.length
      }])
    }
  }

  const extractVariablesFromContent = () => {
    const regex = /\{\{(\w+)\}\}/g
    const matches = content.matchAll(regex)
    const foundVars = new Set<string>()
    
    for (const match of matches) {
      foundVars.add(match[1])
    }

    const newVars: Variable[] = []
    foundVars.forEach((varName, index) => {
      if (!variables.find(v => v.name === varName)) {
        newVars.push({
          name: varName,
          display_name: varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          data_type: 'text',
          default_value: '',
          is_required: true,
          position: variables.length + index
        })
      }
    })

    if (newVars.length > 0) {
      setVariables([...variables, ...newVars])
    }
  }

  const updateVariable = (index: number, field: keyof Variable, value: any) => {
    const updated = [...variables]
    updated[index] = { ...updated[index], [field]: value }
    setVariables(updated)
  }

  const removeVariable = (index: number) => {
    const varToRemove = variables[index]
    setContent(content.replace(new RegExp(`\\{\\{${varToRemove.name}\\}\\}`, 'g'), ''))
    setVariables(variables.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!id || !user) return
    
    setSaving(true)
    try {
      const { data: versionData } = await supabase
        .from('template_versions')
        .select('version_number')
        .eq('template_id', id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single()

      const newVersion = (versionData?.version_number || 0) + 1

      const { error: versionError } = await supabase
        .from('template_versions')
        .insert({
          template_id: id,
          version_number: newVersion,
          content: content,
          variables: variables,
          created_by: user.id
        })

      if (versionError) throw versionError

      for (const variable of variables) {
        if (variable.id) {
          await supabase
            .from('variables')
            .update({
              display_name: variable.display_name,
              data_type: variable.data_type,
              default_value: variable.default_value,
              is_required: variable.is_required,
              position: variable.position
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
              default_value: variable.default_value,
              is_required: variable.is_required,
              position: variable.position
            })
        }
      }

      alert('Template saved successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Template: {templateName}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add variables to your template using {"{{variable_name}}"} syntax
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Template Content</h2>
              <button
                onClick={handleInsertVariable}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Insert Variable
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={extractVariablesFromContent}
              className="w-full h-96 p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Paste your document content here and add variables like {{client_name}}"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Variables</h2>
            {variables.length === 0 ? (
              <p className="text-sm text-gray-500">No variables added yet</p>
            ) : (
              <div className="space-y-4">
                {variables.map((variable, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={variable.display_name}
                        onChange={(e) => updateVariable(index, 'display_name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Display name"
                      />
                      <select
                        value={variable.data_type}
                        onChange={(e) => updateVariable(index, 'data_type', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="email">Email</option>
                        <option value="boolean">Yes/No</option>
                      </select>
                      <input
                        type="text"
                        value={variable.default_value}
                        onChange={(e) => updateVariable(index, 'default_value', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Default value"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={variable.is_required}
                            onChange={(e) => updateVariable(index, 'is_required', e.target.checked)}
                            className="mr-2"
                          />
                          Required
                        </label>
                        <button
                          onClick={() => removeVariable(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Template'}
        </button>
      </div>
    </div>
  )
}