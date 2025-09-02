# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Brand Identity
- **Primary Color**: #6366F1 (Indigo-500)
- **Secondary Color**: #10B981 (Emerald-500)
- **Error**: #EF4444 (Red-500)
- **Warning**: #F59E0B (Amber-500)
- **Typography**: Inter (UI), Monaco (Code)
- **Border Radius**: 0.5rem (consistent rounded corners)
- **Shadows**: Subtle depth with 3-level shadow system

### Component Library
- **Framework**: Shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion for smooth transitions
- **Theme**: Light/Dark mode support with system preference detection
- **Forms**: React Hook Form with Zod validation
- **Tables**: Tanstack Table for data grids
- **Auth**: Supabase Auth UI components

## User Journeys

### 1. First-Time User Journey
```
Landing → Sign Up (Supabase Auth) → Dashboard → Upload Document → Edit Template → Generate Document
```

**Key Touch Points:**
- Welcome modal with interactive tutorial
- Sample templates for quick start
- Tooltips for variable insertion
- Success celebration on first generation

### 2. Power User Journey
```
Dashboard → Template Library → Select Template → Bulk CSV Upload → Review Mapping → Generate Batch → Download ZIP
```

**Key Touch Points:**
- Keyboard shortcuts (Cmd+K for search, Cmd+I for insert variable)
- Recent templates quick access
- Saved CSV mappings
- Batch operation progress indicators

### 3. Template Editor Journey
```
Open Template → Insert Variables → Set Validation Rules → Preview → Save Version → Share/Export
```

**Key Touch Points:**
- Auto-save every 30 seconds
- Variable autocomplete
- Real-time preview
- Version history sidebar

## Page Layouts

