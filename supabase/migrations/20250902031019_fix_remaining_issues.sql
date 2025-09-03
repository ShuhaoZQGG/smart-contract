-- Fix duplicate policies on variables table
DROP POLICY IF EXISTS "Users can manage variables" ON variables;

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id 
ON generated_documents(template_id);

CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id 
ON generated_documents(user_id);

CREATE INDEX IF NOT EXISTS idx_templates_user_id 
ON templates(user_id);

-- Drop the indexes we just created that are unused (they were incorrectly indexed before)
DROP INDEX IF EXISTS idx_generated_documents_template_version_id;
DROP INDEX IF EXISTS idx_template_versions_created_by;