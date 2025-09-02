export const extractVariables = (content: string): string[] => {
  const regex = /\{\{(\w+)\}\}/g
  const matches = content.match(regex) || []
  const variables = matches.map(m => m.replace(/\{\{|\}\}/g, ''))
  return Array.from(new Set(variables))
}

export const replaceVariables = (
  template: string,
  variables: Record<string, string>
): string => {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(regex, value)
  })
  return result
}

export const validateVariables = (
  requiredVariables: string[],
  providedVariables: Record<string, string>
): { valid: boolean; missing: string[] } => {
  const missing = requiredVariables.filter(v => !providedVariables[v])
  return {
    valid: missing.length === 0,
    missing
  }
}