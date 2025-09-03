-- Fix RLS performance issues by using subselects for auth functions
-- This prevents re-evaluation for each row

-- Drop and recreate RLS policies for template_shares table
DROP POLICY IF EXISTS "Users can view shares they created or are shared with" ON public.template_shares;
DROP POLICY IF EXISTS "Template owners can create shares" ON public.template_shares;  
DROP POLICY IF EXISTS "Template owners can delete shares" ON public.template_shares;

CREATE POLICY "Users can view shares they created or are shared with" ON public.template_shares
  FOR SELECT USING (
    created_by = (SELECT auth.uid()) OR
    shared_with_user_id = (SELECT auth.uid())
  );

CREATE POLICY "Template owners can create shares" ON public.template_shares
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.templates
      WHERE templates.id = template_shares.template_id
      AND templates.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Template owners can delete shares" ON public.template_shares
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.templates
      WHERE templates.id = template_shares.template_id
      AND templates.user_id = (SELECT auth.uid())
    )
  );

-- Drop and recreate RLS policies for bulk_generations table
DROP POLICY IF EXISTS "Users can view their own bulk generations" ON public.bulk_generations;
DROP POLICY IF EXISTS "Users can create bulk generations" ON public.bulk_generations;
DROP POLICY IF EXISTS "Users can update their own bulk generations" ON public.bulk_generations;

CREATE POLICY "Users can view their own bulk generations" ON public.bulk_generations
  FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create bulk generations" ON public.bulk_generations
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own bulk generations" ON public.bulk_generations
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- Add missing indexes for foreign keys to improve performance
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_version_id 
  ON public.generated_documents(template_version_id);

CREATE INDEX IF NOT EXISTS idx_template_versions_created_by 
  ON public.template_versions(created_by);

-- Add composite indexes for commonly used queries
CREATE INDEX IF NOT EXISTS idx_template_shares_composite 
  ON public.template_shares(template_id, shared_with_user_id);

CREATE INDEX IF NOT EXISTS idx_bulk_generations_user_template 
  ON public.bulk_generations(user_id, template_id);

-- Analyze tables to update statistics for query planner
ANALYZE public.template_shares;
ANALYZE public.bulk_generations;
ANALYZE public.generated_documents;
ANALYZE public.template_versions;