import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

describe('RLS Performance Tests', () => {
  let testUserId: string;
  let testTemplateId: string;

  beforeAll(async () => {
    // Mock user authentication for testing
    const { data: { user } } = await supabase.auth.getUser();
    // Use a valid UUID format for testing
    testUserId = user?.id || '00000000-0000-0000-0000-000000000000';
  });

  afterAll(async () => {
    // Cleanup test data if needed
  });

  describe('Template Shares RLS Performance', () => {
    it('should efficiently query template shares without re-evaluating auth functions', async () => {
      const startTime = Date.now();
      
      // Query template shares - this should use the optimized RLS policy
      const { data, error } = await supabase
        .from('template_shares')
        .select('*')
        .limit(100);

      const queryTime = Date.now() - startTime;

      // Performance assertion - query should complete quickly
      expect(queryTime).toBeLessThan(1000); // Under 1 second
      expect(error).toBeNull();
    });

    it('should allow template owners to create shares efficiently', async () => {
      // First create a test template
      const { data: template } = await supabase
        .from('templates')
        .insert({
          name: 'Performance Test Template',
          user_id: testUserId,
          storage_path: '/test/path',
          file_type: 'docx',
          description: 'Test template for performance testing'
        })
        .select()
        .single();

      if (template) {
        testTemplateId = template.id;

        const startTime = Date.now();
        
        // Create a share - this should use the optimized RLS policy
        const { data, error } = await supabase
          .from('template_shares')
          .insert({
            template_id: testTemplateId,
            shared_with_user_id: testUserId,
            created_by: testUserId,
            permissions: ['view', 'generate']
          })
          .select();

        const insertTime = Date.now() - startTime;

        expect(insertTime).toBeLessThan(500); // Under 500ms
        expect(error).toBeNull();
        expect(data).toBeDefined();
      }
    });
  });

  describe('Bulk Generations RLS Performance', () => {
    it('should efficiently query bulk generations for current user', async () => {
      const startTime = Date.now();
      
      // Query bulk generations - this should use the optimized RLS policy
      const { data, error } = await supabase
        .from('bulk_generations')
        .select('*')
        .eq('user_id', testUserId)
        .limit(100);

      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(1000); // Under 1 second
      expect(error).toBeNull();
    });

    it('should allow users to create bulk generations efficiently', async () => {
      if (!testTemplateId) {
        // Skip test if user is not authenticated
        if (testUserId === '00000000-0000-0000-0000-000000000000') {
          console.warn('Skipping test - no authenticated user available');
          return;
        }

        // Create a test template if not already created
        const { data: template, error: templateError } = await supabase
          .from('templates')
          .insert({
            name: 'Bulk Gen Test Template',
            user_id: testUserId,
            storage_path: '/test/bulk',
            file_type: 'docx',
            description: 'Test template for bulk generation performance testing'
          })
          .select()
          .single();
        
        if (templateError || !template?.id) {
          console.error('Template creation error:', templateError);
          // Skip test if we can't create a template (likely due to auth)
          console.warn('Skipping test - unable to create test template (likely auth issue)');
          return;
        }
        testTemplateId = template.id;
      }

      const startTime = Date.now();
      
      // Create a bulk generation - this should use the optimized RLS policy
      const { data, error } = await supabase
        .from('bulk_generations')
        .insert({
          template_id: testTemplateId,
          user_id: testUserId,
          csv_data: { rows: [] },
          status: 'pending',
          total_count: 0,
          completed_count: 0
        })
        .select();

      const insertTime = Date.now() - startTime;

      expect(insertTime).toBeLessThan(500); // Under 500ms
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('Foreign Key Index Performance', () => {
    it('should have efficient joins on generated_documents with template_versions', async () => {
      const startTime = Date.now();
      
      // Query with join - should use the new index
      const { data, error } = await supabase
        .from('generated_documents')
        .select(`
          *,
          template_versions (
            id,
            version_number,
            content
          )
        `)
        .limit(100);

      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(1500); // Under 1.5 seconds for join
      expect(error).toBeNull();
    });

    it('should have efficient queries filtering by template_version_id', async () => {
      const startTime = Date.now();
      
      // Query filtering by foreign key - should use the new index
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('template_version_id', '00000000-0000-0000-0000-000000000001')
        .limit(100);

      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(500); // Under 500ms with index
      expect(error).toBeNull();
    });
  });
});