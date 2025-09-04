# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Design Language: Material Design 3
- **Theme**: Modern, clean, productivity-focused
- **Color Palette**:
  - Primary: #2563eb (Blue 600)
  - Secondary: #7c3aed (Violet 600)
  - Success: #16a34a (Green 600)
  - Error: #dc2626 (Red 600)
  - Background: #ffffff / #f9fafb
  - Text: #111827 / #6b7280
  - Variable Highlight: #fbbf24 (Amber 400)

### Typography
- **Headings**: Inter (700 weight)
- **Body**: Inter (400/500 weight)
- **Code**: JetBrains Mono
- **Scale**: 14px base, 1.25 ratio

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up (Supabase Auth) → Onboarding → Dashboard → Upload First Document → Edit Template → Generate Document
```

### 2. Template Creation Flow
```
Dashboard → Upload Document → Editor (Insert Variables) → Save Template → Test Generation → Publish to Marketplace (optional)
```

### 3. Document Generation Flow
```
Dashboard → Select Template → Fill Variables → Preview → Generate → Download
```

### 4. Bulk Generation Flow
```
Dashboard → Select Template → Upload CSV → Map Columns → Preview Batch → Generate All → Download ZIP
```

### 5. Collaboration Flow
```
Template → Share → Real-time Edit → Comment → Resolve Conflicts → Save Version
```

## Page Layouts

### Landing Page
```
┌─────────────────────────────────────────────────────┐
│ Logo   [Features] [Pricing] [Docs]    [Login] [Sign Up]│
├─────────────────────────────────────────────────────┤
│                                                      │
│     Transform Documents into Smart Templates         │
│     Upload • Customize • Generate at Scale          │
│                                                      │
│     [Get Started Free]  [Watch Demo]                │
│                                                      │
│     ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│     │Upload   │→│Add Vars │→│Generate │           │
│     │Document │ │{{name}} │ │Personalized│        │
│     └─────────┘ └─────────┘ └─────────┘           │
│                                                      │
│     ✓ Any Document Format (DOCX, PDF, TXT)          │
│     ✓ Visual Variable Editor with Lexical           │
│     ✓ Bulk Generation from CSV                      │
│     ✓ Real-time Collaboration via Supabase         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Dashboard (Post-Login)
```
┌─────────────────────────────────────────────────────┐
│ [≡] Smart Contract  [Search...]  [@] [🔔] [Profile] │
├────────┬────────────────────────────────────────────┤
│        │  Welcome back, {{userName}}                │
│ My Work│                                            │
│  📄 Templates│  Quick Actions                       │
│  📊 Analytics│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  👥 Shared  │  │Upload │ │Create│ │Import│        │
│  🏪 Market  │  │ Doc   │ │Blank │ │ CSV  │        │
│        │  └──────┘ └──────┘ └──────┘        │
│ Tools  │                                            │
│  ⚙️ Settings│  Recent Templates                      │
│  📚 Help    │  ┌────────────┐ ┌────────────┐       │
│        │  │Contract v2  │ │Invoice Pro  │       │
│        │  │5 variables  │ │8 variables  │       │
│        │  │Used: 2 hrs  │ │Used: 1 day  │       │
│        │  │[Edit] [Use] │ │[Edit] [Use] │       │
│        │  └────────────┘ └────────────┘       │
│        │                                            │
│        │  Real-time Activity (WebSocket)            │
│        │  • John is editing "Sales Agreement" 🟢    │
│        │  • 15 documents generated from "Invoice"  │
└────────┴────────────────────────────────────────────┘
```

### Template Editor (Lexical Integration)
```
┌─────────────────────────────────────────────────────┐
│ ← Back  "Contract Template"  [Preview] [Save] [Share]│
├──────────────┬──────────────────────────────────────┤
│ Variables (3)│   Formatting Toolbar                  │
│              │   [B][I][U] [🔗] [📎] [{{}}] [⚡]    │
│ {{client}}   │   ┌─────────────────────────────┐    │
│ [text]       │   │ LOAN AGREEMENT              │    │
│              │   │                             │    │
│ {{amount}}   │   │ This agreement is made     │    │
│ [currency]   │   │ between {{client}} and      │    │
│              │   │ First National Bank on      │    │
│ {{date}}     │   │ {{date}} for a loan amount  │    │
│ [date]       │   │ of {{amount}}.              │    │
│              │   │                             │    │
│ + Add Var    │   │ Terms and Conditions:       │    │
│              │   │ 1. Interest rate: 5.5%      │    │
│ Presence     │   │ 2. Monthly installments     │    │
│ ─────────    │   │ 3. Duration: 60 months      │    │
│ 🟢 You       │   │                             │    │
│ 🔵 Sarah     │   │ The borrower {{client}}     │    │
│ 🟡 Mike      │   │ agrees to terms...          │    │
│              │   └─────────────────────────────┘    │
│ Version: v3  │   Comments (2)  History  Test        │
└──────────────┴──────────────────────────────────────┘
```

