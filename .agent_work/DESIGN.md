# UI/UX Design Specifications - Cycle 1 Continuation

## Design System
- **Framework**: Material Design 3 (MD3)
- **Color Scheme**: Dynamic theming with light/dark modes
- **Typography**: Roboto (headings), Inter (body)
- **Breakpoints**: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- **Accessibility**: WCAG 2.1 AA compliant

## Feature 1: Advanced Variable System UI

### Variable Configuration Panel
```
┌──────────────────────────────────────────────────────┐
│ Variable Configuration: {{loan_amount}}              │
├──────────────────────────────────────────────────────┤
│ Display Name: [Loan Amount                    ]      │
│                                                       │
│ Variable Type: [▼ Computed                    ]      │
│                                                       │
│ ┌─ Computation Settings ────────────────────────┐    │
│ │ Formula:                                      │    │
│ │ ┌─────────────────────────────────────────┐  │    │
│ │ │ {{principal}} * (1 + {{interest_rate}}) │  │    │
│ │ └─────────────────────────────────────────┘  │    │
│ │                                              │    │
│ │ Dependencies:                                │    │
│ │ • principal (Number)                         │    │
│ │ • interest_rate (Number)                     │    │
│ │                                              │    │
│ │ [Test Formula]  Output: $52,500.00          │    │
│ └──────────────────────────────────────────────┘    │
│                                                       │
│ ┌─ Validation Rules ───────────────────────────┐    │
│ │ ☑ Required field                             │    │
│ │ ☑ Minimum value: [1000        ]              │    │
│ │ ☑ Maximum value: [1000000     ]              │    │
│ │ ☑ Format as currency                         │    │
│ └──────────────────────────────────────────────┘    │
│                                                       │
│ [Cancel]                              [Save Variable] │
└──────────────────────────────────────────────────────┘
```

### Conditional Variable Builder
```
┌──────────────────────────────────────────────────────┐
│ Conditional Logic Builder                            │
├──────────────────────────────────────────────────────┤
│ IF {{customer_type}} equals "Premium"                │
│   THEN show {{premium_discount}}                     │
│ ELSE IF {{customer_type}} equals "Standard"          │
│   THEN show {{standard_rate}}                        │
│ ELSE                                                  │
│   THEN show {{base_rate}}                           │
│                                                       │
│ [+ Add Condition]  [Test Logic]  [Clear All]        │
└──────────────────────────────────────────────────────┘
```

### User Journey - Variable Configuration
1. **Access**: Click variable in editor → "Configure" option
2. **Type Selection**: Dropdown with tooltips explaining each type
3. **Configuration**: Dynamic form based on selected type
4. **Testing**: Live preview with sample data
5. **Validation**: Real-time error checking
6. **Save**: Confirmation with impact analysis

### Mobile Responsive Design (320px)
- Stacked layout with collapsible sections
- Full-width inputs with larger touch targets (48px min)
- Bottom sheet pattern for configuration panels
- Swipe gestures for section navigation

## Feature 2: Conflict Resolution Interface

### Merge Conflict Dialog
```
┌──────────────────────────────────────────────────────┐
│ 🔄 Resolve Edit Conflict                             │
├──────────────────────────────────────────────────────┤
│ 2 users edited the same section simultaneously       │
│                                                       │
│ ┌─ Your Version (10:32 AM) ──────────────────┐      │
│ │ This agreement is between {{bank_name}}     │      │
│ │ and {{client_full_name}} for the amount    │      │
│ │ of {{total_loan_amount}}.                  │      │
│ └──────────────────────────────────────────────┘    │
│                                                       │
│ ┌─ Sarah's Version (10:33 AM) ────────────────┐     │
│ │ This agreement is between {{bank_name}}     │      │
│ │ and {{borrower_name}} for a loan           │      │
│ │ of {{loan_principal}}.                     │      │
│ └──────────────────────────────────────────────┘    │
│                                                       │
│ ┌─ Merged Result ──────────────────────────────┐    │
│ │ This agreement is between {{bank_name}}     │ ✏️   │
│ │ and {{client_full_name}} for a loan        │      │
│ │ of {{total_loan_amount}}.                  │      │
│ └──────────────────────────────────────────────┘    │
│                                                       │
│ [Use Yours] [Use Theirs] [Edit Merge] [Accept Merge]│
└──────────────────────────────────────────────────────┘
```

### Conflict Notification Banner
```
┌──────────────────────────────────────────────────────┐
│ ⚠️ 3 conflicts need resolution                       │
│ Sarah edited sections you're currently working on    │
│ [View Conflicts] [Auto-Merge Safe Changes]           │
└──────────────────────────────────────────────────────┘
```

### User Journey - Conflict Resolution
1. **Detection**: Real-time notification when conflict occurs
2. **Review**: Side-by-side comparison with diff highlighting
3. **Resolution Options**:
   - Accept yours/theirs
   - Manual merge with live preview
   - Auto-merge non-conflicting changes
4. **Confirmation**: Preview final result before applying
5. **History**: Conflict resolution logged for audit

## Feature 3: Comment System Interface

### Inline Comment Thread
```
┌──────────────────────────────────────────────────────┐
│ Template Editor                                      │
├──────────────────────────────────────────────────────┤
│ ...                                                   │
│ 42  The borrower agrees to pay {{monthly_payment}}   │
│ 43  on the {{payment_date}} of each month. 💬(2)    │
│     ┌───────────────────────────────────────┐       │
│     │ 💬 Comments on line 43                 │       │
│     ├───────────────────────────────────────┤       │
│     │ @john (2 hours ago):                  │       │
│     │ Should we add late payment terms?     │       │
│     │                                        │       │
│     │   @sarah (1 hour ago):               │       │
│     │   Good idea. I'll add a {{late_fee}} │       │
│     │   variable here.                     │       │
│     │                                        │       │
│     │ [Reply...] [Resolve Thread]          │       │
│     └───────────────────────────────────────┘       │
│ 44  in accordance with the terms below.              │
│ ...                                                   │
└──────────────────────────────────────────────────────┘
```

### Comment Sidebar Panel
```
┌─────────────────────────┐
│ Template Comments (5)    │
├─────────────────────────┤
│ Filter: [All ▼]         │
│                         │
│ ┌─ Line 43 ─────────┐  │
│ │ @john: Payment    │  │
│ │ terms discussion  │  │
│ │ 2 replies • Open  │  │
│ └───────────────────┘  │
│                         │
│ ┌─ Line 67 ─────────┐  │
│ │ @mike: Variable   │  │
│ │ naming issue      │  │
│ │ Resolved ✓        │  │
│ └───────────────────┘  │
│                         │
│ [+ New Comment]         │
└─────────────────────────┘
```

### User Journey - Commenting
1. **Initiate**: Select text → Add comment icon appears
2. **Compose**: Rich text editor with @mentions
3. **Thread**: Replies nest under parent comment
4. **Notification**: Real-time alerts for mentions/replies
5. **Resolution**: Mark as resolved with timestamp
6. **Filter**: View all/open/resolved comments

## Component Hierarchy

```
App
├── AdvancedVariableSystem
│   ├── VariableConfigPanel
│   │   ├── TypeSelector
│   │   ├── ComputedVariableForm
│   │   │   ├── FormulaEditor
│   │   │   └── DependencyList
│   │   ├── ConditionalVariableForm
│   │   │   ├── ConditionBuilder
│   │   │   └── LogicValidator
│   │   └── ValidationRules
│   │       ├── RequiredToggle
│   │       ├── RangeInputs
│   │       └── FormatSelector
│   ├── VariableTestPanel
│   └── VariableList
│
├── ConflictResolution
│   ├── ConflictDetector
│   ├── MergeDialog
│   │   ├── VersionComparison
│   │   ├── MergeEditor
│   │   └── ConflictActions
│   ├── ConflictNotification
│   └── ConflictHistory
│
└── CommentSystem
    ├── InlineCommentThread
    │   ├── CommentBubble
    │   ├── ReplyBox
    │   └── ThreadActions
    ├── CommentSidebar
    │   ├── CommentFilter
    │   ├── CommentList
    │   └── NewCommentButton
    └── CommentNotifications
```

## Interaction Patterns

### Advanced Variables
- **Drag & Drop**: Reorder conditions in logical expressions
- **Auto-complete**: Variable names in formula editor
- **Live validation**: Syntax checking as you type
- **Tooltip hints**: Contextual help on hover

### Conflict Resolution
- **Visual diff**: Color-coded changes (green add, red remove)
- **Smart merge**: AI-suggested resolution based on patterns
- **Keyboard shortcuts**: Arrow keys to navigate conflicts
- **Batch actions**: Resolve multiple similar conflicts at once

### Comments
- **Inline indicators**: Subtle icons show comment presence
- **Quick actions**: Single-click resolve/reply
- **Keyboard navigation**: Tab through comment threads
- **Smart positioning**: Comments follow text during edits

## Accessibility Features

### Keyboard Navigation
- **Tab order**: Logical flow through all interactive elements
- **Focus indicators**: High-contrast outlines (3:1 ratio minimum)
- **Shortcuts**:
  - `Ctrl+/`: Add comment
  - `Ctrl+Shift+V`: Open variable config
  - `Ctrl+R`: Resolve conflict
  - `Esc`: Close dialogs

### Screen Reader Support
- **ARIA labels**: All interactive elements properly labeled
- **Live regions**: Announce conflicts and comments
- **Semantic HTML**: Proper heading hierarchy
- **Role attributes**: Dialog, button, navigation roles

### Visual Accessibility
- **Color contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus visible**: Never rely on color alone
- **Text scaling**: Support up to 200% zoom
- **Motion reduction**: Respect prefers-reduced-motion

## Performance Considerations

### Optimizations
- **Virtual scrolling**: For large template lists
- **Debounced validation**: 300ms delay on formula checking
- **Lazy loading**: Comments load on demand
- **Optimistic updates**: UI updates before server confirmation

### Loading States
```
┌─────────────────────────┐
│ ⟳ Checking conflicts... │
└─────────────────────────┘

┌─────────────────────────┐
│ ✓ All changes saved     │
└─────────────────────────┘
```

## Error Handling

### Validation Errors
```
┌──────────────────────────────────────┐
│ ❌ Formula Error                      │
│ Undefined variable: {{total_cost}}   │
│ Did you mean {{total_amount}}?       │
│ [Fix] [Ignore]                       │
└──────────────────────────────────────┘
```

### Network Errors
```
┌──────────────────────────────────────┐
│ ⚠️ Connection Lost                    │
│ Your changes are saved locally       │
│ They'll sync when reconnected        │
│ [Retry] [Work Offline]               │
└──────────────────────────────────────┘
```

## Mobile-Specific Adaptations

### Touch Gestures
- **Swipe right**: Open comment sidebar
- **Long press**: Variable quick actions
- **Pinch zoom**: Template preview
- **Pull to refresh**: Sync conflicts

### Responsive Layouts
- **< 768px**: Single column, bottom sheets
- **768px - 1024px**: Collapsible sidebar
- **> 1024px**: Multi-panel layout

## Integration Points

### Supabase Realtime
- Comment notifications via presence channel
- Conflict detection via broadcast events
- Variable updates via database changes

### Edge Functions
- Formula evaluation for computed variables
- Conflict auto-resolution logic
- Comment mention notifications

## Success Metrics
- Variable configuration time < 30 seconds
- Conflict resolution rate > 90%
- Comment response time < 2 hours average
- Mobile usability score > 95/100

## Design Handoff Notes
- Figma components use 8px grid system
- Export assets at @1x, @2x, @3x for mobile
- CSS variables for theming flexibility
- Component library alignment with existing codebase