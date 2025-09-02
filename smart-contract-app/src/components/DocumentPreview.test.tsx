import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DocumentPreview from './DocumentPreview'

// Mock the documentGenerator utility
jest.mock('../utils/documentGenerator', () => ({
  generateDocument: jest.fn((options) => {
    const { template, variables } = options
    const generatedContent = template.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => variables[key] || match)
    return {
      content: generatedContent,
      variablesUsed: Object.keys(variables),
      missingVariables: []
    }
  })
}))

describe('DocumentPreview Component', () => {
  const defaultProps = {
    templateContent: 'Hello {{name}}, welcome to {{company}}!',
    variables: {
      name: 'John Doe',
      company: 'Acme Corp'
    },
    fileName: 'test-document.txt'
  }

  it('renders preview button', () => {
    render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    expect(previewButton).toBeInTheDocument()
  })

  it('opens preview modal when button is clicked', () => {
    render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    expect(screen.getByText('Document Preview')).toBeInTheDocument()
  })

  it('displays generated content with replaced variables', () => {
    render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    expect(screen.getByText(/Hello John Doe, welcome to Acme Corp!/)).toBeInTheDocument()
  })

  it('shows variable count in footer', () => {
    render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    expect(screen.getByText('Variables replaced: 2')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    render(<DocumentPreview {...defaultProps} />)
    
    // Open modal
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    expect(screen.getByText('Document Preview')).toBeInTheDocument()
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: '' })
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('Document Preview')).not.toBeInTheDocument()
  })

  it('handles download action', () => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    global.URL.revokeObjectURL = jest.fn()
    
    // Mock document methods
    const mockClick = jest.fn()
    const mockAppendChild = jest.spyOn(document.body, 'appendChild')
    const mockRemoveChild = jest.spyOn(document.body, 'removeChild')
    
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = document.createElement(tagName)
      if (tagName === 'a') {
        element.click = mockClick
      }
      return element
    })
    
    render(<DocumentPreview {...defaultProps} />)
    
    // Open modal
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    // Click download
    const downloadButton = screen.getByRole('button', { name: /download/i })
    fireEvent.click(downloadButton)
    
    expect(mockClick).toHaveBeenCalled()
    expect(mockAppendChild).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalled()
    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(global.URL.revokeObjectURL).toHaveBeenCalled()
    
    // Cleanup
    mockAppendChild.mockRestore()
    mockRemoveChild.mockRestore()
  })

  it('calls onClose callback when provided', () => {
    const mockOnClose = jest.fn()
    render(<DocumentPreview {...defaultProps} onClose={mockOnClose} />)
    
    // Open modal
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    // Close modal
    const closeButton = screen.getByRole('button', { name: '' })
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('updates preview when template content changes', () => {
    const { rerender } = render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    expect(screen.getByText(/Hello John Doe, welcome to Acme Corp!/)).toBeInTheDocument()
    
    // Update props
    const newProps = {
      ...defaultProps,
      templateContent: 'Goodbye {{name}}!',
      variables: { name: 'Jane Smith' }
    }
    
    rerender(<DocumentPreview {...newProps} />)
    
    expect(screen.getByText(/Goodbye Jane Smith!/)).toBeInTheDocument()
  })
})