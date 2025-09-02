export interface Variable {
  name: string;
  position: number;
}

export function extractVariables(content: string): Variable[] {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = content.matchAll(regex);
  const variableMap = new Map<string, number>();
  let position = 0;

  for (const match of matches) {
    const varName = match[1];
    if (!variableMap.has(varName)) {
      variableMap.set(varName, position++);
    }
  }

  return Array.from(variableMap.entries()).map(([name, pos]) => ({
    name,
    position: pos
  }));
}

export function replaceVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}