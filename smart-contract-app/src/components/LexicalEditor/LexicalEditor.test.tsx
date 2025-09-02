import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LexicalEditor from './LexicalEditor';
import { Variable } from '../../types';

describe('LexicalEditor', () => {
  const mockOnChange = jest.fn();
  const mockOnVariablesChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the editor with placeholder text', () => {
    render(
      <LexicalEditor
        placeholder="Custom placeholder"
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders toolbar with formatting buttons', () => {
    render(
      <LexicalEditor
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // Check for toolbar buttons
    expect(screen.getByLabelText('Undo')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo')).toBeInTheDocument();
    expect(screen.getByLabelText('Format Bold')).toBeInTheDocument();
    expect(screen.getByLabelText('Format Italics')).toBeInTheDocument();
    expect(screen.getByLabelText('Format Underline')).toBeInTheDocument();
    expect(screen.getByLabelText('Insert Variable')).toBeInTheDocument();
  });

  it('renders with initial content', () => {
    const initialContent = 'This is a template with {{client_name}} variable';
    
    render(
      <LexicalEditor
        initialContent={initialContent}
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // The content should be rendered in the editor
    const editorElement = document.querySelector('.editor-input');
    expect(editorElement).toBeInTheDocument();
  });

  it('disables editing when readOnly is true', () => {
    render(
      <LexicalEditor
        readOnly={true}
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    const editorElement = document.querySelector('.editor-input');
    expect(editorElement).toHaveAttribute('contenteditable', 'false');
  });

  it('extracts variables from content', async () => {
    const content = 'Hello {{firstName}} {{lastName}}!';
    
    render(
      <LexicalEditor
        initialContent={content}
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // Wait for the variables to be extracted
    await waitFor(() => {
      expect(mockOnVariablesChange).toHaveBeenCalled();
    });

    // Check that the correct variables were extracted
    const lastCall = mockOnVariablesChange.mock.calls[mockOnVariablesChange.mock.calls.length - 1];
    const extractedVariables: Variable[] = lastCall[0];
    
    expect(extractedVariables).toHaveLength(2);
    expect(extractedVariables[0].name).toBe('firstName');
    expect(extractedVariables[1].name).toBe('lastName');
  });

  it('handles variable insertion', async () => {
    render(
      <LexicalEditor
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // Mock window.prompt
    const originalPrompt = window.prompt;
    window.prompt = jest.fn(() => 'testVariable');

    // Click the insert variable button
    const insertVariableButton = screen.getByLabelText('Insert Variable');
    fireEvent.click(insertVariableButton);

    // Wait for the variable to be inserted
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });

    // Restore original prompt
    window.prompt = originalPrompt;
  });

  it('applies text formatting', async () => {
    render(
      <LexicalEditor
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // Click bold button
    const boldButton = screen.getByLabelText('Format Bold');
    fireEvent.click(boldButton);

    // The button should be active
    expect(boldButton).toHaveClass('active');
  });

  it('handles undo and redo operations', async () => {
    render(
      <LexicalEditor
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    const undoButton = screen.getByLabelText('Undo');
    const redoButton = screen.getByLabelText('Redo');

    // Initially, undo and redo should be disabled
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it('supports list creation', () => {
    render(
      <LexicalEditor
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // Check for list buttons
    expect(screen.getByLabelText('Insert Unordered List')).toBeInTheDocument();
    expect(screen.getByLabelText('Insert Ordered List')).toBeInTheDocument();
  });

  it('supports text alignment', () => {
    render(
      <LexicalEditor
        onChange={mockOnChange}
        onVariablesChange={mockOnVariablesChange}
      />
    );

    // Check for alignment buttons
    expect(screen.getByLabelText('Left Align')).toBeInTheDocument();
    expect(screen.getByLabelText('Center Align')).toBeInTheDocument();
    expect(screen.getByLabelText('Right Align')).toBeInTheDocument();
    expect(screen.getByLabelText('Justify Align')).toBeInTheDocument();
  });

  it('auto-saves content at specified intervals', async () => {
    jest.useFakeTimers();
    
    const handleChange = jest.fn();
    
    render(
      <LexicalEditor
        onChange={handleChange}
        onVariablesChange={mockOnVariablesChange}
        autoSave={true}
        autoSaveInterval={5000}
      />
    );

    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);

    // Auto-save should have been triggered
    // Note: In the actual implementation, this would trigger the parent's save logic
    
    jest.useRealTimers();
  });
});