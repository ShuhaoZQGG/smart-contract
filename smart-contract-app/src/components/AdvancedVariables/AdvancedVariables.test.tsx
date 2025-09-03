import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvancedVariables from './AdvancedVariables';
import { supabase } from '../../lib/supabase';

// Mock supabase client
jest.mock('../../lib/supabase');

describe('AdvancedVariables', () => {
  const mockTemplateId = 'test-template-id';
  const mockVariables = [
    { id: 'var1', name: 'customer_name', display_name: 'Customer Name', data_type: 'text' },
    { id: 'var2', name: 'discount_rate', display_name: 'Discount Rate', data_type: 'number' },
    { id: 'var3', name: 'is_vip', display_name: 'Is VIP', data_type: 'boolean' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (supabase as any).from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    }));
  });

  describe('Conditional Variables', () => {
    it('should render conditional variable configuration modal', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const conditionalOption = screen.getByLabelText(/Conditional/i);
      fireEvent.click(conditionalOption);
      
      expect(screen.getByText(/Configure Condition Logic/i)).toBeInTheDocument();
    });

    it('should create conditional variable with IF-THEN-ELSE logic', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'adv-var-1', type: 'conditional' },
        error: null,
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: mockInsert,
          })),
        })),
      });
      
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      // Select conditional type
      const conditionalOption = screen.getByLabelText(/Conditional/i);
      fireEvent.click(conditionalOption);
      
      // Configure condition
      const ifField = screen.getByLabelText(/If Variable/i);
      fireEvent.change(ifField, { target: { value: 'is_vip' } });
      
      const equalsField = screen.getByLabelText(/Equals/i);
      fireEvent.change(equalsField, { target: { value: 'true' } });
      
      const thenField = screen.getByLabelText(/Then Value/i);
      fireEvent.change(thenField, { target: { value: '20%' } });
      
      const elseField = screen.getByLabelText(/Else Value/i);
      fireEvent.change(elseField, { target: { value: '5%' } });
      
      const saveButton = screen.getByText(/Save Variable/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
    });

    it('should support nested conditions', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const conditionalOption = screen.getByLabelText(/Conditional/i);
      fireEvent.click(conditionalOption);
      
      const addNestedButton = screen.getByText(/Add Nested Condition/i);
      fireEvent.click(addNestedButton);
      
      expect(screen.getByText(/Nested Condition 1/i)).toBeInTheDocument();
    });
  });

  describe('Computed Variables', () => {
    it('should render computed variable configuration modal', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const computedOption = screen.getByLabelText(/Computed/i);
      fireEvent.click(computedOption);
      
      expect(screen.getByText(/Configure Formula/i)).toBeInTheDocument();
    });

    it('should create computed variable with mathematical formula', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'adv-var-2', type: 'computed' },
        error: null,
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: mockInsert,
          })),
        })),
      });
      
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      // Select computed type
      const computedOption = screen.getByLabelText(/Computed/i);
      fireEvent.click(computedOption);
      
      // Configure formula
      const formulaField = screen.getByLabelText(/Formula/i);
      fireEvent.change(formulaField, { target: { value: '{{price}} * {{quantity}} * (1 - {{discount_rate}}/100)' } });
      
      const saveButton = screen.getByText(/Save Variable/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
    });

    it('should validate formula syntax', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const computedOption = screen.getByLabelText(/Computed/i);
      fireEvent.click(computedOption);
      
      // Enter invalid formula
      const formulaField = screen.getByLabelText(/Formula/i);
      fireEvent.change(formulaField, { target: { value: '{{price} * {{quantity}}' } });
      
      const validateButton = screen.getByText(/Validate Formula/i);
      fireEvent.click(validateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid formula syntax/i)).toBeInTheDocument();
      });
    });

    it('should support date calculations', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const computedOption = screen.getByLabelText(/Computed/i);
      fireEvent.click(computedOption);
      
      const formulaTypeSelect = screen.getByLabelText(/Formula Type/i);
      fireEvent.change(formulaTypeSelect, { target: { value: 'date' } });
      
      expect(screen.getByText(/Date Functions/i)).toBeInTheDocument();
      expect(screen.getByText(/ADD_DAYS/i)).toBeInTheDocument();
      expect(screen.getByText(/DATE_DIFF/i)).toBeInTheDocument();
    });
  });

  describe('Lookup Variables', () => {
    it('should render lookup variable configuration modal', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const lookupOption = screen.getByLabelText(/Lookup/i);
      fireEvent.click(lookupOption);
      
      expect(screen.getByText(/Configure Data Source/i)).toBeInTheDocument();
    });

    it('should create lookup variable with database source', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'adv-var-3', type: 'lookup' },
        error: null,
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: mockInsert,
          })),
        })),
      });
      
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      // Select lookup type
      const lookupOption = screen.getByLabelText(/Lookup/i);
      fireEvent.click(lookupOption);
      
      // Configure lookup
      const sourceSelect = screen.getByLabelText(/Data Source/i);
      fireEvent.change(sourceSelect, { target: { value: 'database' } });
      
      const tableField = screen.getByLabelText(/Table Name/i);
      fireEvent.change(tableField, { target: { value: 'customers' } });
      
      const keyField = screen.getByLabelText(/Lookup Key/i);
      fireEvent.change(keyField, { target: { value: 'customer_id' } });
      
      const returnField = screen.getByLabelText(/Return Field/i);
      fireEvent.change(returnField, { target: { value: 'discount_tier' } });
      
      const saveButton = screen.getByText(/Save Variable/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
    });

    it('should support API endpoint lookups', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const lookupOption = screen.getByLabelText(/Lookup/i);
      fireEvent.click(lookupOption);
      
      const sourceSelect = screen.getByLabelText(/Data Source/i);
      fireEvent.change(sourceSelect, { target: { value: 'api' } });
      
      expect(screen.getByLabelText(/API Endpoint/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Authentication/i)).toBeInTheDocument();
    });

    it('should support CSV file lookups', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      const lookupOption = screen.getByLabelText(/Lookup/i);
      fireEvent.click(lookupOption);
      
      const sourceSelect = screen.getByLabelText(/Data Source/i);
      fireEvent.change(sourceSelect, { target: { value: 'csv' } });
      
      expect(screen.getByText(/Upload CSV File/i)).toBeInTheDocument();
    });
  });

  describe('Variable Management', () => {
    it('should list all advanced variables', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: [
          { id: 'adv1', type: 'conditional', variable_id: 'var1' },
          { id: 'adv2', type: 'computed', variable_id: null },
          { id: 'adv3', type: 'lookup', variable_id: 'var2' },
        ],
        error: null,
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockSelect()),
        })),
      });
      
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Conditional Variable/i)).toBeInTheDocument();
        expect(screen.getByText(/Computed Variable/i)).toBeInTheDocument();
        expect(screen.getByText(/Lookup Variable/i)).toBeInTheDocument();
      });
    });

    it('should edit existing advanced variable', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: [
          { 
            id: 'adv1', 
            type: 'conditional',
            variable_id: 'var1',
            condition_logic: {
              if: 'is_vip',
              equals: 'true',
              then: '20%',
              else: '5%'
            }
          },
        ],
        error: null,
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockSelect()),
        })),
      });
      
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Conditional Variable/i)).toBeInTheDocument();
      });
      
      const editButton = screen.getByLabelText(/Edit variable/i);
      fireEvent.click(editButton);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('20%')).toBeInTheDocument();
      });
    });

    it('should delete advanced variable', async () => {
      const mockDelete = jest.fn().mockResolvedValue({ error: null });
      const mockSelect = jest.fn().mockResolvedValue({
        data: [
          { id: 'adv1', type: 'conditional', variable_id: 'var1' },
        ],
        error: null,
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockSelect()),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => mockDelete()),
        })),
      });
      
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Conditional Variable/i)).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByLabelText(/Delete variable/i);
      fireEvent.click(deleteButton);
      
      // Confirm deletion
      const confirmButton = screen.getByText(/Confirm Delete/i);
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalled();
      });
    });
  });

  describe('Preview and Testing', () => {
    it('should preview variable output with test data', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const previewButton = screen.getByText(/Test Variables/i);
      fireEvent.click(previewButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Test Variable Values/i)).toBeInTheDocument();
      });
      
      // Enter test data
      const customerNameInput = screen.getByLabelText(/customer_name/i);
      fireEvent.change(customerNameInput, { target: { value: 'John Doe' } });
      
      const discountRateInput = screen.getByLabelText(/discount_rate/i);
      fireEvent.change(discountRateInput, { target: { value: '10' } });
      
      const runTestButton = screen.getByText(/Run Test/i);
      fireEvent.click(runTestButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Test Results/i)).toBeInTheDocument();
      });
    });

    it('should show errors for invalid variable configurations', async () => {
      render(<AdvancedVariables templateId={mockTemplateId} variables={mockVariables} />);
      
      const addButton = screen.getByText(/Add Advanced Variable/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Configure Advanced Variable/i)).toBeInTheDocument();
      });
      
      // Try to save without configuration
      const saveButton = screen.getByText(/Save Variable/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Please select a variable type/i)).toBeInTheDocument();
      });
    });
  });
});