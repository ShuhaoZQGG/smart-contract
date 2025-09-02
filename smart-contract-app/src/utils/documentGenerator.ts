import { replaceVariables, validateVariables } from './templateUtils';

export interface DocumentGenerationOptions {
  template: string;
  variables: Record<string, string>;
  outputFormat?: 'docx' | 'pdf' | 'html';
  metadata?: {
    title?: string;
    author?: string;
    createdAt?: Date;
  };
}

export interface BulkGenerationOptions {
  template: string;
  data: Record<string, string>[];
  outputFormat?: 'docx' | 'pdf' | 'html';
  filenamePattern?: string; // e.g., "contract_{{client_name}}_{{date}}"
}

export interface GenerationResult {
  success: boolean;
  content?: string;
  base64?: string;
  error?: string;
  metadata?: {
    generatedAt: Date;
    variablesUsed: string[];
    format: string;
  };
}

/**
 * Generate a single document from a template with variable substitution
 */
export const generateDocument = (options: DocumentGenerationOptions): GenerationResult => {
  try {
    const { template, variables, outputFormat = 'html' } = options;
    
    // Extract required variables from template
    const requiredVariables = extractVariablesFromTemplate(template);
    
    // Validate that all required variables are provided
    const validation = validateVariables(requiredVariables, variables);
    if (!validation.valid) {
      return {
        success: false,
        error: `Missing required variables: ${validation.missing.join(', ')}`
      };
    }
    
    // Replace variables in template
    const processedContent = replaceVariables(template, variables);
    
    // Convert to base64 for binary formats
    let base64Content: string | undefined;
    if (outputFormat === 'docx' || outputFormat === 'pdf') {
      base64Content = btoa(processedContent);
    }
    
    return {
      success: true,
      content: processedContent,
      base64: base64Content,
      metadata: {
        generatedAt: new Date(),
        variablesUsed: Object.keys(variables),
        format: outputFormat
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Generate multiple documents from a template using bulk data
 */
export const generateBulkDocuments = (options: BulkGenerationOptions): GenerationResult[] => {
  const { template, data, outputFormat = 'html', filenamePattern } = options;
  
  return data.map((row, index) => {
    const result = generateDocument({
      template,
      variables: row,
      outputFormat
    });
    
    // Add filename if pattern is provided
    if (result.success && filenamePattern) {
      const filename = replaceVariables(filenamePattern, {
        ...row,
        index: String(index + 1),
        date: new Date().toISOString().split('T')[0]
      });
      
      // Ensure metadata exists and add filename
      if (!result.metadata) {
        result.metadata = {
          generatedAt: new Date(),
          variablesUsed: Object.keys(row),
          format: outputFormat
        };
      }
      
      // Add filename property to metadata
      (result.metadata as any).filename = filename;
    }
    
    return result;
  });
};

/**
 * Extract variable names from a template
 */
export const extractVariablesFromTemplate = (template: string): string[] => {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = template.match(regex) || [];
  const variables = matches.map(m => m.replace(/\{\{|\}\}/g, ''));
  return Array.from(new Set(variables));
};

/**
 * Process CSV data into array of objects
 */
export const processCsvData = (csvContent: string): Record<string, string>[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }
  
  // Simple CSV parser that handles quoted values with commas
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    
    return result.map(field => field.replace(/^"|"$/g, ''));
  };
  
  // Parse headers
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
};

/**
 * Validate template syntax
 */
export const validateTemplate = (template: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Check for unclosed variable brackets
  const openBrackets = (template.match(/\{\{/g) || []).length;
  const closeBrackets = (template.match(/\}\}/g) || []).length;
  
  if (openBrackets !== closeBrackets) {
    errors.push('Mismatched variable brackets');
  }
  
  // Check for invalid variable names
  const variableRegex = /\{\{([^}]+)\}\}/g;
  let match;
  while ((match = variableRegex.exec(template)) !== null) {
    const varName = match[1];
    if (!/^\w+$/.test(varName)) {
      errors.push(`Invalid variable name: ${varName}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Generate a preview of the document with sample data
 */
export const generatePreview = (
  template: string,
  sampleData?: Record<string, string>
): string => {
  const variables = extractVariablesFromTemplate(template);
  
  // Generate sample data if not provided
  const previewData = sampleData || {};
  variables.forEach(variable => {
    if (!previewData[variable]) {
      previewData[variable] = `[${variable}]`;
    }
  });
  
  return replaceVariables(template, previewData);
};