import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Lazy load all pages for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TemplateEditor = lazy(() => import('./pages/TemplateEditor'))
const TemplateEditorEnhanced = lazy(() => import('./components/TemplateEditorEnhanced'))
const GenerateDocument = lazy(() => import('./pages/GenerateDocument'))
const BulkGenerator = lazy(() => import('./components/BulkGenerator'))
const TemplateLibrary = lazy(() => import('./pages/TemplateLibrary'))
const TemplateUpload = lazy(() => import('./pages/TemplateUpload'))
const Auth = lazy(() => import('./pages/Auth'))

// Loading component for lazy loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return user ? <>{children}</> : <Navigate to="/auth" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<LoadingSpinner />}>
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
                path="/template/upload"
                element={
                  <PrivateRoute>
                    <TemplateUpload />
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
              <Route
                path="/template/:templateId/edit-enhanced"
                element={
                  <PrivateRoute>
                    <TemplateEditorEnhanced />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bulk-generate"
                element={
                  <PrivateRoute>
                    <BulkGenerator />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App