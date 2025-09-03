# Smart Contract Document Template System - UI/UX Design

## Design Principles
- **Simplicity First**: Clean, intuitive interface with progressive disclosure
- **Mobile Responsive**: All features accessible on tablets and phones
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: <1.5s initial load, instant interactions

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up (Supabase Auth) → Dashboard → Upload Document → Edit Template → Generate Document
```

### 2. Returning User Flow
```
Sign In → Dashboard → Select Template → Fill Variables → Generate/Bulk Generate
```

### 3. Collaboration Flow
```
Dashboard → Share Template → Set Permissions → Collaborator Edits → Real-time Updates
```

## Page Layouts

### Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract        [Search]    [User] [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Welcome back, {{user_name}}                             │
│                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │ + New        │ │ Recent       │ │ Marketplace  │    │
│ │   Template   │ │ Templates    │ │              │    │
│ └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                          │
│ My Templates                                   [Filter▼] │
│ ┌─────────────────────────────────────────────────────┐│
│ │ ▢ Loan Agreement    Modified 2h ago    [Edit][Gen]  ││
│ │ ▢ NDA Template      Modified 1d ago    [Edit][Gen]  ││
│ │ ▢ Service Contract  Modified 3d ago    [Edit][Gen]  ││
│ └─────────────────────────────────────────────────────┘│
│                                                          │
│ Recent Activity                                         │
│ • Generated "Loan-JohnDoe.pdf" - 10 min ago            │
│ • Bulk generated 25 documents - 2h ago                  │
│ • Template shared with team@example.com - 1d ago       │
└─────────────────────────────────────────────────────────┘
```

### Template Editor (Rich Text)
```
┌─────────────────────────────────────────────────────────┐
│ ← Back   Template: {{template_name}}   [Auto-save ✓]    │
├─────────────────────────────────────────────────────────┤
│ [B][I][U] [List▼] [Link] [Table] [{{}}Variable] [Undo]  │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┬─────────────────────┐│
│ │                               │ Variables          ││
│ │ Loan Agreement                │ ┌─────────────────┐││
│ │                               │ │ client_name     │││
│ │ This agreement is between     │ │ bank_name       │││
│ │ {{bank_name}} and             │ │ loan_amount     │││
│ │ {{client_name}} for a loan    │ │ interest_rate   │││
│ │ amount of {{loan_amount}}     │ │ due_date        │││
│ │                               │ └─────────────────┘││
│ │ Interest Rate: {{interest_    │                    ││
│ │ rate}}%                       │ + Add Variable     ││
│ │                               │                    ││
│ │ Due Date: {{due_date}}        │ Collaborators (2)  ││
│ │                               │ ● John (editing)   ││
│ │ [Cursor position indicators]  │ ○ Sarah (viewing)  ││
│ └───────────────────────────────┴─────────────────────┘│
│                                                          │
│ [Preview] [Test Generate] [Save Version] [Share]        │
└─────────────────────────────────────────────────────────┘
```

### Document Generation Form
```
┌─────────────────────────────────────────────────────────┐
│ Generate Document from "Loan Agreement"                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Fill in Variables:                                      │
│                                                          │
│ Client Name *                                           │
│ ┌───────────────────────────────────────────────────┐  │
│ │ John Smith                                        │  │
│ └───────────────────────────────────────────────────┘  │
│                                                          │
│ Bank Name *                                             │
│ ┌───────────────────────────────────────────────────┐  │
│ │ First National Bank                               │  │
│ └───────────────────────────────────────────────────┘  │
│                                                          │
│ Loan Amount *                                           │
│ ┌───────────────────────────────────────────────────┐  │
│ │ $50,000                                           │  │
│ └───────────────────────────────────────────────────┘  │
│                                                          │
│ Interest Rate (%) *                                     │
│ ┌───────────────────────────────────────────────────┐  │
│ │ 5.5                                                │  │
│ └───────────────────────────────────────────────────┘  │
│                                                          │
│ Due Date                                                │
│ ┌───────────────────────────────────────────────────┐  │
│ │ 📅 03/15/2025                                     │  │
│ └───────────────────────────────────────────────────┘  │
│                                                          │
│ Output Format:  ○ PDF  ● DOCX                          │
│                                                          │
│ [Preview] [Generate Document] [Bulk Generate from CSV]  │
└─────────────────────────────────────────────────────────┘
```

