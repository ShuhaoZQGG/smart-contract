# Smart Contract - UI/UX Design Specifications

## Design System

### Brand Identity
- **Primary Color**: #2563EB (Blue-600)
- **Secondary Color**: #10B981 (Emerald-500)
- **Accent Color**: #F59E0B (Amber-500)
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
Landing → Sign Up → Onboarding Tutorial → Create First Template → Success
```
- Progressive disclosure of features
- Interactive tutorial with sample template
- Quick win: Generate first document in <3 minutes

### 2. Template Creation Flow
```
Upload Document → Extract Content → Insert Variables → Configure Settings → Save Template
```
- Drag-and-drop upload with format validation
- Visual variable insertion with syntax highlighting
- Auto-save every 30 seconds

### 3. Document Generation Flow
```
Select Template → Fill Variables → Preview → Generate → Download
```
- Form validation with helpful error messages
- Real-time preview updates
- Multiple export formats (PDF/DOCX)

### 4. Bulk Generation Flow
```
Select Template → Upload CSV → Map Columns → Preview Sample → Generate All → Download ZIP
```
- CSV template download option
- Column auto-mapping with manual override
- Progress indicator with estimated time

## Page Layouts

### Dashboard
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Smart Contract    [Search]    [User] [Settings] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Welcome back, {{user_name}}                        │
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│ │ Templates   │ │ Documents   │ │ Analytics   │  │
│ │    12       │ │    48       │ │ This Month  │  │
│ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                     │
│ Recent Templates                    Quick Actions  │
│ ┌──────────────────────────┐      [+ New Template]│
│ │ • Contract_v2.docx       │      [↑ Upload Doc]  │
│ │ • Invoice_Template.pdf   │      [⚡ Generate]    │
│ │ • NDA_Standard.docx      │                      │
│ └──────────────────────────┘                      │
└─────────────────────────────────────────────────────┘
```

### Template Editor
```
┌─────────────────────────────────────────────────────────┐
│ ← Back  Template: {{template_name}}  [Save] [Preview] │
├─────────────────┬─────────────────────────────────────────┤
│ Variables   │                                           │
│             │  [Bold] [Italic] [List] [{{}}] [Undo]     │
│ ┌─────────┐ │  ┌─────────────────────────────────────┐   │
│ │client_   │ │  │                                   │   │
│ │name     │ │  │ Service Agreement                 │   │
│ │         │ │  │                                   │   │
│ │company_ │ │  │ This agreement is between        │   │
│ │name     │ │  │ {{client_name}} and              │   │
│ │         │ │  │ {{company_name}}.                │   │
│ │service_ │ │  │                                   │   │
│ │date     │ │  │ Services begin on                │   │
│ │         │ │  │ {{service_date}} for a          │   │
│ │amount   │ │  │ total of {{amount}}.            │   │
│ │         │ │  │                                   │   │
│ │[+ Add]  │ │  └─────────────────────────────────────┘   │
│ └─────────┘ │                                           │
│             │  Formatting preserved from original       │
│ Properties  │  Variable highlighting in blue           │
│ ┌─────────┐ │  Auto-complete on {{ trigger            │
│ │Format:  │ │                                           │
│ │ DOCX    │ │  Collaborators (2 active) 🟢             │
│ │Version: │ │  └─ John D. (editing)                    │
│ │ 1.2     │ │  └─ Sarah M. (viewing)                   │
│ └─────────┘ │                                           │
└─────────────┴───────────────────────────────────────────┘
```

### Generation Form
```
┌─────────────────────────────────────────────────────────┐
│        Generate Document from Template                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Template: Employment Contract v2.1                    │
│                                                         │
│  Fill in the variables:                               │
│                                                         │
│  Client Name *                                         │
│  ┌─────────────────────────────────────────────┐          │
│  │ John Smith                              │          │
│  └─────────────────────────────────────────────┘          │
│                                                         │
│  Company Name *                                        │
│  ┌─────────────────────────────────────────────┐          │
│  │ Acme Corporation                        │          │
│  └─────────────────────────────────────────────┘          │
│                                                         │
│  Service Date *                                        │
│  ┌─────────────────────────────────────────────┐          │
│  │ 📅 2024-03-15                           │          │
│  └─────────────────────────────────────────────┘          │
│                                                         │
│  Amount *                                              │
│  ┌─────────────────────────────────────────────┐          │
│  │ $ 50,000.00                             │          │
│  └─────────────────────────────────────────────┘          │
│                                                         │
│  Output Format:  [●] PDF  [○] DOCX                    │
│                                                         │
│  [Preview Document]  [Generate & Download]             │
└─────────────────────────────────────────────────────────┘
```

### Template Marketplace
```
┌─────────────────────────────────────────────────────────┐
│              Template Marketplace                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Search templates...]  [Categories ▼]  [Sort by ▼]    │
│                                                         │
│  Featured Templates                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │    📄    │ │    📄    │ │    📄    │              │
│  │  Legal   │ │ Business │ │ Personal │              │
│  │ Contract │ │ Invoice  │ │  Resume  │              │
│  │ ⭐ 4.8   │ │ ⭐ 4.9   │ │ ⭐ 4.7   │              │
│  │ 2k uses  │ │ 5k uses  │ │ 1k uses  │              │
│  │ [Clone]  │ │ [Clone]  │ │ [Clone]  │              │
│  └──────────┘ └──────────┘ └──────────┘              │
│                                                         │
│  Browse by Category                                    │
│  ┌─────────────────────────────────────────┐          │
│  │ 📁 Legal (124)      📁 Business (89)   │          │
│  │ 📁 Education (45)   📁 Personal (67)   │          │
│  │ 📁 Healthcare (23)  📁 Real Estate (34) │          │
│  └─────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

## Component Specifications

### Navigation Bar
- Fixed position with blur backdrop
- User avatar with dropdown menu
- Notification bell with badge counter
- Search with command palette (Cmd+K)

### Template Card
```
┌─────────────────────────┐
│ [Icon] Template Name    │
│ Last edited 2 hours ago │
│ 5 variables · 3 pages   │
│ [Edit] [Generate] [⋮]  │
└─────────────────────────┘
```

### Variable Input Field
- Label with asterisk for required fields
- Placeholder text with example values
- Error state with red border and message
- Success state with green checkmark

### Real-time Collaboration
- Cursor positions with user colors
- Presence avatars in editor header
- "User is typing..." indicator
- Conflict resolution dialog

## Responsive Design

### Breakpoints
- Mobile: 320-767px (single column)
- Tablet: 768-1023px (2 columns)
- Desktop: 1024-1439px (3 columns)
- Wide: 1440px+ (4 columns)

### Mobile Adaptations
- Bottom navigation bar
- Full-screen modals
- Swipe gestures for actions
- Collapsed sidebar with hamburger menu

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus indicators on all interactive elements
- Keyboard shortcuts with ? help modal
- Escape key closes all modals

### Screen Reader Support
- Semantic HTML5 elements
- ARIA labels on icons and buttons
- Live regions for dynamic content
- Skip navigation links

### Visual Accessibility
- 4.5:1 contrast ratio minimum
- Resizable text up to 200%
- No information by color alone
- Reduced motion option

## Performance Optimizations

### Loading States
- Skeleton screens for content
- Progressive image loading
- Optimistic UI updates
- Staggered animations

### Offline Support
- Service worker for asset caching
- IndexedDB for template storage
- Queue for pending operations
- Sync indicator in header

## Error Handling

### Error States
- Inline validation messages
- Toast notifications for actions
- Full-page error boundaries
- Retry mechanisms with exponential backoff

### Empty States
```
┌─────────────────────────┐
│                         │
│         📄              │
│   No templates yet      │
│                         │
│ Create your first       │
│ template to get started │
│                         │
│  [+ Create Template]    │
│                         │
└─────────────────────────┘
```

## Animation & Micro-interactions

### Transitions
- Page transitions: 200ms ease-out
- Modal fade-in: 150ms ease-in
- Button hover: scale(1.02)
- Card hover: translateY(-2px)

### Feedback
- Button click ripple effect
- Drag-and-drop visual feedback
- Progress bars for long operations
- Success checkmarks with animation

## Integration Points

### Supabase Auth UI
- Magic link authentication
- Social login buttons (Google, GitHub)
- Password strength indicator
- MFA setup flow

### File Upload
- Drag-and-drop zone with dashed border
- File type validation indicators
- Upload progress with percentage
- Thumbnail preview for documents

### Export Options
- Format selection radio buttons
- Quality settings for PDF
- Email delivery option
- Cloud storage integration buttons

## Future Enhancements (Cycle 2+)

### Advanced Features UI
- Conditional variable logic builder
- Formula editor with autocomplete
- Webhook configuration panel
- API key management interface

### Enterprise Dashboard
- Team member management
- Usage analytics charts
- Billing and subscription UI
- Audit log viewer

### AI Integration
- Smart variable detection overlay
- Content suggestions sidebar
- Template recommendation cards
- Auto-categorization interface

## Style Guide

### Button Hierarchy
1. Primary: Blue background, white text
2. Secondary: Gray border, gray text
3. Tertiary: No border, blue text
4. Danger: Red background, white text

### Form Elements
- Input height: 40px
- Border radius: 6px
- Border color: #E5E7EB
- Focus border: #2563EB

### Typography Scale
- H1: 32px, font-weight: 700
- H2: 24px, font-weight: 600
- H3: 20px, font-weight: 600
- Body: 16px, font-weight: 400
- Small: 14px, font-weight: 400

### Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64

## Implementation Notes

### Frontend Stack
- React 18.3 with TypeScript
- Shadcn/ui component library
- Tailwind CSS for styling
- Lexical for rich text editing
- Zustand for state management
- React Query for server state

### Component Structure
```
components/
├── layout/
│   ├── Navigation.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── templates/
│   ├── TemplateCard.tsx
│   ├── TemplateEditor.tsx
│   └── VariablePanel.tsx
├── generation/
│   ├── GenerationForm.tsx
│   ├── BulkUpload.tsx
│   └── PreviewModal.tsx
└── shared/
    ├── Button.tsx
    ├── Input.tsx
    └── Modal.tsx
```

### Design Tokens
```css
:root {
  --color-primary: #2563EB;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```