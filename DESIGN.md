# Smart Contract Document Template System - UI/UX Design

## Design System

### Material Design 3 Foundation
- **Color Scheme**: Dynamic color with tonal palettes
- **Typography**: Inter for UI, JetBrains Mono for code/variables
- **Spacing**: 8px grid system
- **Elevation**: 5-level system for depth perception
- **Motion**: Smooth transitions (200-300ms ease-in-out)

### Accessibility (WCAG 2.1 AA)
- **Contrast Ratios**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: 2px solid outline with 2px offset
- **Keyboard Navigation**: Full tab support, arrow key navigation
- **Screen Readers**: ARIA labels, roles, and live regions
- **Mobile Touch**: 44x44px minimum touch targets

## User Journeys

### 1. Template Creation Journey
```
Landing → Upload Document → Visual Editor → Insert Variables → Save Template
```
**Key Actions**: Upload DOCX/PDF → Edit with rich text → Add {{variables}} → Preview → Save

### 2. Document Generation Journey
```
Template Library → Select Template → Fill Variables → Preview → Generate
```
**Key Actions**: Browse/search → Select → Input values → Review → Download PDF/DOCX

### 3. Bulk Generation Journey
```
Template → Upload CSV → Map Columns → Process → Download ZIP
```
**Key Actions**: Select template → Import CSV → Map variables → Generate batch → Download all

### 4. Collaboration Journey
```
Template → Share → Edit Together → Resolve Conflicts → Merge Changes
```
**Key Actions**: Invite users → Real-time editing → See presence → Comment → Resolve

## Core Screens

### 1. Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract     [Search...]    [+Template] [User] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome back, {{user_name}}                               │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Recent       │ │ Templates    │ │ Documents    │       │
│  │ Activity     │ │ Created      │ │ Generated    │       │
│  │              │ │              │ │              │       │
│  │ [icon] 24    │ │ [icon] 12    │ │ [icon] 156   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
│  Recent Templates                           [View All →]    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Contract Template    Modified 2h ago    [Edit]    │   │
│  │ • Invoice Template     Modified 1d ago    [Edit]    │   │
│  │ • NDA Template        Modified 3d ago    [Edit]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Quick Actions                                             │
│  [+ Create Template] [Generate Document] [Browse Gallery]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Template Editor
```
┌─────────────────────────────────────────────────────────────┐
│ [← Back] Template: {{template_name}}                       │
│ [Save] [Preview] [Share] [Version History]                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌───────────────────────────────┬─────────────────────┐   │
│ │ Toolbar:                       │ Variables ({{4}})   │   │
│ │ [B][I][U][Link][List][{{}}]    │                     │   │
│ ├───────────────────────────────┼─────────────────────┤   │
│ │                                │ • client_name       │   │
│ │ LOAN AGREEMENT                 │   [text] Required  │   │
│ │                                │                     │   │
│ │ This agreement is between      │ • loan_amount      │   │
│ │ {{bank_name}} and             │   [number] $       │   │
│ │ {{client_name}} for a loan    │                     │   │
│ │ amount of {{loan_amount}}.    │ • interest_rate    │   │
│ │                                │   [number] %       │   │
│ │ Interest Rate: {{interest}}%   │                     │   │
│ │ Due Date: {{due_date}}        │ • due_date         │   │
│ │                                │   [date]           │   │
│ │ [Active users: 👤 John, 👤 Mary] │                     │   │
│ └───────────────────────────────┴─────────────────────┘   │
│                                                             │
│ [💬 3 Comments]  [🔄 Auto-save: On]  [👁 Preview Mode]      │
└─────────────────────────────────────────────────────────────┘
```

### 3. Variable Input Form
```
┌─────────────────────────────────────────────────────────────┐
│ Generate Document from: Loan Agreement v2                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fill in the following variables:                          │
│                                                             │
│  Bank Name *                                               │
│  ┌───────────────────────────────────────────────────┐     │
│  │ First National Bank                               │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Client Name *                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ John Smith                                        │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Loan Amount *                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ $ 50,000                                          │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Interest Rate (%) *                                       │
│  ┌───────────────────────────────────────────────────┐     │
│  │ 5.5                                               │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Due Date *                                                │
│  ┌───────────────────────────────────────────────────┐     │
│  │ 📅 03/15/2025                                     │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  Output Format:                                            │
│  ○ PDF  ● DOCX  ○ Both                                    │
│                                                             │
│  [Cancel] [Preview] [Generate Document]                    │
└─────────────────────────────────────────────────────────────┘
```

