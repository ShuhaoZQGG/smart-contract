import { generateDocument, bulkGenerateDocuments } from './documentGenerator';

describe('Document Generator', () => {
  describe('generateDocument', () => {
    it('should generate document with variable substitution', () => {
      const template = 'Dear {{client_name}},\n\nThis agreement is between {{company_name}} and {{client_name}}.';
      const variables = {
        client_name: 'John Doe',
        company_name: 'ACME Corp'
      };
      
      const result = generateDocument(template, variables);
      
      expect(result).toBe('Dear John Doe,\n\nThis agreement is between ACME Corp and John Doe.');
    });

    it('should handle missing variables', () => {
      const template = 'Hello {{name}}, your balance is {{amount}}.';
      const variables = {
        name: 'Jane Smith'
        // amount is missing
      };
      
      const result = generateDocument(template, variables);
      
      expect(result).toBe('Hello Jane Smith, your balance is {{amount}}.');
    });

    it('should handle empty variables object', () => {
      const template = 'Template with {{var1}} and {{var2}}.';
      const variables = {};
      
      const result = generateDocument(template, variables);
      
      expect(result).toBe('Template with {{var1}} and {{var2}}.');
    });

    it('should handle special characters in values', () => {
      const template = 'Amount: {{amount}}, Description: {{description}}';
      const variables = {
        amount: '$1,000.50',
        description: 'Payment for "services" & goods'
      };
      
      const result = generateDocument(template, variables);
      
      expect(result).toBe('Amount: $1,000.50, Description: Payment for "services" & goods');
    });
  });

  describe('bulkGenerateDocuments', () => {
    it('should generate multiple documents from array', () => {
      const template = 'Invoice for {{client}}: ${{amount}}';
      const dataRows = [
        { client: 'Client A', amount: '100' },
        { client: 'Client B', amount: '200' },
        { client: 'Client C', amount: '300' }
      ];
      
      const results = bulkGenerateDocuments(template, dataRows);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toBe('Invoice for Client A: $100');
      expect(results[1]).toBe('Invoice for Client B: $200');
      expect(results[2]).toBe('Invoice for Client C: $300');
    });

    it('should handle empty data array', () => {
      const template = 'Template {{var}}';
      const dataRows: Record<string, string>[] = [];
      
      const results = bulkGenerateDocuments(template, dataRows);
      
      expect(results).toEqual([]);
    });

    it('should handle inconsistent data rows', () => {
      const template = 'Name: {{name}}, Age: {{age}}';
      const dataRows = [
        { name: 'Alice', age: '30' },
        { name: 'Bob' }, // missing age
        { name: 'Charlie', age: '25', extra: 'ignored' }
      ];
      
      const results = bulkGenerateDocuments(template, dataRows);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toBe('Name: Alice, Age: 30');
      expect(results[1]).toBe('Name: Bob, Age: {{age}}');
      expect(results[2]).toBe('Name: Charlie, Age: 25');
    });
  });
});