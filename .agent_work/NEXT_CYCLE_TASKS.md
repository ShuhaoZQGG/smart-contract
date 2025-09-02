# Next Cycle Tasks - Cycle 2

## Priority 1: Performance Optimizations
### RLS Policy Fixes
- Fix performance warnings in `template_shares` table
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
- Fix performance warnings in `bulk_generations` table  
  - Replace `auth.uid()` with `(select auth.uid())` in all policies
- Add missing indexes for foreign keys:
  - `generated_documents.template_version_id`
  - `template_versions.created_by`

## Priority 2: Rich Text Editor
### Lexical/Slate.js Integration
- Replace current basic editor with full-featured rich text editor
- Implement formatting toolbar (bold, italic, underline, lists, etc.)
- Add table support for complex document templates
- Implement undo/redo functionality
- Add find and replace feature

## Priority 3: Real-time Collaboration
### WebSocket Implementation
- Set up Supabase Realtime for collaborative editing
- Implement presence indicators (who's viewing/editing)
- Add cursor position sharing
- Implement conflict resolution for simultaneous edits
- Add commenting system on templates

## Priority 4: Template Marketplace
### Public Template Sharing
- Create public template gallery
- Implement template rating system
- Add template categories and tags
- Build search and filter functionality
- Add template preview before importing

## Priority 5: Advanced Variables
### Enhanced Variable Types
- Dropdown/select variables with predefined options
- Date picker variables with formatting options
- Calculated fields (formulas based on other variables)
- Conditional content blocks (show/hide based on variable values)
- Variable validation rules (required, min/max, regex patterns)

## Technical Debt
### From Cycle 1 Review
- Remove unused indexes (informational):
  - `idx_generated_documents_template_id`
  - `idx_generated_documents_user_id`
  - `idx_templates_user_id`
  - `idx_template_shares_template_id`
  - `idx_template_shares_shared_with`
  - `idx_template_shares_created_by`
  - `idx_bulk_generations_user_id`
  - `idx_bulk_generations_template_id`
  - `idx_bulk_generations_status`

### Testing Improvements
- Fix 3 skipped tests (mock limitations)
- Add E2E tests for critical user flows
- Improve test coverage for Edge Functions
- Add performance benchmarks

## Documentation Needs
- API documentation for Edge Functions
- User guide for template creation
- Video tutorials for common workflows
- Developer documentation for contributions

## Future Considerations
- Mobile app development (React Native)
- API rate limiting and usage quotas
- Webhook integrations for document generation
- Multi-language support (i18n)
- PDF form field mapping
- Integration with cloud storage providers (Google Drive, Dropbox)
- Audit trail for document generation history
- Template versioning with rollback capability