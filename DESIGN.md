# Smart Contract - UI/UX Design Specifications

## Design System

### Brand & Theme
- **Primary Color**: #4F46E5 (Indigo-600)
- **Secondary Color**: #10B981 (Emerald-500)
- **Danger Color**: #EF4444 (Red-500)
- **Typography**: Inter for UI, Fira Code for variables
- **Spacing**: 4px base unit (Tailwind default)
- **Border Radius**: 8px for cards, 4px for inputs
- **Shadows**: Subtle elevation (shadow-sm, shadow-md)

### Component Library
- **Framework**: React 18.3 + TypeScript
- **UI Components**: Tailwind CSS + HeadlessUI
- **Icons**: Lucide React
- **Editor**: Lexical (Facebook)
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast

## User Journeys

### 1. First-Time User Journey
```
Landing → Sign Up → Email Verification → Dashboard → Upload First Document → 
Insert Variables → Save Template → Generate Document → Success
```

### 2. Returning User Journey
```
Sign In → Dashboard → Select Template → Generate Document → Download
```

### 3. Bulk Generation Journey
```
Dashboard → Select Template → Upload CSV → Preview → Generate All → Download ZIP
```

### 4. Collaboration Journey
```
Dashboard → Select Template → Share → Collaborator Joins → Real-time Edit → Save
```

## Page Layouts

### 1. Authentication Pages

#### Sign In/Sign Up (Supabase Auth UI)
```
┌─────────────────────────────────────────────┐
│              Smart Contract                 │
│         Document Template System             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Tab: Sign In] [Tab: Sign Up]      │   │
│  ├─────────────────────────────────────┤   │
│  │  Email:                              │   │
│  │  [_________________________________] │   │
│  │                                      │   │
│  │  Password:                           │   │
│  │  [_________________________________] │   │
│  │                                      │   │
│  │  [✓] Remember me                     │   │
│  │                                      │   │
│  │  [Sign In]  or  [Continue with Google]│   │
│  │                                      │   │
│  │  Forgot password? • Privacy Policy   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  • Secure authentication via Supabase       │
│  • MFA support available                    │
└─────────────────────────────────────────────┘
```

### 2. Dashboard

#### Main Dashboard (Responsive Grid)
```
┌─────────────────────────────────────────────────────────┐
│  [≡] Smart Contract     [Search...]     [@User] [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Welcome back, {{user_name}}!                           │
│                                                          │
│  Quick Actions:                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│  │   📄   │ │   🔄   │ │   📊   │ │   🏪   │          │
│  │ Upload │ │Generate│ │  Bulk  │ │Marketplace│        │
│  │  New   │ │  Doc   │ │Generate│ │ Browse  │          │
│  └────────┘ └────────┘ └────────┘ └────────┘          │
│                                                          │
│  Recent Templates                    [View All →]        │
│  ┌─────────────────────────────────────────────┐       │
│  │ Template      │ Variables │ Last Used │ Actions│     │
│  ├─────────────────────────────────────────────┤       │
│  │ 📄 Contract A │ 6         │ 2 hrs ago │ [•••] │     │
│  │ 📄 Invoice B  │ 4         │ Yesterday │ [•••] │     │
│  │ 📄 Letter C   │ 3         │ 3 days    │ [•••] │     │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│  Activity Feed                                          │
│  • Generated "Contract A" for client_123 (2 hrs ago)    │
│  • John Doe edited "Invoice B" (4 hrs ago)              │
│  • 5 documents generated from bulk CSV (Yesterday)      │
└─────────────────────────────────────────────────────────┘
```

### 3. Template Editor

#### Rich Text Editor with Variable System
```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Template: {{template_name}}  [Auto-saved ✓]       │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────┬─────────────────────┐  │
│  │ [B][I][U][S] [≡][≡][≡] [Link]    │ Variables ({{6}})   │  │
│  │ [H1][H2][H3] [•][1.][✓]          │ ┌─────────────────┐ │  │
│  │ [Undo][Redo] [{{}}Insert Variable]│ │ client_name     │ │  │
│  ├──────────────────────────────────┤ │ agreement_date  │ │  │
│  │                                   │ │ loan_amount     │ │  │
│  │ LOAN AGREEMENT                    │ │ interest_rate   │ │  │
│  │                                   │ │ bank_name       │ │  │
│  │ This agreement is between         │ │ due_date        │ │  │
│  │ {{bank_name}} and {{client_name}} │ └─────────────────┘ │  │
│  │ dated {{agreement_date}}.         │                     │  │
│  │                                   │ Variable Settings:  │  │
│  │ Principal Amount: {{loan_amount}} │ Name: client_name   │  │
│  │ Interest Rate: {{interest_rate}}% │ Type: [Text     ▼]  │  │
│  │                                   │ Required: [✓]       │  │
│  │ The borrower agrees to repay the  │ Default: [_______]  │  │
│  │ full amount by {{due_date}}.      │                     │  │
│  │                                   │ [+ Add Variable]    │  │
│  │                                   │                     │  │
│  └──────────────────────────────────┴─────────────────────┐  │
│  Active Collaborators: • You • John (editing) • Sarah (viewing)│
├──────────────────────────────────────────────────────────────┤
│  [Save Template] [Preview] [Test Generate] [Share] [Export]   │
└──────────────────────────────────────────────────────────────┘
```

