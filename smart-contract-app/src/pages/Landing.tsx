import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Edit, Download, ArrowRight } from 'lucide-react'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Smart Contract</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link
            to="/auth"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Documents into Smart Templates
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Upload → Insert Variables → Generate Documents
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
            <p className="text-gray-600">Any document becomes a template</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Edit Template</h3>
            <p className="text-gray-600">Insert variables where needed</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate Docs</h3>
            <p className="text-gray-600">Create personalized documents</p>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <h4 className="font-semibold">Any document format</h4>
                <p className="text-gray-600">Support for DOCX and PDF files</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <h4 className="font-semibold">Bulk generation</h4>
                <p className="text-gray-600">Generate multiple documents from CSV</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <h4 className="font-semibold">Variable insertion</h4>
                <p className="text-gray-600">Easy variable management</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <h4 className="font-semibold">Format preservation</h4>
                <p className="text-gray-600">Maintain original document styling</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <h4 className="font-semibold">CSV import</h4>
                <p className="text-gray-600">Bulk variable data import</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <h4 className="font-semibold">Secure storage</h4>
                <p className="text-gray-600">Your documents are safe with us</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing