# Smart Contract - UI/UX Design Specifications

## Design System Foundation

### Material Design 3 Components
- **Primary Color**: #1976D2 (Blue) - Professional, trustworthy
- **Secondary Color**: #00BCD4 (Cyan) - Modern, accessible
- **Accent Color**: #8B5CF6 (Violet) - Premium features
- **Variable Highlight**: #FFE082 (Amber-200) - Variable identification
- **Error**: #F44336 (Red)
- **Warning**: #FF9800 (Orange)
- **Success**: #4CAF50 (Green)
- **Info**: #2196F3 (Light Blue)
- **Neutral Palette**: Material Gray scale

### Typography
- **Headings**: Inter (700, 600, 500)
- **Body**: Inter (400, 300)
- **Code/Variables**: JetBrains Mono
- **Sizes**: 12px, 14px, 16px, 20px, 24px, 32px, 48px

### Component Library
- **Framework**: Material Design 3 + React Components
- **Icons**: Heroicons + Custom SVG
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Editor**: Lexical (Rich Text)

## Information Architecture

### Primary Navigation
```
Dashboard | Templates | Editor | Marketplace | Analytics | Settings
```

### User Roles & Permissions (Aligned with Supabase Auth)
1. **Free User**: 5 templates, basic features, single document generation
2. **Pro User**: Unlimited templates, bulk generation, collaboration, version control
3. **Team Admin**: Team management, shared workspace, template sharing, analytics
4. **Enterprise**: API access, webhooks, custom branding, advanced variables

## Core User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up → Onboarding → Template Upload → Variable Setup → Generate Document
```

**Onboarding Screens:**
1. Welcome & Value Proposition
2. Quick Tour (Interactive)
3. First Template Upload
4. Success & Next Steps

### 2. Document Creation Journey
```
Select Template → Edit Variables → Preview → Generate → Download/Share
```

### 3. Collaboration Flow
```
Open Template → Invite Team → Real-time Edit → Comment/Review → Publish
```

## Page Layouts & Components

### 1. Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Smart Contract    [Search]    [🔔] [User Avatar] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Welcome back, {{user_name}} 👋                         │
│  You have 3 documents pending review                    │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 📄 125     │ │ 📊 89%      │ │ 👥 12       │      │
│  │ Documents  │ │ Efficiency  │ │ Team Members│      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                          │
│  Recent Templates                          [View All]    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📄 Employment Contract    edited 2 hours ago    │   │
│  │ 📄 NDA Agreement         edited yesterday       │   │
│  │ 📄 Invoice Template      edited 3 days ago     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Quick Actions                                          │
│  [+ New Template] [↑ Upload] [⚡ Generate] [📤 Export] │
└─────────────────────────────────────────────────────────┘
```

### 2. Template Editor (Lexical Rich Text with Variables)
```
┌─────────────────────────────────────────────────────────┐
│ ← Back   Employment Contract v2.1   [Save] [Preview] 🔄 │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │ Variables (6) │  Document Editor                     │ │
│ │               │  ┌─────────────────────────────┐    │ │
│ │ {{company}}   │  │ B I U S | ¶ ≡ 🔗 {{}} 📎 │    │ │
│ │ {{employee}}  │  ├─────────────────────────────┤    │ │
│ │ {{start_date}}│  │                              │    │ │
│ │ {{salary}}    │  │ EMPLOYMENT AGREEMENT         │    │ │
│ │ {{position}}  │  │                              │    │ │
│ │ {{manager}}   │  │ This agreement is between    │    │ │
│ │               │  │ {{company}} ("Employer")     │    │ │
│ │ [+ Add]       │  │ and {{employee}}             │    │ │
│ │               │  │ ("Employee") for the         │    │ │
│ │               │  │ position of {{position}}.    │    │ │
│ │               │  │                              │    │ │
│ │               │  │ Start Date: {{start_date}}   │    │ │
│ │               │  │ Salary: ${{salary}}/year     │    │ │
│ │               │  │ Reports to: {{manager}}      │    │ │
│ │               │  │                              │    │ │
│ └───────────────┴─────────────────────────────────┘    │ │
│                                                          │
│ 💬 Comments (3)  📊 Versions  👥 Active Users(2)  🔄 Auto-save │
└─────────────────────────────────────────────────────────┘
```

### 3. Variable Configuration Panel
```
┌──────────────────────────────────────┐
│ Variable: {{salary}}                 │
│                                      │
│ Display Name: [Annual Salary____]    │
│                                      │
│ Type: [Number        ▼]              │
│                                      │
│ Format: [Currency    ▼]              │
│                                      │
│ Default: [75000_________]            │
│                                      │
│ Validation:                          │
│ ☑ Required                          │
│ ☑ Min: [30000___] Max: [500000___] │
│                                      │
│ Advanced:                            │
│ Formula: [_________________]         │
│ Condition: [_________________]       │
│                                      │
│ [Cancel]            [Save Variable]  │
└──────────────────────────────────────┐
```

### 4. Document Generation Form
```
┌─────────────────────────────────────────────────────────┐
│ Generate Document from: Employment Contract             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Fill in the following information:                      │
│                                                          │
│ Company Name *                                          │
│ [Acme Corporation_________________________]            │
│                                                          │
│ Employee Name *                                         │
│ [John Smith_______________________________]            │
│                                                          │
│ Position *                                              │
│ [Senior Software Engineer_________________]            │
│                                                          │
│ Start Date *                                           │
│ [📅 03/15/2024___________________________]            │
│                                                          │
│ Annual Salary *                                         │
│ [$ 125,000_______________________________]            │
│                                                          │
│ Reporting Manager                                       │
│ [Jane Doe________________________________]            │
│                                                          │
│ Output Format:                                          │
│ ○ PDF  ● DOCX  ○ Both                                  │
│                                                          │
│ [Cancel]    [Preview]    [Generate Document →]         │
└─────────────────────────────────────────────────────────┘
```

### 5. Bulk Generation Interface
```
┌─────────────────────────────────────────────────────────┐
│ Bulk Document Generation                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Template: Employment Contract                           │
│                                                          │
│ ┌─────────────────────────────────────────────────┐   │
│ │ 📁 Upload CSV File                               │   │
│ │                                                   │   │
│ │    Drag & drop your CSV here or click to browse │   │
│ │                                                   │   │
│ │    Required columns:                             │   │
│ │    company, employee, position,                  │   │
│ │    start_date, salary, manager                   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                          │
│ ✅ employees_march_2024.csv (125 rows)                 │
│                                                          │
│ Preview:                                                │
│ ┌─────────────────────────────────────────────────┐   │
│ │ # │ Company │ Employee │ Position │ Salary      │   │
│ ├───┼─────────┼──────────┼──────────┼────────────┤   │
│ │ 1 │ Acme    │ J. Smith │ Engineer │ $125,000   │   │
│ │ 2 │ Acme    │ A. Jones │ Designer │ $95,000    │   │
│ │ 3 │ Acme    │ B. Brown │ Manager  │ $145,000   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                          │
│ [← Back]    [Validate Data]    [Generate All →]        │
└─────────────────────────────────────────────────────────┘
```

### 6. Template Marketplace
```
┌─────────────────────────────────────────────────────────┐
│ Template Marketplace      [Search___] [Filter ▼] [Sort]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Categories: [All] [Legal] [HR] [Sales] [Finance] [More]│
│                                                          │
│ Featured Templates                                      │
│ ┌─────────────┬─────────────┬─────────────┐           │
│ │ NDA Pro     │ Sales Quote │ Invoice Pro │           │
│ │ ⭐ 4.8 (234)│ ⭐ 4.9 (189)│ ⭐ 4.7 (445)│           │
│ │ $19         │ Free        │ $29         │           │
│ │ [Preview]   │ [Use Now]   │ [Preview]   │           │
│ └─────────────┴─────────────┴─────────────┘           │
│                                                          │
│ Browse All Templates                                    │
│ ┌─────────────────────────────────────────────────┐   │
│ │ 📄 Employment Contract                           │   │
│ │    Complete employment agreement with all        │   │
│ │    standard clauses and variables                │   │
│ │    ⭐ 4.6 (123) | 2.5K downloads | Free         │   │
│ │    [Preview] [Clone to My Templates]            │   │
│ ├─────────────────────────────────────────────────┤   │
│ │ 📄 Service Agreement                             │   │
│ │    Professional service contract template        │   │
│ │    ⭐ 4.8 (89) | 1.8K downloads | $15           │   │
│ │    [Preview] [Purchase]                         │   │
│ └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 7. Real-time Collaboration View (Supabase Realtime)
```
┌─────────────────────────────────────────────────────────┐
│ 👥 Collaborative Editing - Employment Contract          │
├─────────────────────────────────────────────────────────┤
│ Active Users (Presence):                                │
│ 🟢 You  🟡 Sarah (editing)  🔵 Mike (viewing)          │
│                                                          │
│ ┌─────────────────────────────────────────────────┐   │
│ │ [Lexical Editor with Yjs CRDT sync]             │   │
│ │                                                   │   │
│ │ This agreement is between                        │   │
│ │ {{company}} │Sarah's cursor│                     │   │
│ │                                                   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                          │
│ 💬 Comments & Activity (WebSocket)                      │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Sarah: Should we add a confidentiality clause?  │   │
│ │ Mike: @Sarah Yes, I'll draft it now            │   │
│ │ System: Mike added variable {{nda_duration}}    │   │
│ │ System: Conflict resolved automatically (Yjs)   │   │
│ └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Mobile Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Wide**: 1440px+

