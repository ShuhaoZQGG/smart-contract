# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Color Palette
- **Primary**: #3B82F6 (blue-500)
- **Secondary**: #8B5CF6 (violet-500)
- **Success**: #10B981 (emerald-500)
- **Warning**: #F59E0B (amber-500)
- **Error**: #EF4444 (red-500)
- **Background**: #FFFFFF / #111827 (dark)
- **Surface**: #F9FAFB / #1F2937 (dark)
- **Text**: #111827 / #F9FAFB (dark)

### Typography
- **Font**: Inter (primary), system-ui (fallback)
- **Headings**: 2xl-4xl, font-semibold
- **Body**: base, font-normal
- **Small**: sm, font-normal
- **Code**: Fira Code, monospace

### Spacing & Layout
- **Grid**: 12-column responsive
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **Container**: max-w-7xl, centered
- **Spacing**: 4px base unit (space-1 to space-16)

## User Journeys

### 1. First-Time User Journey
```
Landing → Sign Up → Onboarding → Upload Document → Create Template → Generate Document
```

### 2. Returning User Journey
```
Sign In → Dashboard → Select Template → Input Variables → Generate Document
```

### 3. Power User Journey
```
Dashboard → Template Library → Bulk Upload CSV → Review Results → Download All
```

### 4. Collaboration Journey
```
Template → Share → Team Member Edits → Real-time Updates → Generate Together
```

## Page Layouts

### 1. Authentication Pages

#### Sign In/Sign Up
```
┌─────────────────────────────────────────┐
│              Logo                       │
│                                         │
│    ┌───────────────────────────┐       │
│    │  Email                    │       │
│    └───────────────────────────┘       │
│                                         │
│    ┌───────────────────────────┐       │
│    │  Password                 │       │
│    └───────────────────────────┘       │
│                                         │
│    [────── Sign In ──────]             │
│                                         │
│    ──────── OR ──────────               │
│                                         │
│    [Continue with Google]              │
│    [Continue with GitHub]              │
│                                         │
│    Don't have account? Sign Up         │
└─────────────────────────────────────────┘
```

### 2. Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract     [Search...]    [🔔] [User Avatar] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome back, {{user_name}}                               │
│                                                             │
│  Quick Actions:                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │    📄    │ │    📁    │ │    ⚡    │ │    📊    │        │
│  │  Upload  │ │Templates│ │Generate │ │Analytics│        │
│  │ Document│ │         │ │  Bulk   │ │         │        │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│                                                             │
│  Recent Templates                              View All →  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📄 Loan Agreement      • 6 variables  • Used 23x    │  │
│  │ 📄 NDA Template        • 4 variables  • Used 15x    │  │
│  │ 📄 Service Contract    • 8 variables  • Used 12x    │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Recent Documents                              View All →  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📄 John_Smith_Loan.pdf     • 2 hours ago           │  │
│  │ 📄 Jane_Doe_NDA.docx       • Yesterday             │  │
│  │ 📄 Bulk_Contracts.zip      • 3 days ago            │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Template Editor

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back    Template: {{template_name}}    [Save] [Preview]  │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┬────────────────────────────────────────────┐  │
│ │Variables │                Editor                       │  │
│ │          │ ┌──────────────────────────────────────┐  │  │
│ │ ┌──────┐ │ │ [B] [I] [U] [≡] [•] [1.] [{{}}]    │  │  │
│ │ │+ Add │ │ ├──────────────────────────────────────┤  │  │
│ │ └──────┘ │ │                                      │  │  │
│ │          │ │ This agreement is between            │  │  │
│ │ Variables│ │ {{company_name}} and {{client_name}} │  │  │
│ │ ────────│ │ for services rendered.               │  │  │
│ │          │ │                                      │  │  │
│ │ • company│ │ Start Date: {{start_date}}          │  │  │
│ │   _name  │ │ End Date: {{end_date}}              │  │  │
│ │          │ │                                      │  │  │
│ │ • client │ │ Payment Terms:                      │  │  │
│ │   _name  │ │ Total: ${{total_amount}}            │  │  │
│ │          │ │ Due: {{payment_due_date}}           │  │  │
│ │ • start  │ │                                      │  │  │
│ │   _date  │ │ [Type or paste your content here]   │  │  │
│ │          │ │                                      │  │  │
│ │ • end    │ └──────────────────────────────────────┘  │  │
│ │   _date  │                                            │  │
│ │          │ Variable Properties:                      │  │
│ │ • total  │ ┌────────────────────────────────────┐  │  │
│ │   _amount│ │ Name: client_name                  │  │  │
│ │          │ │ Type: [Text ▼]                     │  │  │
│ │ • payment│ │ Required: ☑                        │  │  │
│ │   _due   │ │ Default: ____________              │  │  │
│ │   _date  │ └────────────────────────────────────┘  │  │
│ └──────────┴────────────────────────────────────────────┘  │
│                                                             │
│ [Auto-save: On] Last saved 2 minutes ago                   │
└─────────────────────────────────────────────────────────────┘
```

### 4. Document Generation

#### Single Document
```
┌─────────────────────────────────────────────────────────────┐
│ Generate Document from: Loan Agreement Template             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fill in the variables:                                    │
│                                                             │
│  Bank Name *                                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ First National Bank                                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Client Name *                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ John Smith                                          │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Agreement Date *                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📅 2024-03-15                                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Loan Amount *                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ $50,000                                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Interest Rate (%) *                                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 5.5                                                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Due Date *                                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📅 2025-03-15                                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Output Format:                                            │
│  ○ PDF  ● DOCX                                            │
│                                                             │
│  [Preview]          [Generate Document]                    │
└─────────────────────────────────────────────────────────────┘
```

#### Bulk Generation
```
┌─────────────────────────────────────────────────────────────┐
│ Bulk Generate from: Service Contract Template               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Upload CSV File:                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │         📁 Drop CSV file here or click to browse   │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ✓ contracts_data.csv uploaded (145 rows)                  │
│                                                             │
│  Column Mapping:                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ CSV Column          →  Template Variable           │  │
│  │ ─────────────────────────────────────────────────  │  │
│  │ company_name        →  {{company_name}}     ✓     │  │
│  │ customer_name       →  {{client_name}}       ✓     │  │
│  │ service_start       →  {{start_date}}        ✓     │  │
│  │ service_end         →  {{end_date}}          ✓     │  │
│  │ amount              →  {{total_amount}}      ✓     │  │
│  │ payment_date        →  {{payment_due_date}}  ✓     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Preview (First 5 rows):                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Row 1: Acme Corp, John Doe, 2024-04-01...         │  │
│  │ Row 2: TechCo, Jane Smith, 2024-04-02...         │  │
│  │ Row 3: StartupXYZ, Bob Johnson, 2024-04-03...    │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Output Format: ○ PDF  ● DOCX  ○ Both                     │
│                                                             │
│  [Cancel]              [Generate 145 Documents]            │
└─────────────────────────────────────────────────────────────┘
```

### 5. Template Library

```
┌─────────────────────────────────────────────────────────────┐
│ Template Library                    [+ New Template]        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Search templates...]  [All ▼] [Recent ▼] [Grid/List]      │
│                                                             │
│ Categories: [All] [Legal] [Sales] [HR] [Finance] [Custom]  │
│                                                             │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│ │    📄     │ │    📄     │ │    📄     │ │    📄     │  │
│ │           │ │           │ │           │ │           │  │
│ │   Loan    │ │    NDA    │ │  Service  │ │  Invoice  │  │
│ │ Agreement │ │ Template  │ │ Contract  │ │ Template  │  │
│ │           │ │           │ │           │ │           │  │
│ │ 6 vars    │ │ 4 vars    │ │ 8 vars    │ │ 5 vars    │  │
│ │ Used 23x  │ │ Used 15x  │ │ Used 12x  │ │ Used 8x   │  │
│ │           │ │           │ │           │ │           │  │
│ │ [Edit]    │ │ [Edit]    │ │ [Edit]    │ │ [Edit]    │  │
│ │ [Generate]│ │ [Generate]│ │ [Generate]│ │ [Generate]│  │
│ │ [Share]   │ │ [Share]   │ │ [Share]   │ │ [Share]   │  │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘  │
│                                                             │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│ │    📄     │ │    📄     │ │    📄     │ │    +     │  │
│ │           │ │           │ │           │ │           │  │
│ │Employment │ │  Purchase │ │   Lease   │ │   Upload  │  │
│ │ Contract  │ │   Order   │ │ Agreement │ │    New    │  │
│ │           │ │           │ │           │ │ Template  │  │
│ │ 10 vars   │ │ 7 vars    │ │ 9 vars    │ │           │  │
│ │ Used 6x   │ │ Used 4x   │ │ Used 3x   │ │           │  │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Specifications

