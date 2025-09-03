-- Fix the function search path issue first
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Drop all duplicate RLS policies first
DROP POLICY IF EXISTS "Users can create own templates" ON templates;
DROP POLICY IF EXISTS "Users can view own templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;

DROP POLICY IF EXISTS "Users can view own template versions" ON template_versions;

DROP POLICY IF EXISTS "Users can view own generated documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can create generated documents" ON generated_documents;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view template variables" ON variables;
DROP POLICY IF EXISTS "Users can manage template variables" ON variables;

-- Now update the remaining policies to use optimized pattern

-- Templates table policies
DROP POLICY IF EXISTS "Users can create templates" ON templates;
CREATE POLICY "Users can create templates" ON templates
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own templates" ON templates;
CREATE POLICY "Users can view their own templates" ON templates
FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own templates" ON templates;
CREATE POLICY "Users can update their own templates" ON templates
FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own templates" ON templates;
CREATE POLICY "Users can delete their own templates" ON templates
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Template versions policies
DROP POLICY IF EXISTS "Users can view template versions" ON template_versions;
CREATE POLICY "Users can view template versions" ON template_versions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM templates
        WHERE templates.id = template_versions.template_id
        AND templates.user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can create template versions" ON template_versions;
CREATE POLICY "Users can create template versions" ON template_versions
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM templates
        WHERE templates.id = template_versions.template_id
        AND templates.user_id = (SELECT auth.uid())
    )
);

-- Generated documents policies
DROP POLICY IF EXISTS "Users can create documents" ON generated_documents;
CREATE POLICY "Users can create documents" ON generated_documents
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own documents" ON generated_documents;
CREATE POLICY "Users can view their own documents" ON generated_documents
FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own documents" ON generated_documents;
CREATE POLICY "Users can delete their own documents" ON generated_documents
FOR DELETE USING (user_id = (SELECT auth.uid()));

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Profile creation on signup" ON profiles;
CREATE POLICY "Profile creation on signup" ON profiles
FOR INSERT WITH CHECK (id = (SELECT auth.uid()));

-- Variables policies
DROP POLICY IF EXISTS "Users can view variables" ON variables;
CREATE POLICY "Users can view variables" ON variables
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM templates
        WHERE templates.id = variables.template_id
        AND templates.user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can manage variables" ON variables;
CREATE POLICY "Users can manage variables" ON variables
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM templates
        WHERE templates.id = variables.template_id
        AND templates.user_id = (SELECT auth.uid())
    )
);