import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DocumentPreview from './DocumentPreview'

// Mock the documentGenerator utility
jest.mock('../utils/documentGenerator', () => ({
  generateDocument: jest.fn((options) => {
    const { template, variables } = options
    let generatedContent = template
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      generatedContent = generatedContent.replace(regex, variables[key])
    })
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

  it.skip('displays generated content with replaced variables', async () => {
    render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello John Doe, welcome to Acme Corp!')).toBeInTheDocument()
    })
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
    
    // Mock click on anchor
    const mockClick = jest.fn()
    HTMLAnchorElement.prototype.click = mockClick
    
    render(<DocumentPreview {...defaultProps} />)
    
    // Open modal
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    // Click download
    const downloadButton = screen.getByRole('button', { name: /download/i })
    fireEvent.click(downloadButton)
    
    expect(mockClick).toHaveBeenCalled()
    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(global.URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('calls onClose callback when provided', () => {
    const mockOnClose = jest.fn()
    render(<DocumentPreview {...defaultProps} onClose={mockOnClose} />)
    
    // Open modal
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    // Close modal - find by class pattern since it's an icon button
    const closeButtons = screen.getAllByRole('button')
    const closeButton = closeButtons.find(btn => 
      btn.className.includes('text-gray-400')
    )
    
    expect(closeButton).toBeDefined()
    if (closeButton) {
      fireEvent.click(closeButton)
    }
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it.skip('updates preview when template content changes', async () => {
    const { rerender } = render(<DocumentPreview {...defaultProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    fireEvent.click(previewButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello John Doe, welcome to Acme Corp!')).toBeInTheDocument()
    })
    
    // Update props
    const newProps = {
      ...defaultProps,
      templateContent: 'Goodbye {{name}}!',
      variables: { name: 'Jane Smith' }
    }
    
    rerender(<DocumentPreview {...newProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Goodbye Jane Smith!')).toBeInTheDocument()
    })
  })
})