### 4. Template Library
```
┌─────────────────────────────────────────────────────────────┐
│ Template Library                    [Search...] [Filter ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Categories: [All] [Contracts] [Invoices] [Legal] [HR]      │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ [📄]        │ │ [📄]        │ │ [📄]        │          │
│ │             │ │             │ │             │          │
│ │ Employment  │ │ NDA         │ │ Invoice     │          │
│ │ Contract    │ │ Template    │ │ Template    │          │
│ │             │ │             │ │             │          │
│ │ ⭐ 4.8 (124) │ │ ⭐ 4.6 (89)  │ │ ⭐ 4.9 (201) │          │
│ │ 12 vars     │ │ 8 vars      │ │ 15 vars     │          │
│ │             │ │             │ │             │          │
│ │ [Use] [Clone]│ │ [Use] [Clone]│ │ [Use] [Clone]│          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ [📄]        │ │ [📄]        │ │ [📄]        │          │
│ │             │ │             │ │             │          │
│ │ Purchase    │ │ Service     │ │ Lease       │          │
│ │ Order       │ │ Agreement   │ │ Agreement   │          │
│ │             │ │             │ │             │          │
│ │ ⭐ 4.5 (67)  │ │ ⭐ 4.7 (112) │ │ ⭐ 4.4 (45)  │          │
│ │ 10 vars     │ │ 14 vars     │ │ 18 vars     │          │
│ │             │ │             │ │             │          │
│ │ [Use] [Clone]│ │ [Use] [Clone]│ │ [Use] [Clone]│          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│ [← Previous] Page 1 of 5 [Next →]                          │
└─────────────────────────────────────────────────────────────┘
```

### 5. Bulk Generation Interface
```
┌─────────────────────────────────────────────────────────────┐
│ Bulk Document Generation                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Template: Employment Contract v3                           │
│                                                             │
│ Step 1: Upload CSV File                                    │
│ ┌───────────────────────────────────────────────────┐     │
│ │ 📎 employees.csv (245 rows)                       │     │
│ │ Uploaded successfully ✓                           │     │
│ └───────────────────────────────────────────────────┘     │
│                                                             │
│ Step 2: Map CSV Columns to Variables                       │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Template Variable    →    CSV Column               │   │
│ │ ─────────────────────────────────────────────────  │   │
│ │ employee_name        →    [Full Name         ▼]    │   │
│ │ position             →    [Job Title         ▼]    │   │
│ │ start_date           →    [Start Date        ▼]    │   │
│ │ salary               →    [Annual Salary     ▼]    │   │
│ │ department           →    [Department        ▼]    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Step 3: Preview & Generate                                 │
│ ☑ Generate as PDF                                          │
│ ☑ Generate as DOCX                                         │
│ ☐ Send via email (requires setup)                         │
│                                                             │
│ Processing: [████████████░░░░░] 156/245 (64%)             │
│ Estimated time remaining: 2 minutes                        │
│                                                             │
│ [Cancel] [Pause] [Download Completed (156)]                │
└─────────────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Mobile Template Editor (375px width)
```
┌─────────────────────┐
│ [☰] Contract v2 [⋮]│
├─────────────────────┤
│ [B][I][U][{{}}][⋯] │
├─────────────────────┤
│                     │
│ LOAN AGREEMENT      │
│                     │
│ This agreement is   │
│ between {{bank}}    │
│ and {{client}}...   │
│                     │
│ [View Variables (4)]│
│                     │
├─────────────────────┤
│ [Save] [Preview]    │
└─────────────────────┘
```

### Mobile Dashboard
```
┌─────────────────────┐
│ [☰] Smart Contract  │
├─────────────────────┤
│ Welcome, John       │
│                     │
│ Quick Actions       │
│ ┌─────────────────┐ │
│ │ + New Template  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Generate Doc    │ │
│ └─────────────────┘ │
│                     │
│ Recent Templates    │
│ ┌─────────────────┐ │
│ │ Contract v2     │ │
│ │ 2 hours ago     │ │
│ │ [Edit] [Use]    │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## Component Library

### Buttons
- **Primary**: Filled, elevated, call-to-action
- **Secondary**: Outlined, secondary actions
- **Text**: Minimal, tertiary actions
- **FAB**: Floating action button for primary create action

