# Smart Contract Document Template System - UI/UX Design

## Design System

### Color Palette
- **Primary**: #3B82F6 (Blue 500)
- **Secondary**: #10B981 (Emerald 500)
- **Accent**: #8B5CF6 (Violet 500)
- **Error**: #EF4444
- **Warning**: #F59E0B
- **Success**: #22C55E
- **Background**: #FFFFFF / #F9FAFB
- **Dark Mode**: #111827 / #1F2937

### Typography
- **Headings**: Inter, system-ui
- **Body**: Inter, system-ui
- **Code**: 'Fira Code', monospace

### Spacing Grid
- Base unit: 4px
- Common spacings: 8px, 16px, 24px, 32px, 48px

## User Journeys

### 1. First-Time User Journey
```
Landing → Sign Up (Supabase Auth) → Dashboard → Upload Template → Edit Variables → Generate Document
```

**Key Touchpoints:**
- Clear value proposition on landing
- Streamlined Supabase Auth UI
- Interactive onboarding tour
- Sample templates gallery

### 2. Returning User Journey
```
Sign In → Dashboard → Select Template → Quick Generate OR Bulk Generate
```

**Key Touchpoints:**
- Recent templates quick access
- Saved variable sets
- Generation history

### 3. Power User Journey
```
Dashboard → Template Editor → Advanced Variables → Collaboration → Bulk Operations
```

**Key Touchpoints:**
- Keyboard shortcuts
- Batch operations
- Team workspace

## Page Layouts

### Landing Page
```
┌─────────────────────────────────────────────┐
│  Logo  [Features] [Pricing] [Sign In] [Start]│
├─────────────────────────────────────────────┤
│                                             │
│     Transform Any Document Into            │
│     A Smart Template                       │
│                                             │
│     [Upload Your First Template →]         │
│                                             │
│     ┌──────┐  ┌──────┐  ┌──────┐         │
│     │Upload│→ │Insert│→ │Generate│        │
│     │ Doc  │  │ Vars │  │ Docs  │         │
│     └──────┘  └──────┘  └──────┘         │
│                                             │
└─────────────────────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────────────┐
│ 📄 Smart Contract  [Search...] [👤] [Settings]│
├────┬────────────────────────────────────────┤
│    │  Dashboard                             │
│ 📁 │  ┌─────────────────────────────┐      │
│    │  │ + New Template              │      │
│ 📋 │  └─────────────────────────────┘      │
│    │                                        │
│ 📊 │  Recent Templates                      │
│    │  ┌──────┐ ┌──────┐ ┌──────┐         │
│ ⚙️ │  │Contract│ │Invoice│ │Report │        │
│    │  │  📄   │ │  📄   │ │  📄   │        │
│    │  └──────┘ └──────┘ └──────┘         │
│    │                                        │
│    │  Quick Actions                         │
│    │  [Upload] [Generate] [Browse Gallery] │
└────┴────────────────────────────────────────┘

Sidebar:
- Templates (with count)
- Generated (history)
- Analytics
- Settings
```

### Template Editor (Rich Text)
```
┌─────────────────────────────────────────────┐
│ ← Back  Template Name  [Save] [Preview] [...] │
├─────────────────────────────────────────────┤
│ [B][I][U] [T▼] [≡] [🔗] [{{}}] │ Variables │
├─────────────────────────┬───────────────────┤
│                         │ Used Variables:    │
│  Document Title         │ ┌───────────────┐ │
│                         │ │ client_name   │ │
│  This agreement between │ │ bank_name     │ │
│  {{bank_name}} and      │ │ loan_amount   │ │
│  {{client_name}} for    │ │ interest_rate │ │
│  the amount of          │ │ due_date      │ │
│  {{loan_amount}}...     │ └───────────────┘ │
│                         │                    │
│  [Insert variable ↓]    │ Variable Settings: │
│                         │ Type: [Text ▼]     │
│                         │ Required: [✓]      │
│                         │ Default: [____]    │
└─────────────────────────┴───────────────────┘

Toolbar Features:
- Bold, Italic, Underline
- Text size/style
- Alignment
- Links
- Variable insertion ({{}})
```

### Generation Interface
```
┌─────────────────────────────────────────────┐
│  Generate Document from: Contract Template   │
├─────────────────────────────────────────────┤
│                                             │
│  Fill Variable Values:                      │
│                                             │
│  Client Name *                              │
│  [_____________________________]            │
│                                             │
│  Bank Name *                                │
│  [_____________________________]            │
│                                             │
│  Loan Amount *                              │
│  $ [___________]                           │
│                                             │
│  Interest Rate                              │
│  [___] %                                    │
│                                             │
│  Due Date                                   │
│  [📅 Select Date_______________]            │
│                                             │
│  [Preview Document]  [Generate PDF] [DOCX]  │
└─────────────────────────────────────────────┘
```

### Bulk Generation
```
┌─────────────────────────────────────────────┐
│  Bulk Generate from: Contract Template       │
├─────────────────────────────────────────────┤
│                                             │
│  📁 Upload CSV File                         │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐              │
│  │  Drop CSV file here or    │              │
│  │  [Browse Files]           │              │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘              │
│                                             │
│  Column Mapping:                            │
│  ┌──────────────┬──────────────┐           │
│  │ CSV Column   │ Template Var │           │
│  ├──────────────┼──────────────┤           │
│  │ Name         → client_name  │           │
│  │ Bank         → bank_name    │           │
│  │ Amount       → loan_amount  │           │
│  │ Rate         → interest_rate│           │
│  │ Due          → due_date     │           │
│  └──────────────┴──────────────┘           │
│                                             │
│  Output: [PDF ▼]  [Generate All]           │
│                                             │
│  Progress: ████████░░ 80% (8/10)           │
└─────────────────────────────────────────────┘
```