### Navigation Bar
- **Height**: 64px
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Items**: Logo, Search, Notifications, User Menu
- **Mobile**: Hamburger menu at <768px

### Sidebar (Template Editor)
- **Width**: 280px (desktop), fullscreen (mobile)
- **Sections**: Variables, Properties, History
- **Collapsible**: Yes
- **Resizable**: Yes (desktop only)

### Forms
- **Input Height**: 40px
- **Border Radius**: 6px
- **Validation**: Real-time with error messages
- **Required Fields**: Marked with asterisk (*)

### Buttons
- **Primary**: bg-primary, white text, hover:darker
- **Secondary**: border-primary, primary text
- **Sizes**: sm(32px), md(40px), lg(48px)
- **Icons**: 20px, left or right aligned

### Cards
- **Border Radius**: 8px
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Padding**: 16px (sm), 24px (md)
- **Hover**: Lift effect with increased shadow

### Modals
- **Overlay**: rgba(0,0,0,0.5)
- **Max Width**: 600px (default), 900px (large)
- **Animation**: Fade in/slide up
- **Close**: X button + ESC key

### Tables
- **Row Height**: 48px
- **Hover**: Background highlight
- **Selection**: Checkbox + bulk actions
- **Pagination**: 10/25/50/100 per page

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Wide**: 1280px+

### Mobile Adaptations
- Stack layouts vertically
- Full-width buttons
- Swipeable panels
- Bottom sheet modals
- Simplified navigation

### Touch Targets
- Minimum 44x44px
- 8px spacing between targets
- Larger buttons on mobile
- Swipe gestures for navigation

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 (normal), 3:1 (large)
- **Focus Indicators**: 2px outline, visible
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels and roles

### Keyboard Shortcuts
- `Cmd/Ctrl + S`: Save template
- `Cmd/Ctrl + P`: Preview document
- `Cmd/Ctrl + G`: Generate document
- `Cmd/Ctrl + /`: Search
- `ESC`: Close modal/cancel

### ARIA Implementation
- Landmarks: header, nav, main, footer
- Live regions for status updates
- Descriptive labels for all inputs
- Error announcements
- Loading states announced

## Interactive States

### Loading
- Skeleton screens for content
- Progress bars for operations
- Spinners for quick loads
- Estimated time for long operations

### Empty States
- Illustrated placeholders
- Clear call-to-action
- Helpful suggestions
- Quick start guides

### Error Handling
- Inline validation messages
- Toast notifications for system errors
- Retry options
- Contact support link

### Success Feedback
- Green checkmarks
- Success toasts
- Confetti for milestones
- Next step suggestions

## Animation & Transitions

### Micro-interactions
- Button hover: 150ms ease
- Card hover: 200ms ease-out
- Modal open: 300ms ease-in-out
- Page transitions: 200ms fade

### Loading Animations
- Skeleton pulse: 1.5s infinite
- Spinner rotation: 1s linear infinite
- Progress bar: smooth increments
- Success checkmark: 400ms draw

## Dark Mode

### Color Adjustments
- Background: #111827
- Surface: #1F2937
- Text: #F9FAFB
- Borders: #374151

### Special Considerations
- Reduced contrast for comfort
- Adjusted shadows and highlights
- Syntax highlighting for code
- Image opacity adjustments

## Performance Optimizations

### Image Loading
- Lazy loading below fold
- Progressive JPEGs
- WebP with fallbacks
- Responsive srcset

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports
- Vendor bundle separation

### Caching Strategy
- Service worker for offline
- LocalStorage for preferences
- SessionStorage for temp data
- IndexedDB for templates

## Implementation Notes

### Framework: React + TypeScript
- Shadcn/ui components
- Tailwind CSS styling
- Framer Motion animations
- React Hook Form validation

### State Management
- Zustand for global state
- React Query for server state
- Context for theme/auth
- Local state for UI

### Testing Requirements
- Unit tests for utilities
- Integration tests for flows
- E2E tests for critical paths
- Accessibility audits

## Next Steps

1. Create component library in Storybook
2. Implement design tokens system
3. Build responsive grid system
4. Develop interaction patterns
5. Create animation library
6. Set up accessibility testing
7. Implement dark mode toggle
8. Build skeleton screens
9. Create error boundary components
10. Set up performance monitoring