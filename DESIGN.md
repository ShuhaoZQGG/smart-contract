# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Visual Identity
- **Primary Color**: #3B82F6 (Blue-500)
- **Secondary Color**: #8B5CF6 (Purple-500)
- **Success**: #10B981 (Green-500)
- **Warning**: #F59E0B (Amber-500)
- **Error**: #EF4444 (Red-500)
- **Typography**: Inter (UI), JetBrains Mono (Code/Variables)
- **Border Radius**: 8px (cards), 4px (inputs), 999px (pills)
- **Shadows**: Tailwind shadow-sm/md/lg

### Component Library
- **Framework**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS + Supabase Auth UI
- **Icons**: Lucide Icons
- **Editor**: Lexical with custom variable highlighting
- **Tables**: @tanstack/react-table
- **Charts**: Recharts for analytics

## Information Architecture

```
├── Landing (/)
├── Auth (/auth)
│   ├── Sign In
│   ├── Sign Up
│   └── Reset Password
├── Dashboard (/dashboard)
│   ├── Overview
│   ├── Recent Templates
│   └── Quick Actions
├── Templates (/templates)
│   ├── My Templates
│   ├── Shared With Me
│   ├── Template Editor (/templates/:id/edit)
│   └── Template Preview (/templates/:id/preview)
├── Documents (/documents)
│   ├── Generated Documents
│   ├── Bulk Generation
│   └── Document Preview (/documents/:id)
├── Marketplace (/marketplace)
│   ├── Browse Templates
│   ├── Template Details (/marketplace/:id)
│   └── My Purchases
├── Analytics (/analytics)
├── Settings (/settings)
│   ├── Profile
│   ├── Team
│   ├── API Keys
│   └── Webhooks
```

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up → Email Verification → Onboarding Tour → 
Dashboard → Upload First Document → Create Template → 
Add Variables → Generate Document → Success
```

### 2. Template Creation Flow
```
Dashboard → New Template → Upload Document → 
Visual Editor → Insert Variables → Configure Variables → 
Save Template → Test Generation → Share/Publish
```

### 3. Document Generation Flow
```
Templates List → Select Template → Fill Variables Form → 
Preview Document → Generate → Download/Share
```

### 4. Bulk Generation Flow
```
Template → Bulk Generate → Upload CSV → Map Columns → 
Validate Data → Generate Batch → Download ZIP
```

## Page Designs

### Dashboard
```
┌────────────────────────────────────────────────────────┐
│  [Logo] Smart Contract    [Search]   [🔔] [Avatar ▼]  │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome back, {{user_name}} 👋                       │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │ Templates   │ │ Documents   │ │ This Month  │     │
│  │    [24]     │ │    [156]    │ │    [47]     │     │
│  │ +3 this week│ │ Generated   │ │ Generated   │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                         │
│  Quick Actions                                         │
│  ┌────────────────────────────────────────────┐       │
│  │ [+] Create Template  [📄] Generate Document │       │
│  │ [📊] Bulk Generate   [🛍️] Browse Marketplace│       │
│  └────────────────────────────────────────────┘       │
│                                                         │
│  Recent Templates                    [View All →]      │
│  ┌─────────────────────────────────────────────┐      │
│  │ • Loan Agreement      Updated 2 hours ago   │      │
│  │ • Invoice Template    Updated yesterday     │      │
│  │ • NDA Document       Updated 3 days ago    │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  Recent Activity                                       │
│  [Timeline of recent actions with live updates]        │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Template Editor
```
┌────────────────────────────────────────────────────────┐
│  [← Back] Template: {{template_name}}                  │
│  [Save] [Preview] [Settings] [Share]    [Collaborators]│
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────┬────────────────────┐    │
│  │ EDITOR                   │ VARIABLES          │    │
│  │                          │                    │    │
│  │ [B][I][U] [Link] [List]  │ Detected Variables │    │
│  │ [{{}}] Insert Variable   │                    │    │
│  │ ────────────────────     │ • client_name     │    │
│  │                          │   Type: Text       │    │
│  │ Loan Agreement           │   Required: Yes    │    │
│  │                          │                    │    │
│  │ This agreement is made   │ • loan_amount     │    │
│  │ between {{client_name}}  │   Type: Number    │    │
│  │ and {{bank_name}} for   │   Format: Currency │    │
│  │ the amount of           │                    │    │
│  │ {{loan_amount}} at an   │ • interest_rate   │    │
│  │ interest rate of        │   Type: Number    │    │
│  │ {{interest_rate}}%.     │   Format: Percent │    │
│  │                          │                    │    │
│  │ [Variable highlighted]   │ • due_date        │    │
│  │                          │   Type: Date      │    │
│  │                          │   Format: MM/DD/YY│    │
│  └──────────────────────────┴────────────────────┘    │
│                                                         │
│  Real-time Collaboration                               │
│  [Avatar1] [Avatar2] [+3 more] Currently editing       │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Document Generation Form
```
┌────────────────────────────────────────────────────────┐
│  Generate from: Loan Agreement Template                │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Fill in the Variables                                 │
│                                                         │
│  Client Name *                                         │
│  ┌──────────────────────────────────────┐             │
│  │ John Smith                           │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Bank Name *                                           │
│  ┌──────────────────────────────────────┐             │
│  │ First National Bank                  │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Loan Amount *                                         │
│  ┌──────────────────────────────────────┐             │
│  │ $ 50,000.00                          │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Interest Rate *                                       │
│  ┌──────────────────────────────────────┐             │
│  │ 5.5 %                                │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Due Date *                                            │
│  ┌──────────────────────────────────────┐             │
│  │ 📅 03/15/2025                        │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Output Format                                         │
│  (•) PDF  ( ) DOCX                                    │
│                                                         │
│  [Preview] [Generate Document]                         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Marketplace
```
┌────────────────────────────────────────────────────────┐
│  Template Marketplace                                  │
│  ┌──────────────────────────────────────┐             │
│  │ 🔍 Search templates...              │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Categories                                            │
│  [All] [Legal] [Finance] [HR] [Sales] [Marketing]      │
│                                                         │
│  Sort by: [Most Popular ▼] Filter: [All Ratings ▼]    │
│                                                         │
│  ┌─────────────────┬─────────────────┬─────────────┐  │
│  │ NDA Template    │ Invoice Pro     │ Contract     │  │
│  │ ⭐ 4.8 (245)    │ ⭐ 4.9 (189)    │ ⭐ 4.7 (156) │  │
│  │ Legal          │ Finance         │ Legal        │  │
│  │                │                 │              │  │
│  │ Professional   │ Modern invoice  │ Standard     │  │
│  │ non-disclosure │ with automatic  │ employment   │  │
│  │ agreement      │ calculations    │ contract     │  │
│  │                │                 │              │  │
│  │ [Preview]      │ [Preview]       │ [Preview]    │  │
│  │ [Use Template] │ [Use Template]  │ [Use Template]│ │
│  └─────────────────┴─────────────────┴─────────────┘  │
│                                                         │
│  [Load More Templates]                                 │
│                                                         │
└────────────────────────────────────────────────────────┘
```

