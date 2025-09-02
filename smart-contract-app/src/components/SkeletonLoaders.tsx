import React from 'react'

// Base skeleton component with shimmer animation
const SkeletonBase: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

// Template card skeleton
export const TemplateCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <SkeletonBase className="h-6 w-3/4 mb-3" />
    <SkeletonBase className="h-4 w-full mb-2" />
    <SkeletonBase className="h-4 w-5/6 mb-4" />
    <div className="flex justify-between items-center">
      <SkeletonBase className="h-3 w-24" />
      <div className="flex space-x-2">
        <SkeletonBase className="h-8 w-20 rounded" />
        <SkeletonBase className="h-8 w-20 rounded" />
      </div>
    </div>
  </div>
)

// Dashboard stats skeleton
export const DashboardStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-8 w-8 rounded" />
        </div>
        <SkeletonBase className="h-8 w-16 mb-1" />
        <SkeletonBase className="h-3 w-24" />
      </div>
    ))}
  </div>
)

// Template editor skeleton
export const TemplateEditorSkeleton: React.FC = () => (
  <div className="flex h-screen bg-gray-50">
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <SkeletonBase className="h-8 w-48 mb-2" />
            <SkeletonBase className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-3">
            <SkeletonBase className="h-10 w-32 rounded" />
            <SkeletonBase className="h-10 w-32 rounded" />
            <SkeletonBase className="h-10 w-24 rounded" />
          </div>
        </div>
      </div>
      
      {/* Editor area */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow h-full p-6">
          <SkeletonBase className="h-4 w-full mb-3" />
          <SkeletonBase className="h-4 w-5/6 mb-3" />
          <SkeletonBase className="h-4 w-4/5 mb-3" />
          <SkeletonBase className="h-4 w-full mb-3" />
          <SkeletonBase className="h-4 w-3/4 mb-3" />
        </div>
      </div>
    </div>
    
    {/* Sidebar */}
    <div className="w-80 bg-white border-l p-6">
      <SkeletonBase className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3">
            <SkeletonBase className="h-5 w-24 mb-2" />
            <SkeletonBase className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    {/* Header */}
    <div className="bg-gray-50 px-6 py-3 border-b">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBase key={i} className="h-4 flex-1" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonBase 
                key={colIndex} 
                className={`h-4 flex-1 ${colIndex === 0 ? 'w-32' : ''}`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Form skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <SkeletonBase className="h-4 w-32 mb-2" />
        <SkeletonBase className="h-10 w-full rounded" />
      </div>
    ))}
    <div className="flex space-x-3 pt-4">
      <SkeletonBase className="h-10 w-32 rounded" />
      <SkeletonBase className="h-10 w-32 rounded" />
    </div>
  </div>
)

// Variable panel skeleton
export const VariablePanelSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <SkeletonBase className="h-6 w-32 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3">
          <SkeletonBase className="h-4 w-24 mb-2" />
          <SkeletonBase className="h-8 w-full mb-2" />
          <div className="flex space-x-2">
            <SkeletonBase className="h-6 w-20 rounded" />
            <SkeletonBase className="h-6 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Document preview skeleton
export const DocumentPreviewSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg p-8">
    <SkeletonBase className="h-8 w-64 mx-auto mb-6" />
    <div className="space-y-4">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-5/6" />
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-4/5" />
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-3/4" />
    </div>
    <div className="mt-8 flex justify-center space-x-3">
      <SkeletonBase className="h-10 w-32 rounded" />
      <SkeletonBase className="h-10 w-32 rounded" />
    </div>
  </div>
)

// List skeleton with custom item renderer
export const ListSkeleton: React.FC<{ 
  items?: number;
  renderItem?: () => React.ReactNode;
}> = ({ 
  items = 5,
  renderItem = () => (
    <div className="flex items-center space-x-4 p-4">
      <SkeletonBase className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-32 mb-2" />
        <SkeletonBase className="h-3 w-48" />
      </div>
      <SkeletonBase className="h-8 w-20 rounded" />
    </div>
  )
}) => (
  <div className="divide-y">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i}>{renderItem()}</div>
    ))}
  </div>
)

const SkeletonLoaders = {
  TemplateCardSkeleton,
  DashboardStatsSkeleton,
  TemplateEditorSkeleton,
  TableSkeleton,
  FormSkeleton,
  VariablePanelSkeleton,
  DocumentPreviewSkeleton,
  ListSkeleton
}

export default SkeletonLoaders