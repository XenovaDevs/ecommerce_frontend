# Phase 2: Advanced CMS Components Documentation

This document provides comprehensive documentation for all 10 advanced UI components created in Phase 2 of the Le Pas Sage ecommerce frontend development.

## Design System

All components follow the Le Pas Sage design system:
- **Colors**: Black, white, sage (gray-green), and gold accents
- **Animations**: Luxury animations with sophisticated easing
- **Accessibility**: WCAG AA compliant
- **TypeScript**: Full type safety
- **Responsive**: Mobile-first design

## Components Overview

### 1. Table Component

**Location**: `src/components/ui/Table/`

**Purpose**: Display tabular data with sorting, selection, and responsive design.

**Key Features**:
- Sortable columns (click header to sort)
- Row selection with checkboxes
- Responsive (converts to cards on mobile)
- Loading skeleton state
- Empty state
- Striped rows
- Hover states with sage colors
- Sticky header option

**Usage**:
```tsx
import { Table, Column } from '@/components/ui';

const columns: Column[] = [
  { key: 'name', header: 'Product Name', sortable: true },
  { key: 'price', header: 'Price', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <Badge>{value}</Badge>
  },
];

const data = [
  { id: 1, name: 'Product 1', price: '$99', status: 'Active' },
  { id: 2, name: 'Product 2', price: '$149', status: 'Sold Out' },
];

<Table
  columns={columns}
  data={data}
  sortable
  selectable
  onRowSelect={(rows) => console.log(rows)}
  striped
  hoverable
  stickyHeader
/>
```

**Props**:
- `columns`: Column[] - Array of column definitions
- `data`: any[] - Array of data objects
- `sortable?`: boolean - Enable column sorting
- `selectable?`: boolean - Enable row selection
- `onRowSelect?`: (rows: any[]) => void - Callback when rows selected
- `loading?`: boolean - Show loading skeleton
- `emptyMessage?`: string - Message when no data
- `striped?`: boolean - Alternate row colors
- `hoverable?`: boolean - Enable hover states
- `stickyHeader?`: boolean - Keep header fixed on scroll

---

### 2. Tabs Component

**Location**: `src/components/ui/Tabs/`

**Purpose**: Organize content into tabbed sections with animated indicator.

**Key Features**:
- Horizontal/vertical orientation
- Animated indicator
- Icon support
- Badge/count support
- Keyboard navigation (arrow keys)
- ARIA accessible

**Usage**:
```tsx
import { Tabs, Tab } from '@/components/ui';
import { Package, ShoppingCart } from 'lucide-react';

const tabs: Tab[] = [
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    badge: 45,
    content: <div>Products content...</div>,
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    badge: 12,
    content: <div>Orders content...</div>,
  },
];

<Tabs
  tabs={tabs}
  defaultTab="products"
  onChange={(tabId) => console.log(tabId)}
  variant="underline"
  orientation="horizontal"
/>
```

**Props**:
- `tabs`: Tab[] - Array of tab objects
- `defaultTab?`: string - Initially active tab ID
- `onChange?`: (tabId: string) => void - Callback when tab changes
- `variant?`: 'default' | 'pills' | 'underline' - Visual style
- `orientation?`: 'horizontal' | 'vertical' - Layout direction

---

### 3. FileUpload Component

**Location**: `src/components/ui/FileUpload/`

**Purpose**: Upload files with drag & drop, preview, and validation.

**Key Features**:
- Drag & drop support
- Multiple files
- Image preview thumbnails
- Progress bar during upload
- File type/size validation
- Remove file button
- Gold accent animations

**Usage**:
```tsx
import { FileUpload } from '@/components/ui';

const handleUpload = async (files: File[]) => {
  // Upload files to server
  console.log('Uploading:', files);
};

<FileUpload
  onUpload={handleUpload}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  maxFiles={5}
  multiple
  preview
/>
```

**Props**:
- `onUpload`: (files: File[]) => Promise<void> - Upload handler
- `accept?`: string - Allowed file types (e.g., "image/*")
- `maxSize?`: number - Maximum file size in bytes
- `maxFiles?`: number - Maximum number of files
- `multiple?`: boolean - Allow multiple file selection
- `preview?`: boolean - Show image previews

---

### 4. Toast/Notification Component

**Location**: `src/components/ui/Toast/`

**Purpose**: Display temporary notification messages.

**Key Features**:
- Success/error/warning/info variants
- Auto-dismiss with timer
- Close button
- Multiple toast stacking
- Slide-in animation from top-right
- Icon for each type

**Usage**:
```tsx
import { ToastProvider, useToast } from '@/components/ui';

// 1. Wrap app with ToastProvider
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

// 2. Use toast in components
function MyComponent() {
  const toast = useToast();

  const handleSave = () => {
    toast.success('Product saved successfully!');
  };

  const handleError = () => {
    toast.error('Failed to save changes');
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleError}>Test Error</button>
    </div>
  );
}
```

**Methods**:
- `toast.success(message, duration?)` - Success notification
- `toast.error(message, duration?)` - Error notification
- `toast.warning(message, duration?)` - Warning notification
- `toast.info(message, duration?)` - Info notification

---

### 5. Dropdown/Menu Component

**Location**: `src/components/ui/Dropdown/`

**Purpose**: Display contextual menus with actions.

**Key Features**:
- Click/hover triggers
- Nested menus support
- Icons and shortcuts
- Dividers and labels
- Disabled items
- Keyboard navigation
- Position control

**Usage**:
```tsx
import { Dropdown, DropdownItem, DropdownDivider, DropdownLabel } from '@/components/ui';
import { Edit, Trash2, Download } from 'lucide-react';

<Dropdown
  trigger={<Button>Actions</Button>}
  align="right"
  side="bottom"
>
  <DropdownLabel>Quick Actions</DropdownLabel>
  <DropdownItem icon={Edit} shortcut="⌘E">
    Edit
  </DropdownItem>
  <DropdownItem icon={Download}>
    Download
  </DropdownItem>
  <DropdownDivider />
  <DropdownItem icon={Trash2} destructive>
    Delete
  </DropdownItem>
</Dropdown>
```

**Props**:
- `trigger`: ReactNode - Element that opens dropdown
- `children`: ReactNode - DropdownItem components
- `align?`: 'left' | 'right' - Horizontal alignment
- `side?`: 'top' | 'bottom' - Vertical position

**DropdownItem Props**:
- `icon?`: LucideIcon - Icon to display
- `onClick?`: () => void - Click handler
- `disabled?`: boolean - Disable item
- `shortcut?`: string - Keyboard shortcut label
- `destructive?`: boolean - Red styling for dangerous actions

---

### 6. SearchInput Component

**Location**: `src/components/ui/SearchInput/`

**Purpose**: Search input with debouncing and keyboard shortcuts.

**Key Features**:
- Debounced search (300ms default)
- Loading spinner
- Clear button
- Icon (search/loading)
- Keyboard shortcuts (⌘K hint)
- Sage focus states

**Usage**:
```tsx
import { SearchInput } from '@/components/ui';

const [search, setSearch] = useState('');

<SearchInput
  value={search}
  onChange={setSearch}
  onSearch={(value) => console.log('Search:', value)}
  placeholder="Search products..."
  loading={false}
  debounce={300}
  showShortcut
/>
```

**Props**:
- `value?`: string - Controlled input value
- `onChange?`: (value: string) => void - Debounced change callback
- `onSearch?`: (value: string) => void - Called on Enter key
- `placeholder?`: string - Input placeholder
- `loading?`: boolean - Show loading spinner
- `debounce?`: number - Debounce delay in ms (default 300)
- `showShortcut?`: boolean - Display ⌘K hint

---

### 7. DatePicker Component

**Location**: `src/components/ui/DatePicker/`

**Purpose**: Select single dates or date ranges.

**Key Features**:
- Single date selection
- Date range selection
- Calendar popup
- Input with format (dd/mm/yyyy)
- Today shortcut
- Clear button
- Sage colors for selected dates

**Usage**:
```tsx
import { DatePicker } from '@/components/ui';

const [date, setDate] = useState<Date | null>(null);

// Single date
<DatePicker
  value={date}
  onChange={setDate}
  mode="single"
  placeholder="Select date"
/>

// Date range
const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);

<DatePicker
  value={range}
  onChange={setRange}
  mode="range"
  placeholder="Select date range"
/>
```

**Props**:
- `value?`: Date | { start: Date; end: Date } | null - Selected date(s)
- `onChange?`: (date) => void - Change callback
- `mode?`: 'single' | 'range' - Selection mode
- `placeholder?`: string - Input placeholder
- `minDate?`: Date - Minimum selectable date
- `maxDate?`: Date - Maximum selectable date
- `disabled?`: boolean - Disable picker

---

### 8. Pagination Component

**Location**: `src/components/ui/Pagination/`

**Purpose**: Navigate through paginated data.

**Key Features**:
- Page numbers with ellipsis (...)
- Previous/Next buttons
- First/Last buttons
- Page size selector (10/25/50/100)
- Total items display
- Sage active page style

**Usage**:
```tsx
import { Pagination } from '@/components/ui';

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(25);

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  totalItems={245}
  showTotal
  showPageSize
  pageSizeOptions={[10, 25, 50, 100]}
/>
```

**Props**:
- `currentPage`: number - Current page (1-indexed)
- `totalPages`: number - Total number of pages
- `onPageChange`: (page: number) => void - Page change callback
- `pageSize?`: number - Items per page
- `onPageSizeChange?`: (size: number) => void - Page size change callback
- `totalItems?`: number - Total number of items
- `pageSizeOptions?`: number[] - Available page sizes
- `showPageSize?`: boolean - Show page size selector
- `showTotal?`: boolean - Show total items count

---

### 9. StatCard Component

**Location**: `src/components/ui/StatCard/`

**Purpose**: Display key metrics and statistics.

**Key Features**:
- Icon support
- Large number display
- Label/description
- Trend indicator (up/down with %)
- Color variants (sage/gold/success/danger)
- Loading skeleton
- Clickable option

**Usage**:
```tsx
import { StatCard } from '@/components/ui';
import { ShoppingCart } from 'lucide-react';

<StatCard
  icon={ShoppingCart}
  label="Total Orders"
  value="1,234"
  description="This month"
  trend={{ value: 12, isPositive: true }}
  variant="sage"
  loading={false}
  onClick={() => console.log('Clicked')}
/>
```

**Props**:
- `icon?`: LucideIcon - Icon to display
- `label`: string - Descriptive label
- `value`: string | number - Main statistic value
- `description?`: string - Secondary description
- `trend?`: { value: number; isPositive: boolean } - Trend indicator
- `variant?`: 'sage' | 'gold' | 'success' | 'danger' - Color theme
- `loading?`: boolean - Show loading skeleton
- `onClick?`: () => void - Click handler

---

### 10. Skeleton Component

**Location**: `src/components/ui/Skeleton/`

**Purpose**: Show placeholder content during loading.

**Key Features**:
- Various shapes (text, circle, rectangle, card)
- Pulse animation with sage colors
- Width/height variants
- Count prop for multiple lines
- Pre-configured variants

**Usage**:
```tsx
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonTable,
} from '@/components/ui';

// Basic skeleton
<Skeleton variant="text" width="100%" height={16} count={3} />

// Pre-configured variants
<SkeletonText lines={5} />
<SkeletonCard />
<SkeletonAvatar size={40} />
<SkeletonButton />
<SkeletonImage width={400} height={300} />
<SkeletonTable rows={5} columns={4} />
```

**Props**:
- `variant?`: 'text' | 'circle' | 'rectangle' | 'card' - Shape
- `width?`: string | number - Width of skeleton
- `height?`: string | number - Height of skeleton
- `count?`: number - Number of skeleton elements

---

## Color System

All components use the Le Pas Sage color palette:

```css
/* Sage colors (gray-green) */
sage-50: #f8f9f8
sage-100: #e8ebe9
sage-200: #d1d7d3
sage-300: #b1bab5
sage-400: #8a9590
sage-500: #6b7972
sage-600: #546159
sage-700: #434d47
sage-800: #37403a
sage-900: #2d342f

/* Gold accents */
gold-50: #fefce8
gold-100: #fef9c3
gold-200: #fef08a
gold-300: #fde047
gold-400: #facc15
gold-500: #eab308
gold-600: #ca8a04
gold-700: #a16207
gold-800: #854d0e
gold-900: #713f12
```

---

## Animation Guidelines

All components use luxury animations with sophisticated easing:

```css
/* Standard transition */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Emphasis transition */
transition: all 300ms cubic-bezier(0.33, 1, 0.68, 1);

/* Smooth entrance */
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

---

## Accessibility Features

All components follow WCAG AA standards:

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus visible states
- ✅ Color contrast 4.5:1 minimum
- ✅ Screen reader support
- ✅ Error state communication

---

## Testing

Visit `/ui-showcase` to see all components in action with interactive examples.

---

## Integration Examples

### Complete Admin Dashboard Example

```tsx
import {
  Table,
  Tabs,
  StatCard,
  SearchInput,
  Pagination,
  ToastProvider,
  useToast,
} from '@/components/ui';

export default function AdminDashboard() {
  const toast = useToast();

  return (
    <ToastProvider>
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            label="Products"
            value="1,234"
            trend={{ value: 12, isPositive: true }}
          />
          {/* More stat cards... */}
        </div>

        {/* Search and filters */}
        <SearchInput
          onChange={(value) => console.log(value)}
          placeholder="Search products..."
        />

        {/* Data table */}
        <Table
          columns={columns}
          data={products}
          sortable
          selectable
        />

        {/* Pagination */}
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={setPage}
        />
      </div>
    </ToastProvider>
  );
}
```

---

## Next Steps

These components form the foundation for the admin CMS. Phase 3 will focus on:
- Complete admin dashboard pages
- Product management interface
- Order management system
- Customer management
- Analytics and reports

---

## Support

For questions or issues, refer to:
- Component source code with `@ai-context` comments
- `/ui-showcase` interactive examples
- Design system documentation in Tailwind config
