# Smart Contract UI/UX Design Specifications

## Design Philosophy
- **Clean & Modern**: Minimal interface focused on functionality
- **User-Centric**: Guided workflows with clear CTAs
- **Responsive**: Mobile-first, works on all devices
- **Accessible**: WCAG 2.1 AA compliant

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up → Dashboard → Upload Template → Edit Variables → Generate
```

### 2. Returning User Flow
```
Sign In → Dashboard → Select Template → Generate/Edit
```

### 3. Bulk Generation Flow
```
Dashboard → Template → Bulk Generate → Upload CSV → Review → Download ZIP
```

## Page Designs

### Authentication (Supabase Auth UI)
- **Sign In/Up**: Email/Password with OAuth (Google, GitHub)
- **Password Reset**: Standard email flow
- **Profile Setup**: Name, avatar after first login

### Dashboard
```
┌─────────────────────────────────────────────────┐
│ [Logo] Smart Contract        [+ New] [Profile]  │
├─────────────────────────────────────────────────┤
│                                                  │
│ My Templates                    [Grid] [List]   │
│                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Template │ │ Template │ │ Template │        │
│ │ Preview  │ │ Preview  │ │ Preview  │        │
│ │          │ │          │ │          │        │
│ │ Name     │ │ Name     │ │ Name     │        │
│ │ 5 vars   │ │ 8 vars   │ │ 3 vars   │        │
│ │ Updated  │ │ Updated  │ │ Updated  │        │
│ └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│ Recent Documents                                 │
│ ┌────────────────────────────────────────┐     │
│ │ Document_12345  • 2 min ago • Download │     │
│ │ Contract_ABC    • 1 hour ago • Download│     │
│ └────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

### Template Upload
```
┌─────────────────────────────────────────────────┐
│ Upload Template                          [Back] │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌─────────────────────────────────┐          │
│   │                                 │          │
│   │     Drop file here or browse   │          │
│   │                                 │          │
│   │     [📄 Choose File]            │          │
│   │                                 │          │
│   │   Supports: DOCX, PDF          │          │
│   └─────────────────────────────────┘          │
│                                                  │
│   Template Name: [________________]             │
│   Description:   [________________]             │
│                  [________________]             │
│                                                  │
│   [Cancel]                    [Upload & Edit]   │
└─────────────────────────────────────────────────┘
```

### Template Editor
```
┌─────────────────────────────────────────────────┐
│ Edit: Loan Agreement      [Preview] [Save] [×]  │
├─────────────────────────────────────────────────┤
│ Variables (6)           │ Document              │
│ ┌─────────────────┐    │ ┌──────────────────┐ │
│ │ {{client_name}}  │    │ │ This agreement   │ │
│ │ {{bank_name}}    │    │ │ is between       │ │
│ │ {{loan_amount}}  │    │ │ {{bank_name}}    │ │
│ │ {{interest_rate}}│    │ │ and              │ │
│ │ {{due_date}}     │    │ │ {{client_name}}  │ │
│ │ {{agreement_date}}│    │ │                  │ │
│ │                  │    │ │ Loan Amount:     │ │
│ │ [+ Add Variable] │    │ │ {{loan_amount}}  │ │
│ └─────────────────┐    │ │                  │ │
│                        │ │ Interest Rate:   │ │
│ Variable Settings:     │ │ {{interest_rate}}│ │
│ ┌─────────────────┐    │ │                  │ │
│ │ Name: client_name│   │ │ Due Date:        │ │
│ │ Type: [Text ▼]   │   │ │ {{due_date}}     │ │
│ │ Required: [✓]    │   │ └──────────────────┘ │
│ │ Default: _______ │   │                       │
│ └─────────────────┘    │                       │
└─────────────────────────────────────────────────┘
```

### Generate Document
```
┌─────────────────────────────────────────────────┐
│ Generate: Loan Agreement                 [Back] │
├─────────────────────────────────────────────────┤
│                                                  │
│ Fill Variables:                                 │
│                                                  │
│ Client Name *     [John Smith_________]         │
│ Bank Name *       [First National_____]         │
│ Loan Amount *     [$50,000___________]          │
│ Interest Rate *   [5.5%______________]          │
│ Due Date *        [📅 03/15/2025_____]          │
│ Agreement Date *  [📅 Today__________]          │
│                                                  │
│ Output Format:    [●] DOCX  [○] PDF             │
│                                                  │
│ ┌─────────────────────────────────────┐        │
│ │ Preview:                            │        │
│ │ This agreement is between           │        │
│ │ First National and John Smith...    │        │
│ └─────────────────────────────────────┘        │
│                                                  │
│ [Cancel]     [Generate & Download]              │
└─────────────────────────────────────────────────┘
```

