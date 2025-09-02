import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          original_filename: string | null
          file_type: 'docx' | 'pdf' | null
          storage_path: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          original_filename?: string | null
          file_type?: 'docx' | 'pdf' | null
          storage_path: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          original_filename?: string | null
          file_type?: 'docx' | 'pdf' | null
          storage_path?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      template_versions: {
        Row: {
          id: string
          template_id: string
          version_number: number
          content: any
          variables: any | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          template_id: string
          version_number: number
          content: any
          variables?: any | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          template_id?: string
          version_number?: number
          content?: any
          variables?: any | null
          created_at?: string
          created_by?: string | null
        }
      }
      variables: {
        Row: {
          id: string
          template_id: string
          name: string
          display_name: string | null
          data_type: 'text' | 'number' | 'date' | 'boolean' | 'email'
          default_value: string | null
          is_required: boolean
          validation_rules: any | null
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          name: string
          display_name?: string | null
          data_type?: 'text' | 'number' | 'date' | 'boolean' | 'email'
          default_value?: string | null
          is_required?: boolean
          validation_rules?: any | null
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          name?: string
          display_name?: string | null
          data_type?: 'text' | 'number' | 'date' | 'boolean' | 'email'
          default_value?: string | null
          is_required?: boolean
          validation_rules?: any | null
          position?: number | null
          created_at?: string
        }
      }
      generated_documents: {
        Row: {
          id: string
          template_id: string
          template_version_id: string | null
          user_id: string
          name: string | null
          variable_values: any
          storage_path: string
          output_format: 'docx' | 'pdf'
          generated_at: string
        }
        Insert: {
          id?: string
          template_id: string
          template_version_id?: string | null
          user_id: string
          name?: string | null
          variable_values: any
          storage_path: string
          output_format: 'docx' | 'pdf'
          generated_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          template_version_id?: string | null
          user_id?: string
          name?: string | null
          variable_values?: any
          storage_path?: string
          output_format?: 'docx' | 'pdf'
          generated_at?: string
        }
      }
    }
  }
}