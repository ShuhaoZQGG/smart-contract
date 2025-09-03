# Smart Contract Template System - UI/UX Design Specifications

## Design System

### Brand & Visual Identity
- **Primary Color**: #3B82F6 (Blue-500)
- **Secondary Color**: #10B981 (Emerald-500) 
- **Accent Color**: #8B5CF6 (Violet-500)
- **Typography**: Inter (UI), Fira Code (code)
- **Spacing**: 4px base unit
- **Border Radius**: 8px (cards), 6px (buttons), 4px (inputs)

### Component Library
- **Framework**: Shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up → Onboarding → Upload Document → Insert Variables → Generate → Success
```

### 2. Returning User Flow
```
Sign In → Dashboard → Select Template → Fill Variables → Generate → Download
```

### 3. Bulk Generation Flow
```
Select Template → Upload CSV → Map Columns → Preview → Generate All → Download ZIP
```

## Page Layouts

### 1. Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Smart Contract    [Templates] [Docs] [Profile]│
├─────────────────────────────────────────────────────┤
│                                                      │
│  Welcome back, {{user_name}}                        │
│                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ + New        │ │ Recent       │ │ Quick        ││
│  │ Template     │ │ Templates    │ │ Generate     ││
│  └──────────────┘ └──────────────┘ └──────────────┘│
│                                                      │
│  Your Templates                    [Search] [Filter] │
│  ┌─────────────────────────────────────────────────┐│
│  │ ┌─────┐ Contract Template     Modified: 2h ago  ││
│  │ │ DOC │ 5 variables • 12 generations            ││
│  │ └─────┘ [Edit] [Generate] [Share] [...]         ││
│  ├─────────────────────────────────────────────────┤│
│  │ ┌─────┐ Invoice Template      Modified: 1d ago  ││
│  │ │ PDF │ 8 variables • 45 generations            ││
│  │ └─────┘ [Edit] [Generate] [Share] [...]         ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
│  Recent Activity                                     │
│  • Generated "Contract_JohnDoe.pdf" - 10 min ago    │
│  • Shared "Invoice Template" with team - 2h ago     │
│  • Created new template "NDA Agreement" - 1d ago    │
└─────────────────────────────────────────────────────┘
```

### 2. Template Editor (Lexical Rich Text)
```
┌─────────────────────────────────────────────────────────┐
│ ← Back  Template: {{template_name}}  [Save] [Preview]   │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────────────────┬───────────────────────┐  │
│ │ Formatting Toolbar        │ Variables Panel       │  │
│ │ [B][I][U][Link][List]     │ ┌───────────────────┐ │  │
│ │ [H1][H2][H3][Quote]       │ │ Active Variables  │ │  │
│ │ [Table][Image]            │ │ • client_name     │ │  │
│ ├───────────────────────────┤ │ • contract_date   │ │  │
│ │                           │ │ • amount          │ │  │
│ │ SERVICE AGREEMENT        │ │ • payment_terms   │ │  │
│ │                           │ │                   │ │  │
│ │ This agreement is between │ │ [+ Add Variable]  │ │  │
│ │ {{client_name}} and our   │ │                   │ │  │
│ │ company for services      │ │ Variable Settings │ │  │
│ │ starting {{contract_date}}.│ │ Name: client_name │ │  │
│ │                           │ │ Type: [Text    ▼] │ │  │
│ │ Total Amount: {{amount}}  │ │ Required: [✓]     │ │  │
│ │ Terms: {{payment_terms}}  │ │ Default: _____    │ │  │
│ │                           │ │ [Update][Delete]  │ │  │
│ │ [Type / to insert variable]│ └───────────────────┘ │  │
│ └───────────────────────────┴───────────────────────┘  │
│                                                         │
│ Status: Auto-saved 30 seconds ago                      │
└─────────────────────────────────────────────────────────┘
```

### 3. Document Generation Form
```
┌─────────────────────────────────────────────────────┐
│ Generate Document from: Contract Template           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Fill in Variables                                  │
│                                                     │
│ Client Name *                                      │
│ ┌─────────────────────────────────────────────────┐│
│ │ John Smith                                      ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Contract Date *                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📅 03/15/2024                                   ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Amount *                                            │
│ ┌─────────────────────────────────────────────────┐│
│ │ $ 50,000.00                                     ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Payment Terms                                       │
│ ┌─────────────────────────────────────────────────┐│
│ │ Net 30 days                                  ▼  ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Output Format                                       │
│ ( ) PDF  (•) DOCX                                  │
│                                                     │
│ [Preview] [Generate & Download]                    │
└─────────────────────────────────────────────────────┘
```

### 4. Bulk Generation Interface
```
┌─────────────────────────────────────────────────────┐
│ Bulk Generate: Invoice Template                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Step 1: Upload CSV                                 │
│ ┌─────────────────────────────────────────────────┐│
│ │  📁 Drop CSV file here or click to browse       ││
│ │                                                  ││
│ │      [Select File]                               ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Step 2: Map Columns                                │
│ ┌─────────────────────────────────────────────────┐│
│ │ Template Variable    →    CSV Column            ││
│ │ client_name         →    [Customer Name    ▼]  ││
│ │ invoice_date        →    [Date            ▼]  ││
│ │ amount              →    [Total           ▼]  ││
│ │ due_date            →    [Due Date        ▼]  ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Step 3: Preview (First 3 rows)                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ ✓ Invoice_JohnSmith.pdf                         ││
│ │ ✓ Invoice_JaneDoe.pdf                           ││
│ │ ✓ Invoice_BobJohnson.pdf                        ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [← Back] [Generate All 45 Documents]               │
└─────────────────────────────────────────────────────┘
```

