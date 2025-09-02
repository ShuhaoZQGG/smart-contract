import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Variable {
  id: string
  name: string
  display_name: string
  data_type: 'text' | 'number' | 'date' | 'boolean' | 'email'
  default_value: string | null
  is_required: boolean
}

export default function GenerateDocumentPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [templateName, setTemplateName] = useState('')
  const [variables, setVariables] = useState<Variable[]>([])
  const [values, setValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)

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
        .select('name')
        .eq('id', id)
        .single()

      if (error) throw error
      setTemplateName(data.name)
    } catch (error) {
      console.error('Error fetching template:', error)
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
      
      const initialValues: Record<string, any> = {}
      data?.forEach(variable => {
        initialValues[variable.name] = variable.default_value || ''
      })
      
      setVariables(data || [])
      setValues(initialValues)
    } catch (error) {
      console.error('Error fetching variables:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValueChange = (varName: string, value: any) => {
    setValues({ ...values, [varName]: value })
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const rows = text.split('\n')
        const headers = rows[0].split(',').map(h => h.trim())
        
        const documents = []
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue
          
          const values = rows[i].split(',').map(v => v.trim())
          const docValues: Record<string, string> = {}
          
          headers.forEach((header, index) => {
            docValues[header] = values[index] || ''
          })
          
          documents.push(docValues)
        }
        
        await generateBulkDocuments(documents)
      } catch (error) {
        console.error('Error parsing CSV:', error)
        alert('Error parsing CSV file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }

  const generateBulkDocuments = async (documents: Record<string, string>[]) => {
    if (!id || !user) return
    
    setGenerating(true)
    try {
      for (const docValues of documents) {
        await generateSingleDocument(docValues)
      }
      alert(`Successfully generated ${documents.length} documents!`)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error generating documents:', error)
      alert('Error generating documents. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const generateSingleDocument = async (docValues: Record<string, any>) => {
    if (!id || !user) return

    const { data: versionData } = await supabase
      .from('template_versions')
      .select('id, content')
      .eq('template_id', id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    if (!versionData) throw new Error('No template version found')

    let processedContent = versionData.content
    for (const [key, value] of Object.entries(docValues)) {
      processedContent = processedContent.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
        value
      )
    }

    const fileName = `generated_${Date.now()}.txt`
    const { data: storageData, error: storageError } = await supabase.storage
      .from('generated')
      .upload(`${user.id}/${fileName}`, processedContent)

    if (storageError) throw storageError

    const { error: dbError } = await supabase
      .from('generated_documents')
      .insert({
        template_id: id,
        template_version_id: versionData.id,
        user_id: user.id,
        name: fileName,
        variable_values: docValues,
        storage_path: storageData.path,
        output_format: 'docx'
      })

    if (dbError) throw dbError
  }

  const handleGenerate = async () => {
    if (!id || !user) return
    
    setGenerating(true)
    try {
      await generateSingleDocument(values)
      alert('Document generated successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Error generating document. Please try again.')
    } finally {
      setGenerating(false)
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Generate Document: {templateName}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the variable values to generate your personalized document
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Document Variables</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bulkMode}
                onChange={(e) => setBulkMode(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Bulk Mode (CSV)</span>
            </label>
          </div>
        </div>

        {bulkMode ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <label className="mt-4 cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload CSV file with variable values
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  className="sr-only"
                />
                <span className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Choose CSV File
                </span>
              </label>
              <p className="mt-2 text-xs text-gray-500">
                CSV should have headers matching variable names: {variables.map(v => v.name).join(', ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {variables.map((variable) => (
              <div key={variable.id}>
                <label className="block text-sm font-medium text-gray-700">
                  {variable.display_name}
                  {variable.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {variable.data_type === 'boolean' ? (
                  <select
                    value={values[variable.name] || 'false'}
                    onChange={(e) => handleValueChange(variable.name, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    type={variable.data_type === 'number' ? 'number' : variable.data_type === 'date' ? 'date' : variable.data_type === 'email' ? 'email' : 'text'}
                    value={values[variable.name] || ''}
                    onChange={(e) => handleValueChange(variable.name, e.target.value)}
                    required={variable.is_required}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          {!bulkMode && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Document'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}