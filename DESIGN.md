# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Material Design 3 Implementation
- **Theme**: Dynamic color system with light/dark modes
- **Primary Color**: #2196F3 (Blue 500)
- **Secondary Color**: #00BCD4 (Cyan 500)
- **Success**: #4CAF50 (Green 500)
- **Warning**: #FF9800 (Orange 500)
- **Error**: #F44336 (Red 500)
- **Typography**: Inter font family
- **Elevation**: 5 levels (0dp, 1dp, 3dp, 6dp, 8dp)
- **Border Radius**: 8px (small), 16px (medium), 24px (large)
- **Spacing**: 8px base unit

## Information Architecture

```
Root (/)
├── Auth (/auth)
│   ├── Login
│   ├── Register
│   └── Password Reset
├── Dashboard (/dashboard)
│   ├── Recent Templates
│   ├── Quick Actions
│   └── Analytics Summary
├── Templates (/templates)
│   ├── My Templates
│   ├── Shared with Me
│   └── Template Details (/templates/:id)
│       ├── Editor View
│       ├── Variables Panel
│       ├── Version History
│       └── Comments
├── Generate (/generate)
│   ├── Single Document
│   ├── Bulk Generation
│   └── Preview & Export
├── Marketplace (/marketplace)
│   ├── Browse Templates
│   ├── Categories
│   ├── Template Details
│   └── Ratings & Reviews
├── Analytics (/analytics)
│   ├── Usage Stats
│   ├── Generation Reports
│   └── Template Performance
└── Settings (/settings)
    ├── Profile
    ├── API Keys
    ├── Integrations
    └── Team Management
```

## Core User Journeys

### 1. Template Creation Journey
```
Upload Document → Extract Content → Insert Variables → Save Template → Test Generation
```

**Upload Interface**:
```
┌─────────────────────────────────────────────────┐
│  📤 Upload Your Document                        │
│                                                 │
│  ╭─────────────────────────────────╮           │
│  │                                 │           │
│  │     [Drag & Drop Area]          │           │
│  │                                 │           │
│  │     📄 DOCX  📋 PDF  📝 TXT    │           │
│  │                                 │           │
│  │    [Browse Files]                │           │
│  ╰─────────────────────────────────╯           │
│                                                 │
│  Recent Uploads:                               │
│  • contract_template.docx (2 mins ago)         │
│  • invoice_form.pdf (1 hour ago)              │
└─────────────────────────────────────────────────┘
```

**Variable Editor Interface**:
```
┌─────────────────────────────────────────────────────────┐
│ [Save] [Preview] [Share] [Version] [Settings]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Template Name: [Loan Agreement Template v2]            │
│                                                         │
│ ┌──────────────────────────┬──────────────────────┐   │
│ │ Editor (Lexical)          │ Variables Panel      │   │
│ │                           │                      │   │
│ │ This agreement is between │ Detected Variables: │   │
│ │ {{bank_name}} and         │ • bank_name         │   │
│ │ {{client_name}} for a     │ • client_name       │   │
│ │ loan amount of            │ • loan_amount       │   │
│ │ ${{loan_amount}}.         │ • interest_rate     │   │
│ │                           │ • due_date          │   │
│ │ Interest: {{interest_rate}}│                     │   │
│ │ Due: {{due_date}}         │ [+ Add Variable]    │   │
│ │                           │                      │   │
│ └──────────────────────────┴──────────────────────┘   │
│                                                         │
│ Formatting: [B][I][U] [≡] [◉] [1.] ["] [🔗] [{{}}]   │
└─────────────────────────────────────────────────────────┘
```

### 2. Document Generation Journey

**Single Document Generation**:
```
┌─────────────────────────────────────────────────────┐
│ Generate from: Loan Agreement Template v2           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Fill in Variables:                                 │
│                                                     │
│ Bank Name *                                        │
│ [First National Bank              ]                │
│                                                     │
│ Client Name *                                      │
│ [John Smith                       ]                │
│                                                     │
│ Loan Amount *                                      │
│ [$] [50,000                       ]                │
│                                                     │
│ Interest Rate *                                    │
│ [5.5                             ] [%]             │
│                                                     │
│ Due Date *                                         │
│ [📅 03/15/2025                    ]                │
│                                                     │
│ Output Format:                                     │
│ ○ PDF  ● DOCX                                      │
│                                                     │
│ [Preview] [Generate & Download]                    │
└─────────────────────────────────────────────────────┘
```