## Component Library

### Buttons
```
Primary:   [Generate Document]  - Blue, filled
Secondary: [Preview]            - Gray, outlined
Danger:    [Delete]            - Red, filled
Ghost:     [Cancel]            - Transparent
```

### Form Elements
```
Text Input:    [_________________]
Select:        [Option ▼]
Date Picker:   [📅 MM/DD/YYYY]
File Upload:   [📁 Choose File]
Toggle:        [○─────]
Checkbox:      [✓] Option
```

### Cards
```
┌─────────────────────┐
│ Template Name       │
│ Last edited: 2 hrs  │
│ 5 variables         │
│ [Edit] [Generate]   │
└─────────────────────┘
```

### Modals
```
┌──────────────────────┐
│ × │ Confirm Delete   │
├──────────────────────┤
│ Delete this template?│
│                      │
│ [Cancel] [Delete]    │
└──────────────────────┘
```

## Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Mobile Layout
```
┌─────────────┐
│ ☰ Logo  👤  │
├─────────────┤
│ Templates   │
│ ┌─────────┐ │
│ │Template │ │
│ └─────────┘ │
│ ┌─────────┐ │
│ │Template │ │
│ └─────────┘ │
│             │
│ [+ New]     │
└─────────────┘
```

### Tablet Layout
- 2-column grid for templates
- Collapsible sidebar
- Touch-optimized controls

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratio: 4.5:1 minimum
- Focus indicators: 2px blue outline
- Skip navigation links
- ARIA labels for icons
- Keyboard navigation support

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save template
- `Ctrl/Cmd + P`: Preview
- `Ctrl/Cmd + G`: Generate
- `Tab`: Navigate fields
- `Esc`: Close modals

### Screen Reader Support
- Semantic HTML structure
- Descriptive alt text
- Form field labels
- Status announcements

## Loading States

### Skeleton Screens
```
┌─────────────┐
│ ░░░░░░░░░░  │
│ ░░░░░░░     │
│ ░░░░░░░░░░░ │
└─────────────┘
```

### Progress Indicators
- Spinner: ⟳ (for quick actions)
- Progress bar: ████░░░░ (for bulk operations)
- Percentage: "Processing... 75%"

## Error States

### Inline Validation
```
Email *
[invalid@email]
⚠️ Please enter a valid email
```

### Empty States
```
┌─────────────────────┐
│                     │
│    📄              │
│  No templates yet   │
│                     │
│ [Create Your First] │
└─────────────────────┘
```

## Animation & Transitions

### Micro-interactions
- Button hover: Scale 1.02, shadow
- Card hover: Lift with shadow
- Variable insertion: Highlight fade
- Success: Green checkmark animation

### Page Transitions
- Fade: 200ms ease-in-out
- Slide: 300ms cubic-bezier
- Modal: Backdrop fade + scale

## Dark Mode

### Color Adjustments
- Background: #111827
- Cards: #1F2937
- Text: #F9FAFB
- Borders: #374151
- Primary: #60A5FA (Blue 400)

## Performance Optimizations

### Image Optimization
- Lazy loading for template previews
- WebP format with fallbacks
- Responsive image sizes

### Code Splitting
- Route-based splitting
- Dynamic imports for heavy components
- Vendor bundle separation

### Caching Strategy
- Service worker for offline support
- Template caching
- Variable sets local storage

## Mobile-Specific Features

### Touch Gestures
- Swipe to delete templates
- Pull to refresh
- Pinch to zoom preview

### Native Features
- Share API for documents
- Camera for document scan
- File system access

## Collaboration Features (Future)

### Real-time Indicators
```
┌─────────────────────┐
│ 👤 John editing...  │
│ 👤 Sarah viewing    │
└─────────────────────┘
```

### Commenting System
```
│ This clause needs review
│ └─ @john: Updated the terms
│   └─ @sarah: Looks good ✓
```

## Technical Recommendations

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State**: Zustand for simple state
- **Forms**: React Hook Form + Zod
- **Rich Text**: Lexical (Facebook's editor)
- **Icons**: Heroicons
- **Animations**: Framer Motion

### Component Architecture
```
src/
├── components/
│   ├── ui/          (Button, Input, Card)
│   ├── layout/      (Header, Sidebar, Footer)
│   ├── editor/      (RichTextEditor, VariableInserter)
│   ├── generation/  (GenerationForm, BulkUploader)
│   └── templates/   (TemplateCard, TemplateList)
├── pages/
├── hooks/
└── utils/
```

### Supabase Auth Integration
- Use Supabase Auth UI components
- Social logins: Google, GitHub
- Magic link support
- Session persistence
- Protected routes with RLS

## Success Metrics

### UX Metrics
- Time to first template: < 2 minutes
- Variable insertion accuracy: > 95%
- Generation success rate: > 99%
- Mobile usage: > 30%

### Performance Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Bundle size: < 200KB gzipped