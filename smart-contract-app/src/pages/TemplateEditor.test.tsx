import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TemplateEditor from './TemplateEditor';
import { templateService } from '../services/templateService';

// Mock services
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

// Mock useParams
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock Lexical Editor
jest.mock('../components/LexicalEditor/LexicalEditor', () => ({
  __esModule: true,
  default: ({ initialContent, onChange, onVariableInsert }: any) => (
    <div data-testid="lexical-editor">
      <textarea
        data-testid="editor-textarea"
        value={initialContent}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={() => onVariableInsert('test_variable')}>
        Insert Variable
      </button>
    </div>
  ),
}));

const mockTemplateService = templateService as jest.Mocked<typeof templateService>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('TemplateEditor Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({});
  });

  describe('Editor Initialization', () => {
    test('should load template content when template ID is provided', async () => {
      const mockTemplate = {
        id: 'template-123',
        name: 'Test Template',
        description: 'Test Description',
      };
      const mockContent = 'Hello {{name}}, welcome to {{company}}.';

      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate as any);
      mockTemplateService.getTemplateContent.mockResolvedValue(mockContent);

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        expect(mockTemplateService.getTemplate).toHaveBeenCalledWith('template-123');
        expect(mockTemplateService.getTemplateContent).toHaveBeenCalledWith('template-123');
      });

      const editor = screen.getByTestId('editor-textarea');
      expect(editor).toHaveValue(mockContent);
    });

    test('should start with empty editor for new template', () => {
      renderWithRouter(<TemplateEditor />);

      const editor = screen.getByTestId('editor-textarea');
      expect(editor).toHaveValue('');
    });

    test('should display template name in header', async () => {
      const mockTemplate = {
        id: 'template-123',
        name: 'Contract Template',
      };

      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate as any);
      mockTemplateService.getTemplateContent.mockResolvedValue('');

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        expect(screen.getByText(/contract template/i)).toBeInTheDocument();
      });
    });
  });

  describe('Variable Insertion', () => {
    test('should insert variable at cursor position', async () => {
      renderWithRouter(<TemplateEditor />);

      const editor = screen.getByTestId('editor-textarea');
      await userEvent.type(editor, 'Hello ');

      const insertButton = screen.getByText(/insert variable/i);
      fireEvent.click(insertButton);

      await waitFor(() => {
        expect(editor).toHaveValue('Hello {{test_variable}}');
      });
    });

    test('should show variable insertion dialog', async () => {
      renderWithRouter(<TemplateEditor />);

      const insertVariableButton = screen.getByRole('button', { name: /add variable/i });
      fireEvent.click(insertVariableButton);

      await waitFor(() => {
        expect(screen.getByText(/enter variable name/i)).toBeInTheDocument();
      });
    });

    test('should validate variable name format', async () => {
      renderWithRouter(<TemplateEditor />);

      const insertVariableButton = screen.getByRole('button', { name: /add variable/i });
      fireEvent.click(insertVariableButton);

      const input = await screen.findByPlaceholderText(/variable name/i);
      await userEvent.type(input, 'invalid-name-123');

      const confirmButton = screen.getByText(/confirm/i);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid variable name/i)).toBeInTheDocument();
      });
    });

    test('should display list of existing variables', async () => {
      const mockContent = 'Hello {{name}}, your order {{order_id}} is ready.';
      
      renderWithRouter(<TemplateEditor />);

      const editor = screen.getByTestId('editor-textarea');
      await userEvent.clear(editor);
      await userEvent.type(editor, mockContent);

      await waitFor(() => {
        expect(screen.getByText(/variables used/i)).toBeInTheDocument();
        expect(screen.getByText(/name/i)).toBeInTheDocument();
        expect(screen.getByText(/order_id/i)).toBeInTheDocument();
      });
    });

    test('should highlight variables in preview', async () => {
      const mockContent = 'Hello {{name}}, welcome!';
      
      renderWithRouter(<TemplateEditor />);

      const editor = screen.getByTestId('editor-textarea');
      await userEvent.type(editor, mockContent);

      const previewButton = screen.getByText(/preview/i);
      fireEvent.click(previewButton);

      await waitFor(() => {
        const preview = screen.getByTestId('template-preview');
        expect(preview.innerHTML).toContain('variable-highlight');
      });
    });
  });

  describe('Template Saving', () => {
    test('should save template content', async () => {
      const mockTemplate = {
        id: 'template-123',
        name: 'Test Template',
      };

      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate as any);
      mockTemplateService.getTemplateContent.mockResolvedValue('Initial content');
      mockTemplateService.updateTemplate.mockResolvedValue({ success: true, version: 2 });

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        const editor = screen.getByTestId('editor-textarea');
        expect(editor).toHaveValue('Initial content');
      });

      // Modify content
      const editor = screen.getByTestId('editor-textarea');
      await userEvent.clear(editor);
      await userEvent.type(editor, 'Updated content with {{variable}}');

      // Save
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockTemplateService.updateTemplate).toHaveBeenCalledWith(
          'template-123',
          'Updated content with {{variable}}'
        );
      });

      expect(screen.getByText(/template saved/i)).toBeInTheDocument();
    });

    test('should show auto-save indicator', async () => {
      renderWithRouter(<TemplateEditor />);

      const editor = screen.getByTestId('editor-textarea');
      await userEvent.type(editor, 'Some content');

      // Wait for auto-save delay
      await waitFor(() => {
        expect(screen.getByText(/saving/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('should handle save errors', async () => {
      mockTemplateService.updateTemplate.mockRejectedValue(new Error('Save failed'));

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/save failed/i)).toBeInTheDocument();
      });
    });

    test('should prevent navigation with unsaved changes', async () => {
      const mockTemplate = { id: 'template-123', name: 'Test' };
      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate as any);
      mockTemplateService.getTemplateContent.mockResolvedValue('Initial');

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        const editor = screen.getByTestId('editor-textarea');
        expect(editor).toHaveValue('Initial');
      });

      // Make changes
      const editor = screen.getByTestId('editor-textarea');
      await userEvent.type(editor, ' changed');

      // Try to navigate away
      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
      
      // Simulate navigation attempt
      window.dispatchEvent(new Event('beforeunload'));

      expect(mockConfirm).toHaveBeenCalled();
      mockConfirm.mockRestore();
    });
  });

  describe('Formatting Tools', () => {
    test('should display formatting toolbar', () => {
      renderWithRouter(<TemplateEditor />);

      expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument();
    });

    test('should support undo/redo operations', async () => {
      renderWithRouter(<TemplateEditor />);

      const editor = screen.getByTestId('editor-textarea');
      await userEvent.type(editor, 'First text');
      
      const undoButton = screen.getByRole('button', { name: /undo/i });
      fireEvent.click(undoButton);

      expect(editor).toHaveValue('');

      const redoButton = screen.getByRole('button', { name: /redo/i });
      fireEvent.click(redoButton);

      expect(editor).toHaveValue('First text');
    });
  });

  describe('Template Metadata', () => {
    test('should allow editing template name', async () => {
      const mockTemplate = {
        id: 'template-123',
        name: 'Old Name',
      };

      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate as any);

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('Old Name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'New Name');

      expect(nameInput).toHaveValue('New Name');
    });

    test('should allow editing template description', async () => {
      const mockTemplate = {
        id: 'template-123',
        name: 'Template',
        description: 'Old description',
      };

      mockTemplateService.getTemplate.mockResolvedValue(mockTemplate as any);

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Old description')).toBeInTheDocument();
      });

      const descInput = screen.getByDisplayValue('Old description');
      await userEvent.clear(descInput);
      await userEvent.type(descInput, 'New description');

      expect(descInput).toHaveValue('New description');
    });
  });

  describe('Version History', () => {
    test('should display version history', async () => {
      const mockVersions = [
        { version_number: 1, created_at: '2024-01-01', created_by: 'user-123' },
        { version_number: 2, created_at: '2024-01-02', created_by: 'user-123' },
      ];

      mockTemplateService.getTemplateVersions = jest.fn().mockResolvedValue(mockVersions);

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      const historyButton = screen.getByText(/version history/i);
      fireEvent.click(historyButton);

      await waitFor(() => {
        expect(screen.getByText(/version 1/i)).toBeInTheDocument();
        expect(screen.getByText(/version 2/i)).toBeInTheDocument();
      });
    });

    test('should allow reverting to previous version', async () => {
      const mockVersions = [
        { id: 'v1', version_number: 1, content: { text: 'Version 1 content' } },
        { id: 'v2', version_number: 2, content: { text: 'Version 2 content' } },
      ];

      mockTemplateService.getTemplateVersions = jest.fn().mockResolvedValue(mockVersions);
      mockTemplateService.revertToVersion = jest.fn().mockResolvedValue({ success: true });

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      const historyButton = screen.getByText(/version history/i);
      fireEvent.click(historyButton);

      await waitFor(() => {
        const revertButton = screen.getByText(/revert to version 1/i);
        fireEvent.click(revertButton);
      });

      expect(mockTemplateService.revertToVersion).toHaveBeenCalledWith('template-123', 'v1');
    });
  });

  describe('Collaboration Features', () => {
    test('should show active users', async () => {
      const mockActiveUsers = [
        { id: 'user-1', name: 'John Doe', avatar: 'avatar1.jpg' },
        { id: 'user-2', name: 'Jane Smith', avatar: 'avatar2.jpg' },
      ];

      mockTemplateService.getActiveUsers = jest.fn().mockResolvedValue(mockActiveUsers);

      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
      });
    });

    test('should show user cursors in collaborative mode', async () => {
      mockUseParams.mockReturnValue({ id: 'template-123' });
      renderWithRouter(<TemplateEditor />);

      await waitFor(() => {
        expect(screen.getByTestId('collaboration-indicator')).toBeInTheDocument();
      });
    });
  });
});