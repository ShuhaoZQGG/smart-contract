# Smart Contract Document Template System - UI/UX Design Specifications

## Design System

### Visual Language
- **Framework**: Material Design 3 with custom theming
- **Typography**: Inter for UI, IBM Plex Sans for content
- **Color Palette**:
  - Primary: #2563EB (Blue)
  - Secondary: #10B981 (Green)
  - Error: #EF4444
  - Warning: #F59E0B
  - Neutral: #6B7280 - #F9FAFB gradient
  - Dark Mode: #111827 background

### Component Library
- **Base**: MUI v5 with custom extensions
- **Icons**: Heroicons + Material Icons
- **Animation**: Framer Motion for micro-interactions
- **Grid**: 12-column responsive system

## User Journeys

### 1. First-Time User Flow
```
Landing → Sign Up (Supabase Auth) → Onboarding Tutorial → Template Upload → Variable Insertion → Generate Document
```

### 2. Returning User Flow
```
Login → Dashboard → Template Library → Select/Edit → Generate/Share
```

### 3. Collaboration Flow
```
Template → Invite Team → Real-time Edit → Comments → Resolve Conflicts → Version Control
```

### 4. Marketplace Flow
```
Browse Templates → Preview → Purchase/Clone → Customize → Use
```

## Page Designs

### 1. Landing Page
**Layout**: Hero + Features + Pricing + CTA

**Components**:
- Hero Section:
  - Headline: "Transform Documents into Smart Templates"
  - Subheadline: "Upload, Add Variables, Generate Personalized Documents"
  - CTA: "Start Free" / "View Demo"
  - Live Demo Widget (interactive preview)

- Features Grid (3x2):
  - Upload Any Document
  - Visual Variable Editor
  - Bulk Generation
  - Real-time Collaboration
  - Template Marketplace
  - API Integration

### 2. Dashboard
**Layout**: Sidebar Navigation + Main Content Area

**Sidebar (Collapsible)**:
```
┌─────────────┐
│ Logo        │
├─────────────┤
│ Dashboard   │
│ Templates   │
│ Documents   │
│ Variables   │
│ Team        │
│ Marketplace │
│ Analytics   │
│ Settings    │
└─────────────┘
```

**Main Content**:
- Quick Actions Bar: [+ New Template] [Upload Document] [Generate]
- Recent Templates (Card Grid)
- Activity Feed (Real-time updates)
- Usage Statistics (Charts)

### 3. Template Editor
**Layout**: Three-Panel Design

**Left Panel - Variables (300px)**:
```
┌─────────────────────┐
│ Variables (12)      │
├─────────────────────┤
│ + Add Variable      │
├─────────────────────┤
│ ▼ Text Variables    │
│   {{client_name}}   │
│   {{company}}       │
│ ▼ Date Variables    │
│   {{sign_date}}     │
│ ▼ Computed          │
│   {{total_amount}}  │
└─────────────────────┘
```

**Center Panel - Editor**:
- Toolbar: Bold | Italic | Underline | Link | Variable | Format | Undo | Redo
- Rich Text Editor (Lexical)
- Variable Highlighting (Blue background)
- Line Numbers (Optional)
- Presence Indicators (Collaborative editing)

**Right Panel - Properties/Preview**:
- Preview Tab: Live document preview
- Comments Tab: Thread discussions
- History Tab: Version timeline
- Settings Tab: Template configuration

### 4. Variable Management Modal
**Layout**: Modal Dialog (600x400)

```
┌─────────────────────────────────┐
│ Configure Variable              │
├─────────────────────────────────┤
│ Name:     [client_name______]   │
│ Display:  [Client Name______]   │
│ Type:     [▼ Text          ]    │
│ Default:  [_________________]   │
│ Required: ☑                     │
│                                 │
│ ▼ Advanced Options              │
│   Validation: [Email format ]   │
│   Min Length: [3___]           │
│   Max Length: [50__]           │
│                                 │
│ [Cancel]           [Save]       │
└─────────────────────────────────┘
```

### 5. Document Generation Form
**Layout**: Step-by-Step Wizard

**Step 1: Select Template**
- Template Cards with preview
- Search/Filter bar
- Categories sidebar

**Step 2: Fill Variables**
```
┌─────────────────────────────────┐
│ Generate Document               │
├─────────────────────────────────┤
│ Template: Service Agreement v2  │
├─────────────────────────────────┤
│ Client Name*                    │
│ [_____________________________] │
│                                 │
│ Company Name*                   │
│ [_____________________________] │
│                                 │
│ Contract Date                   │
│ [📅 Select Date______________] │
│                                 │
│ Service Type                    │
│ [▼ Select...                ] │
│                                 │
│ Amount                          │
│ [$_____________________________]│
├─────────────────────────────────┤
│ [Back] [Preview] [Generate PDF] │
└─────────────────────────────────┘
```

**Step 3: Preview & Download**
- Full document preview
- Format selection (PDF/DOCX)
- Email/Share options

### 6. Bulk Generation Interface
**Layout**: Data Grid + Actions

```
┌─────────────────────────────────────┐
│ Bulk Document Generation            │
├─────────────────────────────────────┤
│ Template: [▼ Select Template    ]   │
│                                     │
│ CSV Upload                          │
│ ┌───────────────────────────────┐  │
│ │ 📎 Drop CSV file here         │  │
│ │    or click to browse         │  │
│ └───────────────────────────────┘  │
│                                     │
│ ▼ Data Preview (5 rows)            │
│ ┌─────┬─────┬─────┬──────┐       │
│ │Name │Email│Date │Amount│       │
│ ├─────┼─────┼─────┼──────┤       │
│ │John │j@ex │3/15 │$5000 │       │
│ │Jane │jane │3/16 │$7500 │       │
│ └─────┴─────┴─────┴──────┘       │
│                                     │
│ Output: ○ PDF ● DOCX               │
│                                     │
│ [Cancel] [Validate] [Generate All]  │
└─────────────────────────────────────┘
```

### 7. Template Marketplace
**Layout**: Grid + Filters

**Filter Sidebar**:
- Categories
- Price Range
- Rating
- Features
- Sort By

**Main Grid**:
```
┌────────┐ ┌────────┐ ┌────────┐
│ Template Card     │ │          │
│ ★★★★☆ (124)       │ │          │
│ Service Agreement │ │          │
│ By: John Doe      │ │          │
│ $9.99             │ │          │
│ [Preview] [Buy]   │ │          │
└────────┘ └────────┘ └────────┘
```

### 8. Collaboration Features

**Real-time Presence**:
```
┌─────────────────────────────┐
│ Active Now: 👤 John 👤 Jane  │
└─────────────────────────────┘
```

**Conflict Resolution Modal**:
```
┌─────────────────────────────────┐
│ Resolve Edit Conflict          │
├─────────────────────────────────┤
│ Your Version    │ Their Version │
│ ─────────────   │ ──────────── │
│ Contract terms  │ Agreement     │
│ and conditions  │ terms and     │
│                 │ conditions    │
├─────────────────────────────────┤
│ [Use Mine] [Use Theirs] [Merge] │
└─────────────────────────────────┘
```

**Comments Thread**:
```
┌─────────────────────────────┐
│ 💬 Comments on line 42      │
├─────────────────────────────┤
│ @jane: Should we update     │
│ this clause?                │
│   └─ @john: Yes, let's     │
│      discuss tomorrow       │
│                             │
│ [Add Reply...]              │
└─────────────────────────────┘
```

## Mobile Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Mobile Adaptations

**Navigation**: Bottom Tab Bar
```
┌─────────────────────────┐
│      Main Content       │
│                         │
├─────────────────────────┤
│ 🏠  📄  ➕  👥  ⚙️     │
└─────────────────────────┘
```

**Editor**: Stacked Layout
- Variables: Slide-up drawer
- Editor: Full screen
- Preview: Separate screen

**Forms**: Single Column
- Full-width inputs
- Sticky action buttons
- Progressive disclosure

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order: Logical flow
- Focus indicators: 2px blue outline
- Skip links: "Skip to main content"
- Shortcuts:
  - Ctrl/Cmd + S: Save
  - Ctrl/Cmd + G: Generate
  - Ctrl/Cmd + /: Search

### Screen Reader Support
- ARIA labels on all interactive elements
- Live regions for real-time updates
- Semantic HTML structure
- Alt text for all images

### Visual Accessibility
- Color contrast: 4.5:1 minimum
- Focus visible indicators
- Resizable text (up to 200%)
- No color-only information

## Loading & Error States

### Loading States
- Skeleton screens for content
- Progress bars for uploads/generation
- Shimmer effects for cards
- Spinner for actions

### Error States
```
┌─────────────────────────┐
│ ⚠️ Unable to load       │
│ Please try again        │
│ [Retry] [Contact Help]  │
└─────────────────────────┘
```

### Empty States
```
┌─────────────────────────┐
│ 📄 No templates yet     │
│ Create your first       │
│ template to get started │
│ [+ Create Template]     │
└─────────────────────────┘
```

## Performance Considerations

### Optimizations
- Lazy loading for template cards
- Virtual scrolling for long lists
- Debounced search (300ms)
- Optimistic UI updates
- Image compression & CDN
- Code splitting by route

### Target Metrics
- First Contentful Paint: <1.2s
- Time to Interactive: <3.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## Dark Mode Support

All components support dark mode with:
- Inverted color schemes
- Adjusted contrast ratios
- Reduced brightness
- Dark-compatible illustrations
- System preference detection

## Notification System

### Types
- Success: Green toast, 3s duration
- Error: Red toast, 5s duration
- Info: Blue toast, 4s duration
- Progress: Persistent with percentage

### Placement
- Desktop: Top-right corner
- Mobile: Bottom with swipe-to-dismiss

## Search & Filter UX

### Global Search
- Command palette (Cmd+K)
- Fuzzy matching
- Recent searches
- Search categories

### Filters
- Multi-select checkboxes
- Range sliders
- Date pickers
- Clear all option
- Active filter badges

## Onboarding Flow

### Step 1: Welcome
- Value proposition
- Quick video (30s)
- Skip option

### Step 2: Upload First Document
- Drag & drop area
- Sample templates
- Format explanation

### Step 3: Add Variables
- Interactive tutorial
- Highlighted UI elements
- Practice variable

### Step 4: Generate
- Preview result
- Success celebration
- Next steps guidance

## Analytics Dashboard

### Metrics Display
- Cards for key metrics
- Line charts for trends
- Bar charts for comparisons
- Heat maps for usage patterns
- Export functionality

### Filters
- Date range picker
- Template selector
- User filter (admin)
- Comparison mode

## Settings Interface

### Sections
1. Profile: Avatar, name, email
2. Security: Password, 2FA, sessions
3. Notifications: Email, in-app preferences
4. API: Keys, webhooks, limits
5. Billing: Plan, usage, invoices
6. Team: Members, roles, invites

## Design Tokens

```css
--primary: #2563EB;
--primary-hover: #1D4ED8;
--secondary: #10B981;
--error: #EF4444;
--warning: #F59E0B;
--success: #10B981;
--text-primary: #111827;
--text-secondary: #6B7280;
--border: #E5E7EB;
--background: #FFFFFF;
--surface: #F9FAFB;
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--font-body: 'Inter', sans-serif;
--font-mono: 'IBM Plex Mono', monospace;
```

## Interaction Patterns

### Drag & Drop
- Visual feedback during drag
- Drop zone highlighting
- Reorder animations
- Multi-select support

### Auto-save
- Every 30 seconds
- On blur events
- Visual indicator
- Conflict detection

### Undo/Redo
- Stack limit: 50 actions
- Keyboard shortcuts
- Visual feedback
- Group related actions

## Component States

### Buttons
- Default, Hover, Active, Disabled, Loading

### Inputs
- Default, Focus, Error, Success, Disabled

### Cards
- Default, Hover, Selected, Dragging

## Animation Guidelines

### Transitions
- Duration: 200-300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: transform, opacity

### Micro-interactions
- Button press: scale(0.95)
- Card hover: translateY(-2px)
- Success: checkmark animation
- Loading: pulse/skeleton

## Responsive Tables

### Mobile Strategy
- Horizontal scroll for wide tables
- Card view alternative
- Priority columns
- Expandable rows

## File Upload UX

### Features
- Drag & drop zone
- Progress indication
- Format validation
- Size limits display
- Batch upload support
- Cancel capability

## Print Styles

### Optimizations
- Hide navigation
- Remove backgrounds
- Black text on white
- Page break control
- A4/Letter formats

## Integration Points

### Supabase Auth UI
- Social logins (Google, GitHub)
- Magic link option
- Password recovery
- Email verification
- Session management

### Real-time Features
- Presence indicators
- Live cursors
- Change broadcasts
- Connection status
- Reconnection handling

## Future Considerations

### AI Integration
- Smart variable detection
- Content suggestions
- Template recommendations
- Auto-formatting

### Voice Interface
- Voice commands
- Dictation support
- Audio feedback
- Accessibility enhancement