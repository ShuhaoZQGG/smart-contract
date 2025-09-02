import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Plus, FileText, Download, Upload, LogOut, Menu } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('templates')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create template record
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .insert({
          name: file.name.replace(/\.[^/.]+$/, ''),
          original_filename: file.name,
          storage_path: uploadData.path,
          file_type: fileExt,
          user_id: user?.id,
        })
        .select()
        .single()

      if (templateError) throw templateError

      // Navigate to template editor
      navigate(`/template/${templateData.id}/edit`)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-lg`}>
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Smart Contract</span>
          </Link>
        </div>
        <nav className="px-6">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-3"
          >
            <FileText className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/templates"
            className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-3"
          >
            <FileText className="h-5 w-5" />
            <span>Templates</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg p-3 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <input
                  type="file"
                  accept=".docx,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center">
                  <Plus className="h-12 w-12 text-primary mb-3" />
                  <span className="font-semibold">New Template</span>
                </div>
              </label>
              
              <Link
                to="/templates"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-secondary mb-3" />
                  <span className="font-semibold">Generate Document</span>
                </div>
              </Link>
              
              <Link
                to="/bulk-generate"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-accent mb-3" />
                  <span className="font-semibold">Bulk Generate</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Templates */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Templates</h2>
              <Link to="/templates" className="text-primary hover:text-blue-600">
                View All
              </Link>
            </div>
            
            {loading ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : templates.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variables
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                      <tr key={template.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                              {template.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(template.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/template/${template.id}/edit-enhanced`}
                            className="text-primary hover:text-blue-600 mr-4"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/template/${template.id}/generate`}
                            className="text-secondary hover:text-green-600"
                          >
                            Generate
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No templates yet. Create your first template!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard