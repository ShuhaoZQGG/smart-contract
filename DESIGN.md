# Smart Contract - UI/UX Design Specifications

## Design System

### Brand Identity
- **Primary Color**: #2563EB (Blue-600)
- **Secondary Color**: #10B981 (Emerald-500) 
- **Accent Color**: #F59E0B (Amber-500)
- **Error Color**: #EF4444 (Red-500)
- **Typography**: Inter for UI, Monaco for code/variables
- **Icons**: Lucide React icon set

### Material Design 3 Principles
- Dynamic color theming with light/dark modes
- Elevation through subtle shadows and layering
- Rounded corners (8px default, 12px for cards)
- Responsive grid: 4/8/12 columns

## Core User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up (Supabase Auth) → Onboarding → Create First Template → Generate Document
```
- Supabase Auth with email/magic link
- Interactive tutorial overlay
- Sample template pre-loaded
- Quick win: Generate first document in <2 minutes

### 2. Template Creation Flow
```
Upload → Extract → Edit Variables → Configure → Save → Version Control
```
- Drag-and-drop upload (DOCX/PDF/TXT)
- Automatic text extraction via Edge Function
- Rich text editor with variable insertion
- Auto-save with version tracking

### 3. Document Generation Flow
```
Select Template → Fill Form → Preview → Generate → Download/Store
```
- Dynamic form based on variables
- Real-time preview
- Multiple export formats (PDF/DOCX)
- Cloud storage integration

### 4. Bulk Generation Flow
```
Select Template → Upload CSV → Map Columns → Validate → Generate Batch → Download ZIP
```
- CSV template generator
- Column auto-mapping
- Progress tracking
- Batch download

### 5. Real-time Collaboration Flow
```
Open Template → See Active Users → Edit Together → Resolve Conflicts → Save Version
```
- Presence indicators
- Live cursor positions
- Conflict resolution UI
- Activity feed

## Page Layouts

### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract    [Search]    [🔔 3] [User] [Settings]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Welcome back, {{user_name}}                                 │
│                                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐│
│ │ Templates   │ │ Generated   │ │ Collaborators│ │Analytics││
│ │    24       │ │    156      │ │      5       │ │ +32% ↑  ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘│
│                                                              │
│ Recent Activity                        Quick Actions        │
│ ┌────────────────────────────────┐    ┌──────────────────┐ │
│ │ • John edited Contract_v2 (2m) │    │ [+ New Template] │ │
│ │ • Generated 5 invoices (1h)    │    │ [📤 Upload Doc]  │ │
│ │ • Sarah shared NDA template    │    │ [⚡ Quick Gen]   │ │
│ │ • New comment on Proposal_v3   │    │ [🏪 Marketplace] │ │
│ └────────────────────────────────┘    └──────────────────┘ │
│                                                              │
│ Your Templates                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │   📄     │ │   📄     │ │   📄     │ │   📄     │      │
│ │ Contract │ │ Invoice  │ │   NDA    │ │ Proposal │      │
│ │ v2.1     │ │ Template │ │ Standard │ │   v3     │      │
│ │ 5 vars   │ │ 8 vars   │ │ 6 vars   │ │ 12 vars  │      │
│ │ [Edit]   │ │ [Edit]   │ │ [Edit]   │ │ [Edit]   │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Template Editor (with Lexical)
```
┌──────────────────────────────────────────────────────────────────┐
│ ← Back   Template: {{name}}   [Auto-saved ✓]  [Share] [Version] │
├─────────────────┬─────────────────────────────────────────────────┤
│ Variables (8)   │  Formatting Toolbar                            │
│ ┌─────────────┐ │  [B] [I] [U] [List] [Link] [{{}}] [📎] [↶] [↷]│
│ │ ✓ client_   │ ├─────────────────────────────────────────────┤
│ │   name      │ │                                               │
│ │   📝 Text   │ │  Service Agreement                            │
│ │             │ │                                               │
│ │ ✓ company_  │ │  This agreement is entered into between      │
│ │   name      │ │  {{client_name}} ("Client") and              │
│ │   📝 Text   │ │  {{company_name}} ("Provider").              │
│ │             │ │                                               │
│ │ ✓ start_    │ │  1. Services                                 │
│ │   date      │ │  The Provider agrees to deliver:             │
│ │   📅 Date   │ │  {{services_description}}                    │
│ │             │ │                                               │
│ │ ○ amount    │ │  2. Payment Terms                            │
│ │   💵 Number │ │  Total amount: ${{amount}}                   │
│ │             │ │  Due date: {{payment_due}}                   │
│ │             │ │                                               │
│ │ [+ Add Var] │ │  3. Conditional Clause                       │
│ └─────────────┘ │  {{IF has_penalty}}                          │
│                 │  Late payment penalty: {{penalty_rate}}%     │
│ Advanced        │  {{ENDIF}}                                    │
│ ┌─────────────┐ │                                               │
│ │ ⚙️ Computed │ └─────────────────────────────────────────────┘
│ │ Variables   │                                               │
│ │             │ Active Collaborators (2)                      │
│ │ 🔀 Conditnl │ 🟢 John D. (editing line 15)                  │
│ │ Logic       │ 🟡 Sarah M. (viewing)                         │
│ │             │                                               │
│ │ 📊 Lookups  │ Comments (3)                   [💬 Add Comment]│
│ └─────────────┘ └─────────────────────────────────────────────┘
└─────────────────┴─────────────────────────────────────────────┘
```

### Advanced Variable Configuration Modal
```
┌─────────────────────────────────────────────────────┐
│         Configure Advanced Variable                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Variable Name: discount_amount                      │
│                                                      │
│ Type: [○ Conditional] [● Computed] [○ Lookup]       │
│                                                      │
│ ─── Computation Formula ────────────────────        │
│                                                      │
│ ┌──────────────────────────────────────────┐        │
│ │ {{amount}} * {{discount_rate}} / 100     │        │
│ └──────────────────────────────────────────┘        │
│                                                      │
│ Dependencies:                                       │
│ • amount (Number) - required                        │
│ • discount_rate (Number) - required                 │
│                                                      │
│ Preview Result: $500.00                             │
│                                                      │
│ [Test Formula]  [Cancel]  [Save Variable]           │
└─────────────────────────────────────────────────────┘
```

### Document Generation Form (Enhanced)
```
┌──────────────────────────────────────────────────────────┐
│           Generate Document - Employment Contract        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Basic Information                                       │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Client Name *                                      │  │
│ │ [John Smith                              ]         │  │
│ │                                                    │  │
│ │ Company Name *                                     │  │
│ │ [Acme Corporation                        ]         │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Date Fields                                             │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Start Date *              End Date                 │  │
│ │ [📅 2024-03-15    ]      [📅 2025-03-15    ]      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Financial Details                                       │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Base Amount *             Discount Rate            │  │
│ │ [$ 50,000.00     ]       [10 %           ]        │  │
│ │                                                    │  │
│ │ 💡 Calculated: Discount Amount = $5,000.00        │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Conditional Options                                     │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ☑ Include Penalty Clause                          │  │
│ │   └─ Penalty Rate: [15 %           ]              │  │
│ │                                                    │  │
│ │ ☐ Include Confidentiality Agreement               │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Output Options                                          │
│ Format: [● PDF] [○ DOCX]   Language: [English ▼]       │
│                                                          │
│ [Preview]  [Generate & Download]  [Save to Cloud]       │
└──────────────────────────────────────────────────────────┘
```

### Template Marketplace (Enhanced)
```
┌────────────────────────────────────────────────────────────┐
│                   Template Marketplace                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ [🔍 Search templates...]  [Category ▼]  [Price ▼] [Rating ▼]│
│                                                            │
│ Featured Templates                              [View All →]│
│ ┌───────────────────────────────────────────────────────┐ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │ │
│ │ │   📄    │ │   📄    │ │   📄    │ │   📄    │     │ │
│ │ │ Legal   │ │Business │ │ HR Pack │ │ Sales   │     │ │
│ │ │Contract │ │ Invoice │ │Templates│ │ Bundle  │     │ │
│ │ │         │ │         │ │         │ │         │     │ │
│ │ │ ⭐ 4.8  │ │ ⭐ 4.9  │ │ ⭐ 4.7  │ │ ⭐ 4.6  │     │ │
│ │ │2.1k uses│ │5.3k uses│ │890 uses │ │1.5k uses│     │ │
│ │ │ FREE    │ │ $9.99   │ │ $29.99  │ │ $19.99  │     │ │
│ │ │         │ │         │ │         │ │         │     │ │
│ │ │ [Clone] │ │ [Buy]   │ │ [Buy]   │ │ [Buy]   │     │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                            │
│ Top Rated This Month                                      │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ 1. Employment Agreement Pro    ⭐ 5.0 (124 reviews)   │ │
│ │    By: LegalTemplates Inc.    💰 $14.99              │ │
│ │    15 variables, conditional logic, multi-language    │ │
│ │    [Preview] [Reviews] [Buy Now]                     │ │
│ │                                                       │ │
│ │ 2. SaaS Service Contract      ⭐ 4.9 (89 reviews)    │ │
│ │    By: TechDocs              💰 $24.99              │ │
│ │    Complex conditionals, API webhooks included       │ │
│ │    [Preview] [Reviews] [Buy Now]                     │ │
│ └───────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Conflict Resolution Dialog
```
┌─────────────────────────────────────────────────┐
│        ⚠️ Edit Conflict Detected                │
├─────────────────────────────────────────────────┤
│                                                  │
│ You and John both edited the same section:      │
│                                                  │
│ Your Version (2:45 PM):                         │
│ ┌──────────────────────────────────────────┐    │
│ │ Payment shall be made within 30 days     │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ John's Version (2:46 PM):                       │
│ ┌──────────────────────────────────────────┐    │
│ │ Payment shall be made within 15 days     │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ Resolution Options:                             │
│ [● Keep Yours] [○ Keep John's] [○ Merge Both]  │
│                                                  │
│ Manual Merge:                                   │
│ ┌──────────────────────────────────────────┐    │
│ │ Payment shall be made within ___ days    │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ [Cancel]  [Resolve Conflict]                    │
└─────────────────────────────────────────────────┐
```

### Comment Thread Component
```
┌─────────────────────────────────────────────┐
│ 💬 Comments on line 45                      │
├─────────────────────────────────────────────┤
│ Sarah M. • 2 hours ago                      │
│ Should we add a termination clause here?    │
│                                              │
│   └─ John D. • 1 hour ago                   │
│     Good idea, let's use standard 30-day    │
│                                              │
│   └─ You • Just now                         │
│     ┌────────────────────────────────┐      │
│     │ Type your reply...              │      │
│     └────────────────────────────────┘      │
│     [Post] [Resolve Thread]                 │
└─────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Mobile Dashboard (375px width)
```
┌─────────────────────┐
│ ☰  Smart Contract  🔔│
├─────────────────────┤
│ Welcome, John       │
│                     │
│ ┌─────┐ ┌─────┐    │
│ │ 24  │ │ 156 │    │
│ │Tmplt│ │ Docs│    │
│ └─────┘ └─────┘    │
│                     │
│ [+ New Template]    │
│                     │
│ Recent Templates    │
│ ┌─────────────────┐ │
│ │ 📄 Contract v2  │ │
│ │    5 variables  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 📄 Invoice      │ │
│ │    8 variables  │ │
│ └─────────────────┘ │
│                     │
│ [⊞][🏠][📄][👤][⚙️] │
└─────────────────────┘
```

### Mobile Editor (375px width)
```
┌─────────────────────┐
│ ← Contract_v2  ⋮   │
├─────────────────────┤
│ [B][I][{{}}][↶][↷] │
├─────────────────────┤
│                     │
│ Service Agreement   │
│                     │
│ This agreement is   │
│ between {{client_   │
│ name}} and          │
│ {{company_name}}.   │
│                     │
│ [💬 3][👥 2][📝]    │
└─────────────────────┘
```

## Component Library

### Form Controls
- **Text Input**: Border on focus, validation states
- **Select Dropdown**: Custom styled with search
- **Date Picker**: Calendar popup with range selection
- **Number Input**: Formatted with currency/percentage
- **Checkbox**: Custom styled with animations
- **Radio Group**: Single selection with labels
- **File Upload**: Drag-and-drop with progress

### Buttons
```
Primary:   [━━━━━━━━━━] Blue bg, white text
Secondary: [┅┅┅┅┅┅┅┅┅] Gray border, gray text  
Success:   [━━━━━━━━━━] Green bg, white text
Danger:    [━━━━━━━━━━] Red bg, white text
Ghost:     [          ] No border, blue text
```

### Cards
```
┌────────────────────┐
│ [Icon] Title       │
│ Description text   │
│ Metadata • Stats   │
│ [Action] [Action]  │
└────────────────────┘
```

### Modals
- Backdrop blur effect
- Slide-up animation on mobile
- Fade-in on desktop
- Close on escape/backdrop click

### Toast Notifications
```
┌──────────────────────┐
│ ✓ Success message    │
└──────────────────────┘

┌──────────────────────┐
│ ⚠️ Warning message   │
└──────────────────────┘

┌──────────────────────┐
│ ✕ Error message      │
└──────────────────────┘
```

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate through interactive elements
- **Enter**: Activate buttons/links
- **Space**: Toggle checkboxes/expand dropdowns
- **Escape**: Close modals/dropdowns
- **Arrow Keys**: Navigate menus/lists
- **Cmd/Ctrl + K**: Global search
- **Cmd/Ctrl + S**: Save template
- **Cmd/Ctrl + Enter**: Generate document

### Screen Reader Support
- Semantic HTML5 elements
- ARIA labels on all icons
- Live regions for dynamic updates
- Form field descriptions
- Error announcements
- Progress indicators

### Visual Accessibility
- 4.5:1 contrast ratio minimum
- Focus indicators on all interactive elements
- No color-only information
- Resizable text up to 200%
- High contrast mode support
- Reduced motion preferences

## Performance Optimizations

### Loading States
```
Template Card Skeleton:
┌────────────────────┐
│ ░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░      │
│ ░░░░░░ ░░░░░░     │
└────────────────────┘
```

### Progressive Enhancement
- Core functionality without JavaScript
- Progressive web app features
- Offline template editing
- Background sync
- Push notifications for collaboration

## Animations & Interactions

### Micro-interactions
- Button hover: scale(1.02) 
- Card hover: translateY(-2px) + shadow
- Variable insertion: bounce animation
- Success state: checkmark draw
- Loading: rotating spinner
- Progress: animated bar fill

### Page Transitions
- Route change: 200ms crossfade
- Modal open: 150ms slide-up
- Dropdown: 100ms expand
- Tab switch: instant with underline slide

## Integration Specifications

### Supabase Auth Components
- Email/password with validation
- Magic link authentication
- Social providers (Google, GitHub, Microsoft)
- Multi-factor authentication setup
- Password reset flow
- Session management

### Real-time Features
- User presence indicators
- Typing indicators
- Live cursor positions
- Document lock states
- Activity notifications
- Collaboration invites

### Storage Integration
- Direct upload to Supabase Storage
- Signed URLs for secure access
- Image optimization
- Document thumbnails
- Version history storage

## Error Handling

### Error States
```
┌────────────────────────┐
│    ⚠️                  │
│ Something went wrong   │
│                        │
│ Unable to load         │
│ template. Please try   │
│ again.                 │
│                        │
│ [Retry] [Go Back]     │
└────────────────────────┘
```

### Validation Messages
- Inline field validation
- Form-level error summary
- Clear error descriptions
- Suggested fixes
- Help documentation links

## Dark Mode Specifications

### Color Adjustments
- Background: #0F172A (Slate-900)
- Surface: #1E293B (Slate-800)
- Border: #334155 (Slate-700)
- Text Primary: #F1F5F9 (Slate-100)
- Text Secondary: #CBD5E1 (Slate-400)

### Component Adaptations
- Reduced brightness for primary colors
- Increased contrast for readability
- Subtle shadows with transparency
- Inverted skeleton loaders

## Implementation Guidelines

### Component Architecture
```typescript
// Example component structure
interface TemplateEditorProps {
  templateId: string;
  onSave: (content: TemplateContent) => void;
  collaborators?: User[];
  autoSave?: boolean;
}

// State management with Zustand
interface TemplateStore {
  templates: Template[];
  activeTemplate: Template | null;
  variables: Variable[];
  setActiveTemplate: (id: string) => void;
  updateVariable: (id: string, value: any) => void;
}
```

### Styling Approach
- Tailwind CSS for utility classes
- CSS modules for component styles
- CSS variables for theming
- Styled components for complex animations

### Performance Targets
- First Contentful Paint: <1.2s
- Time to Interactive: <2.5s
- Lighthouse Score: >95
- Bundle Size: <100KB

## Future Enhancements

### AI-Powered Features
- Smart variable detection
- Content suggestions
- Auto-categorization
- Template recommendations

### Enterprise Features
- SSO integration
- Advanced permissions
- Audit logs UI
- Usage analytics dashboard
- Team management interface

### Advanced Workflows
- Multi-step approval flows
- Template inheritance
- Batch operations
- Scheduled generation
- Email delivery integration

## Testing Requirements

### Component Testing
- Unit tests for all components
- Integration tests for user flows
- Visual regression testing
- Accessibility audits
- Performance benchmarks

### User Testing
- Usability testing sessions
- A/B testing for key features
- Feedback collection
- Analytics tracking
- Heat mapping

## Documentation

### Design Documentation
- Component storybook
- Design tokens reference
- Pattern library
- Accessibility guidelines
- Brand guidelines

### Developer Documentation
- Component API reference
- Integration guides
- State management patterns
- Performance best practices
- Deployment procedures