### Bulk Generation Interface
```
┌─────────────────────────────────────────────────────────┐
│ Bulk Generate from CSV                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Template: Loan Agreement                                │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │ 📎 Drag & drop CSV file here or click to browse     ││
│ │                                                      ││
│ │         Expected columns:                           ││
│ │         client_name, bank_name, loan_amount,        ││
│ │         interest_rate, due_date                     ││
│ └─────────────────────────────────────────────────────┘│
│                                                          │
│ Preview (First 5 rows):                                 │
│ ┌─────────────────────────────────────────────────────┐│
│ │ # │ client_name │ bank_name │ loan_amount │ ...    ││
│ │───┼─────────────┼───────────┼─────────────┼────────││
│ │ 1 │ John Smith  │ FNB       │ 50000       │ ...    ││
│ │ 2 │ Jane Doe    │ FNB       │ 75000       │ ...    ││
│ │ 3 │ Bob Johnson │ FNB       │ 100000      │ ...    ││
│ └─────────────────────────────────────────────────────┘│
│                                                          │
│ Total Documents: 125                                    │
│ Output Format: ○ PDF ● DOCX ○ Both                     │
│                                                          │
│ [Map Columns] [Validate] [Generate All]                 │
└─────────────────────────────────────────────────────────┘
```

### Template Marketplace
```
┌─────────────────────────────────────────────────────────┐
│ Template Marketplace           [Search] [Category▼]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Featured Templates                                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ NDA      │ │ Invoice  │ │ Contract │ │ Report   │   │
│ │ ⭐ 4.8   │ │ ⭐ 4.9   │ │ ⭐ 4.7   │ │ ⭐ 4.6   │   │
│ │ 2.3k     │ │ 5.1k     │ │ 1.8k     │ │ 900      │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│ Browse by Category                                      │
│ [Legal] [Finance] [HR] [Sales] [Marketing] [Admin]      │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Service Agreement Template                          ││
│ │ by LegalTemplates  ⭐ 4.9 (342 reviews)            ││
│ │ Professional service agreement with customizable    ││
│ │ terms, payment schedules, and deliverables.        ││
│ │ [Preview] [Import to Library] [Reviews]            ││
│ ├─────────────────────────────────────────────────────┤│
│ │ Employment Contract                                 ││
│ │ by HRPro  ⭐ 4.7 (189 reviews)                     ││
│ │ Comprehensive employment contract with benefits,    ││
│ │ compensation, and termination clauses.             ││
│ │ [Preview] [Import to Library] [Reviews]            ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Component Specifications

### Navigation
- **Top Bar**: Logo, search, user menu, notifications
- **Sidebar** (Desktop): Quick access to templates, recent docs, settings
- **Bottom Tab** (Mobile): Dashboard, Templates, Generate, Profile

### Forms
- **Input Fields**: Clear labels, inline validation, helper text
- **Variable Types**: Text, number, date picker, dropdown, calculated
- **Validation**: Real-time feedback, clear error messages

### Editor Features
- **Toolbar**: Bold, italic, underline, lists, tables, links, variables
- **Variable Insertion**: Click button or type {{, auto-complete
- **Highlighting**: Variables in blue, editable text in black
- **Collaboration**: User avatars, cursor positions, selection highlights

### Responsive Breakpoints
- **Mobile**: 320px - 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px (two columns, collapsible sidebar)
- **Desktop**: 1024px+ (full layout, fixed sidebar)

## Accessibility Features
- **Keyboard Navigation**: Tab order, shortcuts (Ctrl+S save, Ctrl+G generate)
- **Screen Reader**: ARIA labels, semantic HTML, announcements
- **Visual**: High contrast mode, focus indicators, 16px minimum font
- **Motor**: Large click targets (44x44px), no time-based interactions

## Performance Optimizations
- **Lazy Loading**: Load editor only when needed
- **Code Splitting**: Separate bundles for editor, marketplace, generation
- **Skeleton Screens**: Show layout while loading content
- **Optimistic Updates**: Update UI immediately, sync in background
- **Auto-save**: Every 30 seconds with debouncing

## Frontend Framework Recommendations
- **Framework**: React 18.3 (existing) with TypeScript
- **UI Library**: Tailwind CSS + Shadcn/ui (existing)
- **Rich Editor**: Lexical (Facebook) for advanced features
- **State**: Zustand for local, Supabase Realtime for sync
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table for data grids
- **Icons**: Lucide React for consistent iconography

## Design Tokens
```css
/* Colors */
--primary: #2563eb (blue-600)
--secondary: #64748b (slate-500)
--success: #10b981 (emerald-500)
--danger: #ef4444 (red-500)
--variable: #3b82f6 (blue-500)

/* Typography */
--font-body: 'Inter', system-ui, sans-serif
--font-mono: 'JetBrains Mono', monospace
--text-base: 16px
--text-sm: 14px
--text-lg: 18px

/* Spacing */
--space-unit: 8px
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px

/* Borders */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
```

## Mobile-First Considerations
- Touch-friendly variable insertion
- Swipe gestures for navigation
- Collapsible panels to save space
- Bottom sheet for forms
- Native share functionality
- Offline mode with sync

## Integration Points
- **Supabase Auth UI**: Use built-in components for sign in/up
- **Supabase Storage**: Direct upload with progress indicators
- **Supabase Realtime**: WebSocket status indicator
- **Edge Functions**: Loading states during processing