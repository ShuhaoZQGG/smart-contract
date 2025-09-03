import { supabase } from '../lib/supabase';

export interface Template {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  storage_path: string;
  original_filename?: string;
  file_type?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Variable {
  name: string;
  display_name: string;
  data_type: string;
  position: number;
  is_required: boolean;
  default_value?: string;
}

export interface GenerationResult {
  success: boolean;
  downloadUrl?: string;
  path?: string;
  error?: string;
}

export interface BulkGenerationResult {
  success: boolean;
  documents: Array<{
    path: string;
    variables: Record<string, any>;
  }>;
  count: number;
}

class TemplateService {
  async createTemplate(params: {
    name: string;
    description?: string;
    file: File;
  }): Promise<Template> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;
    const timestamp = Date.now();
    const fileExt = params.file.name.split('.').pop();
    const storagePath = `${userId}/templates/${timestamp}_${params.file.name}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('templates')
      .upload(storagePath, params.file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    // Create template record
    const { data, error } = await supabase
      .from('templates')
      .insert({
        name: params.name,
        description: params.description,
        user_id: userId,
        storage_path: uploadData.path,
        original_filename: params.file.name,
        file_type: fileExt,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async extractVariables(templateId: string, content: string): Promise<string[]> {
    const { data, error } = await supabase.functions.invoke('process-docx', {
      body: {
        action: 'extractVariables',
        content,
      },
    });

    if (error) {
      throw new Error(`Variable extraction failed: ${error.message}`);
    }

    return data.variables || [];
  }

  async generateDocument(
    templateId: string,
    variableValues: Record<string, any>,
    outputFormat: 'docx' | 'pdf' = 'docx'
  ): Promise<GenerationResult> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('process-docx', {
      body: {
        action: 'generateDocument',
        templateId,
        variableValues,
        userId: userData.user.id,
        outputFormat,
      },
    });

    if (error) {
      throw new Error(`Document generation failed: ${error.message}`);
    }

    return data;
  }

  async bulkGenerate(
    templateId: string,
    csvData: Array<Record<string, any>>,
    outputFormat: 'docx' | 'pdf' = 'docx'
  ): Promise<BulkGenerationResult> {
    if (!csvData || csvData.length === 0) {
      return {
        success: true,
        documents: [],
        count: 0,
      };
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('process-docx', {
      body: {
        action: 'bulkGenerate',
        templateId,
        csvData,
        userId: userData.user.id,
        outputFormat,
      },
    });

    if (error) {
      throw new Error(`Bulk generation failed: ${error.message}`);
    }

    return data;
  }

  async updateTemplate(templateId: string, content: string): Promise<any> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('process-docx', {
      body: {
        action: 'processTemplate',
        templateId,
        content,
        userId: userData.user.id,
      },
    });

    if (error) {
      throw new Error(`Template update failed: ${error.message}`);
    }

    // Update the updated_at timestamp
    const { error: updateError } = await supabase
      .from('templates')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', templateId);

    if (updateError) {
      console.error('Failed to update timestamp:', updateError);
    }

    return data;
  }

  async listTemplates(): Promise<Template[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }

    return data || [];
  }

  async getTemplate(templateId: string): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch template: ${error.message}`);
    }

    return data;
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  async getTemplateContent(templateId: string): Promise<string> {
    // Get the latest version content
    const { data, error } = await supabase
      .from('template_versions')
      .select('content')
      .eq('template_id', templateId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Failed to fetch template content: ${error.message}`);
    }

    return typeof data.content === 'string' 
      ? data.content 
      : data.content.text || '';
  }

  async getTemplateVariables(templateId: string): Promise<Variable[]> {
    const { data, error } = await supabase
      .from('variables')
      .select('*')
      .eq('template_id', templateId)
      .order('position', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch variables: ${error.message}`);
    }

    return data || [];
  }

  async shareTemplate(
    templateId: string,
    shareWithUserId: string,
    permissions: string[] = ['view', 'generate']
  ): Promise<void> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('template_shares')
      .insert({
        template_id: templateId,
        shared_with_user_id: shareWithUserId,
        permissions,
        created_by: userData.user.id,
      });

    if (error) {
      throw new Error(`Failed to share template: ${error.message}`);
    }
  }

  async getSharedTemplates(): Promise<Template[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('template_shares')
      .select(`
        template_id,
        templates (*)
      `)
      .eq('shared_with_user_id', userData.user.id);

    if (error) {
      throw new Error(`Failed to fetch shared templates: ${error.message}`);
    }

    return data?.map((share: any) => share.templates) || [];
  }

  async getTemplateVersions(templateId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('template_versions')
      .select('*')
      .eq('template_id', templateId)
      .order('version_number', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch template versions: ${error.message}`);
    }

    return data || [];
  }

  async revertToVersion(templateId: string, versionId: string): Promise<any> {
    const { data: versionData, error: versionError } = await supabase
      .from('template_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (versionError) {
      throw new Error(`Failed to fetch version: ${versionError.message}`);
    }

    // Create a new version with the old content
    const { data: latestVersion } = await supabase
      .from('template_versions')
      .select('version_number')
      .eq('template_id', templateId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const newVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

    const { data, error } = await supabase
      .from('template_versions')
      .insert({
        template_id: templateId,
        version_number: newVersionNumber,
        content: versionData.content,
        variables: versionData.variables,
        created_by: (await supabase.auth.getUser()).data?.user?.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to revert to version: ${error.message}`);
    }

    return { success: true, data };
  }

  async getActiveUsers(templateId: string): Promise<any[]> {
    // This would typically use Supabase Realtime
    // For now, return mock data or empty array
    return [];
  }
}

export const templateService = new TemplateService();