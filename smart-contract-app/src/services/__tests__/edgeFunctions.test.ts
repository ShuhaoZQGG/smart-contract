import { edgeFunctions } from '../edgeFunctions';

describe('EdgeFunctions Service', () => {
  describe('extractVariables', () => {
    it('should extract variables from template content', async () => {
      const content = 'Hello {{name}}, your appointment is on {{date}} at {{time}}.';
      const mockResponse = {
        success: true,
        variables: [
          { name: 'name', display_name: 'Name', data_type: 'text', position: 0, is_required: true },
          { name: 'date', display_name: 'Date', data_type: 'date', position: 1, is_required: true },
          { name: 'time', display_name: 'Time', data_type: 'text', position: 2, is_required: true }
        ],
        count: 3
      };

      // Mock the supabase functions.invoke
      jest.spyOn(edgeFunctions as any, 'invokeFunction').mockResolvedValue(mockResponse);

      const result = await edgeFunctions.extractVariables(content);
      
      expect(result.success).toBe(true);
      expect(result.count).toBe(3);
      expect(result.variables).toHaveLength(3);
      expect(result.variables[0].name).toBe('name');
    });
  });

  describe('parseCsvContent', () => {
    it('should parse simple CSV content correctly', () => {
      const csvContent = `name,email,amount
John Doe,john@example.com,100
Jane Smith,jane@example.com,200`;

      const result = edgeFunctions.parseCsvContent(csvContent);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        amount: '100'
      });
      expect(result[1]).toEqual({
        name: 'Jane Smith',
        email: 'jane@example.com',
        amount: '200'
      });
    });

    it('should handle CSV with quoted values', () => {
      const csvContent = `name,address,city
"John Doe","123 Main St, Apt 4","New York"
"Jane Smith","456 Oak Ave","Los Angeles"`;

      const result = edgeFunctions.parseCsvContent(csvContent);
      
      expect(result).toHaveLength(2);
      expect(result[0].address).toBe('123 Main St, Apt 4');
      expect(result[1].city).toBe('Los Angeles');
    });

    it('should handle CSV with escaped quotes', () => {
      const csvContent = `name,description
"John ""JD"" Doe","He said ""Hello"""
"Jane Smith","Regular text"`;

      const result = edgeFunctions.parseCsvContent(csvContent);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John "JD" Doe');
      expect(result[0].description).toBe('He said "Hello"');
    });

    it('should throw error for empty CSV', () => {
      const csvContent = '';
      
      expect(() => edgeFunctions.parseCsvContent(csvContent)).toThrow(
        'CSV must have at least a header row and one data row'
      );
    });

    it('should throw error for CSV with only headers', () => {
      const csvContent = 'name,email,amount';
      
      expect(() => edgeFunctions.parseCsvContent(csvContent)).toThrow(
        'CSV must have at least a header row and one data row'
      );
    });
  });

  describe('generateDocument', () => {
    it('should generate document with variable replacement', async () => {
      const params = {
        templateId: 'test-template-id',
        variableValues: {
          client_name: 'John Doe',
          agreement_date: '2025-01-02',
          loan_amount: '50000'
        },
        userId: 'test-user-id',
        outputFormat: 'docx' as const
      };

      const mockResponse = {
        success: true,
        document: {
          id: 'doc-123',
          template_id: 'test-template-id',
          user_id: 'test-user-id',
          variable_values: params.variableValues,
          storage_path: 'test-user-id/generated_123456.docx'
        },
        downloadUrl: 'https://example.com/download/doc-123',
        content: 'Generated document content with John Doe'
      };

      jest.spyOn(edgeFunctions as any, 'invokeFunction').mockResolvedValue(mockResponse);

      const result = await edgeFunctions.generateDocument(params);
      
      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.downloadUrl).toBeDefined();
      expect(result.document.variable_values).toEqual(params.variableValues);
    });
  });

  describe('bulkGenerate', () => {
    it('should generate multiple documents from CSV data', async () => {
      const params = {
        templateId: 'test-template-id',
        csvData: [
          { name: 'John Doe', amount: '1000' },
          { name: 'Jane Smith', amount: '2000' }
        ],
        userId: 'test-user-id',
        outputFormat: 'pdf' as const
      };

      const mockResponse = {
        success: true,
        generated: 2,
        failed: 0,
        results: [
          {
            index: 0,
            success: true,
            document: { id: 'doc-1' },
            downloadUrl: 'https://example.com/download/doc-1'
          },
          {
            index: 1,
            success: true,
            document: { id: 'doc-2' },
            downloadUrl: 'https://example.com/download/doc-2'
          }
        ],
        errors: []
      };

      jest.spyOn(edgeFunctions as any, 'invokeFunction').mockResolvedValue(mockResponse);

      const result = await edgeFunctions.bulkGenerate(params);
      
      expect(result.success).toBe(true);
      expect(result.generated).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(2);
    });

    it('should handle partial failures in bulk generation', async () => {
      const params = {
        templateId: 'test-template-id',
        csvData: [
          { name: 'John Doe', amount: '1000' },
          { name: '', amount: '2000' } // Invalid data
        ],
        userId: 'test-user-id'
      };

      const mockResponse = {
        success: true,
        generated: 1,
        failed: 1,
        results: [
          {
            index: 0,
            success: true,
            document: { id: 'doc-1' },
            downloadUrl: 'https://example.com/download/doc-1'
          }
        ],
        errors: [
          {
            index: 1,
            error: 'Name is required',
            data: { name: '', amount: '2000' }
          }
        ]
      };

      jest.spyOn(edgeFunctions as any, 'invokeFunction').mockResolvedValue(mockResponse);

      const result = await edgeFunctions.bulkGenerate(params);
      
      expect(result.success).toBe(true);
      expect(result.generated).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toBe('Name is required');
    });
  });
});