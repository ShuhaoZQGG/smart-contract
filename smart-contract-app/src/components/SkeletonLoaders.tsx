import React from 'react'

export const TemplateSkeleton: React.FC = () => (
  <div className="animate-pulse p-6 bg-white rounded-lg shadow">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    <div className="flex justify-between mt-4">
      <div className="h-8 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
)

export const TemplateListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <TemplateSkeleton key={i} />
    ))}
  </div>
)

export const DashboardStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
)

export const TableSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-10 mb-2 rounded"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gray-100 h-12 mb-1 rounded"></div>
    ))}
  </div>
)

export const FormSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i}>
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
    <div className="h-10 bg-gray-300 rounded w-32"></div>
  </div>
)

export const EditorSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-96 bg-gray-100 rounded p-4">
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
)