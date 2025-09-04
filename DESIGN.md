# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Theme Foundation
- **Framework**: Material Design 3
- **Primary Color**: #1976D2 (Blue 600)
- **Secondary Color**: #26A69A (Teal 400)
- **Error**: #F44336 (Red 500)
- **Warning**: #FF9800 (Orange 500)
- **Success**: #4CAF50 (Green 500)
- **Typography**: Inter (headings), Roboto (body)
- **Border Radius**: 8px (cards), 4px (buttons)
- **Shadow System**: Material elevation 0-24

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px - 1440px
- Large: 1440px+

## Core User Journeys

### 1. Template Creation Flow
```
Upload → Extract → Edit Variables → Preview → Save
```

**Upload Page**
- Drag-and-drop zone (full viewport on mobile)
- File type badges (DOCX, PDF, TXT)
- Progress bar with percentage
- Format preservation indicator
- Quick action: "Use Sample Template"

**Variable Editor**
- Split view: Source | Live Preview
- Variable insertion toolbar
- {{variable}} syntax highlighting
- Auto-complete dropdown
- Variable sidebar with drag-to-insert
- Mobile: Tabbed view (Edit/Preview)

**Variable Management Panel**
- Variable list with types
- Quick actions: Edit, Delete, Reorder
- Validation rules editor
- Default values input
- Required field toggle

### 2. Document Generation Flow
```
Select Template → Fill Variables → Preview → Export
```

**Template Selection**
- Grid view (3 cols desktop, 1 col mobile)
- Template cards with:
  - Preview thumbnail
  - Title & description
  - Variable count badge
  - Last used timestamp
  - Quick generate button

**Generation Form**
- Smart form layout
- Variable grouping by sections
- Input validation indicators
- Progress save (auto-save every 30s)
- Bulk upload CSV option
- Mobile: Single column with sticky submit

**Preview & Export**
- Full document preview
- Variable highlight toggle
- Export format selector (PDF/DOCX)
- Email delivery option
- Download queue for bulk

### 3. Collaboration Interface
```
Real-time Edit → Presence → Comments → Resolve
```

**Editor Presence**
- User avatars in toolbar
- Cursor colors per user
- "User is typing..." indicators
- Active section highlights
- Participant list drawer

**Commenting System**
- Inline comment threads
- @mention autocomplete
- Resolve/Reopen actions
- Activity timeline
- Mobile: Bottom sheet comments

**Conflict Resolution**
- Side-by-side diff view
- Accept/Reject buttons
- Merge preview
- Version rollback option
- Auto-save conflict copies

## Page Layouts

### Dashboard
```
┌─────────────────────────────────────────┐
│ Nav | Smart Contract                [+] │
├─────┼───────────────────────────────────┤
│ S   │ Welcome back, {{user_name}}       │
│ i   │                                   │
│ d   │ Quick Actions                     │
│ e   │ [Upload] [Create] [Generate]      │
│ b   │                                   │
│ a   │ Recent Templates        View All > │
│ r   │ ┌──────┐ ┌──────┐ ┌──────┐      │
│     │ │      │ │      │ │      │      │
│ T   │ │ Card │ │ Card │ │ Card │      │
│ e   │ │      │ │      │ │      │      │
│ m   │ └──────┘ └──────┘ └──────┘      │
│ p   │                                   │
│ l   │ Analytics Overview                │
│ a   │ ┌────────────────────────────┐    │
│ t   │ │ 📊 Usage Chart             │    │
│ e   │ └────────────────────────────┘    │
│ s   │                                   │
│     │ Recent Activity                   │
│ M   │ • John edited "Contract v2"      │
│ a   │ • Sarah generated 5 documents    │
│ r   │ • New comment on "Invoice"       │
│ k   │                                   │
└─────┴───────────────────────────────────┘
```

### Template Editor
```
┌─────────────────────────────────────────┐
│ ← Back | Template Name        [Save] 👥 │
├─────────────────────────────────────────┤
│ Toolbar: B I U | {{}} | 🔗 | ≡ | ↶ ↷  │
├─────────────────────────────────────────┤
│         │                    │          │
│ Editor  │                    │ Variables│
│         │                    │          │
│ Content │                    │ • name   │
│ with    │                    │ • date   │
│ {{vars}}│                    │ • amount │
│         │                    │          │
│         │                    │ [+ Add]  │
├─────────┴────────────────────┴──────────┤
│ 💬 Comments (3)  📊 Analytics  ⚙️ Settings│
└─────────────────────────────────────────┘
```

### Template Marketplace
```
┌─────────────────────────────────────────┐
│ Marketplace     🔍 Search    [Filters]  │
├─────────────────────────────────────────┤
│ Categories: All | Legal | Sales | HR    │
├─────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ Template │ │ Template │ │ Template ││
│ │  ⭐4.5   │ │  ⭐4.8   │ │  ⭐4.2   ││
│ │ $9.99    │ │ FREE     │ │ $14.99   ││
│ │ [Clone]  │ │ [Clone]  │ │ [Clone]  ││
│ └──────────┘ └──────────┘ └──────────┘│
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│ │ Template │ │ Template │ │ Template ││
│ │  ⭐4.7   │ │  ⭐4.9   │ │  ⭐3.9   ││
│ │ $19.99   │ │ $4.99    │ │ FREE     ││
│ │ [Clone]  │ │ [Clone]  │ │ [Clone]  ││
│ └──────────┘ └──────────┘ └──────────┘│
└─────────────────────────────────────────┘
```

