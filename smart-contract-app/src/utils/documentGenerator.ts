import { replaceVariables } from './variableExtractor';

export function generateDocument(
  template: string,
  variables: Record<string, string>
): string {
  return replaceVariables(template, variables);
}

export function bulkGenerateDocuments(
  template: string,
  dataRows: Record<string, string>[]
): string[] {
  return dataRows.map(row => generateDocument(template, row));
}

export interface GenerationResult {
  content: string;
  timestamp: Date;
  variables: Record<string, string>;
}

export function generateWithMetadata(
  template: string,
  variables: Record<string, string>
): GenerationResult {
  return {
    content: generateDocument(template, variables),
    timestamp: new Date(),
    variables
  };
}