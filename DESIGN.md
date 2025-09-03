# Smart Contract Document Template System - UI/UX Design Specifications

## Design Philosophy
Clean, intuitive interface prioritizing efficiency and user productivity. Material Design 3 principles with focus on accessibility and responsive design. Enhanced for Cycle 3 with advanced collaboration, marketplace, and enterprise features.

## Color Palette
- **Primary**: #2563EB (Blue 600) - Actions, CTAs
- **Secondary**: #7C3AED (Purple 600) - Variables, highlights
- **Success**: #16A34A (Green 600) - Confirmations
- **Warning**: #EA580C (Orange 600) - Alerts
- **Error**: #DC2626 (Red 600) - Errors
- **Background**: #FFFFFF / #111827 (Dark mode)
- **Surface**: #F9FAFB / #1F2937 (Dark mode)

## Typography
- **Headings**: Inter, system-ui
- **Body**: Inter, system-ui
- **Code/Variables**: JetBrains Mono, monospace
- **Sizes**: 14px base, 1.5 line-height

## Component Library
Leverage Supabase Auth UI components + shadcn/ui for consistency with backend.

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up (Supabase Auth) → Onboarding Tutorial → Dashboard → Create First Template
```
- Welcome modal with 3-step interactive tutorial
- Sample template pre-loaded for exploration
- Tooltips on first interaction with features

### 2. Template Creation Flow
```
Upload Document → Visual Editor → Insert Variables → Configure Settings → Save Template
```
- Drag-drop upload zone with format indicators
- Live preview panel beside editor
- Variable insertion via toolbar button or {{shortcut}}
- Auto-save indicator with 30s intervals

### 3. Document Generation Flow
```
Select Template → Fill Variables → Preview → Generate → Download
```
- Template gallery with search/filter
- Dynamic form generation from variables
- Side-by-side preview of changes
- Multi-format export options

### 4. Bulk Generation Flow
```
Select Template → Upload CSV → Map Columns → Preview Sample → Generate Batch → Download ZIP
```
- CSV template download option
- Visual column mapping interface
- Progress bar with real-time updates
- Error handling with retry options

## Page Layouts

### Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Smart Contract    [Search]    [User] [Settings] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Welcome back, {{user_name}}                        │
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│ │ Templates   │ │ Documents   │ │ Analytics   │  │
│ │    12       │ │    48       │ │ This Month  │  │
│ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                     │
│ Recent Templates                    Quick Actions  │
│ ┌──────────────────────────┐      [+ New Template]│
│ │ • Contract_v2.docx       │      [↑ Upload Doc]  │
│ │ • Invoice_Template.pdf   │      [⚡ Generate]    │
│ │ • NDA_Standard.docx      │                      │
│ └──────────────────────────┘                      │
└─────────────────────────────────────────────────────┘
```

### Template Editor
```
┌─────────────────────────────────────────────────────┐
│ [← Back] Template: {{template_name}}  [Save] [Preview] │
├─────────────────────────────────────────────────────┤
│ Toolbar: [B][I][U] | [{{}}] [Link] [List] | [Undo][Redo] │
├──────────────────────────┬──────────────────────────┤
│                          │ Variables ({{count}})    │
│                          │ ┌──────────────────────┐ │
│   Rich Text Editor       │ │ client_name         │ │
│   (Lexical)              │ │ agreement_date      │ │
│                          │ │ loan_amount         │ │
│   Variable highlighting  │ │ [+ Add Variable]    │ │
│   Live formatting        │ └──────────────────────┘ │
│                          │                          │
│                          │ Variable Settings       │
│                          │ ┌──────────────────────┐ │
│                          │ │ Name: client_name   │ │
│                          │ │ Type: [Text ▼]      │ │
│                          │ │ Required: [✓]       │ │
│                          │ │ Default: ________   │ │
│                          │ └──────────────────────┘ │
└──────────────────────────┴──────────────────────────┘
```

### Document Generation
```
┌─────────────────────────────────────────────────────┐
│ Generate from: {{template_name}}                    │
├──────────────────────────┬──────────────────────────┤
│ Variable Input Form      │ Preview                  │
│                          │                          │
│ client_name *            │ Agreement between        │
│ [___________________]    │ Acme Corp and           │
│                          │ {{client_name}} for     │
│ agreement_date *         │ services starting       │
│ [📅 _______________]     │ {{agreement_date}}      │
│                          │                          │
│ loan_amount *            │ Total Amount:           │
│ [$ _________________]    │ {{loan_amount}}         │
│                          │                          │
│ interest_rate            │ Interest Rate:          │
│ [_____ %]                │ {{interest_rate}}%      │
│                          │                          │
│ [Generate PDF] [DOCX]    │ (Live preview updates)  │
└──────────────────────────┴──────────────────────────┘
```

