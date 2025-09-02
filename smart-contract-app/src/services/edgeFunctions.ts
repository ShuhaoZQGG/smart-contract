import { supabase } from '../lib/supabase';

interface VariableInfo {
  name: string;
  display_name: string;
  data_type: string;
  position: number;
  is_required: boolean;
}

interface GenerateDocumentParams {
  templateId: string;
  variableValues: Record<string, any>;
  userId: string;
  outputFormat?: 'docx' | 'pdf';
}

interface BulkGenerateParams {
  templateId: string;
  csvData: Record<string, any>[];
  userId: string;
  outputFormat?: 'docx' | 'pdf';
}

class EdgeFunctionsService {
  private async invokeFunction(functionName: string, body: any) {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: JSON.stringify(body),
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    return data;
  }

  async extractVariables(content: string): Promise<{
    success: boolean;
    variables: VariableInfo[];
    count: number;
  }> {
    return await this.invokeFunction('process-docx', {
      action: 'extractVariables',
      content,
    });
  }

  async processTemplate(templateId: string, content: string, userId: string) {
    return await this.invokeFunction('process-docx', {
      action: 'processTemplate',
      templateId,
      content,
      userId,
    });
  }

  async generateDocument(params: GenerateDocumentParams) {
    return await this.invokeFunction('process-docx', {
      action: 'generateDocument',
      ...params,
    });
  }

  async bulkGenerate(params: BulkGenerateParams) {
    return await this.invokeFunction('process-docx', {
      action: 'bulkGenerate',
      ...params,
    });
  }

  async uploadTemplate(file: File, userId: string) {
    const fileName = `${userId}/templates/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('templates')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return {
      path: data.path,
      fileName: file.name,
      fileType: file.name.split('.').pop() || 'unknown',
    };
  }

  parseCsvContent(csvContent: string): Record<string, any>[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        console.warn(`Row ${i + 1} has incorrect number of columns, skipping`);
        continue;
      }

      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }

    return data;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    // Remove only the outer quotes, not escaped inner quotes
    return result.map(val => {
      if (val.startsWith('"') && val.endsWith('"')) {
        return val.slice(1, -1);
      }
      return val;
    });
  }

  async getTemplateVariables(templateId: string): Promise<VariableInfo[]> {
    const { data, error } = await supabase
      .from('variables')
      .select('*')
      .eq('template_id', templateId)
      .order('position');

    if (error) {
      throw new Error(`Failed to fetch variables: ${error.message}`);
    }

    return data || [];
  }

  async getGeneratedDocuments(userId: string) {
    const { data, error } = await supabase
      .from('generated_documents')
      .select(`
        *,
        templates (name, description)
      `)
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return data || [];
  }

  getDownloadUrl(storagePath: string): string {
    const { data } = supabase.storage
      .from('generated')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  }
}

export const edgeFunctions = new EdgeFunctionsService();