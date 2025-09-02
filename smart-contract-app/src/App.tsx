import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import TemplateEditor from './pages/TemplateEditor'
import GenerateDocument from './pages/GenerateDocument'
import TemplateLibrary from './pages/TemplateLibrary'
import Auth from './pages/Auth'

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/auth" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <PrivateRoute>
                  <TemplateLibrary />
                </PrivateRoute>
              }
            />
            <Route
              path="/template/:id/edit"
              element={
                <PrivateRoute>
                  <TemplateEditor />
                </PrivateRoute>
              }
            />
            <Route
              path="/template/:id/generate"
              element={
                <PrivateRoute>
                  <GenerateDocument />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App