/**
 * @ai-context UI Components Showcase Page
 *             Demonstrates all Phase 2 components with interactive examples.
 *             This page is for development/testing purposes.
 */
'use client';

import { useState } from 'react';
import {
  Table,
  Tabs,
  FileUpload,
  ToastProvider,
  useToast,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  DropdownLabel,
  SearchInput,
  DatePicker,
  Pagination,
  StatCard,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  Button,
  Card,
} from '@/components/ui';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';

// Example component that uses toast
function ToastExamples() {
  const toast = useToast();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-sage-900 mb-4">Toast Notifications</h3>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Product saved successfully!')}>
          Success Toast
        </Button>
        <Button onClick={() => toast.error('Failed to delete product')} variant="secondary">
          Error Toast
        </Button>
        <Button onClick={() => toast.warning('Stock is running low')} variant="secondary">
          Warning Toast
        </Button>
        <Button onClick={() => toast.info('New order received')} variant="secondary">
          Info Toast
        </Button>
      </div>
    </Card>
  );
}

export default function UIShowcasePage() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // Sample data for table
  const sampleProducts = [
    { id: 1, name: 'Classic Leather Bag', price: '$299', stock: 45, status: 'Active' },
    { id: 2, name: 'Silk Scarf', price: '$89', stock: 120, status: 'Active' },
    { id: 3, name: 'Gold Bracelet', price: '$499', stock: 12, status: 'Low Stock' },
    { id: 4, name: 'Designer Sunglasses', price: '$199', stock: 0, status: 'Out of Stock' },
    { id: 5, name: 'Premium Wallet', price: '$149', stock: 78, status: 'Active' },
  ];

  const tableColumns = [
    { key: 'name', header: 'Product Name', sortable: true },
    { key: 'price', header: 'Price', sortable: true },
    { key: 'stock', header: 'Stock', sortable: true },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => {
        const status = String(value ?? '');
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              status === 'Active'
                ? 'bg-green-100 text-green-700'
                : status === 'Low Stock'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <Dropdown
          trigger={
            <button className="p-2 hover:bg-sage-50 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-sage-600" />
            </button>
          }
        >
          <DropdownItem icon={Eye}>View</DropdownItem>
          <DropdownItem icon={Edit}>Edit</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={Trash2} destructive>
            Delete
          </DropdownItem>
        </Dropdown>
      ),
    },
  ];

  const handleFileUpload = async (files: File[]) => {
    console.log('Uploading files:', files);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-sage-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-sage-900 mb-2">UI Components Showcase</h1>
            <p className="text-sage-600">Phase 2: Advanced CMS Components</p>
          </div>

          {/* Statistics Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Stat Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Package}
                label="Total Products"
                value="1,234"
                trend={{ value: 12, isPositive: true }}
                variant="sage"
              />
              <StatCard
                icon={ShoppingCart}
                label="Orders"
                value="856"
                trend={{ value: 8, isPositive: true }}
                variant="gold"
              />
              <StatCard
                icon={Users}
                label="Customers"
                value="2,450"
                trend={{ value: 3, isPositive: false }}
                variant="success"
              />
              <StatCard
                icon={DollarSign}
                label="Revenue"
                value="$45,678"
                description="This month"
                variant="sage"
              />
            </div>
          </section>

          {/* Search Input */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Search Input</h2>
            <div className="max-w-md">
              <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search products..."
                showShortcut
              />
            </div>
          </section>

          {/* Table */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Data Table</h2>
            <Table
              columns={tableColumns}
              data={sampleProducts}
              sortable
              selectable
              onRowSelect={(rows) => console.log('Selected rows:', rows)}
              striped
              hoverable
            />
          </section>

          {/* Tabs */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Tabs</h2>
            <Tabs
              tabs={[
                {
                  id: 'all',
                  label: 'All Products',
                  badge: 1234,
                  content: (
                    <Card className="p-6">
                      <p className="text-sage-600">All products content...</p>
                    </Card>
                  ),
                },
                {
                  id: 'active',
                  label: 'Active',
                  badge: 856,
                  content: (
                    <Card className="p-6">
                      <p className="text-sage-600">Active products content...</p>
                    </Card>
                  ),
                },
                {
                  id: 'draft',
                  label: 'Draft',
                  badge: 45,
                  content: (
                    <Card className="p-6">
                      <p className="text-sage-600">Draft products content...</p>
                    </Card>
                  ),
                },
                {
                  id: 'archived',
                  label: 'Archived',
                  content: (
                    <Card className="p-6">
                      <p className="text-sage-600">Archived products content...</p>
                    </Card>
                  ),
                },
              ]}
              variant="underline"
            />
          </section>

          {/* File Upload */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">File Upload</h2>
            <div className="max-w-2xl">
              <FileUpload
                onUpload={handleFileUpload}
                accept="image/*"
                multiple
                preview
                maxSize={5 * 1024 * 1024}
              />
            </div>
          </section>

          {/* Date Picker */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Date Picker</h2>
            <div className="max-w-md">
              <DatePicker
                value={selectedDate}
                onChange={(date) => {
                  if (date instanceof Date || date === null) {
                    setSelectedDate(date);
                  }
                }}
                placeholder="Select a date"
              />
            </div>
          </section>

          {/* Pagination */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Pagination</h2>
            <Card className="p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
                totalItems={245}
                pageSize={25}
                showTotal
                showPageSize
              />
            </Card>
          </section>

          {/* Dropdown Menu */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Dropdown Menu</h2>
            <Dropdown trigger={<Button>Actions Menu</Button>}>
              <DropdownLabel>Quick Actions</DropdownLabel>
              <DropdownItem icon={Download} shortcut="⌘D">
                Download Report
              </DropdownItem>
              <DropdownItem icon={Edit} shortcut="⌘E">
                Edit Settings
              </DropdownItem>
              <DropdownDivider />
              <DropdownLabel>Danger Zone</DropdownLabel>
              <DropdownItem icon={Trash2} destructive>
                Delete All
              </DropdownItem>
            </Dropdown>
          </section>

          {/* Toast Examples */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Toast Notifications</h2>
            <ToastExamples />
          </section>

          {/* Skeleton Loaders */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Skeleton Loaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-sage-900 mb-4">Card Skeleton</h3>
                <SkeletonCard />
              </div>
              <div>
                <h3 className="text-sm font-medium text-sage-900 mb-4">Table Skeleton</h3>
                <SkeletonTable rows={5} columns={4} />
              </div>
            </div>
          </section>

          {/* Loading State Example */}
          <section>
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Loading States</h2>
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <Button onClick={() => setLoading(!loading)}>
                  Toggle Loading State
                </Button>
              </div>
              {loading ? (
                <SkeletonTable rows={3} columns={5} />
              ) : (
                <Table
                  columns={tableColumns.slice(0, 4)}
                  data={sampleProducts.slice(0, 3)}
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </ToastProvider>
  );
}