### 4. Document Generation

#### Single Document Generation Form
```
┌─────────────────────────────────────────────────┐
│  Generate Document from: Contract Template v2    │
├─────────────────────────────────────────────────┤
│                                                  │
│  Fill in the variables:                         │
│                                                  │
│  Bank Name *                                    │
│  [_____________________________________________] │
│                                                  │
│  Client Name *                                  │
│  [_____________________________________________] │
│                                                  │
│  Agreement Date *                               │
│  [📅 Select Date_______________________________] │
│                                                  │
│  Loan Amount *                                  │
│  [$ ___________________________________________] │
│                                                  │
│  Interest Rate (%) *                            │
│  [_____________________________________________] │
│                                                  │
│  Due Date *                                     │
│  [📅 Select Date_______________________________] │
│                                                  │
│  Output Format:                                 │
│  ( ) PDF  (•) DOCX  ( ) Both                   │
│                                                  │
│  [Preview Document] [Generate & Download]       │
└─────────────────────────────────────────────────┘
```

#### Bulk Generation Interface
```
┌──────────────────────────────────────────────────┐
│  Bulk Generate: Contract Template                │
├──────────────────────────────────────────────────┤
│                                                   │
│  Step 1: Upload CSV File                         │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐         │
│  │   📁 Drag & drop CSV file here     │         │
│  │        or click to browse           │         │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘         │
│                                                   │
│  Step 2: Map Columns to Variables                │
│  ┌─────────────────────────────────────┐        │
│  │ CSV Column    → Template Variable    │        │
│  │ Name          → [client_name     ▼]  │        │
│  │ Bank          → [bank_name       ▼]  │        │
│  │ Date          → [agreement_date  ▼]  │        │
│  │ Amount        → [loan_amount     ▼]  │        │
│  │ Rate          → [interest_rate   ▼]  │        │
│  │ DueDate       → [due_date        ▼]  │        │
│  └─────────────────────────────────────┘        │
│                                                   │
│  Step 3: Preview (First 3 rows)                  │
│  ┌─────────────────────────────────────┐        │
│  │ ✓ John Smith, First National, $50k  │        │
│  │ ✓ Jane Doe, First National, $75k    │        │
│  │ ✓ Bob Johnson, First National, $100k│        │
│  └─────────────────────────────────────┘        │
│                                                   │
│  Total: 156 documents will be generated          │
│                                                   │
│  [← Back] [Generate All] [Generate & Email]      │
└──────────────────────────────────────────────────┘
```

### 5. Template Marketplace