### Template Marketplace
```
┌─────────────────────────────────────────────────────┐
│ Template Marketplace     [Search] [Filter] [Sort ▼] │
├─────────────────────────────────────────────────────┤
│ Categories: [All] [Legal] [Business] [Personal]     │
│                                                      │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│ │ NDA        │ │ Invoice    │ │ Contract   │       │
│ │ ⭐ 4.8     │ │ ⭐ 4.9     │ │ ⭐ 4.7     │       │
│ │ 1.2k uses  │ │ 3.4k uses  │ │ 890 uses   │       │
│ │ [Free]     │ │ [$9.99]    │ │ [Free]     │       │
│ └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
│ [Load More...]                                       │
└─────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Mobile Template Editor
```
┌─────────────┐
│ [☰] [Save]  │
├─────────────┤
│ Editor      │
│             │
│ {{content}} │
│             │
├─────────────┤
│ [{{}}] Variables │
└─────────────┘
```
- Collapsible variable panel
- Simplified toolbar
- Touch-optimized controls

### Mobile Generation Form
```
┌─────────────┐
│ Template    │
├─────────────┤
│ Variables:  │
│ ┌─────────┐ │
│ │ Input 1 │ │
│ │ Input 2 │ │
│ └─────────┘ │
│ [Generate]  │
├─────────────┤
│ [Preview]   │
└─────────────┘
```
- Stacked layout
- Expandable preview
- Large touch targets

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order logical flow
- Focus indicators visible
- Shortcuts: Ctrl+S (Save), Ctrl+P (Preview), Ctrl+Shift+V (Insert Variable)

### Screen Reader Support
- ARIA labels on all interactive elements
- Live regions for status updates
- Semantic HTML structure

### Visual Accessibility
- Color contrast ratio ≥4.5:1 (text), ≥3:1 (UI)
- Focus indicators ≥2px outline
- Text resizable to 200% without loss
- Dark mode support

## Real-time Collaboration UI (Enhanced)

### Active Users Indicator
```
┌──────────────────────────┐
│ Active Now (3)           │
│ [●] John (editing)       │
│ [●] Sarah (viewing)      │
│ [●] Mike (commenting)    │
└──────────────────────────┘
```

### Cursor Presence
- Colored cursors for each user
- Name labels on hover
- Smooth position updates via WebSocket

### Conflict Resolution Modal
```
┌─────────────────────────────┐
│ Merge Conflict              │
├─────────────────────────────┤
│ Your Version | Their Version│
│ [Text A]     | [Text B]     │
│                             │
│ [Use Mine] [Use Theirs]     │
│ [Merge Both]                │
└─────────────────────────────┘
```

## Loading States & Feedback

### Skeleton Loaders
- Template cards: Animated placeholders
- Editor: Progressive content loading
- Forms: Field-by-field appearance

### Progress Indicators
- Document upload: Progress bar with percentage
- Bulk generation: Item counter (3/10 completed)
- Auto-save: Subtle spinner with "Saving..."

### Toast Notifications
```
┌────────────────────────┐
│ ✓ Template saved       │
└────────────────────────┘
```
Position: Bottom-right
Duration: 3s (success), 5s (error)
Actions: Undo option where applicable

## Error States

### Empty States
```
┌─────────────────────────┐
│     No templates yet    │
│         📄              │
│  Create your first      │
│  template to start      │
│                         │
│  [+ Create Template]    │
└─────────────────────────┘
```

### Error Messages
- Field-level validation: Inline below input
- Form errors: Summary at top
- System errors: Modal with retry option

## Performance Optimization

### Lazy Loading
- Route-based code splitting
- Image lazy loading with blur-up
- Infinite scroll for template gallery

### Caching Strategy
- Template metadata: 5 min cache
- Generated documents: 24hr cache
- User preferences: LocalStorage

### Bundle Optimization
- Target: <100KB initial load
- Chunk vendors separately
- Tree-shake unused components

## Animation & Transitions

### Micro-interactions
- Button hover: Scale 1.05, 200ms ease
- Variable insertion: Highlight pulse
- Card hover: Subtle shadow elevation

### Page Transitions
- Route changes: Fade 300ms
- Modal open: Scale + fade 200ms
- Panel slides: Transform 250ms ease-out

## Implementation Guidelines

### Component Structure
```typescript
// Example component with accessibility
<Button
  onClick={handleGenerate}
  aria-label="Generate document"
  disabled={!isValid}
  className="btn-primary"
>
  <Icon name="generate" aria-hidden />
  Generate
</Button>
```

### State Management
- Global: Zustand for user, templates
- Server: React Query for API data
- Local: useState for UI state
- Forms: React Hook Form validation

### Responsive Utilities
```css
/* Mobile-first approach */
.container {
  padding: 1rem;
}
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

## Testing Requirements

### Usability Testing
- Task completion rate >95%
- Time to first document <3 min
- Error recovery success >90%

### Performance Metrics
- First Contentful Paint <1.2s
- Time to Interactive <2.5s
- Cumulative Layout Shift <0.1

### Cross-browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS Safari 14+, Chrome Android 90+

## Integration Points

### Supabase Auth UI
- Use @supabase/auth-ui-react components
- Maintain consistent theming
- Social login buttons prominent

### Edge Functions
- Loading states during processing
- Error handling with user guidance
- Progress tracking for long operations

### Real-time Updates
- Visual indicators for live changes
- Smooth transitions for content updates
- Connection status indicator

## Future Enhancements (Cycle 3+)

### Advanced Features UI
- Conditional logic builder (drag-drop)
- Formula editor with autocomplete
- API integration wizard
- Webhook configuration panel

### Analytics Dashboard
- Usage charts (Recharts)
- Template performance metrics
- Export analytics to CSV
- Custom date range picker

### Team Management
- Member invite flow
- Permission matrix UI
- Activity timeline
- Quota usage indicators

## Design System Documentation
Maintain Storybook with all components, states, and interactions documented for consistent implementation across the application.