## Component Library

### Buttons
- **Primary**: Filled, elevation 2
- **Secondary**: Outlined, no elevation
- **Text**: No border, ripple effect
- **FAB**: Circular, elevation 6
- **States**: Default, Hover (+elevation), Active, Disabled (opacity 0.38)

### Cards
- **Template Card**
  - 16px padding
  - Elevation 1 (hover: 4)
  - Preview image 16:9
  - Title (16px, semibold)
  - Metadata (12px, muted)

### Forms
- **Input Fields**
  - Outlined variant
  - Floating labels
  - Helper text below
  - Error states with messages
  - Character counter for text

### Data Tables
- **Document List**
  - Sticky header
  - Sortable columns
  - Row hover states
  - Inline actions
  - Pagination controls

## Interaction Patterns

### Gestures (Mobile)
- **Swipe left**: Delete/Archive
- **Swipe right**: Share/Export
- **Pull to refresh**: Update lists
- **Long press**: Multi-select
- **Pinch**: Zoom preview

### Animations
- **Page transitions**: Slide (300ms)
- **Card hover**: Elevation change (200ms)
- **Loading**: Skeleton screens
- **Success**: Checkmark animation
- **Micro-interactions**: Button ripples

### Feedback
- **Toast notifications**: Bottom (mobile), top-right (desktop)
- **Progress indicators**: Linear for uploads, circular for processing
- **Empty states**: Illustrations with CTAs
- **Error boundaries**: Friendly error messages

## Accessibility (WCAG 2.1 AA)

### Visual
- **Color contrast**: 4.5:1 minimum
- **Focus indicators**: 2px outline
- **Text sizing**: Base 16px, scalable
- **Icons**: Always with labels or tooltips

### Keyboard Navigation
- **Tab order**: Logical flow
- **Skip links**: "Skip to content"
- **Shortcuts**: Documented hotkeys
- **Focus trap**: Modals and drawers

### Screen Readers
- **ARIA labels**: All interactive elements
- **Live regions**: Status updates
- **Semantic HTML**: Proper heading hierarchy
- **Alt text**: All images and icons

## Mobile-First Optimizations

### Performance
- **Lazy loading**: Images and heavy components
- **Code splitting**: Route-based chunks
- **PWA**: Offline capability, app install
- **Caching**: Service worker strategies

### Touch Targets
- **Minimum size**: 44x44px
- **Spacing**: 8px between targets
- **Thumb zones**: Primary actions in reach

### Responsive Components
- **Navigation**: Bottom nav (mobile), sidebar (desktop)
- **Tables**: Horizontal scroll with sticky columns
- **Modals**: Full screen (mobile), centered (desktop)
- **Forms**: Single column (mobile), multi-column (desktop)

## Advanced Features UI

### Variable Types Interface
```
Variable Configuration
├── Type: [Dropdown ▼]
├── Options (for dropdown)
│   ├── Option 1
│   ├── Option 2
│   └── [+ Add Option]
├── Validation Rules
│   ├── Required ☑
│   ├── Min/Max (numbers)
│   └── Pattern (regex)
└── Default Value: [____]
```

### Collaboration Presence
```
[Avatar1] [Avatar2] [+3]
John is editing paragraph 2...
Sarah is viewing...
```

### Conflict Resolution Modal
```
┌─────────────────────────┐
│ Resolve Conflict        │
├─────────────────────────┤
│ Your Version | Their    │
│              | Version  │
│ [Content A]  | [Content B]│
├─────────────────────────┤
│ [Use Mine] [Use Theirs] │
│     [Merge Both]        │
└─────────────────────────┘
```

## Design Tokens

```css
--primary: #1976D2;
--primary-light: #42A5F5;
--primary-dark: #1565C0;
--secondary: #26A69A;
--error: #F44336;
--warning: #FF9800;
--success: #4CAF50;
--surface: #FFFFFF;
--background: #FAFAFA;
--text-primary: rgba(0,0,0,0.87);
--text-secondary: rgba(0,0,0,0.54);
--text-disabled: rgba(0,0,0,0.38);
--border: rgba(0,0,0,0.12);
--shadow-1: 0 1px 3px rgba(0,0,0,0.12);
--shadow-2: 0 2px 6px rgba(0,0,0,0.16);
--radius-small: 4px;
--radius-medium: 8px;
--radius-large: 16px;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

## Implementation Notes

### Component Framework
- React 18 with TypeScript
- Material-UI v5 components
- Lexical for rich text editing
- Framer Motion for animations

### State Management
- Redux Toolkit for global state
- React Query for server state
- Yjs for collaborative editing
- Local storage for preferences

### Performance Targets
- FCP: < 1.5s
- TTI: < 3s
- CLS: < 0.1
- Bundle: < 100KB (gzipped)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 10+)