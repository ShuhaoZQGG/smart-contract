import { extractVariables } from './variableExtractor';

describe('Variable Extractor', () => {
  it('should extract simple variables', () => {
    const content = 'Hello {{name}}, welcome to {{company}}!';
    const variables = extractVariables(content);
    
    expect(variables).toEqual([
      { name: 'name', position: 0 },
      { name: 'company', position: 1 }
    ]);
  });

  it('should handle duplicate variables', () => {
    const content = '{{name}} agrees that {{name}} will pay {{amount}} to {{company}}.';
    const variables = extractVariables(content);
    
    expect(variables).toEqual([
      { name: 'name', position: 0 },
      { name: 'amount', position: 1 },
      { name: 'company', position: 2 }
    ]);
  });

  it('should handle no variables', () => {
    const content = 'This is plain text without any variables.';
    const variables = extractVariables(content);
    
    expect(variables).toEqual([]);
  });

  it('should handle complex variable names', () => {
    const content = '{{client_first_name}} {{client_last_name}} from {{company_name}}';
    const variables = extractVariables(content);
    
    expect(variables).toEqual([
      { name: 'client_first_name', position: 0 },
      { name: 'client_last_name', position: 1 },
      { name: 'company_name', position: 2 }
    ]);
  });

  it('should ignore invalid variable syntax', () => {
    const content = 'Valid {{var1}} but not {invalid} or {{}} or {{ spaced }}';
    const variables = extractVariables(content);
    
    expect(variables).toEqual([
      { name: 'var1', position: 0 }
    ]);
  });
});