import React, { useState, useEffect } from 'react'
import { Eye, Download, X, FileText } from 'lucide-react'
import { generateDocument } from '../utils/documentGenerator'

interface DocumentPreviewProps {
  templateContent: string
  variables: Record<string, string>
  fileName?: string
  onClose?: () => void
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  templateContent,
  variables,
  fileName = 'preview.txt',
  onClose
}) => {
  const [previewContent, setPreviewContent] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Generate preview content
    const result = generateDocument({
      template: templateContent,
      variables
    })
    if (result && result.content) {
      setPreviewContent(result.content)
    } else {
      setPreviewContent(templateContent)
    }
  }, [templateContent, variables])

  const handleDownload = () => {
    const blob = new Blob([previewContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace(/\.[^/.]+$/, '') + '_generated.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Preview Button */}
      <button
        onClick={handleOpen}
        className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
      >
        <Eye className="h-4 w-4" />
        <span>Preview</span>
      </button>

      {/* Preview Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold">Document Preview</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-primary text-white px-3 py-1.5 rounded hover:bg-blue-600"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                  {previewContent}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Variables replaced: {Object.keys(variables).length}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">
                    {previewContent.length} characters
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DocumentPreview