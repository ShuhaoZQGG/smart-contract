import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import FileUpload from '../components/FileUpload'

const TemplateUpload: React.FC = () => {
  const navigate = useNavigate()
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')

  const handleUploadSuccess = (templateId: string) => {
    // Navigate to template editor after successful upload
    setTimeout(() => {
      navigate(`/template/${templateId}/edit`)
    }, 1500)
  }

  const handleUploadError = (error: Error) => {
    console.error('Upload failed:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold">Upload New Template</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Create Template from Document</h2>
                <p className="text-gray-600">
                  Upload a document to use as a template for generating personalized versions
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Template Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Employment Contract, Invoice Template"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Brief description of what this template is for..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document
              </label>
              <FileUpload 
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Upload your document (DOCX, PDF, or TXT)</li>
              <li>We'll extract the text content while preserving formatting</li>
              <li>You can then add variables like {'{{client_name}}'}</li>
              <li>Generate personalized documents by filling in the variable values</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TemplateUpload