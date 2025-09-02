import { z } from 'zod';

// Template validation schemas
export const templateNameSchema = z
  .string()
  .min(3, 'Template name must be at least 3 characters')
  .max(100, 'Template name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Template name can only contain letters, numbers, spaces, hyphens, and underscores');

export const templateDescriptionSchema = z
  .string()
  .max(500, 'Description must be less than 500 characters')
  .optional();

export const variableNameSchema = z
  .string()
  .min(1, 'Variable name is required')
  .max(50, 'Variable name must be less than 50 characters')
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Variable name must start with a letter and contain only letters, numbers, and underscores');

const DataTypeEnum = z.enum(['text', 'number', 'date', 'boolean', 'email', 'url', 'phone']);

export const variableSchema = z.object({
  name: variableNameSchema,
  display_name: z.string().optional(),
  data_type: DataTypeEnum,
  default_value: z.string().optional(),
  is_required: z.boolean().default(true),
  validation_rule: z.string().optional(),
  description: z.string().optional()
});

export const templateSchema = z.object({
  name: templateNameSchema,
  description: templateDescriptionSchema,
  content: z.string().min(1, 'Template content is required'),
  variables: z.array(variableSchema).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// Document generation validation schemas
const OutputFormatEnum = z.enum(['pdf', 'docx', 'html']);

export const generateDocumentSchema = z.object({
  template_id: z.string().uuid('Invalid template ID'),
  variables: z.record(z.string(), z.any()),
  output_format: OutputFormatEnum.default('pdf')
});

export const bulkGenerationSchema = z.object({
  template_id: z.string().uuid('Invalid template ID'),
  csv_data: z.string().min(1, 'CSV data is required'),
  output_format: OutputFormatEnum.default('pdf'),
  include_headers: z.boolean().default(true)
});

// User authentication schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name is required').optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"]
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB limit
    'File size must be less than 10MB'
  ).refine(
    (file) => {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'text/html'
      ];
      return allowedTypes.includes(file.type);
    },
    'File type not supported. Please upload PDF, DOCX, DOC, TXT, or HTML files.'
  )
});

// CSV validation for bulk generation
export const csvValidationSchema = z.object({
  headers: z.array(z.string()).min(1, 'CSV must have at least one column'),
  rows: z.array(z.record(z.string(), z.string())).min(1, 'CSV must have at least one row of data'),
  totalRows: z.number().max(1000, 'CSV cannot have more than 1000 rows')
});

// Settings schemas
export const userSettingsSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  notifications: z.object({
    email: z.boolean(),
    inApp: z.boolean(),
    templateShared: z.boolean(),
    documentGenerated: z.boolean()
  }).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    language: z.enum(['en', 'es', 'fr', 'de', 'zh']),
    dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
    timeZone: z.string()
  }).optional()
});

// Sharing and collaboration schemas
export const shareTemplateSchema = z.object({
  template_id: z.string().uuid('Invalid template ID'),
  email: z.string().email('Invalid email address'),
  permission: z.enum(['view', 'edit', 'admin']),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
  expiresAt: z.date().optional()
});

// API response schemas for type safety
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional()
});

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Export type inference helpers
export type Template = z.infer<typeof templateSchema>;
export type Variable = z.infer<typeof variableSchema>;
export type GenerateDocument = z.infer<typeof generateDocumentSchema>;
export type BulkGeneration = z.infer<typeof bulkGenerationSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type ShareTemplate = z.infer<typeof shareTemplateSchema>;
export type Pagination = z.infer<typeof paginationSchema>;