### Forms
- **Text Input**: Outlined variant with labels
- **Select**: Dropdown with search capability
- **Date Picker**: Calendar popup with keyboard input
- **File Upload**: Drag-and-drop with progress indicator

### Feedback
- **Snackbar**: Temporary notifications (3-5 seconds)
- **Dialog**: Modal confirmations and forms
- **Progress**: Linear for operations, circular for loading
- **Skeleton**: Content placeholders during loading

### Navigation
- **App Bar**: Fixed top with primary actions
- **Drawer**: Side navigation for mobile/tablet
- **Tabs**: Section navigation within pages
- **Breadcrumbs**: Path navigation for deep hierarchy

## Variable System UI

### Variable Insertion
- **Syntax Highlighting**: {{variables}} in blue (#1976d2)
- **Auto-complete**: Dropdown with existing variables
- **Quick Insert**: Floating action button in editor
- **Validation**: Real-time checking for undefined variables

### Variable Management Panel
```
Variables Used (4)
├─ client_name [text] *
│  └─ Default: "Customer"
├─ loan_amount [number] *
│  └─ Format: Currency
├─ interest_rate [number]
│  └─ Range: 0-100
└─ due_date [date] *
   └─ Format: MM/DD/YYYY
```

## Real-time Collaboration UI

### Presence Indicators
- **Cursor Colors**: Each user gets unique color
- **Avatar Badges**: Show active users in editor
- **Selection Highlight**: Show what others are editing
- **Activity Feed**: Real-time changes sidebar

### Conflict Resolution
```
┌─────────────────────────────┐
│ Merge Conflict Detected     │
├─────────────────────────────┤
│ Your Version:               │
│ "Payment due in 30 days"    │
│                             │
│ John's Version:            │
│ "Payment due in 45 days"    │
│                             │
│ [Use Mine] [Use Theirs]     │
│ [Merge Both]                │
└─────────────────────────────┘
```

## Marketplace UI

### Template Card
```
┌──────────────────────┐
│ [Preview Image]      │
│                      │
│ Professional Invoice │
│ by @johndoe         │
│                      │
│ ⭐ 4.8 (234 reviews) │
│ 📥 1.2k downloads   │
│ 💲 Free / $9 Pro    │
│                      │
│ 15 variables        │
│ DOCX + PDF          │
│                      │
│ [Preview] [Use Now] │
└──────────────────────┘
```

## Loading States

### Skeleton Screens
- Template cards: Animated placeholders
- Editor: Progressive content loading
- Forms: Field-by-field appearance

### Progress Indicators
- Document upload: Percentage with file size
- Bulk generation: Item counter with time estimate
- Template processing: Step-by-step status

## Error States

### Inline Validation
- Required fields: Red outline with helper text
- Format errors: Specific correction guidance
- Success states: Green checkmark confirmation

### Error Pages
- 404: Template not found with suggestions
- 500: Server error with retry action
- Offline: Local-first with sync indicator

## Animation & Transitions

### Micro-interactions
- Button hover: Elevation change (100ms)
- Variable insertion: Fade in (200ms)
- Tab switch: Slide transition (250ms)
- Dialog open: Scale + fade (300ms)

### Page Transitions
- Route change: Fade through (200ms)
- Drawer slide: Ease-out (250ms)
- Card expand: Height animation (300ms)

## Performance Optimizations

### Lazy Loading
- Images: Intersection observer
- Routes: Code splitting by feature
- Heavy components: Dynamic imports

### Virtualization
- Long template lists: Virtual scrolling
- Large documents: Viewport rendering
- Variable lists: On-demand loading

## Accessibility Features

### Keyboard Navigation
- Tab order: Logical flow
- Focus trap: In modals/dialogs
- Skip links: Direct to content
- Shortcuts: Ctrl+S save, Ctrl+P preview

### Screen Reader Support
- ARIA labels: All interactive elements
- Live regions: Status updates
- Semantic HTML: Proper heading hierarchy
- Alt text: All images and icons

## Framework Recommendations

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI v5
- **Editor**: Lexical (Meta's rich text)
- **State**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Build**: Vite for fast HMR

### Styling Approach
- **CSS**: Tailwind CSS for utilities
- **Components**: Material-UI theming
- **Custom**: CSS Modules for specific needs
- **Dark Mode**: CSS variables + system preference

### Testing Strategy
- **Unit**: Jest + Testing Library
- **E2E**: Playwright
- **Visual**: Storybook + Chromatic
- **Accessibility**: axe-core + Pa11y