#### Public Template Gallery
```
┌────────────────────────────────────────────────────┐
│  Template Marketplace                              │
├────────────────────────────────────────────────────┤
│  [Search templates...]  [Category ▼] [Sort by ▼]  │
│                                                     │
│  Featured Templates                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │    📄    │ │    📄    │ │    📄    │          │
│  │ Contract │ │  Invoice │ │   NDA    │          │
│  │    ⭐4.8 │ │    ⭐4.9 │ │    ⭐4.7 │          │
│  │  1.2k ⬇  │ │   892 ⬇  │ │   654 ⬇  │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│                                                     │
│  Browse by Category                                │
│  • Legal (234)     • Sales (189)                  │
│  • HR (156)        • Finance (142)                │
│  • Marketing (98)  • Operations (87)              │
│                                                     │
│  Recent Templates                                  │
│  ┌───────────────────────────────────────────┐    │
│  │ Template         │ Author  │ Rating │ Uses│    │
│  ├───────────────────────────────────────────┤    │
│  │ Service Agreement│ JohnD   │ ⭐4.9  │ 234 │    │
│  │ Purchase Order   │ SarahM  │ ⭐4.8  │ 189 │    │
│  │ Employee Contract│ MikeR   │ ⭐4.7  │ 156 │    │
│  └───────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Mobile Dashboard (375px)
```
┌─────────────────┐
│ [≡] Smart       │
│    Contract  [@]│
├─────────────────┤
│ Welcome back!   │
│                 │
│ [+ New Template]│
│                 │
│ Recent:         │
│ ┌─────────────┐ │
│ │📄 Contract A│ │
│ │ 6 vars • 2h │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │📄 Invoice B │ │
│ │ 4 vars • 1d │ │
│ └─────────────┘ │
└─────────────────┘
```

### Mobile Editor (375px)
```
┌─────────────────┐
│ [←] Template    │
├─────────────────┤
│ [B][I][U] [{{}}]│
├─────────────────┤
│ Loan Agreement  │
│                 │
│ Between         │
│ {{bank_name}}   │
│ and             │
│ {{client_name}} │
│                 │
├─────────────────┤
│ [Variables (6)] │
└─────────────────┘
```

## Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard support, visible focus indicators
- **Screen Readers**: Proper ARIA labels, semantic HTML
- **Focus Management**: Logical tab order, focus trapping in modals
- **Error Handling**: Clear error messages with instructions

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save template
- `Ctrl/Cmd + P`: Preview document
- `Ctrl/Cmd + G`: Generate document
- `Ctrl/Cmd + /`: Insert variable
- `Ctrl/Cmd + Z/Y`: Undo/Redo
- `Esc`: Close modals

## Real-time Collaboration UI

### Presence Indicators
```
Currently editing: • You • John • Sarah
John is typing in paragraph 3...
```

### Conflict Resolution Modal
```
┌─────────────────────────────┐
│ Merge Conflict Detected     │
├─────────────────────────────┤
│ Your version:               │
│ "The amount is $50,000"     │
│                             │
│ John's version:             │
│ "The amount is $75,000"     │
│                             │
│ [Use Mine] [Use Theirs]     │
│ [Merge Both]                │
└─────────────────────────────┘
```

## Loading States & Skeletons

### Template List Skeleton
```
┌─────────────────────────────┐
│ ░░░░░░░░ ░░░ ░░░░░░ ░░░░   │
│ ░░░░░░░░ ░░░ ░░░░░░ ░░░░   │
│ ░░░░░░░░ ░░░ ░░░░░░ ░░░░   │
└─────────────────────────────┘
```

### Editor Loading State
```
┌─────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Loading template...         │
└─────────────────────────────┘
```

## Error States

### Form Validation
```
Email *
[user@example] ⚠️
Please enter a valid email

Password *
[••••] ❌
Password must be at least 8 characters
```

### Empty States
```
┌─────────────────────────────┐
│                             │
│         📄                  │
│   No templates yet          │
│                             │
│ [Upload Your First Document]│
│                             │
└─────────────────────────────┘
```

## Performance Indicators

### Auto-save Status
```
[Auto-saved ✓] • Last saved 30 seconds ago
[Saving...] • Syncing changes
[Offline ⚠️] • Changes will sync when online
```

### Progress Indicators
```
Generating documents: [████████░░] 80% (156/195)
Processing template... ⟳
Upload complete ✓
```

## Frontend Framework Recommendations

### Component Structure
```
src/
├── components/
│   ├── auth/          # Supabase Auth UI wrapper
│   ├── editor/        # Lexical editor components
│   ├── templates/     # Template management
│   ├── generation/    # Document generation forms
│   └── shared/        # Reusable UI components
├── hooks/
│   ├── useAuth.ts     # Supabase auth hook
│   ├── useRealtime.ts # WebSocket collaboration
│   └── useTemplates.ts # Template CRUD operations
├── pages/
│   ├── Dashboard.tsx
│   ├── Editor.tsx
│   ├── Generate.tsx
│   └── Marketplace.tsx
└── lib/
    ├── supabase.ts    # Supabase client
    └── utils.ts       # Helper functions
```

### State Management
- **Global State**: Zustand for user, templates, settings
- **Server State**: React Query for API calls
- **Form State**: React Hook Form + Zod validation
- **Editor State**: Lexical internal state

### Routing
- **React Router v6** with lazy loading
- Protected routes with Supabase Auth
- Breadcrumb navigation
- Deep linking support

## Design Constraints for Development

### Technical Constraints
- Bundle size must remain under 100KB (currently 107KB)
- Lazy load all non-critical components
- Use Suspense boundaries for smooth transitions
- Implement virtual scrolling for large lists

### Supabase Integration Points
- Use Supabase Auth UI components where possible
- Leverage Realtime for collaboration features
- Utilize Row Level Security for data access
- Implement optimistic UI updates

### Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Progressive enhancement for older browsers
- Graceful degradation for missing features

## Next Phase Priorities

### Phase 2: Security & Performance
1. MFA setup flow UI
2. Rate limiting feedback
3. Audit log viewer
4. Performance metrics dashboard

### Phase 3: Advanced Features
1. Advanced variable configuration UI
2. Conflict resolution interface
3. Comment system sidebar
4. Version comparison view

### Phase 4: Enterprise
1. API documentation interface
2. Webhook configuration panel
3. Team management dashboard
4. Usage analytics views