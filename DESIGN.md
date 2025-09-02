# UI/UX Design Specifications

## Design System

### Brand Identity
- **Primary Color**: #3B82F6 (Blue)
- **Secondary Color**: #10B981 (Green) 
- **Accent Color**: #8B5CF6 (Purple)
- **Error**: #EF4444
- **Warning**: #F59E0B
- **Typography**: Inter (UI), Monaco (Code)

### Component Library
- Shadcn/ui components with Tailwind CSS
- Supabase Auth UI components
- React Hook Form for form handling
- Tanstack Table for data grids

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up → Email Verification → Dashboard → Upload First Template
```

### 2. Template Creation Flow
```
Dashboard → Upload Document → Template Editor → Insert Variables → Save Template
```

### 3. Document Generation Flow
```
Templates List → Select Template → Fill Variables → Preview → Generate → Download
```

### 4. Bulk Generation Flow
```
Templates List → Select Template → Upload CSV → Map Columns → Generate All → Download ZIP
```

## Page Designs

### Landing Page
```
┌────────────────────────────────────────────────────────┐
│  [Logo] Smart Contract              [Sign In] [Sign Up]│
├────────────────────────────────────────────────────────┤
│                                                        │
│        Transform Documents into Smart Templates        │
│                                                        │
│     Upload → Insert Variables → Generate Documents     │
│                                                        │
│                    [Get Started Free]                  │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Upload   │→ │ Edit     │→ │ Generate │           │
│  │ Document │  │ Template │  │ Docs     │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                        │
│  Features:                                             │
│  ✓ Any document format    ✓ Bulk generation          │
│  ✓ Variable insertion     ✓ CSV import              │
│  ✓ Format preservation    ✓ Secure storage          │
└────────────────────────────────────────────────────────┘
```

### Dashboard
```
┌────────────────────────────────────────────────────────┐
│  [≡] Smart Contract        [Search...]    [👤] Profile │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Welcome back, {{userName}}                           │
│                                                        │
│  Quick Actions:                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ + New        │ │ 📄 Generate  │ │ 📊 Bulk      │ │
│  │   Template   │ │    Document  │ │    Generate  │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                        │
│  Recent Templates                           [View All]│
│  ┌────────────────────────────────────────────────┐  │
│  │ Name            Variables    Last Modified      │  │
│  ├────────────────────────────────────────────────┤  │
│  │ 📄 Loan Agreement    6       2 hours ago       │  │
│  │ 📄 Invoice Template   8       Yesterday         │  │
│  │ 📄 NDA Contract       5       3 days ago        │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  Recent Generations                                   │
│  • Generated 5 documents from "Loan Agreement"        │
│  • Generated 1 document from "Invoice Template"       │
└────────────────────────────────────────────────────────┘
```

### Template Editor
```
┌────────────────────────────────────────────────────────┐
│  ← Back   Template: {{templateName}}                  │
│                                                        │
│  [Save] [Preview] [Settings]           Auto-saved ✓   │
├────────────────────────────────────────────────────────┤
│                                    │ Variables (6)    │
│  ┌──────────────────────────────┐ │ ┌──────────────┐ │
│  │ Toolbar:                     │ │ │ {{bank_name}} │ │
│  │ [B] [I] [U] | [{{}}] [🎨]   │ │ │ {{client}}    │ │
│  ├──────────────────────────────┤ │ │ {{date}}      │ │
│  │                              │ │ │ {{amount}}    │ │
│  │ Loan Agreement               │ │ │ {{rate}}      │ │
│  │                              │ │ │ {{due_date}}  │ │
│  │ This agreement is between    │ │ └──────────────┘ │
│  │ {{bank_name}} and           │ │                  │
│  │ {{client_name}} for a loan  │ │ [+ Add Variable] │
│  │ amount of {{loan_amount}}.  │ │                  │
│  │                              │ │ Variable Details:│
│  │ Interest Rate: {{rate}}%    │ │ Name: bank_name  │
│  │ Due Date: {{due_date}}      │ │ Type: Text       │
│  │                              │ │ Required: Yes    │
│  │ [Type to continue...]        │ │ Default: ""      │
│  └──────────────────────────────┘ └──────────────────┘
└────────────────────────────────────────────────────────┘
```

### Variable Input Form
```
┌────────────────────────────────────────────────────────┐
│  Generate Document: Loan Agreement                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Fill in the template variables:                      │
│                                                        │
│  Bank Name *                                          │
│  [_________________________________]                   │
│                                                        │
│  Client Name *                                        │
│  [_________________________________]                   │
│                                                        │
│  Agreement Date *                                     │
│  [📅 Select Date___________________]                  │
│                                                        │
│  Loan Amount *                                        │
│  [$________________________________]                   │
│                                                        │
│  Interest Rate (%) *                                  │
│  [_________________________________]                   │
│                                                        │
│  Due Date *                                           │
│  [📅 Select Date___________________]                  │
│                                                        │
│  Output Format:                                       │
│  (•) PDF  ( ) DOCX  ( ) Both                         │
│                                                        │
│  [Preview] [Generate Document]                        │
└────────────────────────────────────────────────────────┘
```

### Bulk Generation Interface
```
┌────────────────────────────────────────────────────────┐
│  Bulk Generate: Loan Agreement                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Step 1: Upload CSV File                              │
│  ┌────────────────────────────────────────────────┐  │
│  │         📁 Drop CSV file here or browse         │  │
│  │                                                 │  │
│  │              [Choose File]                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  Step 2: Map CSV Columns to Variables                 │
│  ┌────────────────────────────────────────────────┐  │
│  │ Template Variable    →    CSV Column           │  │
│  ├────────────────────────────────────────────────┤  │
│  │ bank_name           →    [Select Column ▼]    │  │
│  │ client_name         →    [Select Column ▼]    │  │
│  │ agreement_date      →    [Select Column ▼]    │  │
│  │ loan_amount         →    [Select Column ▼]    │  │
│  │ interest_rate       →    [Select Column ▼]    │  │
│  │ due_date           →    [Select Column ▼]    │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│  Preview First Row:                                   │
│  • bank_name: "First National Bank"                   │
│  • client_name: "John Smith"                          │
│  • loan_amount: "$50,000"                            │
│                                                        │
│  [Generate 25 Documents]                              │
└────────────────────────────────────────────────────────┘
```

### Templates Library
```
┌────────────────────────────────────────────────────────┐
│  My Templates                    [+ New Template]     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Search templates...]  [All ▼] [Date Created ▼]     │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│ │
│  │ │   📄        │ │   📄        │ │   📄        ││ │
│  │ │             │ │             │ │             ││ │
│  │ │ Loan        │ │ Invoice     │ │ NDA         ││ │
│  │ │ Agreement   │ │ Template    │ │ Contract    ││ │
│  │ │             │ │             │ │             ││ │
│  │ │ 6 variables │ │ 8 variables │ │ 5 variables ││ │
│  │ │ Used 15×    │ │ Used 23×    │ │ Used 7×     ││ │
│  │ │             │ │             │ │             ││ │
│  │ │ [Edit][Use] │ │ [Edit][Use] │ │ [Edit][Use] ││ │
│  │ └─────────────┘ └─────────────┘ └─────────────┘│ │
│  │                                                  │ │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│ │
│  │ │   📄        │ │   📄        │ │   📄        ││ │
│  │ │ Employment  │ │ Service     │ │ Purchase    ││ │
│  │ │ Contract    │ │ Agreement   │ │ Order       ││ │
│  │ └─────────────┘ └─────────────┘ └─────────────┘│ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