### 1. Dashboard (/)
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract     [Search]    [User] [Settings] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome back, {{user_name}}!                          │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ + New       │ │ Upload      │ │ Browse      │      │
│  │ Template    │ │ Document    │ │ Library     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                         │
│  Recent Templates                           [View All] │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 📄 Loan Agreement      Updated 2h ago    [Edit]  │ │
│  │ 📄 NDA Template        Updated 1d ago    [Edit]  │ │
│  │ 📄 Service Contract    Updated 3d ago    [Edit]  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  Quick Stats                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │   12   │ │   48   │ │   5    │ │  85%   │        │
│  │Templates│ │Generated│ │ Active │ │Success │        │
│  └────────┘ └────────┘ └────────┘ └────────┘        │
└─────────────────────────────────────────────────────────┘
```

### 2. Template Editor (/templates/[id]/edit)
```
┌─────────────────────────────────────────────────────────┐
│ ← Back   Template: {{template_name}}    [Save] [Preview]│
├─────────────────────────────────────────────────────────┤
│ Toolbar: [B][I][U] | [{{}}] [📅] [#] [@] | [Undo][Redo]│
├──────────────────────────┬──────────────────────────────┤
│                          │ Variables ({{count}})        │
│  Document Editor         │ ┌────────────────────────┐  │
│                          │ │ client_name     [⚙️]   │  │
│  This agreement is       │ │ Type: text            │  │
│  between {{client_name}} │ │ Required: ✓           │  │
│  and {{company_name}}.   │ ├────────────────────────┤  │
│                          │ │ company_name    [⚙️]   │  │
│  Date: {{date}}          │ │ Type: text            │  │
│  Amount: ${{amount}}     │ │ Default: "ACME Corp"  │  │
│                          │ ├────────────────────────┤  │
│  [Highlighting shows     │ │ date           [⚙️]   │  │
│   variables in blue]     │ │ Type: date            │  │
│                          │ │ Format: MM/DD/YYYY    │  │
│                          │ ├────────────────────────┤  │
│                          │ │ amount         [⚙️]   │  │
│                          │ │ Type: number          │  │
│                          │ │ Min: 0                │  │
│                          │ └────────────────────────┤  │
│                          │ [+ Add Variable]         │  │
└──────────────────────────┴──────────────────────────────┘
```

### 3. Document Generation (/templates/[id]/generate)
```
┌─────────────────────────────────────────────────────────┐
│ Generate from: {{template_name}}           [× Close]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Choose Generation Method:                             │
│                                                         │
│  ┌─────────────────────┬─────────────────────┐        │
│  │ 📝 Single Document  │ 📊 Bulk from CSV    │        │
│  └─────────────────────┴─────────────────────┘        │
│                                                         │
│  Fill in Variables:                                    │
│  ┌──────────────────────────────────────────┐         │
│  │ client_name *    [_________________]     │         │
│  │ company_name     [ACME Corp_________]     │         │
│  │ date *           [📅 _______________]     │         │
│  │ amount *         [$ _______________]      │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
│  Output Format:                                        │
│  ( ) PDF  (•) DOCX  ( ) Both                          │
│                                                         │
│  [Preview]              [Generate & Download]          │
└─────────────────────────────────────────────────────────┘
```

### 4. CSV Bulk Generation (/templates/[id]/bulk)
```
┌─────────────────────────────────────────────────────────┐
│ Bulk Generation: {{template_name}}                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 1: Upload CSV                                    │
│  ┌──────────────────────────────────────────┐         │
│  │                                          │         │
│  │     📁 Drag & drop CSV file here         │         │
│  │         or click to browse               │         │
│  │                                          │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
│  Step 2: Map Columns                                   │
│  ┌──────────────────────────────────────────┐         │
│  │ Template Variable → CSV Column           │         │
│  │                                          │         │
│  │ client_name    → [Select Column ▼]       │         │
│  │ company_name   → [Column B ▼]            │         │
│  │ date           → [Column C ▼]            │         │
│  │ amount         → [Column D ▼]            │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
│  Preview (First 3 rows):                               │
│  ┌──────────────────────────────────────────┐         │
│  │ ✓ John Smith, ACME Corp, 03/15/24, $5000 │         │
│  │ ✓ Jane Doe, ACME Corp, 03/16/24, $7500  │         │
│  │ ⚠️ Invalid date format in row 3          │         │
│  └──────────────────────────────────────────┘         │
│                                                         │
│  [← Back]    [Validate All]    [Generate Batch →]      │
└─────────────────────────────────────────────────────────┘
```

### 5. Template Library (/library)
```
┌─────────────────────────────────────────────────────────┐
│ Template Library               [+ New Template]         │
├─────────────────────────────────────────────────────────┤
│ [Search templates...]  [All ▼] [Recent ▼] [Grid/List]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│ │📄       │ │📄       │ │📄       │ │📄       │      │
│ │ Loan    │ │ NDA     │ │Service  │ │Invoice  │      │
│ │Agreement│ │Template │ │Contract │ │Template │      │
│ │         │ │         │ │         │ │         │      │
│ │5 vars   │ │3 vars   │ │8 vars   │ │6 vars   │      │
│ │Updated  │ │Updated  │ │Updated  │ │Updated  │      │
│ │2h ago   │ │1d ago   │ │3d ago   │ │5d ago   │      │
│ │         │ │         │ │         │ │         │      │
│ │[Edit]   │ │[Edit]   │ │[Edit]   │ │[Edit]   │      │
│ │[Generate]│ │[Generate]│ │[Generate]│ │[Generate]│     │
│ │[Delete] │ │[Delete] │ │[Delete] │ │[Delete] │      │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                         │
│ Showing 1-12 of 48        [← Previous] [1][2][3][4][→] │
└─────────────────────────────────────────────────────────┘
```


## Mobile Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Adaptations
1. **Navigation**: Bottom tab bar for main actions
2. **Editor**: Full-screen with collapsible variable panel
3. **Forms**: Single column, larger touch targets
4. **Tables**: Horizontal scroll with fixed first column
5. **Modals**: Full-screen on mobile

## Accessibility Features (WCAG 2.1 AA)

### Keyboard Navigation
- **Tab Order**: Logical flow through all interactive elements
- **Focus Indicators**: Visible outline on all focusable elements
- **Shortcuts**:
  - `Cmd/Ctrl + K`: Quick search
  - `Cmd/Ctrl + I`: Insert variable
  - `Cmd/Ctrl + S`: Save template
  - `Cmd/Ctrl + G`: Generate document
  - `Esc`: Close modals/overlays

### Screen Reader Support
- **ARIA Labels**: All interactive elements properly labeled
- **Live Regions**: Status updates announced
- **Semantic HTML**: Proper heading hierarchy
- **Form Labels**: Associated with inputs
- **Error Messages**: Clearly associated with fields

### Visual Accessibility
- **Color Contrast**: Minimum 4.5:1 for normal text
- **Font Sizing**: Base 16px, scalable to 200%
- **Icons**: Always paired with text labels
- **Error States**: Not color-only indicators
- **Dark Mode**: Full theme support

## Interaction Patterns

### Variable Insertion
1. **Type Method**: User types `{{` to trigger autocomplete
2. **Button Method**: Click variable button in toolbar
3. **Drag & Drop**: Drag variable from panel to editor
4. **Right-Click**: Context menu to insert at cursor

### Validation Feedback
- **Inline**: Real-time validation as user types
- **Summary**: Error summary at form top
- **Field-Level**: Specific error below each field
- **Success**: Green check mark for valid fields

### Loading States
- **Skeleton Screens**: For initial page loads
- **Progress Bars**: For file uploads/generation
- **Spinners**: For quick actions (<2s)
- **Background Tasks**: Toast notifications

## Component Specifications

### Buttons
- **Primary**: Filled background, white text
- **Secondary**: Outlined, transparent background
- **Danger**: Red background for destructive actions
- **Sizes**: sm (32px), md (40px), lg (48px)
- **States**: Default, Hover, Active, Disabled, Loading

### Forms
- **Input Height**: 40px standard
- **Label Position**: Above input
- **Helper Text**: Below input, gray color
- **Error Text**: Below input, red color
- **Required Indicator**: Red asterisk (*)

### Cards
- **Padding**: 16px mobile, 24px desktop
- **Border**: 1px solid border-gray-200
- **Shadow**: shadow-sm on hover
- **Border Radius**: 8px

### Modals
- **Max Width**: 600px desktop, full mobile
- **Overlay**: Black 50% opacity
- **Close Button**: Top right corner
- **Actions**: Right-aligned buttons

## Performance Considerations

### Optimizations
- **Lazy Loading**: Templates and documents on scroll
- **Virtualization**: Long lists (>100 items)
- **Code Splitting**: Per-route bundles
- **Image Optimization**: WebP with fallbacks
- **Caching**: Template content, user preferences

### Target Metrics
- **FCP**: <1.8s
- **TTI**: <3.9s
- **CLS**: <0.1
- **Bundle Size**: <200KB initial

## Supabase Integration

### Auth UI Components
- **Sign Up/In**: Supabase Auth UI with custom theming
- **OAuth**: Google, GitHub providers pre-configured
- **Magic Links**: Email-based passwordless auth
- **Session Management**: Automatic refresh tokens

### Real-time Features
- **Template Updates**: Live sync across tabs
- **Generation Status**: Progress updates via channels
- **Collaboration**: Presence indicators (Phase 4)

## Next Steps for Development

### Priority 1 (MVP)
1. Dashboard with recent templates
2. Basic template editor with variable insertion
3. Single document generation
4. Supabase Auth integration

### Priority 2 (Enhanced)
1. CSV bulk generation
2. Template library with search
3. Variable validation rules
4. Preview functionality

### Priority 3 (Advanced)
1. Real-time collaboration
2. Template marketplace
3. Analytics dashboard
4. API integration