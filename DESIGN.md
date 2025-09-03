# Smart Contract UI/UX Design Specifications

## Design System

### Theme & Color Palette
- **Primary**: #2563EB (Blue 600) - CTAs, primary actions
- **Secondary**: #7C3AED (Purple 600) - Premium features, variables
- **Success**: #10B981 (Green 500) - Confirmations
- **Warning**: #F59E0B (Amber 500) - Alerts
- **Error**: #EF4444 (Red 500) - Errors
- **Background**: #FFFFFF (Light) / #1F2937 (Dark)
- **Surface**: #F9FAFB (Light) / #111827 (Dark)
- **Text Primary**: #111827 (Light) / #F9FAFB (Dark)
- **Text Secondary**: #6B7280 (Light) / #9CA3AF (Dark)

### Typography
- **Font Family**: Inter (Primary), JetBrains Mono (Code/Variables)
- **Headings**: 
  - H1: 32px/40px, Semi-bold
  - H2: 24px/32px, Semi-bold
  - H3: 20px/28px, Medium
  - H4: 16px/24px, Medium
- **Body**: 14px/20px, Regular
- **Small**: 12px/16px, Regular

### Spacing & Grid
- **Base Unit**: 8px
- **Container Max Width**: 1280px
- **Grid**: 12 columns with 24px gutters
- **Breakpoints**:
  - Mobile: 0-639px
  - Tablet: 640-1023px
  - Desktop: 1024px+

## User Journeys

### 1. First-Time User Journey
```
Landing → Sign Up (Supabase Auth) → Onboarding → Dashboard → Create First Template
```
- Welcome modal with 3-step tutorial
- Sample template auto-loaded
- Interactive tooltips on first actions
- Progress bar showing setup completion

### 2. Template Creation Journey
```
Dashboard → Upload Document → Visual Editor → Insert Variables → Preview → Save
```
- Drag-drop upload for DOCX/PDF/TXT
- Lexical rich text editor
- {{variable}} syntax with highlighting
- Auto-save every 30 seconds
- Format preservation

### 3. Document Generation Journey
```
Templates → Select → Fill Variables → Preview → Generate → Download
```
- Template gallery with search/filters
- Dynamic form from variables
- Live preview updates
- PDF/DOCX export options
- Base64 encoding support

### 4. Bulk Generation Journey
```
Select Template → Upload CSV → Map Columns → Preview → Generate All → Download ZIP
```
- CSV data upload
- Visual column mapping
- Progress tracking
- Batch processing
- Error recovery

### 5. Collaboration Journey
```
Template → Share → Real-time Edit → Comments → Version Control → Merge
```
- WebSocket presence indicators
- Live cursor tracking
- Conflict resolution UI
- Version history

### 6. Marketplace Journey
```
Browse → Preview → Clone/Purchase → Customize → Use
```
- Category navigation
- Template preview
- Ratings/reviews
- Usage analytics

## Core Interfaces

### 1. Authentication (Supabase Auth UI)
```
┌─────────────────────────────────────┐
│        Smart Contract Logo          │
├─────────────────────────────────────┤
│                                     │
│  Welcome Back                       │
│                                     │
│  Email                              │
│  [_____________________]            │
│                                     │
│  Password                           │
│  [_____________________]            │
│                                     │
│  [Sign In]  [Sign Up]               │
│                                     │
│  ─────── Or continue with ──────    │
│                                     │
│  [Google] [GitHub] [Microsoft]      │
│                                     │
│  Forgot password? • Privacy Policy  │
│                                     │
└─────────────────────────────────────┘
```