### Mobile Template Editor
```
┌─────────────┐
│ ☰ │Template │
├─────────────┤
│             │
│ Editor      │
│ [{{}}]      │
│             │
│ Agreement   │
│ between     │
│ {{bank}}    │
│ and {{client}}│
│             │
├─────────────┤
│ Variables(2)│
│ • bank      │
│ • client    │
└─────────────┘
```

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements keyboard accessible
- Skip links for main content
- Escape key closes modals

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for icons
- Form field descriptions
- Status announcements

### Visual Accessibility
- Minimum contrast ratio 4.5:1
- Focus indicators visible
- Resizable text up to 200%
- No color-only information

## Supabase Auth Integration

### Sign Up Flow
1. Email/password registration
2. Email verification via Supabase
3. Profile creation
4. Redirect to dashboard

### Sign In Options
- Email/password
- Magic link
- OAuth (Google, GitHub)
- Remember me option

### Password Reset
1. Request reset email
2. Click verification link
3. Set new password
4. Auto sign in

## Error States

### Empty States
- "No templates yet. Create your first template!"
- "No recent activity. Start by uploading a document."

### Loading States
- Skeleton screens for content
- Progress bars for uploads
- Spinners for quick actions

### Error Messages
- "Failed to upload. File size must be under 10MB."
- "Variable name already exists. Choose another name."
- "Network error. Please check your connection."

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading for modals
- Image optimization
- Virtual scrolling for lists
- React Query for caching

### UX Optimizations
- Optimistic UI updates
- Auto-save in editor
- Debounced search
- Pagination for lists
- Progressive enhancement