import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Download, Eye, Upload } from 'lucide-react'
import DocumentPreview from '../components/DocumentPreview'

interface Variable {
  id: string
  name: string
  display_name: string
  data_type: string
  is_required: boolean
  default_value: string
}

const GenerateDocument: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [template, setTemplate] = useState<any>(null)
  const [variables, setVariables] = useState<Variable[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx' | 'both'>('pdf')
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bulkMode, setBulkMode] = useState(false)

  useEffect(() => {
    fetchTemplateData()
  }, [id])

  const fetchTemplateData = async () => {
    try {
      // Fetch template
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single()

      if (templateError) throw templateError
      setTemplate(templateData)

      // Fetch variables
      const { data: variablesData, error: variablesError } = await supabase
        .from('variables')
        .select('*')
        .eq('template_id', id)
        .order('position')

      if (variablesError) throw variablesError
      setVariables(variablesData || [])

      // Initialize variable values with defaults
      const initialValues: Record<string, string> = {}
      variablesData?.forEach(v => {
        initialValues[v.name] = v.default_value || ''
      })
      setVariableValues(initialValues)
    } catch (error) {
      console.error('Error fetching template:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVariableChange = (varName: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [varName]: value
    }))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      // Get latest template version content
      const { data: versionData } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', id)
        .order('version_number', { ascending: false })
        .limit(1)
        .single()

      if (!versionData) {
        alert('No template content found')
        return
      }

      // Replace variables in content
      let generatedContent = versionData.content.text || ''
      Object.entries(variableValues).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        generatedContent = generatedContent.replace(regex, value)
      })

      // Save generated document record
      const { data: docData, error: docError } = await supabase
        .from('generated_documents')
        .insert({
          template_id: id,
          template_version_id: versionData.id,
          user_id: user?.id,
          name: `${template.name}_${Date.now()}`,
          variable_values: variableValues,
          output_format: outputFormat,
          storage_path: `generated/${user?.id}/${Date.now()}.${outputFormat}`
        })
        .select()
        .single()

      if (docError) throw docError

      // For now, we'll just download the text content
      const blob = new Blob([generatedContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.name}_generated.txt`
      a.click()
      window.URL.revokeObjectURL(url)

      alert('Document generated successfully!')
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Error generating document')
    } finally {
      setGenerating(false)
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const csvText = event.target?.result as string
      // Parse CSV and generate multiple documents
      // This would need proper CSV parsing library in production
      console.log('CSV content:', csvText)
      alert('Bulk generation from CSV will be implemented with proper document processing')
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/templates" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">
              Generate Document: {template?.name}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              <span>{bulkMode ? 'Single Mode' : 'Bulk Mode'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {bulkMode ? (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-lg font-semibold mb-6">Bulk Generate from CSV</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Step 1: Upload CSV File</h3>
              <label className="block w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Drop CSV file here or browse</p>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCSVUpload}
                  />
                </div>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Step 2: Map CSV Columns to Variables</h3>
              <div className="space-y-3">
                {variables.map(variable => (
                  <div key={variable.id} className="flex items-center space-x-3">
                    <span className="w-32 text-sm">{variable.display_name}:</span>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Column</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={generating}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Generate All Documents
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-lg font-semibold mb-6">Fill in the template variables:</h2>
            
            <div className="space-y-6">
              {variables.map(variable => (
                <div key={variable.id}>
                  <label className="block mb-2">
                    <span className="text-sm font-medium">
                      {variable.display_name}
                      {variable.is_required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </label>
                  {variable.data_type === 'date' ? (
                    <input
                      type="date"
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required={variable.is_required}
                    />
                  ) : variable.data_type === 'number' ? (
                    <input
                      type="number"
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required={variable.is_required}
                    />
                  ) : variable.data_type === 'email' ? (
                    <input
                      type="email"
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required={variable.is_required}
                    />
                  ) : (
                    <input
                      type="text"
                      value={variableValues[variable.name] || ''}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Enter ${variable.display_name.toLowerCase()}`}
                      required={variable.is_required}
                    />
                  )}
                </div>
              ))}

              <div>
                <label className="block mb-2">
                  <span className="text-sm font-medium">Output Format:</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pdf"
                      checked={outputFormat === 'pdf'}
                      onChange={(e) => setOutputFormat('pdf')}
                      className="mr-2"
                    />
                    PDF
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="docx"
                      checked={outputFormat === 'docx'}
                      onChange={(e) => setOutputFormat('docx')}
                      className="mr-2"
                    />
                    DOCX
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="both"
                      checked={outputFormat === 'both'}
                      onChange={(e) => setOutputFormat('both')}
                      className="mr-2"
                    />
                    Both
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
                <span>{generating ? 'Generating...' : 'Generate Document'}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default GenerateDocument