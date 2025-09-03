# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Visual Identity
- **Primary Color**: #2563EB (Blue 600)
- **Secondary Color**: #7C3AED (Purple 600)
- **Success**: #10B981 (Green 500)
- **Warning**: #F59E0B (Amber 500)
- **Error**: #EF4444 (Red 500)
- **Typography**: Inter for UI, Monaco for code/variables
- **Spacing**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)

### Component Library
- **Framework**: React + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui for consistency
- **Icons**: Lucide React
- **Editor**: Lexical (Facebook's rich text framework)
- **Charts**: Recharts for analytics

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up (Supabase Auth) → Onboarding Tutorial → Create First Template → Generate Document
```

### 2. Template Creation Journey
```
Dashboard → Upload Document → Visual Editor → Insert Variables → Save Template → Test Generation
```

### 3. Document Generation Journey
```
Template Library → Select Template → Fill Variables Form → Preview → Generate → Download
```

### 4. Bulk Generation Journey
```
Template → Upload CSV → Map Columns → Preview Sample → Generate All → Download ZIP
```

### 5. Collaboration Journey
```
Template → Share → Collaborator Joins → Real-time Editing → Version Control → Publish
```

## Page Layouts

### 1. Authentication Pages

#### Sign In/Sign Up
```
┌─────────────────────────────────────────────────────┐
│                    Smart Contract                   │
│                                                     │
│                   ┌─────────────┐                  │
│                   │    Logo     │                  │
│                   └─────────────┘                  │
│                                                     │
│              Welcome Back / Get Started             │
│                                                     │
│         ┌─────────────────────────────┐           │
│         │  Email                      │           │
│         └─────────────────────────────┘           │
│                                                     │
│         ┌─────────────────────────────┐           │
│         │  Password                   │           │
│         └─────────────────────────────┘           │
│                                                     │
│         [Sign In] or [Sign Up]                    │
│                                                     │
│         ──────── Or continue with ────────        │
│                                                     │
│         [Google] [GitHub] [Microsoft]             │
│                                                     │
│         Forgot password? | Privacy Policy          │
└─────────────────────────────────────────────────────┘
```

### 2. Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract          [Search]    [Notifications] [User]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Welcome back, {{user_name}}                      [New Template]│
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐│
│  │ Templates   │ │ Generated   │ │ Shared      │ │ Usage      ││
│  │     12      │ │     247     │ │      5      │ │  1,234/mo  ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘│
│                                                                  │
│  Recent Templates                                    [View All] │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ┌────┐ Loan Agreement          3 days ago      [Edit]    │  │
│  │ │Icon│ 5 variables • 12 generations                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ┌────┐ Employment Contract     1 week ago      [Edit]    │  │
│  │ │Icon│ 8 variables • 34 generations                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ┌────┐ NDA Template           2 weeks ago      [Edit]    │  │
│  │ │Icon│ 6 variables • 7 generations                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Quick Actions                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐ │
│  │  Upload    │ │  Generate  │ │   Bulk     │ │  Browse     │ │
│  │  Document  │ │  Document  │ │  Generate  │ │ Marketplace │ │
│  └────────────┘ └────────────┘ └────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Template Editor (Core Feature)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Back   Template: Loan Agreement v2                    [Save] [Test]│
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┬─────────────────────────┐  │
│ │                                       │ Variables (6)           │  │
│ │ ┌─────────────────────────────────┐  │ ┌─────────────────────┐ │  │
│ │ │ [B][I][U] [Link] [•][1.] [{{}}] │  │ │ {{bank_name}}       │ │  │
│ │ └─────────────────────────────────┘  │ │ Type: Text          │ │  │
│ │                                       │ │ Required: Yes       │ │  │
│ │ Loan Agreement                        │ ├─────────────────────┤ │  │
│ │                                       │ │ {{client_name}}     │ │  │
│ │ This agreement is made between       │ │ Type: Text          │ │  │
│ │ {{bank_name}} (the "Lender") and     │ │ Required: Yes       │ │  │
│ │ {{client_name}} (the "Borrower")     │ ├─────────────────────┤ │  │
│ │ on {{agreement_date}}.               │ │ {{agreement_date}}  │ │  │
│ │                                       │ │ Type: Date          │ │  │
│ │ Terms and Conditions:                │ │ Default: Today      │ │  │
│ │ 1. Loan Amount: ${{loan_amount}}     │ ├─────────────────────┤ │  │
│ │ 2. Interest Rate: {{interest_rate}}% │ │ {{loan_amount}}     │ │  │
│ │ 3. Repayment Date: {{due_date}}      │ │ Type: Number        │ │  │
│ │                                       │ │ Min: 1000           │ │  │
│ │ The borrower agrees to repay the     │ ├─────────────────────┤ │  │
│ │ full amount with interest by the     │ │ {{interest_rate}}   │ │  │
│ │ specified date.                       │ │ Type: Number        │ │  │
│ │                                       │ │ Min: 0, Max: 30     │ │  │
│ │                                       │ ├─────────────────────┤ │  │
│ │                                       │ │ {{due_date}}        │ │  │
│ │                                       │ │ Type: Date          │ │  │
│ │                                       │ │ Min: Tomorrow       │ │  │
│ │                                       │ └─────────────────────┘ │  │
│ │                                       │ [+ Add Variable]        │  │
│ └───────────────────────────────────────┴─────────────────────────┘  │
│ Status: Auto-saved 30 seconds ago            [Preview] [Version History]│
└──────────────────────────────────────────────────────────────────────┘
```

### 4. Document Generation Form

```
┌────────────────────────────────────────────────────────┐
│ Generate Document from: Loan Agreement                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Fill in the Variables:                                │
│                                                        │
│ Bank Name *                                           │
│ ┌────────────────────────────────────────────────┐   │
│ │ First National Bank                            │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Client Name *                                         │
│ ┌────────────────────────────────────────────────┐   │
│ │ John Smith                                      │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Agreement Date *                                      │
│ ┌────────────────────────────────────────────────┐   │
│ │ 03/15/2024                              [📅]    │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Loan Amount *                                         │
│ ┌────────────────────────────────────────────────┐   │
│ │ 50000                                           │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Interest Rate (%) *                                   │
│ ┌────────────────────────────────────────────────┐   │
│ │ 5.5                                             │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Due Date *                                            │
│ ┌────────────────────────────────────────────────┐   │
│ │ 03/15/2025                              [📅]    │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ Output Format:                                        │
│ ○ PDF  ● DOCX                                         │
│                                                        │
│        [Preview]          [Generate Document]         │
└────────────────────────────────────────────────────────┘
```

### 5. Bulk Generation Interface

```
┌─────────────────────────────────────────────────────────────┐
│ Bulk Document Generation                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Step 1: Select Template                                    │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ ▼ Loan Agreement (6 variables)                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Step 2: Upload CSV File                                    │
│ ┌─────────────────────────────────────────────────────┐   │
│ │                                                      │   │
│ │     📁 Drag & drop CSV file here or click to browse │   │
│ │                                                      │   │
│ │     ✓ clients_data.csv (247 rows)                   │   │
│ │                                                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Step 3: Map Columns to Variables                           │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ bank_name      → [Bank Name         ▼]             │   │
│ │ client_name    → [Customer Name     ▼]             │   │
│ │ agreement_date → [Contract Date     ▼]             │   │
│ │ loan_amount    → [Principal Amount  ▼]             │   │
│ │ interest_rate  → [Rate              ▼]             │   │
│ │ due_date       → [Maturity Date     ▼]             │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Preview (First 3 rows):                                    │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 1. John Smith - $50,000 - Due: 03/15/2025          │   │
│ │ 2. Jane Doe - $75,000 - Due: 04/20/2025            │   │
│ │ 3. Bob Johnson - $100,000 - Due: 05/01/2025        │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│          [Cancel]        [Generate All (247 Documents)]    │
└─────────────────────────────────────────────────────────────┘
```

### 6. Template Marketplace

```
┌──────────────────────────────────────────────────────────────┐
│ Template Marketplace                    [Search] [Filter ▼] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Categories: [All] [Legal] [Business] [HR] [Finance] [Other] │
│                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│ │                │ │                │ │                │  │
│ │  Employment    │ │      NDA       │ │  Service       │  │
│ │   Contract     │ │   Agreement    │ │  Agreement     │  │
│ │                │ │                │ │                │  │
│ │ ⭐ 4.8 (234)   │ │ ⭐ 4.9 (567)   │ │ ⭐ 4.7 (123)   │  │
│ │ By: LegalPro   │ │ By: BizDocs    │ │ By: ProTempls  │  │
│ │ 12 variables   │ │ 8 variables    │ │ 15 variables   │  │
│ │                │ │                │ │                │  │
│ │ [Preview][Use] │ │ [Preview][Use] │ │ [Preview][Use] │  │
│ └────────────────┘ └────────────────┘ └────────────────┘  │
│                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│ │                │ │                │ │                │  │
│ │  Invoice       │ │  Partnership   │ │   Lease        │  │
│ │  Template      │ │   Agreement    │ │  Agreement     │  │
│ │                │ │                │ │                │  │
│ │ ⭐ 4.6 (89)    │ │ ⭐ 4.5 (45)    │ │ ⭐ 4.9 (678)   │  │
│ │ By: InvoiceGen │ │ By: PartnerUp  │ │ By: RentEasy   │  │
│ │ 10 variables   │ │ 20 variables   │ │ 18 variables   │  │
│ │                │ │                │ │                │  │
│ │ [Preview][Use] │ │ [Preview][Use] │ │ [Preview][Use] │  │
│ └────────────────┘ └────────────────┘ └────────────────┘  │
│                                                              │
│                        [Load More]                          │
└──────────────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Template Editor
```
┌─────────────────┐
│ ☰  Template Name│
├─────────────────┤
│ [Variables] [📝] │
├─────────────────┤
│                 │
│ Document        │
│ Content with    │
│ {{variables}}   │
│                 │
│                 │
├─────────────────┤
│ [Insert Var]    │
│ [Save] [Preview]│
└─────────────────┘
```

### Mobile Generation Form
```
┌─────────────────┐
│ Generate Doc    │
├─────────────────┤
│ Bank Name       │
│ ┌───────────┐   │
│ └───────────┘   │
│                 │
│ Client Name     │
│ ┌───────────┐   │
│ └───────────┘   │
│                 │
│ [More Fields ▼] │
│                 │
│ [Generate PDF]  │
└─────────────────┘
```

## Component Architecture

### Core Components
```typescript
// Layout Components
<AppLayout />
<Sidebar />
<Header />
<Footer />

// Template Components
<TemplateEditor />
<VariablePanel />
<TemplateCard />
<TemplateGrid />

// Generation Components
<GenerationForm />
<BulkUploader />
<PreviewModal />
<ProgressTracker />

// Collaboration Components
<CollaborationPresence />
<RealtimeIndicator />
<VersionHistory />
<CommentThread />

// Marketplace Components
<MarketplaceGrid />
<TemplatePreview />
<RatingDisplay />
<ReviewSection />
```

## Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Readers**: Proper ARIA labels and landmarks
- **Form Labels**: All inputs have associated labels
- **Error Messages**: Clear, descriptive error messages with proper association

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save template
- `Ctrl/Cmd + P`: Preview document
- `Ctrl/Cmd + Enter`: Generate document
- `Ctrl/Cmd + Shift + V`: Insert variable
- `Tab`: Navigate between fields
- `Esc`: Close modals

## Real-time Collaboration UI

### Presence Indicators
```
┌──────────────────────────────────────────┐
│ Active Users (3):                        │
│ 🟢 You  🔵 Sarah  🟡 Mike                │
│                                          │
│ Sarah is editing line 12...             │
│ Mike is viewing variables panel         │
└──────────────────────────────────────────┘
```

### Conflict Resolution
```
┌──────────────────────────────────────────┐
│ ⚠️ Merge Conflict Detected               │
│                                          │
│ Your version:                            │
│ "The loan amount is {{amount}}"         │
│                                          │
│ Sarah's version:                        │
│ "The principal amount is {{amount}}"    │
│                                          │
│ [Use Mine] [Use Theirs] [Merge]         │
└──────────────────────────────────────────┘
```

## Loading States & Skeleton Screens

### Template List Skeleton
```
┌────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░          │
├────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░          │
├────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░          │
└────────────────────────────────┘
```

### Progress Indicators
- Linear progress bar for single operations
- Circular progress for bulk operations with count (e.g., "147/247 completed")
- Estimated time remaining for long operations

## Error States

### Form Validation
```
┌─────────────────────────────────┐
│ Client Name *                   │
│ ┌───────────────────────────┐   │
│ │                           │   │
│ └───────────────────────────┘   │
│ ❌ This field is required       │
└─────────────────────────────────┘
```

### System Errors
```
┌─────────────────────────────────┐
│ ⚠️ Unable to generate document  │
│                                 │
│ The template contains errors.   │
│ Please check variable mappings. │
│                                 │
│ [Try Again] [Contact Support]  │
└─────────────────────────────────┐
```

## Performance Optimizations

### Code Splitting
- Lazy load marketplace components
- Split editor bundle from main app
- Dynamic import for PDF generation library

### Image Optimization
- WebP format for template previews
- Lazy loading for marketplace images
- Responsive image sizes

### Caching Strategy
- Cache templates in IndexedDB
- Service worker for offline support
- Optimistic UI updates

## Design Tokens

```css
:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-secondary: #7C3AED;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-mono: 'Monaco', monospace;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Animations */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

## Next Steps for Development

1. **Component Library Setup**: Initialize shadcn/ui with custom theme
2. **Editor Integration**: Implement Lexical with variable highlighting
3. **Real-time Setup**: Configure Supabase Realtime channels
4. **Mobile PWA**: Add service worker and manifest
5. **A/B Testing**: Implement feature flags for UI experiments
6. **Analytics**: Add Mixpanel/Amplitude for user behavior tracking