**Bulk Generation Interface**:
```
┌─────────────────────────────────────────────────────┐
│ Bulk Generation - Loan Agreement Template          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Step 1: Upload CSV                                 │
│ ╭─────────────────────────────────╮               │
│ │ 📁 data.csv (15 rows)           │               │
│ │ Columns detected:               │               │
│ │ ✓ bank_name                     │               │
│ │ ✓ client_name                   │               │
│ │ ✓ loan_amount                   │               │
│ │ ✓ interest_rate                 │               │
│ │ ✓ due_date                      │               │
│ ╰─────────────────────────────────╯               │
│                                                     │
│ Step 2: Preview (First 3 rows)                     │
│ ┌─────────────────────────────────────────┐       │
│ │ Row 1: John Smith - $50,000            │       │
│ │ Row 2: Jane Doe - $75,000              │       │
│ │ Row 3: Bob Johnson - $100,000          │       │
│ └─────────────────────────────────────────┘       │
│                                                     │
│ [Generate All (15 documents)]                      │
│                                                     │
│ Progress: ████████░░ 80% (12/15 complete)         │
└─────────────────────────────────────────────────────┘
```

### 3. Template Marketplace Journey

**Browse Interface**:
```
┌─────────────────────────────────────────────────────┐
│ 🏪 Template Marketplace                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [Search templates...] [Categories ▼] [Sort by ▼]   │
│                                                     │
│ Categories: All | Legal | Finance | HR | Sales     │
│                                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│ │ Contract│ │ Invoice │ │ NDA     │              │
│ │ ⭐4.8   │ │ ⭐4.9   │ │ ⭐4.7   │              │
│ │ Legal   │ │ Finance │ │ Legal   │              │
│ │ 2.3k    │ │ 5.1k    │ │ 1.8k    │              │
│ │ uses    │ │ uses    │ │ uses    │              │
│ └─────────┘ └─────────┘ └─────────┘              │
│                                                     │
│ [Load More]                                        │
└─────────────────────────────────────────────────────┘
```

## Responsive Design

### Mobile Layout (375px)
```
┌──────────────────┐
│ ☰ Smart Contract │
├──────────────────┤
│                  │
│ [Upload Doc]     │
│                  │
│ My Templates     │
│ ┌──────────────┐ │
│ │ Contract v2  │ │
│ │ 2 hours ago  │ │
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │ Invoice v1   │ │
│ │ Yesterday    │ │
│ └──────────────┘ │
│                  │
│ [+ New Template] │
└──────────────────┘
```

### Tablet Layout (768px)
```
┌───────────────────────────────────┐
│ Logo  Dashboard Templates Generate│
├───────────────────────────────────┤
│ ┌─────────────┬─────────────────┐│
│ │ Templates   │ Editor          ││
│ │ • Contract  │                 ││
│ │ • Invoice   │ Content here... ││
│ │ • NDA       │                 ││
│ └─────────────┴─────────────────┘│
└───────────────────────────────────┘
```

### Desktop Layout (1440px)
```
┌──────────────────────────────────────────────────────┐
│ Logo  Dashboard  Templates  Generate  Marketplace    │
├────────┬─────────────────────────┬──────────────────┤
│ Sidebar│ Main Content             │ Variables Panel  │
│        │                          │                  │
│ • Home │ Template Editor          │ • bank_name     │
│ • My   │                          │ • client_name   │
│   Files│ [Rich text content]      │ • amount        │
│ • Team │                          │                  │
│ • API  │                          │ [+ Add Variable] │
└────────┴─────────────────────────┴──────────────────┘
```

## Component Library

### Navigation Components
- **AppBar**: Fixed top navigation with search
- **Drawer**: Collapsible sidebar navigation
- **Breadcrumbs**: Contextual navigation path
- **TabBar**: Section navigation within pages

### Input Components
- **TextField**: Material Design outlined variant
- **Select**: Dropdown with search capability
- **DatePicker**: Calendar interface
- **FileUpload**: Drag-and-drop with progress
- **VariableInput**: Custom {{variable}} insertion

### Display Components
- **Card**: Content containers with elevation
- **DataTable**: Sortable, filterable lists
- **Dialog**: Modal overlays for actions
- **Snackbar**: Temporary notifications
- **Skeleton**: Loading state placeholders

### Editor Components
- **LexicalEditor**: Rich text with formatting
- **VariableHighlight**: Syntax highlighting
- **FormatToolbar**: Text formatting options
- **CommentThread**: Inline comments
- **PresenceIndicator**: Real-time collaboration

## Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 minimum for normal text
- **Focus Indicators**: Visible keyboard navigation
- **Screen Reader**: ARIA labels and landmarks
- **Keyboard Navigation**: All features accessible
- **Skip Links**: Direct navigation to content
- **Form Labels**: Associated with inputs
- **Error Messages**: Clear, descriptive feedback
- **Alt Text**: All images and icons labeled

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save template
- `Ctrl/Cmd + P`: Preview document
- `Ctrl/Cmd + G`: Generate document
- `Ctrl/Cmd + /`: Search templates
- `{{`: Trigger variable insertion
- `Tab`: Navigate between fields
- `Escape`: Close dialogs/modals

## Real-time Collaboration UI

### Presence Indicators
```
┌─────────────────────────────────────┐
│ Active Users (3)                    │
│ 👤 John (editing)                   │
│ 👤 Sarah (viewing)                  │
│ 👤 Mike (commenting)                │
└─────────────────────────────────────┘
```

### Conflict Resolution
```
┌─────────────────────────────────────┐
│ ⚠️ Merge Conflict Detected          │
│                                     │
│ Your version:                       │
│ [The loan amount is {{amount}}]    │
│                                     │
│ Sarah's version:                    │
│ [The loan total is ${{amount}}]    │
│                                     │
│ [Use Mine] [Use Theirs] [Merge]    │
└─────────────────────────────────────┘
```

## Performance Optimization

### Loading States
- Skeleton screens for content
- Progressive image loading
- Lazy loading for off-screen content
- Virtualized lists for large datasets
- Code splitting by route

### Offline Support
- Service worker caching
- Local storage for drafts
- Background sync for uploads
- Offline mode indicators
- Queue management for actions

## Authentication UI

### Supabase Auth Integration
```
┌─────────────────────────────────────┐
│ Welcome to Smart Contract          │
├─────────────────────────────────────┤
│                                     │
│ Email                               │
│ [user@example.com        ]          │
│                                     │
│ Password                            │
│ [••••••••                ]          │
│                                     │
│ [Sign In]                           │
│                                     │
│ ──────── OR ────────                │
│                                     │
│ [G] Continue with Google            │
│ [🔷] Continue with Microsoft        │
│                                     │
│ Don't have an account? Sign Up     │
└─────────────────────────────────────┘
```

## Error States

### Empty States
```
┌─────────────────────────────────────┐
│         No Templates Yet            │
│                                     │
│         📄                          │
│                                     │
│   Upload your first document        │
│   to create a template              │
│                                     │
│      [Upload Document]              │
└─────────────────────────────────────┘
```

### Error Messages
```
┌─────────────────────────────────────┐
│ ❌ Generation Failed                │
│                                     │
│ Unable to process the template.     │
│ Missing required variable:          │
│ client_name                         │
│                                     │
│ [Try Again] [Get Help]              │
└─────────────────────────────────────┘
```

## Analytics Dashboard

```
┌─────────────────────────────────────────────────────┐
│ Analytics Overview                     Last 30 days │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌──────────────┬──────────────┬──────────────┐    │
│ │ Documents    │ Templates    │ Active Users │    │
│ │ 1,234 ↑23%   │ 45 ↑12%      │ 89 ↑5%       │    │
│ └──────────────┴──────────────┴──────────────┘    │
│                                                     │
│ Generation Trend                                    │
│ ┌─────────────────────────────────────────┐       │
│ │     📊 Line chart showing daily stats    │       │
│ └─────────────────────────────────────────┘       │
│                                                     │
│ Top Templates                                      │
│ 1. Service Agreement - 234 uses                    │
│ 2. Invoice Template - 189 uses                     │
│ 3. NDA Template - 156 uses                        │
└─────────────────────────────────────────────────────┘
```

## Implementation Notes

### Frontend Framework
- React 19.1.1 with TypeScript
- Material-UI v5 components
- Lexical Editor for rich text
- TailwindCSS for custom styling
- React Router for navigation
- Supabase client for backend

### State Management
- React Context for global state
- Local state for component data
- Supabase Realtime for sync
- IndexedDB for offline cache

### Performance Targets
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: >90
- Bundle Size: <100KB initial
- Code Coverage: >90%

## Design Tokens

```css
:root {
  /* Colors */
  --primary: #2196F3;
  --secondary: #00BCD4;
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 16px;
  --line-height: 1.5;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Borders */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.16);
  --shadow-lg: 0 10px 20px rgba(0,0,0,0.19);
}
```

## Mobile-First Approach

All interfaces designed with mobile as the primary target, progressively enhanced for larger screens. Touch targets minimum 48x48px, swipe gestures for navigation, and optimized data usage for mobile networks.

## Conclusion

This design system provides a comprehensive, accessible, and performant user experience for the Smart Contract Document Template System, fully leveraging Supabase backend capabilities and Material Design 3 principles.