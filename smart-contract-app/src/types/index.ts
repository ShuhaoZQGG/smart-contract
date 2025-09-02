export interface Variable {
  id: string;
  name: string;
  displayName: string;
  dataType: 'text' | 'number' | 'date' | 'boolean' | 'email';
  defaultValue?: string;
  isRequired?: boolean;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  position?: number;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  description?: string;
  originalFilename?: string;
  fileType?: 'docx' | 'pdf';
  storagePath: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  content: any;
  variables?: Variable[];
  createdAt: string;
  createdBy?: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  templateVersionId?: string;
  userId: string;
  name?: string;
  variableValues: Record<string, any>;
  storagePath: string;
  outputFormat?: 'docx' | 'pdf';
  generatedAt: string;
}

export interface BulkGeneration {
  id: string;
  templateId: string;
  userId: string;
  csvData: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalCount: number;
  completedCount: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TemplateShare {
  id: string;
  templateId: string;
  sharedWithUserId: string;
  permissions: string[];
  createdAt: string;
  createdBy?: string;
}