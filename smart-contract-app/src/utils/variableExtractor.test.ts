import { extractVariables, replaceVariables, validateVariables } from './variableExtractor';

describe('Variable Extractor Utilities', () => {
  describe('extractVariables', () => {
    test('should extract single variable', () => {
      const content = 'Hello {{name}}!';
      const variables = extractVariables(content);
      expect(variables).toEqual(['name']);
    });

    test('should extract multiple variables', () => {
      const content = 'Dear {{client_name}}, your loan amount is {{loan_amount}} at {{interest_rate}}% interest.';
      const variables = extractVariables(content);
      expect(variables).toEqual(['client_name', 'loan_amount', 'interest_rate']);
    });

    test('should handle duplicate variables', () => {
      const content = 'Hello {{name}}, {{name}} your order {{order_id}} is ready. Thanks {{name}}!';
      const variables = extractVariables(content);
      expect(variables).toEqual(['name', 'order_id']);
    });

    test('should handle no variables', () => {
      const content = 'This is a static document with no variables.';
      const variables = extractVariables(content);
      expect(variables).toEqual([]);
    });

    test('should handle nested brackets correctly', () => {
      const content = 'The value is {{{invalid}}} but {{valid}} is correct.';
      const variables = extractVariables(content);
      expect(variables).toEqual(['valid']);
    });

    test('should handle variables with underscores and numbers', () => {
      const content = 'User {{user_name_123}} has balance {{account_balance_2}}.';
      const variables = extractVariables(content);
      expect(variables).toEqual(['user_name_123', 'account_balance_2']);
    });

    test('should ignore invalid variable names', () => {
      const content = 'Valid: {{valid}} Invalid: {{123invalid}} {{-invalid}} {{invalid-name}}';
      const variables = extractVariables(content);
      expect(variables).toEqual(['valid']);
    });
  });

  describe('replaceVariables', () => {
    test('should replace single variable', () => {
      const content = 'Hello {{name}}!';
      const variables = { name: 'John' };
      const result = replaceVariables(content, variables);
      expect(result).toBe('Hello John!');
    });

    test('should replace multiple variables', () => {
      const content = 'Dear {{client_name}}, your loan amount is {{loan_amount}} at {{interest_rate}}% interest.';
      const variables = {
        client_name: 'Jane Doe',
        loan_amount: '$50,000',
        interest_rate: '5.5',
      };
      const result = replaceVariables(content, variables);
      expect(result).toBe('Dear Jane Doe, your loan amount is $50,000 at 5.5% interest.');
    });

    test('should replace duplicate variables', () => {
      const content = 'Hello {{name}}, {{name}} your order is ready. Thanks {{name}}!';
      const variables = { name: 'Bob' };
      const result = replaceVariables(content, variables);
      expect(result).toBe('Hello Bob, Bob your order is ready. Thanks Bob!');
    });

    test('should handle missing variables', () => {
      const content = 'Hello {{name}}, your order {{order_id}} is ready.';
      const variables = { name: 'Alice' };
      const result = replaceVariables(content, variables);
      expect(result).toBe('Hello Alice, your order {{order_id}} is ready.');
    });

    test('should handle empty variables object', () => {
      const content = 'Hello {{name}}!';
      const variables = {};
      const result = replaceVariables(content, variables);
      expect(result).toBe('Hello {{name}}!');
    });

    test('should handle null and undefined values', () => {
      const content = 'Name: {{name}}, Age: {{age}}, City: {{city}}';
      const variables = {
        name: null,
        age: undefined,
        city: 'New York',
      };
      const result = replaceVariables(content, variables);
      expect(result).toBe('Name: , Age: , City: New York');
    });

    test('should handle number values', () => {
      const content = 'The total is {{total}} with {{tax}}% tax.';
      const variables = {
        total: 1234.56,
        tax: 8.5,
      };
      const result = replaceVariables(content, variables);
      expect(result).toBe('The total is 1234.56 with 8.5% tax.');
    });

    test('should handle boolean values', () => {
      const content = 'Active: {{isActive}}, Verified: {{isVerified}}';
      const variables = {
        isActive: true,
        isVerified: false,
      };
      const result = replaceVariables(content, variables);
      expect(result).toBe('Active: true, Verified: false');
    });
  });

  describe('validateVariables', () => {
    test('should validate all variables are provided', () => {
      const content = 'Hello {{name}}, your order {{order_id}} is ready.';
      const variables = {
        name: 'John',
        order_id: '12345',
      };
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(true);
      expect(result.missingVariables).toEqual([]);
    });

    test('should detect missing variables', () => {
      const content = 'Hello {{name}}, your order {{order_id}} is ready.';
      const variables = {
        name: 'John',
      };
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(false);
      expect(result.missingVariables).toEqual(['order_id']);
    });

    test('should detect multiple missing variables', () => {
      const content = 'Dear {{client_name}}, your loan {{loan_id}} of {{amount}} is approved.';
      const variables = {
        client_name: 'Jane',
      };
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(false);
      expect(result.missingVariables).toEqual(['loan_id', 'amount']);
    });

    test('should handle extra variables in input', () => {
      const content = 'Hello {{name}}!';
      const variables = {
        name: 'John',
        extra: 'value',
        another: 'extra',
      };
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(true);
      expect(result.missingVariables).toEqual([]);
      expect(result.extraVariables).toEqual(['extra', 'another']);
    });

    test('should handle empty content', () => {
      const content = '';
      const variables = { name: 'John' };
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(true);
      expect(result.missingVariables).toEqual([]);
      expect(result.extraVariables).toEqual(['name']);
    });

    test('should handle content with no variables', () => {
      const content = 'This is a static document.';
      const variables = { name: 'John' };
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(true);
      expect(result.missingVariables).toEqual([]);
      expect(result.extraVariables).toEqual(['name']);
    });

    test('should handle empty variables object', () => {
      const content = 'Hello {{name}}!';
      const variables = {};
      const result = validateVariables(content, variables);
      expect(result.isValid).toBe(false);
      expect(result.missingVariables).toEqual(['name']);
    });
  });
});