## Responsive Design

### Mobile Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

### Mobile Template Editor
```
┌─────────────────┐
│ [☰] Template    │
│ [Save] [Preview]│
├─────────────────┤
│ [Editor|Vars]   │
│                 │
│ Editor View     │
│ ┌─────────────┐ │
│ │ Content     │ │
│ │ with        │ │
│ │ {{vars}}    │ │
│ └─────────────┘ │
│                 │
│ [+ Variable]    │
└─────────────────┘
```

### Touch Interactions
- Swipe between Editor/Variables tabs
- Long press to insert variable
- Pinch to zoom document preview
- Pull to refresh lists

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard support, visible focus indicators
- **Screen Readers**: ARIA labels, semantic HTML, role attributes
- **Focus Management**: Logical tab order, focus trapping in modals

### Keyboard Shortcuts
- `Cmd/Ctrl + S`: Save template
- `Cmd/Ctrl + P`: Preview document
- `Cmd/Ctrl + Shift + V`: Insert variable
- `Cmd/Ctrl + /`: Show shortcuts
- `Esc`: Close modals/dialogs

## Micro-interactions

### Loading States
```
Template Loading
[━━━━━━━━━━━━━━━] 
Preparing your template...

Document Generating
[●●●○○○○○○○○○○○○]
Processing variables...
```

### Success States
```
✅ Template saved successfully
✅ Document generated
✅ Variables validated
```

### Error States
```
⚠️ Required variable missing
❌ Failed to generate document
🔄 Connection lost. Retrying...
```

## Real-time Collaboration UI

### Presence Indicators
```
Currently editing: [Avatar1] [Avatar2] [+3]
John is typing... (live cursor position)
```

### Conflict Resolution
```
┌──────────────────────────────┐
│ Merge Conflict Detected      │
│                              │
│ Your Version | Their Version │
│ [Show Diff]                  │
│                              │
│ [Keep Mine] [Keep Theirs]    │
│ [Merge Both]                 │
└──────────────────────────────┘
```

## Performance Indicators

### Skeleton Loaders
- Template cards while loading
- Document preview placeholders
- Form field shimmer effects

### Optimistic Updates
- Immediate UI feedback
- Background sync
- Rollback on failure

## Authentication Flow

### Sign In
```
┌────────────────────────────┐
│  Welcome Back              │
│                            │
│  Email                     │
│  [user@example.com      ]  │
│                            │
│  Password                  │
│  [••••••••             ]   │
│                            │
│  [ ] Remember me           │
│                            │
│  [Sign In]                 │
│                            │
│  ─────── OR ───────       │
│                            │
│  [G] Continue with Google  │
│  [MS] Continue with SSO    │
│                            │
│  New user? [Sign up]       │
│  [Forgot password?]        │
└────────────────────────────┘
```

### MFA Screen
```
┌────────────────────────────┐
│  Two-Factor Authentication │
│                            │
│  Enter the 6-digit code    │
│  from your authenticator   │
│                            │
│  [_] [_] [_] [_] [_] [_]  │
│                            │
│  [Verify]                  │
│                            │
│  [Use backup code]         │
└────────────────────────────┘
```

## Dark Mode Support

All components support dark mode with:
- Inverted color schemes
- Reduced brightness
- Increased contrast for readability
- Smooth transitions between modes

## Animation Guidelines

- **Transitions**: 200ms ease-in-out for most interactions
- **Page transitions**: 300ms with fade
- **Modals**: Scale + fade (150ms)
- **Toasts**: Slide in from bottom (200ms)
- **Hover effects**: Subtle scale (1.02) or shadow elevation

## Component States

### Button States
- Default, Hover, Active, Disabled, Loading

### Form Field States  
- Empty, Focused, Filled, Error, Success, Disabled

### Card States
- Default, Hover, Selected, Disabled

## Design Tokens

```typescript
// spacing
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
}

// breakpoints
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
}

// z-index
const zIndex = {
  dropdown: 1000,
  modal: 2000,
  popover: 3000,
  toast: 4000,
  tooltip: 5000
}
```