### Bulk Generation
```
┌─────────────────────────────────────────────────┐
│ Bulk Generate: Loan Agreement            [Back] │
├─────────────────────────────────────────────────┤
│                                                  │
│ Step 1: Upload CSV                              │
│ ┌─────────────────────────────────┐            │
│ │ [📁 Choose CSV File]             │            │
│ │                                  │            │
│ │ Required columns:                │            │
│ │ • client_name                    │            │
│ │ • bank_name                      │            │
│ │ • loan_amount                    │            │
│ │ • interest_rate                  │            │
│ │ • due_date                       │            │
│ │ • agreement_date                 │            │
│ │                                  │            │
│ │ [Download Template CSV]           │            │
│ └─────────────────────────────────┘            │
│                                                  │
│ Step 2: Review Data (3 rows)                    │
│ ┌─────────────────────────────────────┐        │
│ │ ✓ John Smith    | $50,000  | 5.5%  │        │
│ │ ✓ Jane Doe      | $75,000  | 5.25% │        │
│ │ ✓ Bob Johnson   | $100,000 | 5.0%  │        │
│ └─────────────────────────────────────┘        │
│                                                  │
│ Output: [●] DOCX  [○] PDF  [○] Both             │
│                                                  │
│ [Cancel]     [Generate All (3 documents)]       │
└─────────────────────────────────────────────────┘
```

## Component Library

### Buttons
- **Primary**: Blue (#3B82F6) - Main actions
- **Secondary**: Gray (#6B7280) - Secondary actions
- **Danger**: Red (#EF4444) - Destructive actions
- **Success**: Green (#10B981) - Confirmations

### Forms
- **Input Fields**: Rounded borders, clear labels
- **Validation**: Real-time with error messages
- **Date Pickers**: Calendar widget
- **Dropdowns**: Searchable when >10 items

### Cards
- **Template Card**: Preview, name, variable count, actions
- **Document Card**: Name, date, download link
- **Stats Card**: Number, label, trend

### Modals
- **Confirmation**: Action, message, buttons
- **Preview**: Full document preview
- **Settings**: Form-based configuration

## Responsive Breakpoints
- **Mobile**: <640px - Single column
- **Tablet**: 640-1024px - 2 columns
- **Desktop**: >1024px - Full layout

## Accessibility Features
- **Keyboard Navigation**: Tab order, shortcuts
- **Screen Readers**: ARIA labels, semantic HTML
- **Color Contrast**: 4.5:1 minimum
- **Focus Indicators**: Visible outlines
- **Error Messages**: Clear, actionable

## Color Palette
```
Primary:    #3B82F6 (Blue)
Secondary:  #6B7280 (Gray)
Success:    #10B981 (Green)
Warning:    #F59E0B (Amber)
Error:      #EF4444 (Red)
Background: #FFFFFF (White)
Surface:    #F9FAFB (Light Gray)
Text:       #111827 (Dark Gray)
Border:     #E5E7EB (Gray)
```

## Typography
```
Headings:   Inter/System - Bold
Body:       Inter/System - Regular
Monospace:  Monaco/Consolas - Variables
Sizes:      14px base, 1.5 line-height
```

## Animations
- **Page Transitions**: 200ms slide
- **Button Hover**: 150ms color fade
- **Modal Open**: 300ms fade + scale
- **Loading**: Spinner + skeleton screens

## Dark Mode
- Automatic based on system preference
- Manual toggle in profile
- Inverted color scheme maintaining contrast

## Performance Targets
- **First Paint**: <1s
- **Interactive**: <3s
- **API Calls**: Debounced, cached
- **Image Loading**: Lazy, progressive

## Implementation Notes
1. Use Shadcn/ui components for consistency
2. Implement Supabase Auth UI for authentication
3. Use React Query for data fetching/caching
4. Monaco Editor for template editing
5. React Hook Form for form management
6. Framer Motion for animations
7. TailwindCSS for styling

## Mobile-Specific Features
- **Swipe Actions**: Delete, archive templates
- **Pull to Refresh**: Dashboard updates
- **Bottom Sheet**: Actions menu
- **Simplified Editor**: Basic variable insertion