### 5. Template Library (Marketplace Preview)
```
┌─────────────────────────────────────────────────────┐
│ Template Library          [Search] [Category ▼]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Featured Templates                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐      │
│ │ Professional││ Legal      ││ Business    │      │
│ │ Invoice     ││ NDA        ││ Proposal    │      │
│ │ ⭐ 4.8 (234)││ ⭐ 4.9 (567)││ ⭐ 4.7 (123)│      │
│ │ [Use]       ││ [Use]      ││ [Use]       │      │
│ └────────────┘ └────────────┘ └────────────┘      │
│                                                     │
│ Your Organization's Templates                       │
│ ┌─────────────────────────────────────────────────┐│
│ │ Contract v2.1        Sales Team • 15 uses      ││
│ │ Updated: 2 days ago  [Use] [Edit] [Stats]      ││
│ ├─────────────────────────────────────────────────┤│
│ │ Quote Template       Marketing • 8 uses        ││
│ │ Updated: 1 week ago  [Use] [Edit] [Stats]      ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Mobile Layout Adaptations
- Hamburger menu for navigation
- Stack template cards vertically
- Full-width forms and buttons
- Swipeable variable panel in editor
- Simplified toolbar with overflow menu

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus indicators on all interactive elements
- Escape key closes modals/dropdowns
- Arrow keys navigate menus

### Screen Reader Support
- Semantic HTML5 elements
- ARIA labels for icons and buttons
- Form field descriptions
- Status announcements for operations

### Visual Accessibility
- 4.5:1 contrast ratio minimum
- Resizable text up to 200%
- No color-only information
- Focus visible indicators

## Interactive Components

### 1. Variable Insertion
- Type `{{` triggers autocomplete dropdown
- Click "Add Variable" button opens modal
- Drag variables from panel to editor
- Variables highlighted with blue background
- Hover shows variable details tooltip

### 2. Real-time Collaboration (Cycle 2)
```
┌──────────────────────────────┐
│ Active Users (3)             │
│ 👤 John (editing)            │
│ 👤 Sarah (viewing)           │
│ 👤 Mike (commenting)         │
└──────────────────────────────┘
```

### 3. Auto-save Indicator
```
States:
- "Saving..." (spinner)
- "Saved" (✓ checkmark)
- "Error saving" (⚠️ warning)
- "Offline - will sync" (🔄 sync icon)
```

## Loading States

### Skeleton Loaders
- Template cards: Gray rectangles with shimmer
- Editor: Content placeholder with pulse
- Forms: Input field outlines with loading animation

### Progress Indicators
- Document upload: Progress bar with percentage
- Bulk generation: Step indicator + progress
- Template loading: Spinner with message

## Error States

### Form Validation
```
┌─────────────────────────────────┐
│ Client Name *                   │
│ ┌───────────────────────────────┐
│ │                               │
│ └───────────────────────────────┘
│ ❌ This field is required       │
└─────────────────────────────────┘
```

### System Errors
- Toast notifications for minor errors
- Modal dialogs for critical errors
- Inline error messages for form fields
- Retry buttons where applicable

## Performance Optimizations

### Code Splitting
- Lazy load editor component
- Dynamic import for PDF/DOCX libraries
- Route-based code splitting
- Progressive image loading

### Caching Strategy
- Cache templates in localStorage
- IndexedDB for large documents
- Service worker for offline support
- CDN for static assets

## Supabase Auth Integration

### Sign In/Up Flow
```
┌─────────────────────────────────┐
│     Smart Contract Templates    │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Continue with Google     🔍 ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Continue with GitHub     🐙 ││
│  └─────────────────────────────┘│
│                                 │
│  ─────── or ──────             │
│                                 │
│  Email                          │
│  ┌─────────────────────────────┐│
│  │ your@email.com              ││
│  └─────────────────────────────┘│
│  Password                       │
│  ┌─────────────────────────────┐│
│  │ ••••••••                    ││
│  └─────────────────────────────┘│
│                                 │
│  [Sign In]  New? Sign up →     │
└─────────────────────────────────┘
```

## Frontend Framework Recommendations

### Technology Stack
- **React 18.3** with TypeScript 5.6
- **Vite** for build tooling
- **Tailwind CSS** + **Shadcn/ui** for styling
- **Lexical** for rich text editing
- **React Hook Form** + **Zod** for forms
- **TanStack Query** for data fetching
- **Zustand** for global state
- **Framer Motion** for animations

### File Structure
```
src/
├── components/
│   ├── ui/          # Shadcn components
│   ├── editor/      # Lexical editor
│   ├── forms/       # Form components
│   └── layout/      # Layout components
├── features/
│   ├── templates/   # Template management
│   ├── generation/  # Document generation
│   └── auth/        # Authentication
├── hooks/           # Custom React hooks
├── lib/            # Utilities and helpers
└── pages/          # Route components
```

## Design Constraints for Development

### Performance Requirements
- Initial load: <2s
- Time to interactive: <3s
- Auto-save interval: 30s
- Maximum bundle size: 200KB (gzipped)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari/Chrome

### Data Limitations
- Maximum template size: 10MB
- Maximum variables per template: 100
- Maximum bulk generation: 1000 documents
- File upload limit: 25MB

## Next Steps for Implementation

1. Set up Shadcn/ui component library
2. Implement Lexical editor with variable system
3. Create responsive layout components
4. Build form generation system
5. Integrate Supabase Auth UI
6. Implement real-time features (Cycle 2)
7. Add marketplace UI (Cycle 3)