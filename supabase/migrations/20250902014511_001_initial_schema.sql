-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    original_filename VARCHAR(255),
    file_type VARCHAR(50) CHECK (file_type IN ('docx', 'pdf')),
    storage_path TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template versions table
CREATE TABLE IF NOT EXISTS public.template_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    variables JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    UNIQUE(template_id, version_number)
);

-- Variables table
CREATE TABLE IF NOT EXISTS public.variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    data_type VARCHAR(50) DEFAULT 'text' CHECK (data_type IN ('text', 'number', 'date', 'boolean', 'email')),
    default_value TEXT,
    is_required BOOLEAN DEFAULT false,
    validation_rules JSONB,
    position INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, name)
);

-- Generated documents table
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    template_version_id UUID REFERENCES public.template_versions(id),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    name VARCHAR(255),
    variable_values JSONB NOT NULL,
    storage_path TEXT NOT NULL,
    output_format VARCHAR(10) CHECK (output_format IN ('docx', 'pdf')),
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON public.template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_variables_template_id ON public.variables(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id ON public.generated_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON public.generated_documents(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for templates
CREATE POLICY "Users can view their own templates" ON public.templates
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create templates" ON public.templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON public.templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON public.templates
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for template_versions
CREATE POLICY "Users can view template versions" ON public.template_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = template_versions.template_id 
            AND (templates.user_id = auth.uid() OR templates.is_public = true)
        )
    );

CREATE POLICY "Users can create template versions" ON public.template_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = template_versions.template_id 
            AND templates.user_id = auth.uid()
        )
    );

-- RLS Policies for variables
CREATE POLICY "Users can view variables" ON public.variables
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = variables.template_id 
            AND (templates.user_id = auth.uid() OR templates.is_public = true)
        )
    );

CREATE POLICY "Users can manage variables" ON public.variables
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.templates 
            WHERE templates.id = variables.template_id 
            AND templates.user_id = auth.uid()
        )
    );

-- RLS Policies for generated_documents
CREATE POLICY "Users can view their own documents" ON public.generated_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents" ON public.generated_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.generated_documents
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();