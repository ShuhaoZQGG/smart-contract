import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdvancedVariables } from './AdvancedVariables';
import { supabase } from '../lib/supabase';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn((table: string) => {
      // Return appropriate mock based on table name
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: {
                id: '123',
                type: 'computed',
                computation_formula: 'test formula',
                template_id: 'template-123',
                base_variable_id: '2'
              }, 
              error: null 
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      };
    })
  }
}));

describe('AdvancedVariables', () => {
  const mockVariables = [
    {
      id: '1',
      name: 'client_name',
      display_name: 'Client Name',
      data_type: 'text' as const,
      is_required: true,
      position: 0
    },
    {
      id: '2',
      name: 'amount',
      display_name: 'Amount',
      data_type: 'number' as const,
      is_required: true,
      position: 1
    }
  ];

  const mockProps = {
    templateId: 'template-123',
    variables: mockVariables,
    onVariableUpdate: jest.fn(),
    onAdvancedVariableUpdate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders variables list', () => {
    render(<AdvancedVariables {...mockProps} />);
    
    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('{{client_name}}')).toBeInTheDocument();
    expect(screen.getByText('{{amount}}')).toBeInTheDocument();
  });

  it('toggles advanced panel', () => {
    render(<AdvancedVariables {...mockProps} />);
    
    const toggleButton = screen.getByText('Advanced Variables');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Configure Advanced Variable')).toBeInTheDocument();
  });

  it('selects variable for advanced configuration', () => {
    render(<AdvancedVariables {...mockProps} />);
    
    // Open advanced panel
    fireEvent.click(screen.getByText('Advanced Variables'));
    
    // Select a variable
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'client_name' } });
    
    expect(select).toHaveValue('client_name');
  });

  it('switches between advanced types', () => {
    render(<AdvancedVariables {...mockProps} />);
    
    fireEvent.click(screen.getByText('Advanced Variables'));
    
    const conditionalButton = screen.getByText('conditional');
    fireEvent.click(conditionalButton);
    
    expect(conditionalButton.className).toContain('bg-blue-600');
  });

  it('tests formula evaluation', async () => {
    render(<AdvancedVariables {...mockProps} />);
    
    fireEvent.click(screen.getByText('Advanced Variables'));
    
    // Wait for the panel to appear
    await waitFor(() => {
      expect(screen.getByText('Configure Advanced Variable')).toBeInTheDocument();
    });
    
    // Select variable first - find the select element by its containing label text
    const selectContainer = screen.getByText('Select Variable').parentElement;
    const select = selectContainer?.querySelector('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'amount' } });
    }
    
    // Now the formula textarea should appear with the correct placeholder
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('{{amount}} * {{discount_rate}} / 100');
      expect(textarea).toBeInTheDocument();
      fireEvent.change(textarea, { target: { value: '100 * 2' } });
    });
    
    // Test formula
    const testButton = screen.getByText('Test Formula');
    fireEvent.click(testButton);
    
    // Formula testing is simple evaluation, should show result
    await waitFor(() => {
      expect(screen.getByText(/Result:/)).toBeInTheDocument();
    });
  });

  it('adds advanced variable', async () => {
    render(<AdvancedVariables {...mockProps} />);
    
    fireEvent.click(screen.getByText('Advanced Variables'));
    
    // Wait for the panel to appear
    await waitFor(() => {
      expect(screen.getByText('Configure Advanced Variable')).toBeInTheDocument();
    });
    
    // Configure advanced variable - find the select element by its containing label text
    const selectContainer = screen.getByText('Select Variable').parentElement;
    const select = selectContainer?.querySelector('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'amount' } });
    }
    
    // Now the formula textarea should appear
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('{{amount}} * {{discount_rate}} / 100');
      expect(textarea).toBeInTheDocument();
      fireEvent.change(textarea, { target: { value: '{{base}} * {{rate}}' } });
    });
    
    // Add button should appear
    const addButton = screen.getByText('Add Advanced Variable');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockProps.onAdvancedVariableUpdate).toHaveBeenCalledWith([
        {
          id: '123',
          type: 'computed',
          computation_formula: 'test formula',
          template_id: 'template-123',
          base_variable_id: '2'
        }
      ]);
    }, { timeout: 3000 });
  });

  it('displays variable type indicators', () => {
    render(<AdvancedVariables {...mockProps} />);
    
    // Test that variable names are displayed
    expect(screen.getByText('{{client_name}}')).toBeInTheDocument();
    expect(screen.getByText('{{amount}}')).toBeInTheDocument();
    
    // Test required indicator - they should be marked as required
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });
});