### Mobile Adaptations

#### Mobile Dashboard
```
┌─────────────┐
│ ☰  Smart    │
│  Contract   │
├─────────────┤
│ Welcome! 👋 │
│             │
│ [+ New]     │
│ [↑ Upload]  │
│             │
│ Recent:     │
│ • Contract  │
│ • NDA       │
│ • Invoice   │
└─────────────┘
```

#### Mobile Editor
```
┌─────────────┐
│ ← Template  │
├─────────────┤
│ [Variables] │
│ [Editor]    │
│ [Comments]  │
├─────────────┤
│ (Tab content│
│  displays   │
│  here)      │
└─────────────┘
```

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements keyboard accessible
- Escape key closes modals
- Arrow keys navigate menus

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for icons
- Live regions for updates
- Form field descriptions

### Visual Accessibility
- 4.5:1 contrast ratio minimum
- Focus indicators visible
- No color-only information
- Resizable text to 200%

## Interaction Patterns

### Variable Insertion
1. **Inline**: Type `{{` triggers autocomplete
2. **Button**: Click inserts at cursor
3. **Drag & Drop**: From variable panel
4. **Context Menu**: Right-click option

### Auto-save Behavior
- Save every 10 seconds of inactivity
- Visual indicator when saving
- Conflict detection & resolution
- Version checkpoint creation

### Error Handling
```
┌──────────────────────────┐
│ ⚠️ Validation Error      │
│                          │
│ Please fix:              │
│ • Company name required  │
│ • Invalid email format   │
│                          │
│ [Review] [Dismiss]       │
└──────────────────────────┘
```

## Loading States

### Skeleton Screens
```
┌─────────────────────────┐
│ ░░░░░░░░░░░░░          │
│ ░░░░░░░░░░░░░░░░░░░    │
│ ░░░░░░░░░░░░░░░░       │
│ ░░░░░░░░░░░░░          │
└─────────────────────────┘
```

### Progress Indicators
- Linear progress for bulk operations
- Circular spinners for quick loads
- Percentage display for uploads
- Step indicators for wizards

## Empty States

### No Templates
```
┌────────────────────────┐
│      📄                │
│                        │
│  No templates yet      │
│                        │
│  Create your first     │
│  template to get       │
│  started               │
│                        │
│  [+ Create Template]   │
│  [↑ Upload Document]   │
└────────────────────────┘
```

## Notification System

### Types
1. **Success**: Green toast, 3s auto-dismiss
2. **Error**: Red modal, requires action
3. **Warning**: Yellow banner, persistent
4. **Info**: Blue toast, 5s auto-dismiss

### Placement
- Desktop: Top-right corner
- Mobile: Bottom of screen
- Critical: Center modal

## Performance Optimizations

### Lazy Loading
- Route-based code splitting
- Image lazy loading
- Virtual scrolling for lists
- On-demand component loading

### Caching Strategy
- Template content: 5 minutes
- User data: Session
- Static assets: 1 year
- API responses: Conditional

## Supabase Auth Integration

### Login Flow (Supabase Auth UI)
```
┌─────────────────────────┐
│   Smart Contract        │
│                         │
│  ┌───────────────────┐  │
│  │ email@example.com │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ ••••••••         │  │
│  └───────────────────┘  │
│                         │
│  [Sign In]             │
│                         │
│  ─────── OR ───────    │
│                         │
│  [🔵 Continue with     │
│      Google]           │
│  [⚫ Continue with     │
│      GitHub]           │
│  [✉️ Magic Link]       │
│                         │
│  New user? [Sign up]   │
│  Forgot? [Reset]       │
└─────────────────────────┘
```

### MFA Setup
```
┌─────────────────────────┐
│  Secure Your Account    │
│                         │
│  Enable 2FA:            │
│  ○ SMS                  │
│  ● Authenticator App    │
│                         │
│  Scan QR Code:          │
│  [QR CODE IMAGE]        │
│                         │
│  Enter Code:            │
│  [______]               │
│                         │
│  [Verify & Enable]      │
└─────────────────────────┘
```

## Supabase-Specific UI Components

### Database-Driven Features

#### Template Versions (template_versions table)
```
┌─────────────────────────────────────────┐
│ Version History                         │
├─────────────────────────────────────────┤
│ v2.1 (current) - 2 hours ago           │
│   ✓ Added payment terms                │
│                                         │
│ v2.0 - Yesterday                       │
│   ✓ Updated legal clauses              │
│                                         │
│ v1.9 - 3 days ago                      │
│   ✓ Initial template                   │
│                                         │
│ [Compare] [Restore] [Download]         │
└─────────────────────────────────────────┘
```

#### Advanced Variables (advanced_variables table)
```
┌─────────────────────────────────────────┐
│ Advanced Variable Configuration         │
├─────────────────────────────────────────┤
│ Type: [Conditional ▼]                   │
│                                         │
│ IF {{client_type}} = "Enterprise"       │
│ THEN {{discount}} = 20%                │
│ ELSE {{discount}} = 10%                │
│                                         │
│ [Test Logic] [Save Configuration]       │
└─────────────────────────────────────────┘
```

#### Rate Limiting Indicator (rate_limits table)
```
API Usage: ████████░░ 80/100 requests
Resets in: 45 minutes
```

#### Webhooks Configuration (webhooks table)
```
┌─────────────────────────────────────────┐
│ Webhook Settings                        │
├─────────────────────────────────────────┤
│ URL: [https://api.example.com/hook]    │
│                                         │
│ Events:                                 │
│ ☑ Document Generated                   │
│ ☑ Template Updated                     │
│ ☐ Bulk Process Complete               │
│                                         │
│ Secret: [••••••••••]                   │
│                                         │
│ [Test Webhook] [Save]                  │
└─────────────────────────────────────────┘
```

### Edge Function Status Dashboard
```
┌─────────────────────────────────────────────────┐
│ Edge Functions Health                          │
├─────────────────────────────────────────────────┤
│ process-document      ✅ Active  12ms avg      │
│ process-template      ✅ Active  8ms avg       │
│ generate-document     ✅ Active  15ms avg      │
│ process-docx         ✅ Active  22ms avg       │
│ marketplace-backend   ✅ Active  10ms avg      │
│                                                 │
│ Total Invocations: 12,456 (last 24h)          │
│ Error Rate: 0.02%                             │
└─────────────────────────────────────────────────┘
```

## Analytics Dashboard
```
┌──────────────────────────────────────┐
│ Template Analytics                   │
├──────────────────────────────────────┤
│ Usage This Month                     │
│ ┌────────────────────────────────┐  │
│ │ ▁▂▄█▆▄▂▄▆█▇█▆▄▂▁▂▄▆█         │  │
│ └────────────────────────────────┘  │
│                                      │
│ Top Variables Used:                  │
│ 1. {{client_name}} - 89%            │
│ 2. {{date}} - 76%                   │
│ 3. {{amount}} - 65%                 │
│                                      │
│ Generation Stats:                    │
│ • Total: 1,247                       │
│ • PDF: 834 (67%)                     │
│ • DOCX: 413 (33%)                    │
└──────────────────────────────────────┘
```

## Design Tokens

```css
/* Colors */
--primary: #2563EB;
--secondary: #10B981;
--accent: #8B5CF6;
--error: #EF4444;
--warning: #F59E0B;
--success: #10B981;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

/* Animation */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--easing: cubic-bezier(0.4, 0, 0.2, 1);
```

## Component States

### Button States
- **Default**: Primary color, normal weight
- **Hover**: Darker shade, cursor pointer
- **Active**: Pressed appearance, scale(0.98)
- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Spinner icon, disabled state

### Form Field States
- **Default**: Gray border
- **Focus**: Blue border, shadow
- **Error**: Red border, error message
- **Success**: Green checkmark
- **Disabled**: Gray background

## Microinteractions

1. **Variable Highlight**: Pulse animation on hover
2. **Save Indicator**: Checkmark fade-in
3. **Delete Confirmation**: Shake animation
4. **Success Actions**: Confetti burst
5. **Drag & Drop**: Ghost element follows

## Dark Mode Support

### Color Adaptations
- Backgrounds: Gray-900 → Gray-50
- Text: Gray-50 → Gray-900
- Borders: Gray-700 → Gray-300
- Shadows: Reduced opacity

### User Preference
- System preference detection
- Manual toggle in settings
- Persistent localStorage
- Smooth transition animation

## Document Processing UI

### Upload & Processing Flow
```
┌─────────────────────────────────────────────────┐
│ Document Upload & Processing                    │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │                                          │   │
│ │   📄 Drag & drop DOCX/PDF here         │   │
│ │       or click to browse                │   │
│ │                                          │   │
│ │   Supported: .docx, .pdf, .txt          │   │
│ │   Max size: 10MB                        │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ Processing Steps:                               │
│ ✅ File uploaded                               │
│ ✅ Text extracted (mammoth/pdf-lib)           │
│ ⏳ Creating template...                        │
│ ○  Ready for editing                          │
│                                                  │
│ [Cancel]                                        │
└─────────────────────────────────────────────────┘
```

### Base64 Encoding Display
```
┌─────────────────────────────────────────────────┐
│ Document Preview (Base64 Encoded)               │
├─────────────────────────────────────────────────┤
│ Format: DOCX                                    │
│ Size: 245KB                                     │
│ Encoding: Base64                                │
│                                                  │
│ [View Raw] [Download] [Convert to Template]    │
└─────────────────────────────────────────────────┘
```

## Responsive Design Specifications

### Breakpoint Behaviors
| Component | Mobile (320-768px) | Tablet (768-1024px) | Desktop (1024px+) |
|-----------|-------------------|---------------------|-------------------|
| Navigation | Hamburger menu | Side drawer | Top bar |
| Editor | Single column | Two columns | Three panels |
| Variables | Bottom sheet | Side panel | Floating panel |
| Toolbar | Condensed | Full | Full + shortcuts |

### Touch Optimizations
- **Minimum touch target**: 44x44px
- **Swipe gestures**: Navigate between sections
- **Pinch to zoom**: Document preview
- **Long press**: Context menu

## Performance Metrics & Monitoring

### Key Performance Indicators
```
┌─────────────────────────────────────────────────┐
│ Performance Dashboard                           │
├─────────────────────────────────────────────────┤
│ Core Web Vitals:                               │
│ • LCP: 2.1s ✅ (Good < 2.5s)                  │
│ • FID: 45ms ✅ (Good < 100ms)                 │
│ • CLS: 0.08 ✅ (Good < 0.1)                   │
│                                                 │
│ Custom Metrics:                                 │
│ • Template Load: 850ms avg                     │
│ • Document Generation: 1.2s avg                │
│ • Bulk Process: 15ms/doc                       │
│                                                 │
│ [View Details] [Export Report]                  │
└─────────────────────────────────────────────────┘
```

## Security & Privacy UI

### Data Privacy Controls
```
┌─────────────────────────────────────────────────┐
│ Privacy Settings                                │
├─────────────────────────────────────────────────┤
│ Data Sharing:                                   │
│ ○ Private (only you)                           │
│ ● Team (your organization)                     │
│ ○ Public (marketplace)                         │
│                                                 │
│ Document Retention:                            │
│ [30 days ▼] after generation                   │
│                                                 │
│ Analytics:                                      │
│ ☑ Allow usage analytics                       │
│ ☐ Share anonymous data                        │
│                                                 │
│ [Save Preferences]                              │
└─────────────────────────────────────────────────┘
```

## Audit Trail UI (audit_logs table)
```
┌─────────────────────────────────────────────────┐
│ Activity Log                                    │
├─────────────────────────────────────────────────┤
│ Today                                           │
│ • 10:45 AM - Template edited (v2.1)           │
│ • 10:30 AM - Document generated (Contract.pdf) │
│ • 09:15 AM - User logged in (IP: 192.168.1.1) │
│                                                 │
│ Yesterday                                       │
│ • 04:22 PM - Template shared with team        │
│ • 03:10 PM - Bulk generation (50 documents)   │
│                                                 │
│ [Load More] [Export CSV]                        │
└─────────────────────────────────────────────────┘
```

## Conclusion

This comprehensive UI/UX design specification provides a complete blueprint for the Smart Contract Document Template System, fully aligned with the Supabase backend infrastructure. The design ensures:

1. **Complete Feature Coverage**: Every core feature from README.md has corresponding UI designs
2. **Database Alignment**: UI components directly map to all 16 Supabase tables
3. **Real-time Collaboration**: Leverages Supabase Realtime for live editing
4. **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
5. **Performance**: Optimized for sub-3 second interactions
6. **Responsive Design**: Seamless experience across all devices
7. **Security**: Integrated Supabase Auth with MFA support

The design system prioritizes user experience while maintaining technical feasibility, ensuring smooth implementation in the development phase.