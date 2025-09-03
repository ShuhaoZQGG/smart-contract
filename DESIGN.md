# Smart Contract UI/UX Design Specifications

## Design System

### Theme & Color Palette
- **Primary**: #2563EB (Blue) - Actions, CTAs
- **Secondary**: #7C3AED (Purple) - Variables, premium
- **Success**: #10B981 (Green) - Confirmations
- **Warning**: #F59E0B (Amber) - Alerts
- **Error**: #EF4444 (Red) - Errors
- **Background**: #FFFFFF / #1F2937 (Dark mode)
- **Surface**: #F9FAFB / #111827 (Dark mode)

### Typography
- **Font**: Inter (UI), JetBrains Mono (Variables)
- **H1**: 32px Semi-bold
- **H2**: 24px Semi-bold
- **Body**: 14px Regular

### Spacing
- **Base**: 8px grid
- **Container**: 1280px max
- **Mobile**: 0-639px
- **Tablet**: 640-1023px
- **Desktop**: 1024px+

## User Journeys

### 1. First-Time User
Landing → Supabase Auth → Dashboard → Template Creation Tutorial

### 2. Template Creation
Upload → Visual Editor → Insert {{variables}} → Save → Version Control

### 3. Document Generation
Select Template → Fill Variables → Preview → Generate (PDF/DOCX) → Download

### 4. Bulk Generation
Template → Upload CSV → Map Columns → Process → Download ZIP

### 5. Collaboration
Share → Real-time Edit → Comments → Conflict Resolution → Merge

### 6. Marketplace
Browse → Preview → Clone/Purchase → Customize → Use

## Core Interfaces

### Authentication (Supabase Auth)
```
┌─────────────────────────────┐
│     Smart Contract          │
├─────────────────────────────┤
│ [Sign In] [Sign Up]        │
│                            │
│ Email: [_____________]     │
│ Password: [__________]     │
│                            │
│ [Continue] [OAuth Login]   │
│ [Forgot Password?]         │
└─────────────────────────────┘
```

### Dashboard
```
┌──────────────────────────────────────────────┐
│ [Logo] Templates  Marketplace  Docs  [User]  │
├──────────────────────────────────────────────┤
│                                              │
│ Welcome back!                               │
│ [+ New Template] [Import] [Browse Gallery]  │
│                                              │
│ Recent Templates                            │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │ Doc1 │ │ Doc2 │ │ Doc3 │ │ Doc4 │      │
│ └──────┘ └──────┘ └──────┘ └──────┘      │
│                                              │
│ Activity Feed                               │
│ • John edited "Contract v2" (2m ago)       │
│ • Sarah generated 15 documents (1h ago)    │
└──────────────────────────────────────────────┘
```

### Template Editor (Lexical Rich Text)
```
┌──────────────────────────────────────────────────┐
│ Template Name: [________________] [Save] [Share] │
├──────────────────────────────────────────────────┤
│ [B][I][U] [Link] [List] [{{}}] [Undo][Redo]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ Loan Agreement                                  │
│                                                  │
│ This agreement between {{bank_name}} and       │
│ {{client_name}} for {{loan_amount}}.           │
│                                                  │
│ Interest Rate: {{interest_rate}}%              │
│ Due Date: {{due_date}}                         │
│                                                  │
├──────────────────────────────────────────────────┤
│ Variables (5):                                  │
│ • bank_name (text)                             │
│ • client_name (text)                           │
│ • loan_amount (number)                         │
│ • interest_rate (number)                       │
│ • due_date (date)                              │
└──────────────────────────────────────────────────┘
```

### Variable Input Form
```
┌─────────────────────────────────┐
│ Generate Document               │
├─────────────────────────────────┤
│ Template: Loan Agreement v2     │
│                                │
│ Bank Name:                     │
│ [______________________]       │
│                                │
│ Client Name:                   │
│ [______________________]       │
│                                │
│ Loan Amount:                   │
│ [$___________________]         │
│                                │
│ Interest Rate:                 │
│ [____]%                        │
│                                │
│ Due Date:                      │
│ [📅 MM/DD/YYYY]                │
│                                │
│ [Preview] [Generate PDF] [DOCX]│
└─────────────────────────────────┘
```

### Bulk Generation
```
┌──────────────────────────────────────────┐
│ Bulk Document Generation                 │
├──────────────────────────────────────────┤
│ Template: [Select Template ▼]            │
│                                          │
│ Upload CSV:                              │
│ ┌────────────────────────────┐          │
│ │ Drop CSV file here or      │          │
│ │ [Browse Files]              │          │
│ └────────────────────────────┘          │
│                                          │
│ Column Mapping:                          │
│ CSV Column → Template Variable          │
│ [column1 ▼] → {{bank_name}}            │
│ [column2 ▼] → {{client_name}}          │
│                                          │
│ Preview (First 3 rows)                  │
│ ┌─────────────────────────┐             │
│ │ Row 1: First National...│             │
│ │ Row 2: City Bank...     │             │
│ │ Row 3: State Credit...  │             │
│ └─────────────────────────┘             │
│                                          │
│ [Cancel] [Generate All]                  │
└──────────────────────────────────────────┘
```

### Real-time Collaboration
```
┌────────────────────────────────────────────┐
│ Editing: Contract Template                 │
│ [👤 John] [👤 Sarah] [👤 Mike] (3 active) │
├────────────────────────────────────────────┤
│                                            │
│ Document content with live cursors:        │
│ This is a |John typing...                  │
│                                            │
│ {{client_name}} agrees to |Sarah editing.. │
│                                            │
├────────────────────────────────────────────┤
│ Comments (5)                              │
│ Sarah: Should we add payment terms here?   │
│ └─ John: Yes, good idea                   │
└────────────────────────────────────────────┘
```

### Conflict Resolution
```
┌──────────────────────────────────┐
│ Merge Conflict Detected          │
├──────────────────────────────────┤
│ Your Version:                    │
│ "Payment due in 30 days"        │
│                                  │
│ Sarah's Version:                 │
│ "Payment due in 45 days"        │
│                                  │
│ [Use Mine] [Use Theirs] [Merge] │
└──────────────────────────────────┘
```

### Template Marketplace
```
┌─────────────────────────────────────────────┐
│ Template Marketplace                        │
│ [Search...] [Categories ▼] [Sort: Popular]  │
├─────────────────────────────────────────────┤
│                                             │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│ │ Contract  │ │ Invoice   │ │ NDA       │ │
│ │ ⭐ 4.8    │ │ ⭐ 4.9    │ │ ⭐ 4.7    │ │
│ │ 1.2k uses │ │ 890 uses  │ │ 650 uses  │ │
│ │ $9.99     │ │ Free      │ │ $14.99    │ │
│ │ [Preview] │ │ [Clone]   │ │ [Buy]     │ │
│ └───────────┘ └───────────┘ └───────────┘ │
│                                             │
│ Categories: Legal | Business | Personal     │
└─────────────────────────────────────────────┘
```

### Version History
```
┌──────────────────────────────────┐
│ Version History                  │
├──────────────────────────────────┤
│ Current: v5 (Auto-saved)         │
│                                  │
│ v4 - 2h ago by John             │
│ "Added payment terms"            │
│ [View] [Restore]                │
│                                  │
│ v3 - Yesterday by Sarah         │
│ "Updated interest rates"         │
│ [View] [Compare] [Restore]      │
│                                  │
│ v2 - 3 days ago                 │
│ "Initial template"               │
│ [View] [Compare]                │
└──────────────────────────────────┘
```

### Analytics Dashboard
```
┌────────────────────────────────────────┐
│ Template Analytics                     │
├────────────────────────────────────────┤
│ Usage This Month: 📊                  │
│ ┌────────────────────────┐            │
│ │ Views: 450             │            │
│ │ Generated: 125         │            │
│ │ Shared: 32             │            │
│ └────────────────────────┘            │
│                                        │
│ Popular Variables:                    │
│ • client_name (100%)                  │
│ • amount (95%)                        │
│ • date (89%)                          │
│                                        │
│ User Feedback:                        │
│ ⭐ 4.7/5 (23 reviews)                 │
└────────────────────────────────────────┘
```

## Responsive Design

### Mobile (320-639px)
- Single column layout
- Bottom navigation
- Swipeable template cards
- Simplified editor toolbar
- Touch-optimized variable insertion

### Tablet (640-1023px)
- 2-column grid for templates
- Side panel for variables
- Collapsible navigation
- Touch gestures support

### Desktop (1024px+)
- Full feature set
- Multi-panel layouts
- Keyboard shortcuts
- Advanced editing tools

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order logical flow
- Focus indicators visible
- Shortcuts documented
- Skip links provided

### Screen Readers
- ARIA labels complete
- Semantic HTML structure
- Form labels associated
- Error messages announced

### Visual
- Color contrast 4.5:1 minimum
- Text resizable to 200%
- No color-only information
- Focus indicators high contrast

## Performance Optimization

### Loading States
- Skeleton screens for content
- Progressive image loading
- Lazy load marketplace items
- Virtual scrolling for long lists

### Caching
- Template drafts auto-saved
- Recent templates cached
- Variable values remembered
- Offline mode for viewing

### Bundle Optimization
- Code splitting by route
- Lazy load heavy components
- Tree shake unused code
- CDN for static assets

## Error Handling

### User-Friendly Messages
- "Network issue - Retrying..."
- "Template saved locally"
- "Conflict detected - Review changes"
- "Generation complete - Download ready"

### Recovery Options
- Auto-retry failed requests
- Local draft recovery
- Conflict resolution UI
- Download retry mechanism

## Security UI

### Authentication
- MFA setup flow
- Password strength indicator
- Session timeout warnings
- Device management

### Permissions
- Share dialog with role selection
- Permission matrix visible
- Access logs available
- Revoke access option

## Notification System
- Real-time collaboration alerts
- Generation completion notices
- Comment mentions
- Version control updates
- System maintenance warnings