### Variable Input Form (Single Generation)
```
┌─────────────────────────────────────────────────────┐
│        Generate Document from "Contract Template"    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Template Variables:                                │
│                                                      │
│  Client Name * (text)                               │
│  ┌─────────────────────────────────────┐           │
│  │ John Smith                          │           │
│  └─────────────────────────────────────┘           │
│                                                      │
│  Loan Amount * (currency)                           │
│  ┌─────────────────────────────────────┐           │
│  │ $ 50,000.00                         │           │
│  └─────────────────────────────────────┘           │
│                                                      │
│  Agreement Date * (date)                            │
│  ┌─────────────────────────────────────┐           │
│  │ 03/15/2024                          │ 📅        │
│  └─────────────────────────────────────┘           │
│                                                      │
│  Advanced Options ▼                                 │
│                                                      │
│  Output Format:                                     │
│  ○ PDF (pdf-lib)  ● DOCX (docxtemplater)  ○ Both   │
│                                                      │
│  [Live Preview]         [Cancel] [Generate]         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Bulk Generation Interface
```
┌─────────────────────────────────────────────────────┐
│         Bulk Generate from "Invoice Template"        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Step 1: Upload CSV File                            │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐                │
│  │   📁 Drag & drop CSV here      │                │
│  │      or click to browse        │                │
│  │   Max: 1000 rows, 10MB         │                │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                │
│                                                      │
│  ✅ File: customers.csv (250 rows)                  │
│                                                      │
│  Step 2: Map CSV Columns to Variables               │
│  ┌────────────────┬──────────────┐                 │
│  │ Template Var   │ CSV Column   │                 │
│  ├────────────────┼──────────────┤                 │
│  │ customer_name  │ [Name ▼]     │                 │
│  │ invoice_number │ [Invoice# ▼] │                 │
│  │ amount         │ [Total ▼]    │                 │
│  │ due_date       │ [Due Date ▼] │                 │
│  └────────────────┴──────────────┘                 │
│                                                      │
│  Preview (1 of 250): [< Previous] [Next >]          │
│  ┌─────────────────────────────────────┐           │
│  │ Invoice #1001                       │           │
│  │ Customer: ABC Corporation           │           │
│  │ Amount: $5,240.00                   │           │
│  │ Due: April 15, 2024                 │           │
│  └─────────────────────────────────────┘           │
│                                                      │
│  Processing via Supabase Edge Function              │
│  [Back]             [Cancel] [Generate All (250)]   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Template Marketplace
```
┌─────────────────────────────────────────────────────┐
│ Template Marketplace     [Search...] [Category ▼]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Categories: [All] [Legal] [Sales] [HR] [Finance]    │
│ Sort: [Most Used ▼]  Filter: [Free] [Premium]      │
│                                                      │
│ Featured Templates                                  │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│ │ NDA Standard │ │Sales Contract│ │Employee      ││
│ │              │ │              │ │Onboarding    ││
│ │ ⭐ 4.8 (523) │ │⭐ 4.9 (892)  │ │⭐ 4.7 (441)  ││
│ │ Legal        │ │Sales         │ │HR            ││
│ │ 12 variables │ │8 variables   │ │25 variables  ││
│ │ 2.5k uses    │ │4.1k uses     │ │1.8k uses     ││
│ │              │ │              │ │              ││
│ │ [Preview]    │ │[Preview]     │ │[Preview]     ││
│ │ [Use Now]    │ │[Use Now]     │ │[Use Now]     ││
│ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                      │
│ Browse All (127 templates)         [Load More ▼]    │
└─────────────────────────────────────────────────────┘
```

## Component Specifications

### Navigation Components
- **Top Bar**: 64px height, white bg, shadow-sm
- **Sidebar**: 260px width, collapsible, persistent state
- **Breadcrumbs**: Show hierarchy, clickable navigation

### Form Components
- **Input Fields**: 44px height, 14px label, border-gray-300
- **Variable Inputs**: Highlighted border (amber), type icons
- **Validation**: Real-time, inline error messages
- **Required Fields**: Red asterisk, aria-required

### Editor Components (Lexical)
- **Toolbar**: Sticky position, grouped actions
- **Variable Insertion**: {{}} button, autocomplete dropdown
- **Variable Highlighting**: Amber background, non-editable
- **Collaborative Cursors**: Colored, with user names

### Card Components
- **Template Cards**: 320px width, hover elevation
- **Action Buttons**: Bottom aligned, primary/secondary
- **Metadata**: Icon + text pairs, gray-600
- **Status Indicators**: Colored dots with tooltips

### Real-time Features
- **Presence Avatars**: 32px circles, online indicator
- **Activity Feed**: Timestamp, user, action format
- **Typing Indicators**: Pulsing animation
- **Conflict Warnings**: Yellow banner, resolve button

## Responsive Design

### Breakpoints
- **Mobile**: 0-640px (single column)
- **Tablet**: 641-1024px (adaptive columns)
- **Desktop**: 1025px+ (full layout)

### Mobile Adaptations
- Bottom navigation tab bar
- Full-width cards and forms
- Collapsible sections with accordions
- Swipe gestures for template carousel
- Simplified editor toolbar (essential only)

### Tablet Adaptations
- Floating sidebar (overlay)
- 2-column grid for templates
- Modal-based variable editor
- Touch-optimized buttons (min 44px)

## Accessibility (WCAG 2.1 AA)

### Visual
- Color contrast: 4.5:1 minimum ratio
- Focus indicators: 2px blue outline
- Error states: Not color-only
- Icons: Always with text labels or tooltips

### Keyboard Navigation
- Tab order: Logical flow
- Skip links: To main content
- Shortcuts: Documented and customizable
- Escape key: Close modals/dropdowns

### Screen Readers
- ARIA labels: All interactive elements
- Live regions: For dynamic updates
- Semantic HTML: Proper heading hierarchy
- Alt text: All images and icons

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save template
- `Ctrl/Cmd + P`: Preview document
- `Ctrl/Cmd + G`: Generate document
- `Ctrl/Cmd + Shift + V`: Insert variable
- `Ctrl/Cmd + /`: Show all shortcuts

## Interaction Patterns

### Loading States
- **Skeleton screens**: For content areas
- **Progress bars**: For file uploads/generation
- **Spinners**: For quick actions (<3s)
- **Percentage**: For bulk operations

### Error Handling
- **Toast notifications**: Non-blocking errors
- **Inline validation**: Form field errors
- **Error pages**: 404, 500 with actions
- **Retry mechanisms**: With exponential backoff

### Success Feedback
- **Success toasts**: With undo option
- **Checkmark animations**: For completions
- **Celebration**: For first template/generation
- **Progress tracking**: For onboarding

## Real-time Collaboration UI

### Live Presence
- Avatar stack in header (max 5 shown)
- Colored cursors in editor
- "Viewing/Editing" status badges
- User activity timeline

### Conflict Resolution
- Automatic save with versioning
- Conflict dialog with diff view
- Merge options (theirs/mine/manual)
- Rollback to previous versions

### Communication
- Inline comments on text selection
- Thread replies with @mentions
- Activity notifications (opt-in)
- Status messages (saving/saved)

## Performance Optimizations

### Code Splitting
- Route-based lazy loading
- Dynamic imports for heavy components
- Vendor bundle separation
- Tree shaking for icons

### Asset Optimization
- WebP images with fallbacks
- Lazy loading below fold
- Responsive images (srcset)
- SVG sprites for icons

### Runtime Performance
- Virtual scrolling for long lists
- Debounced search (300ms)
- Memoized expensive calculations
- Web Workers for processing

### Offline Support
- Service Worker caching
- IndexedDB for templates
- Sync queue for operations
- Offline indicator banner

## Dark Mode

### Color Adjustments
- Background: #0f172a (slate-900)
- Surface: #1e293b (slate-800)
- Text: #f1f5f9 (slate-100)
- Borders: #334155 (slate-700)
- Variables: #fbbf24 (amber-400)

### Implementation
- System preference detection
- Manual toggle in settings
- CSS custom properties
- Smooth transition (200ms)

## Onboarding Flow

### Welcome Tour (New Users)
1. **Welcome Modal**: Value proposition
2. **Dashboard Tour**: Tooltips on key areas
3. **First Upload**: Guided document upload
4. **Variable Tutorial**: Interactive insertion
5. **Generation Success**: Celebration screen

### Progressive Disclosure
- Start with core features
- Unlock advanced as used
- Contextual help tooltips
- "Learn more" links to docs

## Analytics & Metrics

### User Engagement
- Time to first template
- Templates per user
- Generation frequency
- Feature adoption funnel

### Performance Metrics
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Error rates by feature
- Bundle size impact

### Business Metrics
- Conversion rate (free to paid)
- Template marketplace usage
- Collaboration frequency
- User retention (DAU/MAU)

## Supabase Integration Points

### Authentication UI
- Supabase Auth UI components
- Social login buttons (Google, GitHub)
- Magic link option
- Password reset flow

### Real-time Features
- Supabase Realtime subscriptions
- Presence broadcasting
- Optimistic updates
- Conflict resolution

### Storage UI
- File upload progress
- Storage quota display
- File management interface
- Public URL generation

## Implementation Notes

### Tech Stack Alignment
- React 19.0.1 + TypeScript
- TailwindCSS for styling
- Lexical for rich text
- Supabase UI components
- Framer Motion for animations

### Component Architecture
- Atomic design principles
- Compound components pattern
- Render props for flexibility
- Custom hooks for logic

### State Management
- Zustand for global state
- React Query for server state
- Local state for UI
- URL state for navigation

### Testing Requirements
- Unit tests (Jest, RTL)
- E2E tests (Playwright)
- Visual regression (Percy)
- Accessibility (axe-core)
- Performance (Lighthouse)

## Deployment Considerations

### Environment Support
- Vercel/Netlify ready
- Environment variables
- Preview deployments
- A/B testing capability

### Monitoring
- Error tracking (Sentry)
- Analytics (Posthog)
- Performance (Web Vitals)
- User feedback widget

This design specification provides comprehensive UI/UX guidelines for implementing all core features identified in the README.md, fully leveraging the Supabase backend infrastructure verified in PLAN.md.