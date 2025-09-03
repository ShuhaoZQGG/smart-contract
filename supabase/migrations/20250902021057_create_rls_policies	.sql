-- Enable RLS on all tables (if not already enabled)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE variables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own templates" ON templates;
DROP POLICY IF EXISTS "Users can create own templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;

DROP POLICY IF EXISTS "Users can view own template versions" ON template_versions;
DROP POLICY IF EXISTS "Users can create template versions" ON template_versions;

DROP POLICY IF EXISTS "Users can view own generated documents" ON generated_documents;
DROP POLICY IF EXISTS "Users can create generated documents" ON generated_documents;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view template variables" ON variables;
DROP POLICY IF EXISTS "Users can manage template variables" ON variables;

-- Templates policies
CREATE POLICY "Users can view own templates" ON templates
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create own templates" ON templates
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own templates" ON templates
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own templates" ON templates
    FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Template versions policies
CREATE POLICY "Users can view own template versions" ON template_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM templates 
            WHERE templates.id = template_versions.template_id 
            AND templates.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Users can create template versions" ON template_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM templates 
            WHERE templates.id = template_versions.template_id 
            AND templates.user_id = (SELECT auth.uid())
        )
    );

-- Generated documents policies
CREATE POLICY "Users can view own generated documents" ON generated_documents
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create generated documents" ON generated_documents
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Variables policies
CREATE POLICY "Users can view template variables" ON variables
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM templates 
            WHERE templates.id = variables.template_id 
            AND templates.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Users can manage template variables" ON variables
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM templates 
            WHERE templates.id = variables.template_id 
            AND templates.user_id = (SELECT auth.uid())
        )
    );