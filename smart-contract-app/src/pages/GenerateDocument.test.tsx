import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import GenerateDocument from './GenerateDocument';
import { templateService } from '../services/templateService';

// Mock the services
jest.mock('../services/templateService');
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      }),
    },
  },
}));

const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('GenerateDocument Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Template Selection', () => {
    test('should display template selection dropdown', async () => {
      const mockTemplates = [
        { id: '1', name: 'Contract Template', description: 'Legal contract' },
        { id: '2', name: 'Invoice Template', description: 'Invoice document' },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);

      renderWithRouter(<GenerateDocument />);

      await waitFor(() => {
        expect(screen.getByText(/select template/i)).toBeInTheDocument();
      });

      expect(mockTemplateService.listTemplates).toHaveBeenCalled();
    });

    test('should load template variables when template is selected', async () => {
      const mockTemplates = [
        { id: '1', name: 'Contract Template' },
      ];
      const mockVariables = [
        { name: 'client_name', display_name: 'Client Name', data_type: 'text', is_required: true },
        { name: 'contract_date', display_name: 'Contract Date', data_type: 'date', is_required: true },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);

      renderWithRouter(<GenerateDocument />);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/client name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contract date/i)).toBeInTheDocument();
      });
    });

    test('should show loading state while fetching templates', async () => {
      mockTemplateService.listTemplates.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      renderWithRouter(<GenerateDocument />);

      expect(screen.getByText(/loading templates/i)).toBeInTheDocument();
    });

    test('should handle error when loading templates fails', async () => {
      mockTemplateService.listTemplates.mockRejectedValue(new Error('Failed to load templates'));

      renderWithRouter(<GenerateDocument />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load templates/i)).toBeInTheDocument();
      });
    });
  });

  describe('Variable Input', () => {
    test('should render input fields for each variable', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'name', display_name: 'Name', data_type: 'text', is_required: true },
        { name: 'email', display_name: 'Email', data_type: 'email', is_required: true },
        { name: 'amount', display_name: 'Amount', data_type: 'number', is_required: false },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);

      renderWithRouter(<GenerateDocument />);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/^name/i)).toHaveAttribute('type', 'text');
        expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
        expect(screen.getByLabelText(/amount/i)).toHaveAttribute('type', 'number');
      });
    });

    test('should validate required fields', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'name', display_name: 'Name', data_type: 'text', is_required: true },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);

      renderWithRouter(<GenerateDocument />);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Try to generate without filling required field
      const generateButton = await screen.findByText(/generate document/i);
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    test('should validate email format', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'email', display_name: 'Email', data_type: 'email', is_required: true },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);

      renderWithRouter(<GenerateDocument />);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Enter invalid email
      const emailInput = await screen.findByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalid-email');

      const generateButton = screen.getByText(/generate document/i);
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Document Generation', () => {
    test('should generate document with provided variables', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'name', display_name: 'Name', data_type: 'text', is_required: true },
      ];
      const mockGenerationResult = {
        success: true,
        downloadUrl: 'https://example.com/document.docx',
      };

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);
      mockTemplateService.generateDocument.mockResolvedValue(mockGenerationResult);

      renderWithRouter(<GenerateDocument />);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Fill in variables
      const nameInput = await screen.findByLabelText(/name/i);
      await userEvent.type(nameInput, 'John Doe');

      // Generate document
      const generateButton = screen.getByText(/generate document/i);
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockTemplateService.generateDocument).toHaveBeenCalledWith(
          '1',
          { name: 'John Doe' },
          'docx'
        );
      });

      expect(screen.getByText(/document generated successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/download/i)).toBeInTheDocument();
    });

    test('should allow selecting output format', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'name', display_name: 'Name', data_type: 'text', is_required: true },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);
      mockTemplateService.generateDocument.mockResolvedValue({ success: true });

      renderWithRouter(<GenerateDocument />);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Select PDF format
      const pdfRadio = await screen.findByLabelText(/pdf/i);
      fireEvent.click(pdfRadio);

      // Fill variables and generate
      const nameInput = screen.getByLabelText(/name/i);
      await userEvent.type(nameInput, 'John Doe');

      const generateButton = screen.getByText(/generate document/i);
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockTemplateService.generateDocument).toHaveBeenCalledWith(
          '1',
          { name: 'John Doe' },
          'pdf'
        );
      });
    });

    test('should show preview before generation', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'name', display_name: 'Name', data_type: 'text', is_required: true },
      ];
      const mockContent = 'Hello {{name}}, welcome to our service.';

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);
      mockTemplateService.getTemplateContent.mockResolvedValue(mockContent);

      renderWithRouter(<GenerateDocument />);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Fill variables
      const nameInput = await screen.findByLabelText(/name/i);
      await userEvent.type(nameInput, 'John Doe');

      // Click preview
      const previewButton = screen.getByText(/preview/i);
      fireEvent.click(previewButton);

      await waitFor(() => {
        expect(screen.getByText(/Hello John Doe, welcome to our service/i)).toBeInTheDocument();
      });
    });

    test('should handle generation errors', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockVariables = [
        { name: 'name', display_name: 'Name', data_type: 'text', is_required: true },
      ];

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.getTemplateVariables.mockResolvedValue(mockVariables as any);
      mockTemplateService.generateDocument.mockRejectedValue(new Error('Generation failed'));

      renderWithRouter(<GenerateDocument />);

      // Select template and fill variables
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      const nameInput = await screen.findByLabelText(/name/i);
      await userEvent.type(nameInput, 'John Doe');

      // Try to generate
      const generateButton = screen.getByText(/generate document/i);
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/generation failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Bulk Generation', () => {
    test('should toggle to bulk generation mode', async () => {
      renderWithRouter(<GenerateDocument />);

      const bulkToggle = screen.getByLabelText(/bulk generation/i);
      fireEvent.click(bulkToggle);

      expect(screen.getByText(/upload csv file/i)).toBeInTheDocument();
    });

    test('should handle CSV file upload', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);

      renderWithRouter(<GenerateDocument />);

      // Switch to bulk mode
      const bulkToggle = screen.getByLabelText(/bulk generation/i);
      fireEvent.click(bulkToggle);

      // Select template
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Upload CSV file
      const csvContent = 'name,email\nJohn,john@example.com\nJane,jane@example.com';
      const file = new File([csvContent], 'data.csv', { type: 'text/csv' });

      const fileInput = screen.getByLabelText(/upload csv/i);
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(screen.getByText(/2 rows detected/i)).toBeInTheDocument();
      });
    });

    test('should generate multiple documents from CSV', async () => {
      const mockTemplates = [{ id: '1', name: 'Template' }];
      const mockBulkResult = {
        success: true,
        documents: [
          { path: 'doc1.docx', variables: { name: 'John' } },
          { path: 'doc2.docx', variables: { name: 'Jane' } },
        ],
        count: 2,
      };

      mockTemplateService.listTemplates.mockResolvedValue(mockTemplates as any);
      mockTemplateService.bulkGenerate.mockResolvedValue(mockBulkResult);

      renderWithRouter(<GenerateDocument />);

      // Switch to bulk mode and select template
      const bulkToggle = screen.getByLabelText(/bulk generation/i);
      fireEvent.click(bulkToggle);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
      });

      // Upload CSV
      const csvContent = 'name\nJohn\nJane';
      const file = new File([csvContent], 'data.csv', { type: 'text/csv' });
      const fileInput = screen.getByLabelText(/upload csv/i);
      await userEvent.upload(fileInput, file);

      // Generate documents
      const generateButton = await screen.findByText(/generate all/i);
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockTemplateService.bulkGenerate).toHaveBeenCalled();
        expect(screen.getByText(/2 documents generated/i)).toBeInTheDocument();
      });
    });
  });
});