### 2. Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Dashboard  Templates  Marketplace  [Profile] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Welcome back, {{user_name}}                       │
│                                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │    📄     │ │    📊     │ │    ⚡     │        │
│  │    12     │ │    156    │ │    3      │        │
│  │ Templates │ │ Generated │ │ Active    │        │
│  └───────────┘ └───────────┘ └───────────┘        │
│                                                     │
│  Recent Templates                    [+ New]        │
│  ┌──────────────────────────────────────────┐      │
│  │ 📄 Contract Template        2 hrs ago    │      │
│  │    3 variables • 12 uses • v2           │      │
│  ├──────────────────────────────────────────┤      │
│  │ 📄 Invoice Template         Yesterday    │      │
│  │    5 variables • 8 uses • v1            │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  Quick Actions                                     │
│  [Upload Document] [Create Template] [Browse]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Document Upload & Template Creation
```
┌──────────────────────────────────────────────────┐
│  Create New Template                             │
├──────────────────────────────────────────────────┤
│                                                  │
│  Step 1: Upload Document                         │
│  ┌────────────────────────────────────┐          │
│  │                                    │          │
│  │    📁 Drag & drop your document   │          │
│  │    DOCX, PDF, or TXT              │          │
│  │                                    │          │
│  │    [Browse Files]                 │          │
│  │                                    │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  Supported Formats:                              │
│  ✓ DOCX - Full formatting preserved              │
│  ✓ PDF - Text extraction supported               │
│  ✓ TXT - Plain text templates                    │
│                                                  │
│  [Cancel] [Next →]                               │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4. Visual Editor with Variable System (Lexical)
```
┌──────────────────────────────────────────────────────────┐
│ ← Back  Contract Template                    [Save] [•••] │
├──────────────────────────────────────────────────────────┤
│ [B][I][U] [≡] [🔗] ["] [•] [1.] [{{}}] │ [Undo][Redo]   │
├────────────────────┬─────────────────────────────────────┤
│ Variables (3)      │                                     │
│                    │ SERVICE AGREEMENT                    │
│ ┌────────────────┐ │                                     │
│ │ {{client_name}} │ │ This agreement is between           │
│ │ {{service_date}}│ │ {{client_name}} and Company.        │
│ │ {{amount}}      │ │                                     │
│ │                 │ │ Services will commence on           │
│ │ [+ Add Variable]│ │ {{service_date}} for a total        │
│ └────────────────┘ │ of {{amount}}.                      │
│                    │                                     │
│ Properties         │ Terms and conditions apply as        │
│ ─────────          │ outlined in Schedule A.              │
│ Name: client_name  │                                     │
│ Type: Text         │ [Live preview with formatting]      │
│ Required: ✓        │                                     │
│ Default: -         │                                     │
│                    │                                     │
├────────────────────┴─────────────────────────────────────┤
│ 👥 Active: John D., Sarah M.  •  Auto-saved 2 min ago   │
└──────────────────────────────────────────────────────────┘
```

### 5. Single Document Generation
```
┌─────────────────────────────────────────┐
│  Generate Document                       │
├─────────────────────────────────────────┤
│  Template: Service Agreement v2          │
│                                          │
│  Fill in Variables:                      │
│                                          │
│  Client Name *                           │
│  [_____________________]                 │
│                                          │
│  Service Date *                          │
│  [📅 Select Date______]                  │
│                                          │
│  Amount *                                │
│  [$_________________]                    │
│  Format: Currency                        │
│                                          │
│  ┌─ Live Preview ──────────┐             │
│  │ SERVICE AGREEMENT       │             │
│  │ This agreement is...    │             │
│  └─────────────────────────┘             │
│                                          │
│  Export Format:                          │
│  [✓] PDF  [✓] DOCX                      │
│                                          │
│  [Cancel] [Generate & Download]          │
│                                          │
└─────────────────────────────────────────┘
```

### 6. Bulk Generation from CSV
```
┌──────────────────────────────────────────────┐
│  Bulk Document Generation                    │
├──────────────────────────────────────────────┤
│                                              │
│  Step 1: Upload CSV Data                     │
│  ┌────────────────────────────────┐          │
│  │                                │          │
│  │    📊 Drop CSV file here       │          │
│  │    or click to browse          │          │
│  │                                │          │
│  │    [Download Template CSV]     │          │
│  └────────────────────────────────┘          │
│                                              │
│  Step 2: Map Columns to Variables            │
│  ┌──────────────────────────────┐            │
│  │ CSV Column → Template Variable│            │
│  │ Name       → {{client_name}}  │            │
│  │ Date       → {{service_date}} │            │
│  │ Total      → {{amount}}        │            │
│  └──────────────────────────────┘            │
│                                              │
│  Step 3: Review & Generate                   │
│  Documents to generate: 25                   │
│  ☑ Preview first 3 documents                 │
│                                              │
│  Progress: [████████░░░░] 8/25               │
│                                              │
│  [← Back] [Generate All Documents]           │
│                                              │
└──────────────────────────────────────────────┘
```

### 7. Template Library & Management
```
┌────────────────────────────────────────────────┐
│  My Templates            [Search] [+ New]      │
├────────────────────────────────────────────────┤
│  Filter: [All] [Recent] [Most Used] [Shared]   │
│                                                │
│  ┌──────────────────────────────────────┐      │
│  │ 📄 Service Agreement                  │      │
│  │ 5 variables • v3 • Updated 2hr ago   │      │
│  │ Generated: 45 times                  │      │
│  │ [Edit] [Clone] [Share] [Analytics]  │      │
│  ├──────────────────────────────────────┤      │
│  │ 📄 Invoice Template                   │      │
│  │ 8 variables • v2 • Updated yesterday │      │
│  │ Generated: 23 times                  │      │
│  │ [Edit] [Clone] [Share] [Analytics]  │      │
│  └──────────────────────────────────────┘      │
│                                                │
│  Showing 1-10 of 24 templates                  │
│  [Previous] [1] 2 3 [Next]                     │
│                                                │
└────────────────────────────────────────────────┘
```

### 8. Real-time Collaboration View
```
┌─────────────────────────────────────────────┐
│  Contract Template - Collaborative Editing   │
├─────────────────────────────────────────────┤
│  Active Collaborators:                      │
│  🟢 You  🟡 John (editing)  🔵 Sarah (viewing)│
│                                             │
│  ┌─────────────────────────────────┐        │
│  │ [John's cursor]                  │        │
│  │ This agreement between...        │        │
│  │ {{client_name}} ← Sarah commented│        │
│  │                                  │        │
│  └─────────────────────────────────┘        │
│                                             │
│  Comments (2)                               │
│  ┌─────────────────────────────────┐        │
│  │ 💬 Sarah: Should we add payment │        │
│  │    terms variable here?         │        │
│  │    └─ John: Good idea, adding   │        │
│  │    [Resolve Thread]             │        │
│  └─────────────────────────────────┘        │
│                                             │
│  Version: v3 (2 changes) [View History]     │
│                                             │
└─────────────────────────────────────────────┘
```

### 9. Template Marketplace
```
┌────────────────────────────────────────────────────┐
│  Template Marketplace           [Search] [Filter]  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Categories                                        │
│  [All] [Legal] [Sales] [HR] [Finance] [Marketing] │
│                                                    │
│  Featured Templates                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Preview │ │ Preview │ │ Preview │              │
│  │   NDA   │ │ Invoice │ │Contract │              │
│  │         │ │         │ │         │              │
│  │ ⭐ 4.8  │ │ ⭐ 4.9  │ │ ⭐ 4.7  │              │
│  │ 1.2k    │ │ 890     │ │ 2.1k    │              │
│  │ uses    │ │ uses    │ │ uses    │              │
│  │         │ │         │ │         │              │
│  │ [Clone] │ │ [Clone] │ │ [Clone] │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│                                                    │
│  Sort by: [Most Popular ▼]  Tags: #legal #contract│
│                                                    │
└────────────────────────────────────────────────────┘
```

### 10. Usage Analytics Dashboard
```
┌──────────────────────────────────────────┐
│  Template Analytics - Service Agreement  │
├──────────────────────────────────────────┤
│                                          │
│  Usage Over Time                         │
│  ┌────────────────────────────┐          │
│  │     📊 Line Chart          │          │
│  │     Shows daily usage      │          │
│  └────────────────────────────┘          │
│                                          │
│  Statistics                              │
│  • Total Generated: 156 documents        │
│  • This Month: 45 documents              │
│  • Avg Generation Time: 2.3s             │
│  • Most Active Day: Tuesday              │
│                                          │
│  Variable Usage                          │
│  • client_name: 156 (100%)               │
│  • amount: 145 (93%)                     │
│  • service_date: 156 (100%)              │
│                                          │
│  [Export Report] [Share Analytics]       │
│                                          │
└──────────────────────────────────────────┘
```

## Mobile Responsive Design

### Mobile Navigation (Bottom Tab Bar)
```
┌─────────────┐
│   Content   │
├─────────────┤
│ [🏠][📄][➕][📊][👤] │
└─────────────┘
Home Templates New Analytics Profile
```

### Mobile Template Editor (320-639px)
```
┌─────────────┐
│ ← Template  │
├─────────────┤
│ [{{}}] Variables │
├─────────────┤
│             │
│ Agreement   │
│ between     │
│ {{client}}  │
│             │
├─────────────┤
│ [Save]      │
└─────────────┘
```

### Mobile Generation Form
```
┌─────────────┐
│ Generate    │
├─────────────┤
│ Client Name │
│ [_________] │
│             │
│ Date        │
│ [_________] │
│             │
│ Amount      │
│ [_________] │
│             │
│ [Generate]  │
└─────────────┘
```

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order: logical flow through interface
- Focus indicators: 2px blue outline
- Skip links: "Skip to main content"
- Shortcuts:
  - Ctrl+S: Save template
  - Ctrl+P: Preview document
  - Ctrl+Shift+V: Insert variable
  - Esc: Close modals

### Screen Reader Support
- ARIA labels on all controls
- Live regions for status updates
- Form field descriptions
- Semantic HTML5 elements

### Visual Accessibility
- Contrast ratios: 4.5:1 (normal text), 3:1 (large text)
- Resizable text up to 200%
- No information conveyed by color alone
- Clear focus states

## Loading States & Performance

### Skeleton Screens
```
┌──────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ <- Animated placeholder
│ ▓▓▓▓▓▓▓▓        │
│ ▓▓▓▓▓▓▓▓▓▓▓     │
└──────────────────┘
```

### Progress Indicators
- Document upload: Linear progress bar
- Bulk generation: "Processing 3 of 10..."
- Auto-save: Subtle spinner with text

### Performance Targets
- First Contentful Paint: <1.2s
- Time to Interactive: <2.5s
- Bundle size: <100KB initial

## Error Handling

### Inline Validation
```
Email *
[invalid@email]
⚠️ Please enter a valid email address
```

### Empty States
```
┌─────────────────────────┐
│     No templates yet    │
│         📄              │
│  Create your first      │
│  template to start      │
│                         │
│  [+ Create Template]    │
└─────────────────────────┘
```

### Error Recovery
- Network errors: Retry button
- Form errors: Clear messaging
- Failed generation: Detailed logs

## Dark Mode Support

### Automatic Detection
- System preference respected
- Manual toggle in settings
- Smooth transition (300ms)

### Color Adjustments
- Inverted backgrounds
- Adjusted contrast
- Preserved brand colors

## Component Specifications

### Buttons
- Primary: Blue bg, white text, 40px height
- Secondary: White bg, blue border
- Sizes: Small (32px), Medium (40px), Large (48px)
- States: Default, Hover, Active, Disabled

### Forms
- Input height: 40px
- Label position: Above field
- Error display: Below field
- Required indicator: Red asterisk

### Cards
- Border radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 16px (mobile), 24px (desktop)
- Hover: Elevation increase

### Modals
- Max width: 600px
- Overlay: rgba(0,0,0,0.5)
- Animation: Fade + scale
- Close: X button + Esc key

## Notification System

### Toast Notifications
- Position: Bottom-right (desktop), top (mobile)
- Duration: 3s (success), 5s (error)
- Actions: Undo where applicable

### Types
- Success: Green with checkmark
- Error: Red with X icon
- Info: Blue with i icon
- Warning: Amber with ! icon

## Search & Filtering

### Global Search
- Keyboard shortcut: Cmd/Ctrl+K
- Instant results
- Recent searches saved
- Fuzzy matching

### Template Filters
- Category dropdown
- Date range picker
- Variable count slider
- Public/Private toggle
- Sort options

## Integration Points

### Supabase Backend
- Real-time subscriptions for collaboration
- Row-level security indicators
- Storage integration for files
- Auth state management

### Edge Functions
- Loading states during processing
- Error boundaries
- Retry logic visualization

### Version Control
- Visual diff viewer
- Rollback confirmation
- Version timeline

## Future Considerations (Cycle 2+)

### Advanced Variables UI
- Conditional logic builder
- Formula editor
- Data source connections
- Variable dependencies graph

### API Integration Panel
- Endpoint configuration
- Authentication setup
- Testing interface
- Usage monitoring

### Enterprise Dashboard
- Team member management
- Permission matrix
- Usage quotas
- Billing interface

## Design Tokens

```css
/* Core tokens for implementation */
--color-primary: #2563EB;
--color-secondary: #7C3AED;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```