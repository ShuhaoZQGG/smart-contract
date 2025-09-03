import { templateService } from './templateService';
import { supabase } from '../lib/supabase';

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              single: jest.fn(),
            })),
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
    functions: {
      invoke: jest.fn(),
    },
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('Template Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    test('should create a new template with correct data', async () => {
      const mockTemplate = {
        id: 'template-123',
        name: 'Test Template',
        description: 'Test Description',
        user_id: 'user-123',
        storage_path: 'templates/template-123.docx',
      };

      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockTemplate, error: null }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const result = await templateService.createTemplate({
        name: 'Test Template',
        description: 'Test Description',
        file: new File(['content'], 'test.docx'),
      });

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Template',
        description: 'Test Description',
        user_id: 'user-123',
      }));
      expect(result).toEqual(mockTemplate);
    });

    test('should upload file to storage before creating template', async () => {
      const mockFile = new File(['test content'], 'test.docx');
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'templates/test.docx' },
        error: null,
      });

      (supabase.storage.from as jest.Mock).mockReturnValue({ upload: mockUpload });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      await templateService.createTemplate({
        name: 'Test Template',
        description: 'Test Description',
        file: mockFile,
      });

      expect(supabase.storage.from).toHaveBeenCalledWith('templates');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('user-123'),
        mockFile,
        expect.any(Object)
      );
    });

    test('should handle errors when creating template', async () => {
      const mockError = new Error('Database error');
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(
        templateService.createTemplate({
          name: 'Test Template',
          description: 'Test Description',
          file: new File(['content'], 'test.docx'),
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('extractVariables', () => {
    test('should extract variables from template content', async () => {
      const mockContent = 'Hello {{name}}, your order {{order_id}} is ready.';
      const expectedVariables = ['name', 'order_id'];

      const mockInvoke = jest.fn().mockResolvedValue({
        data: { variables: expectedVariables },
        error: null,
      });

      (supabase.functions.invoke as jest.Mock) = mockInvoke;

      const result = await templateService.extractVariables('template-123', mockContent);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('process-docx', {
        body: {
          action: 'extractVariables',
          content: mockContent,
        },
      });
      expect(result).toEqual(expectedVariables);
    });

    test('should handle templates with no variables', async () => {
      const mockContent = 'Hello world, this is a static template.';
      const mockInvoke = jest.fn().mockResolvedValue({
        data: { variables: [] },
        error: null,
      });

      (supabase.functions.invoke as jest.Mock) = mockInvoke;

      const result = await templateService.extractVariables('template-123', mockContent);

      expect(result).toEqual([]);
    });

    test('should handle duplicate variables', async () => {
      const mockContent = 'Hello {{name}}, {{name}} your order {{order_id}} is ready.';
      const expectedVariables = ['name', 'order_id'];

      const mockInvoke = jest.fn().mockResolvedValue({
        data: { variables: expectedVariables },
        error: null,
      });

      (supabase.functions.invoke as jest.Mock) = mockInvoke;

      const result = await templateService.extractVariables('template-123', mockContent);

      expect(result).toEqual(expectedVariables);
    });
  });

  describe('generateDocument', () => {
    test('should generate document with variable substitution', async () => {
      const mockVariables = {
        name: 'John Doe',
        order_id: '12345',
      };

      const mockInvoke = jest.fn().mockResolvedValue({
        data: {
          success: true,
          downloadUrl: 'https://storage.example.com/generated.docx',
        },
        error: null,
      });

      (supabase.functions.invoke as jest.Mock) = mockInvoke;
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const result = await templateService.generateDocument(
        'template-123',
        mockVariables,
        'docx'
      );

      expect(supabase.functions.invoke).toHaveBeenCalledWith('process-docx', {
        body: {
          action: 'generateDocument',
          templateId: 'template-123',
          variableValues: mockVariables,
          userId: 'user-123',
          outputFormat: 'docx',
        },
      });
      expect(result).toHaveProperty('downloadUrl');
    });

    test('should support PDF output format', async () => {
      const mockVariables = { name: 'Jane Doe' };

      const mockInvoke = jest.fn().mockResolvedValue({
        data: {
          success: true,
          downloadUrl: 'https://storage.example.com/generated.pdf',
        },
        error: null,
      });

      (supabase.functions.invoke as jest.Mock) = mockInvoke;
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      await templateService.generateDocument('template-123', mockVariables, 'pdf');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('process-docx', {
        body: expect.objectContaining({
          outputFormat: 'pdf',
        }),
      });
    });

    test('should handle generation errors', async () => {
      const mockError = new Error('Generation failed');
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        templateService.generateDocument('template-123', { name: 'Test' }, 'docx')
      ).rejects.toThrow('Generation failed');
    });
  });

  describe('bulkGenerate', () => {
    test('should generate multiple documents from CSV data', async () => {
      const mockCsvData = [
        { name: 'John', order_id: '001' },
        { name: 'Jane', order_id: '002' },
        { name: 'Bob', order_id: '003' },
      ];

      const mockInvoke = jest.fn().mockResolvedValue({
        data: {
          success: true,
          documents: [
            { path: 'doc1.docx', variables: mockCsvData[0] },
            { path: 'doc2.docx', variables: mockCsvData[1] },
            { path: 'doc3.docx', variables: mockCsvData[2] },
          ],
          count: 3,
        },
        error: null,
      });

      (supabase.functions.invoke as jest.Mock) = mockInvoke;
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const result = await templateService.bulkGenerate(
        'template-123',
        mockCsvData,
        'docx'
      );

      expect(supabase.functions.invoke).toHaveBeenCalledWith('process-docx', {
        body: {
          action: 'bulkGenerate',
          templateId: 'template-123',
          csvData: mockCsvData,
          userId: 'user-123',
          outputFormat: 'docx',
        },
      });
      expect(result.count).toBe(3);
      expect(result.documents).toHaveLength(3);
    });

    test('should handle empty CSV data', async () => {
      const result = await templateService.bulkGenerate('template-123', [], 'docx');
      expect(result.count).toBe(0);
      expect(result.documents).toEqual([]);
    });

    test('should handle bulk generation errors', async () => {
      const mockError = new Error('Bulk generation failed');
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        templateService.bulkGenerate('template-123', [{ name: 'Test' }], 'docx')
      ).rejects.toThrow('Bulk generation failed');
    });
  });

  describe('updateTemplate', () => {
    test('should update template content and create new version', async () => {
      const mockContent = 'Updated content with {{new_variable}}';
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'template-123', updated_at: new Date() },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({
        data: { success: true, version: 2 },
        error: null,
      });

      const result = await templateService.updateTemplate('template-123', mockContent);

      expect(supabase.functions.invoke).toHaveBeenCalledWith('process-docx', {
        body: {
          action: 'processTemplate',
          templateId: 'template-123',
          content: mockContent,
          userId: expect.any(String),
        },
      });
      expect(result).toHaveProperty('version', 2);
    });
  });

  describe('listTemplates', () => {
    test('should retrieve user templates', async () => {
      const mockTemplates = [
        { id: '1', name: 'Template 1' },
        { id: '2', name: 'Template 2' },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockTemplates,
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const result = await templateService.listTemplates();

      expect(supabase.from).toHaveBeenCalledWith('templates');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockTemplates);
    });

    test('should handle empty template list', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const result = await templateService.listTemplates();
      expect(result).toEqual([]);
    });
  });
});