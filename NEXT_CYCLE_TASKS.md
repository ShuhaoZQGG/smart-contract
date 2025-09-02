# Next Cycle Tasks

## Priority 1: UI Integration (Critical)
- [ ] Connect documentGenerator utilities to UI components
- [ ] Implement real-time template editor with variable highlighting
- [ ] Add file upload for DOCX/PDF templates
- [ ] Create download functionality for generated documents
- [ ] Wire up the existing UI components with backend utilities

## Priority 2: User Experience Enhancements
- [ ] Add user dashboard with template library
- [ ] Implement template search and filtering
- [ ] Create analytics dashboard for generation statistics
- [ ] Add template versioning UI
- [ ] Implement toast notifications for user feedback

## Priority 3: Performance Optimization
- [ ] Add indexes for unindexed foreign keys:
  - `generated_documents.template_version_id`
  - `template_versions.created_by`
- [ ] Clean up unused indexes once usage patterns are established
- [ ] Optimize RLS policies if performance issues arise

## Technical Improvements
- [ ] Add integration tests for end-to-end workflows
- [ ] Create comprehensive documentation with usage examples
- [ ] Implement proper error boundaries
- [ ] Add logging and monitoring

## Feature Enhancements
- [ ] Template marketplace features
  - Public template sharing
  - Template categories and tags
  - Usage analytics and ratings
- [ ] Collaboration features for team templates
- [ ] Real-time editing with WebSocket support
- [ ] Template preview with sample data

## Advanced Features (Future)
- [ ] Variable validation rules (regex, required, etc.)
- [ ] Custom formatting options for variables
- [ ] Template sharing and permissions system
- [ ] Export to multiple formats simultaneously
- [ ] Batch processing progress notifications
- [ ] OAuth integration (Google, Microsoft)
- [ ] Template approval workflows

## Priority 0: Performance Optimizations (From Cycle 1 Review)
- [ ] Optimize RLS policies using `(select auth.uid())` pattern
  - Fix 6 auth function re-evaluations in template_shares and bulk_generations tables
- [ ] Add indexes for unindexed foreign keys when usage patterns emerge
- [ ] Close PR #12 (superseded by PR #13)

## Priority 1: Real-Time Collaboration Features (Cycle 2 Focus)
- [ ] Integrate rich text editor (Lexical or Slate.js)
- [ ] Implement WebSocket support for real-time editing
- [ ] Add presence indicators for collaborative editing
- [ ] Create conflict resolution for simultaneous edits
- [ ] Build template marketplace MVP

## Notes from Cycle 1 Review
- ✅ ALL core features complete and validated
- ✅ 49 tests passing, build successful
- ✅ No security vulnerabilities detected
- ✅ Infrastructure fully deployed (7 tables, 4 Edge Functions, 2 storage buckets)
- ✅ Code splitting reduced bundle size by 80% (546KB → 106KB)
- ✅ PR #14 merged successfully
- 🎯 Focus for Cycle 2: Real-time collaboration and rich text editing

---
*Updated after Cycle 1 PR #14 Review and Merge*
*Date: 2025-09-02*