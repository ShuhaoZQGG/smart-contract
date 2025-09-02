import {
  generateDocument,
  generateBulkDocuments,
  extractVariablesFromTemplate,
  processCsvData,
  validateTemplate,
  generatePreview
} from './documentGenerator';

describe('documentGenerator', () => {
  describe('generateDocument', () => {
    it('should generate a document with replaced variables', () => {
      const result = generateDocument({
        template: 'Hello {{name}}, welcome to {{company}}!',
        variables: {
          name: 'John Doe',
          company: 'Acme Corp'
        }
      });

      expect(result.success).toBe(true);
      expect(result.content).toBe('Hello John Doe, welcome to Acme Corp!');
      expect(result.metadata?.variablesUsed).toEqual(['name', 'company']);
    });

    it('should return error for missing variables', () => {
      const result = generateDocument({
        template: 'Hello {{name}}, welcome to {{company}}!',
        variables: {
          name: 'John Doe'
        }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Missing required variables: company');
    });

    it('should generate base64 content for binary formats', () => {
      const result = generateDocument({
        template: 'Hello {{name}}',
        variables: { name: 'John' },
        outputFormat: 'docx'
      });

      expect(result.success).toBe(true);
      expect(result.base64).toBeDefined();
      expect(result.base64).toBe(btoa('Hello John'));
    });

    it('should include metadata in the result', () => {
      const result = generateDocument({
        template: 'Test {{var}}',
        variables: { var: 'value' },
        outputFormat: 'pdf'
      });

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.format).toBe('pdf');
      expect(result.metadata?.generatedAt).toBeInstanceOf(Date);
      expect(result.metadata?.variablesUsed).toEqual(['var']);
    });
  });

  describe('generateBulkDocuments', () => {
    const template = 'Dear {{name}}, your order #{{order}} is ready.';
    const data = [
      { name: 'Alice', order: '001' },
      { name: 'Bob', order: '002' },
      { name: 'Charlie', order: '003' }
    ];

    it('should generate multiple documents from bulk data', () => {
      const results = generateBulkDocuments({
        template,
        data
      });

      expect(results).toHaveLength(3);
      expect(results[0].content).toBe('Dear Alice, your order #001 is ready.');
      expect(results[1].content).toBe('Dear Bob, your order #002 is ready.');
      expect(results[2].content).toBe('Dear Charlie, your order #003 is ready.');
    });

    it('should apply filename pattern to each document', () => {
      const results = generateBulkDocuments({
        template,
        data,
        filenamePattern: 'order_{{order}}_{{name}}'
      });

      expect((results[0].metadata as any)?.filename).toBe('order_001_Alice');
      expect((results[1].metadata as any)?.filename).toBe('order_002_Bob');
      expect((results[2].metadata as any)?.filename).toBe('order_003_Charlie');
    });

    it('should include index and date in filename pattern', () => {
      const results = generateBulkDocuments({
        template: 'Hello {{name}}',
        data: [{ name: 'Test' }],
        filenamePattern: 'doc_{{index}}_{{date}}'
      });

      const today = new Date().toISOString().split('T')[0];
      expect((results[0].metadata as any)?.filename).toBe(`doc_1_${today}`);
    });
  });

  describe('extractVariablesFromTemplate', () => {
    it('should extract all unique variables from template', () => {
      const template = 'Hello {{name}}, {{name}} works at {{company}}';
      const variables = extractVariablesFromTemplate(template);

      expect(variables).toEqual(['name', 'company']);
    });

    it('should return empty array for template without variables', () => {
      const template = 'Hello world!';
      const variables = extractVariablesFromTemplate(template);

      expect(variables).toEqual([]);
    });

    it('should handle complex variable names', () => {
      const template = '{{firstName}} {{lastName}} - {{email_address}} ({{user_id}})';
      const variables = extractVariablesFromTemplate(template);

      expect(variables).toContain('firstName');
      expect(variables).toContain('lastName');
      expect(variables).toContain('email_address');
      expect(variables).toContain('user_id');
    });
  });

  describe('processCsvData', () => {
    it('should parse CSV content into array of objects', () => {
      const csv = `name,age,city
John,30,New York
Jane,25,Los Angeles
Bob,35,Chicago`;

      const data = processCsvData(csv);

      expect(data).toHaveLength(3);
      expect(data[0]).toEqual({ name: 'John', age: '30', city: 'New York' });
      expect(data[1]).toEqual({ name: 'Jane', age: '25', city: 'Los Angeles' });
      expect(data[2]).toEqual({ name: 'Bob', age: '35', city: 'Chicago' });
    });

    it('should handle quoted values', () => {
      const csv = `name,description
"John Doe","A person with, comma"
"Jane","Simple description"`;

      const data = processCsvData(csv);

      expect(data[0].name).toBe('John Doe');
      expect(data[0].description).toBe('A person with, comma');
    });

    it('should throw error for invalid CSV', () => {
      expect(() => processCsvData('header only')).toThrow(
        'CSV must have at least a header row and one data row'
      );
    });

    it('should handle empty values', () => {
      const csv = `name,age,city
John,,New York
,25,`;

      const data = processCsvData(csv);

      expect(data[0]).toEqual({ name: 'John', age: '', city: 'New York' });
      expect(data[1]).toEqual({ name: '', age: '25', city: '' });
    });
  });

  describe('validateTemplate', () => {
    it('should validate correct template', () => {
      const result = validateTemplate('Hello {{name}}, welcome to {{company}}!');

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect mismatched brackets', () => {
      const result = validateTemplate('Hello {{name}, welcome to {{company}}!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mismatched variable brackets');
    });

    it('should detect invalid variable names', () => {
      const result = validateTemplate('Hello {{name-with-dashes}}!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid variable name: name-with-dashes');
    });

    it('should detect multiple errors', () => {
      const result = validateTemplate('Hello {{name}, {{invalid-var}}');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('generatePreview', () => {
    it('should generate preview with sample data', () => {
      const template = 'Hello {{name}}, your balance is {{balance}}';
      const preview = generatePreview(template, {
        name: 'John',
        balance: '$100'
      });

      expect(preview).toBe('Hello John, your balance is $100');
    });

    it('should generate preview with placeholder data', () => {
      const template = 'Hello {{name}}, your balance is {{balance}}';
      const preview = generatePreview(template);

      expect(preview).toBe('Hello [name], your balance is [balance]');
    });

    it('should use provided sample data and generate placeholders for missing', () => {
      const template = 'Hello {{name}}, your balance is {{balance}}';
      const preview = generatePreview(template, {
        name: 'John'
      });

      expect(preview).toBe('Hello John, your balance is [balance]');
    });
  });
});