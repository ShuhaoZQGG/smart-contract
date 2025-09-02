# Next Cycle Tasks

## High Priority - Performance & Security
1. **Optimize RLS Policies**
   - Replace all `auth.uid()` with `(select auth.uid())` pattern
   - Consolidate duplicate permissive policies
   - Estimated: 14 policies across 5 tables need updating

2. **Database Performance**
   - Add missing indexes on foreign keys:
     - generated_documents.template_version_id
     - template_versions.created_by
   - Remove unused indexes to reduce overhead

3. **Security Fix**
   - Fix `update_updated_at` function search_path parameter

## Medium Priority - Feature Enhancements
1. **Document Processing**
   - Integrate actual DOCX generation with docxtemplater
   - Add PDF generation support with pdf-lib
   - Improve template formatting preservation

2. **Real-time Features**
   - WebSocket support for bulk generation progress
   - Live collaboration with Supabase Realtime
   - Real-time template editing notifications

3. **Template Marketplace**
   - Public template sharing
   - Template categories and tags
   - Usage analytics and ratings
   - Template versioning UI

## Low Priority - Technical Debt
1. **Code Quality**
   - Add unit tests for new components
   - Improve error boundary handling
   - Add logging and monitoring

2. **UI/UX Improvements**
   - Mobile responsive design refinements
   - Accessibility improvements (WCAG 2.1 AA)
   - Dark mode support

3. **Documentation**
   - API documentation
   - User guide creation
   - Developer setup guide

## Deferred Items
- OAuth integration (Google, Microsoft)
- Template approval workflows
- Advanced permission system
- API rate limiting
- Billing integration

---
*Generated from Cycle 1 Review*
*Date: 2025-09-02*