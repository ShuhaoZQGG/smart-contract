# Next Cycle Tasks

## Priority 1: Feature Enhancements (From Cycle 1 Review)
- [ ] **Real-time Collaborative Editing**
  - Implement WebSocket support via Supabase Realtime
  - Add presence indicators for active editors
  - Implement conflict resolution for simultaneous edits
  - Add collaborative cursor positions

- [ ] **Complete Template Versioning UI**
  - Version history interface
  - Diff viewer for version comparisons
  - Rollback functionality
  - Version tagging and comments

## Priority 2: Performance Optimization
- [ ] **Bundle Size Optimization** (Current: 546KB)
  - Implement code splitting by route
  - Lazy load heavy components
  - Optimize import statements
  - Tree-shake unused code

- [ ] **Database Performance**
  - Add indexes for unindexed foreign keys:
    - `generated_documents.template_version_id`
    - `template_versions.created_by`
  - Clean up unused indexes after usage analysis
  - Monitor query performance

## Priority 3: Quality Improvements
- [ ] **Test Coverage Enhancement**
  - Fix 3 skipped tests in DocumentPreview component
  - Improve mock for generateDocument function
  - Add integration tests for full workflow
  - Add E2E tests for critical paths

- [ ] **Error Handling Improvements**
  - Enhance Edge Function error responses
  - Add retry logic for network failures
  - Improve user feedback for errors
  - Add error tracking/monitoring (Sentry)

## Technical Debt (From Cycle 1)
- [ ] Fix DocumentPreview test mock limitations
- [ ] Address bundle size warning
- [ ] Monitor and optimize unused database indexes
- [ ] Add missing integration tests

## Completed in Cycle 1 ✅
- ✅ Core document generation system
- ✅ UI components fully integrated
- ✅ Variable substitution system
- ✅ Single and bulk document generation
- ✅ Multi-format support (DOCX, PDF, TXT)
- ✅ 49 tests passing
- ✅ All lint issues resolved
- ✅ Supabase backend with RLS policies
- ✅ Authentication system

## Feature Backlog
- [ ] Template marketplace/sharing
- [ ] Advanced formatting options
- [ ] Conditional logic in templates
- [ ] API access for external integrations
- [ ] Batch processing improvements
- [ ] Template analytics and usage tracking
- [ ] OAuth integration (Google, Microsoft)
- [ ] Template approval workflows

## Documentation Needs
- [ ] API documentation for Edge Functions
- [ ] User guide for template creation
- [ ] Developer setup guide
- [ ] Deployment documentation

## New Items from Cycle 1 Review

### From Planning/Design Documentation Review
- [ ] **Template Marketplace UI Design**
  - Design marketplace homepage
  - Template preview and rating system
  - Category and search functionality
  - Purchase/download workflow

- [ ] **Enhanced Variable System**
  - Add variable type validation (date, number, text)
  - Implement default values
  - Add conditional variables
  - Variable dependency management

### From Architecture Review
- [ ] **Security Enhancements**
  - Implement rate limiting on Edge Functions
  - Add CSRF protection
  - Enhance input sanitization
  - Add audit logging

- [ ] **Performance Monitoring**
  - Implement application monitoring (APM)
  - Add performance metrics dashboard
  - Set up alerting for critical metrics
  - Database query optimization

---
*Updated after Cycle 1 PR #11 Review and Merge*
*Date: 2025-09-02*