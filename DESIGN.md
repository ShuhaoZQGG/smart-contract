# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Brand Identity
- **Primary Color**: #2563eb (Supabase brand blue)
- **Secondary Color**: #10B981 (Success green)  
- **Accent Color**: #8B5CF6 (Violet-500)
- **Error**: #EF4444 (Red-500)
- **Warning**: #F59E0B (Amber-500)
- **Success**: #22C55E (Green-500)
- **Typography**: Inter (UI), Monaco/SF Mono (editor), system-ui (fallback)
- **Spacing**: 4px base unit system (0.25rem increments)
- **Border Radius**: 8px (cards), 6px (buttons), 4px (inputs)
- **Shadows**: Tailwind shadow scale with custom elevation

### Component Library
- **Lexical**: Rich text editor for template editing
- **Supabase Auth UI**: Authentication components
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form validation and handling
- **Tanstack Table**: Data grids with virtual scrolling
- **React Dropzone**: File upload with drag-and-drop
- **Framer Motion**: Animations and transitions
- **React Query**: Server state management
- **Zustand**: Client state management

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

### Template Editor (Lexical Rich Text)
```
┌────────────────────────────────────────────────────────┐
│  ← Back   Template: {{templateName}}                  │
│                                                        │
│  [Save] [Preview] [Share] [Version History]  Saved ✓  │
├────────────────────────────────────────────────────────┤
│                                    │ Variables (6)    │
│  ┌──────────────────────────────┐ │ ┌──────────────┐ │
│  │ Format Toolbar:              │ │ │ {{bank_name}} │ │
│  │ [B][I][U][S] | [H1][H2][H3] │ │ │ {{client}}    │ │
│  │ [•][1.][☑] | [Link][Table]  │ │ │ {{date}}      │ │
│  │ [{{}}Variable] [Find][Undo] │ │ │ {{amount}}    │ │
│  ├──────────────────────────────┤ │ │ {{rate}}      │ │
│  │                              │ │ │ {{due_date}}  │ │
│  │ LOAN AGREEMENT               │ │ └──────────────┘ │
│  │                              │ │                  │
│  │ This agreement is between    │ │ [+ Add Variable] │
│  │ {{bank_name}} and           │ │                  │
│  │ {{client_name}} for a loan  │ │ Variable Details:│
│  │ amount of {{loan_amount}}.  │ │ Name: bank_name  │
│  │                              │ │ Type: Text       │
│  │ • Interest: {{rate}}%       │ │ Required: ✓      │
│  │ • Due Date: {{due_date}}    │ │ Default: ""      │
│  │                              │ │ Validation: None │
│  │ [Type to continue...]        │ │ [Edit][Delete]   │
│  └──────────────────────────────┘ └──────────────────┘
│  Collaborators: • You (editing) • Sarah (viewing)     │
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

### Frontend Performance
- Code splitting by route (target < 100KB initial bundle)
- Lazy loading for Lexical editor and modals
- Image optimization with WebP/AVIF
- Virtual scrolling for template lists > 50 items
- React Query with 5-minute cache
- Service Worker for offline support

### UX Optimizations  
- Optimistic UI updates for all mutations
- Auto-save every 30 seconds (debounced)
- Debounced search with 300ms delay
- Infinite scroll pagination
- Progressive enhancement for JS-disabled
- Skeleton loaders for all async content

## Real-time Collaboration Features

### Presence System
```
┌────────────────────────────────────────┐
│ Active Collaborators (3)               │
├────────────────────────────────────────┤
│ • John (editing line 5) [Blue cursor]  │
│ • Sarah (selecting text) [Green]       │
│ • Mike (viewing) [Gray - idle 2min]    │
└────────────────────────────────────────┘
```

### Conflict Resolution
```
┌────────────────────────────────────────┐
│ ⚠️ Merge Conflict Detected             │
├────────────────────────────────────────┤
│ Your version:                          │
│ "The payment is due on {{date}}"       │
│                                        │
│ Sarah's version (2 sec ago):          │
│ "Payment must be received by {{date}}" │
│                                        │
│ [Use Mine] [Use Theirs] [Merge Both]  │
└────────────────────────────────────────┘
```

### Live Cursor Tracking
- Colored cursors for each user
- Name labels on hover
- Selection highlighting
- Typing indicators
- Idle state after 1 minute

## Template Marketplace UI

### Browse Templates
```
┌────────────────────────────────────────────────────┐
│ Template Marketplace    [Search...] [Filter ▼]     │
├────────────────────────────────────────────────────┤
│ Categories: [All][Legal][Sales][HR][Finance][Tech] │
│                                                    │
│ Featured Templates                      Sort: Popular ▼│
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │    📄       │ │    📄       │ │    📄       │ │
│ │  ⭐ 4.9     │ │  ⭐ 4.8     │ │  ⭐ 4.7     │ │
│ │             │ │             │ │             │ │
│ │ NDA Template│ │ Invoice Pro │ │ Contract    │ │
│ │             │ │             │ │ Builder     │ │
│ │ by LegalCo  │ │ by FinanceX │ │ by DocMaster│ │
│ │             │ │             │ │             │ │
│ │ 2.3k uses   │ │ 1.8k uses   │ │ 956 uses    │ │
│ │ 12 variables│ │ 8 variables │ │ 15 variables│ │
│ │             │ │             │ │             │ │
│ │ [Preview]   │ │ [Preview]   │ │ [Preview]   │ │
│ │ [Use Now]   │ │ [Use Now]   │ │ [Use Now]   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└────────────────────────────────────────────────────┘
```

### Template Details Modal
```
┌────────────────────────────────────────────────────┐
│ NDA Template                                   [X] │
├────────────────────────────────────────────────────┤
│ By: LegalCo  |  ⭐ 4.9 (234 reviews)  |  2.3k uses│
│                                                    │
│ Description:                                      │
│ Professional NDA template with customizable       │
│ clauses for various business scenarios.           │
│                                                    │
│ Variables (12):                                   │
│ • company_name     • confidential_period          │
│ • party_name       • governing_law                │
│ • effective_date   • signature_fields             │
│                                                    │
│ Preview:                                          │
│ ┌────────────────────────────────────────┐       │
│ │ NON-DISCLOSURE AGREEMENT                │       │
│ │                                         │       │
│ │ This Agreement is entered into...       │       │
│ └────────────────────────────────────────┘       │
│                                                    │
│ Reviews:                                          │
│ ★★★★★ "Perfect for our needs" - John D.          │
│ ★★★★☆ "Good but needs more options" - Sarah M.   │
│                                                    │
│ [Use This Template] [Download Sample]             │
└────────────────────────────────────────────────────┘
```

## Advanced Features UI

### Version History
```
┌────────────────────────────────────────────────────┐
│ Version History: Loan Agreement                    │
├────────────────────────────────────────────────────┤
│ Current Version (v5) - 2 hours ago                │
│ └─ Added new payment terms section                │
│                                                    │
│ v4 - Yesterday at 3:45 PM                         │
│ └─ Updated interest rate variables                │
│                                                    │
│ v3 - 3 days ago                                   │
│ └─ Fixed formatting issues                        │
│                                                    │
│ v2 - 1 week ago                                   │
│ └─ Added bulk generation support                  │
│                                                    │
│ v1 - 2 weeks ago                                  │
│ └─ Initial template creation                      │
│                                                    │
│ [Compare Versions] [Restore Version]              │
└────────────────────────────────────────────────────┘
```

### Analytics Dashboard
```
┌────────────────────────────────────────────────────┐
│ Template Analytics                                 │
├────────────────────────────────────────────────────┤
│ Usage Statistics (Last 30 days)                   │
│                                                    │
│ Total Generations: 156                            │
│ Unique Users: 23                                  │
│ Average Variables Filled: 8/12                    │
│                                                    │
│ Generation Trend:                                 │
│ ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁ (Daily)                         │
│                                                    │
│ Most Used Variables:                              │
│ 1. company_name (156 times)                       │
│ 2. client_name (156 times)                        │
│ 3. amount (145 times)                             │
│                                                    │
│ Export Formats:                                   │
│ PDF: 78%  |  DOCX: 22%                           │
│                                                    │
│ [Export Report] [Download Data]                   │
└────────────────────────────────────────────────────┘
```

## Technical Implementation Notes

### Frontend Architecture
- React 18.3 with TypeScript 5.6
- Vite 5.4 for build tooling
- Lexical for rich text editing
- Supabase Realtime for WebSocket
- Tailwind CSS for styling

### State Management
- Zustand for global client state
- React Query for server state
- Lexical internal state for editor
- Context API for theme/auth

### Performance Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s  
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms