export function extractVariables(content: string): string[] {
  // Match only double brackets, not triple or more
  const regex = /(?<!\{)\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}(?!\})/g;
  const matches = content.matchAll(regex);
  const variableSet = new Set<string>();

  for (const match of matches) {
    variableSet.add(match[1]);
  }

  return Array.from(variableSet);
}

export function replaceVariables(
  content: string,
  variables: Record<string, any>
): string {
  let result = content;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    // Convert null/undefined to empty string, otherwise convert to string
    const replaceValue = value === null || value === undefined ? '' : String(value);
    result = result.replace(regex, replaceValue);
  });

  return result;
}

export interface ValidationResult {
  isValid: boolean;
  missingVariables: string[];
  extraVariables?: string[];
}

export function validateVariables(
  content: string,
  variables: Record<string, any>
): ValidationResult {
  const requiredVariables = extractVariables(content);
  const providedVariables = Object.keys(variables);

  const missingVariables = requiredVariables.filter(
    (variable) => !providedVariables.includes(variable)
  );

  const extraVariables = providedVariables.filter(
    (variable) => !requiredVariables.includes(variable)
  );

  return {
    isValid: missingVariables.length === 0,
    missingVariables,
    extraVariables: extraVariables.length > 0 ? extraVariables : undefined,
  };
}

export function formatVariableName(variableName: string): string {
  // Convert snake_case to Title Case
  return variableName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function parseVariableType(value: any): string {
  if (value === null || value === undefined) return 'text';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (!isNaN(Date.parse(value)) && /\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'email';
  return 'text';
}

export function getVariableMetadata(content: string): Array<{
  name: string;
  displayName: string;
  position: number;
  count: number;
}> {
  const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
  const matches = [...content.matchAll(regex)];
  const variableMap = new Map<string, { position: number; count: number }>();

  matches.forEach((match, index) => {
    const varName = match[1];
    if (!variableMap.has(varName)) {
      variableMap.set(varName, { position: index, count: 0 });
    }
    const current = variableMap.get(varName)!;
    current.count++;
  });

  return Array.from(variableMap.entries()).map(([name, data]) => ({
    name,
    displayName: formatVariableName(name),
    position: data.position,
    count: data.count,
  }));
}

export function highlightVariables(content: string): string {
  const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
  return content.replace(regex, '<span class="variable-highlight">{{$1}}</span>');
}

export function sanitizeVariableName(input: string): string {
  // Remove invalid characters and ensure it starts with a letter or underscore
  const sanitized = input.replace(/[^a-zA-Z0-9_]/g, '_');
  
  // Ensure it starts with a letter or underscore
  if (/^[0-9]/.test(sanitized)) {
    return `_${sanitized}`;
  }
  
  return sanitized;
}

export function generateVariablePlaceholder(variableName: string): string {
  return `{{${variableName}}}`;
}

export function countVariableOccurrences(content: string, variableName: string): number {
  const regex = new RegExp(`\\{\\{${variableName}\\}\\}`, 'g');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

export function getVariablePositions(content: string, variableName: string): number[] {
  const regex = new RegExp(`\\{\\{${variableName}\\}\\}`, 'g');
  const positions: number[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    positions.push(match.index);
  }

  return positions;
}

export function isValidVariableName(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

export function suggestVariableNames(text: string): string[] {
  // Simple heuristic: find potential variable positions based on common patterns
  const suggestions: string[] = [];
  
  // Look for patterns like "Name: ___" or "Date: ___"
  const fieldPattern = /(\w+):\s*(?:_+|\[.*?\]|\(.*?\))/g;
  let match;
  
  while ((match = fieldPattern.exec(text)) !== null) {
    const fieldName = sanitizeVariableName(match[1].toLowerCase());
    if (fieldName && !suggestions.includes(fieldName)) {
      suggestions.push(fieldName);
    }
  }
  
  return suggestions;
}