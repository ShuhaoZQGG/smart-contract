import React, { useState, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { processDocument } from '../utils/documentProcessor'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface FileUploadProps {
  onUploadSuccess?: (templateId: string) => void
  onUploadError?: (error: Error) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploadedFile(file)
    setError(null)
    setUploading(true)
    setProgress(10)

    try {
      // Process the document to extract text
      setProgress(30)
      const extractedText = await processDocument(file)
      
      // Upload original file to Supabase Storage
      setProgress(50)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('templates')
        .upload(fileName, file)

      if (uploadError) throw uploadError
      setProgress(70)

      // Create template record in database
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .insert({
          name: file.name.replace(/\.[^/.]+$/, ''),
          description: `Uploaded from ${file.name}`,
          original_filename: file.name,
          storage_path: uploadData.path,
          file_type: fileExt,
          user_id: user?.id,
        })
        .select()
        .single()

      if (templateError) throw templateError
      setProgress(85)

      // Create initial template version with extracted text
      const { error: versionError } = await supabase
        .from('template_versions')
        .insert({
          template_id: templateData.id,
          version_number: 1,
          content: { 
            text: extractedText,
            originalFormat: fileExt 
          },
          variables: []
        })

      if (versionError) throw versionError
      setProgress(100)

      // Success callback
      if (onUploadSuccess) {
        onUploadSuccess(templateData.id)
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file')
      if (onUploadError) {
        onUploadError(err)
      }
    } finally {
      setUploading(false)
    }
  }, [user, onUploadSuccess, onUploadError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const removeFile = () => {
    setUploadedFile(null)
    setProgress(0)
    setError(null)
  }

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop the file here' : 'Drag & drop your document here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to browse</p>
          <p className="text-xs text-gray-400">
            Supported formats: DOCX, PDF, TXT (Max 10MB)
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3">
              <FileText className="h-8 w-8 text-primary mt-1" />
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {progress === 100 && !error && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Upload successful!</span>
            </div>
          )}

          {error && (
            <div className="mt-2 p-2 bg-red-50 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload