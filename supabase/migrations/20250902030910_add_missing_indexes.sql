-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_version_id 
ON generated_documents(template_version_id);

CREATE INDEX IF NOT EXISTS idx_template_versions_created_by 
ON template_versions(created_by);

-- Drop unused indexes to improve write performance
DROP INDEX IF EXISTS idx_templates_user_id;
DROP INDEX IF EXISTS idx_template_versions_template_id;
DROP INDEX IF EXISTS idx_variables_template_id;
DROP INDEX IF EXISTS idx_generated_documents_template_id;
DROP INDEX IF EXISTS idx_generated_documents_user_id;