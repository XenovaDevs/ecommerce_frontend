/**
 * @ai-context Table component for displaying tabular data with sorting, selection, and responsive modes.
 *             Follows the Le Pas Sage design system with sage/gold accents.
 */
'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type DataRow = Record<string, unknown>;
type MobileMode = 'scroll' | 'cards';
type MobileBreakpoint = 'sm' | 'md';
type SortDirection = 'asc' | 'desc' | null;
type BivariantRender<T extends DataRow> = {
  bivarianceHack: (value: unknown, row: T) => ReactNode;
}['bivarianceHack'];

export interface Column<T extends DataRow = DataRow> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: BivariantRender<T>;
  className?: string;
  mobileLabel?: string;
}

interface TableProps<T extends DataRow = DataRow> {
  columns: Column<T>[];
  data: T[];
  sortable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  mobileMode?: MobileMode;
  mobileBreakpoint?: MobileBreakpoint;
  className?: string;
}

const mobileClasses: Record<MobileBreakpoint, { table: string; cards: string }> = {
  sm: { table: 'hidden sm:table', cards: 'sm:hidden' },
  md: { table: 'hidden md:table', cards: 'md:hidden' },
};

function sortValue(value: unknown): string | number {
  if (typeof value === 'number') return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') return value.toLowerCase();
  return String(value ?? '');
}

export const Table = <T extends DataRow>({
  columns,
  data,
  sortable = false,
  selectable = false,
  onRowSelect,
  loading = false,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  stickyHeader = false,
  mobileMode = 'scroll',
  mobileBreakpoint = 'md',
  className,
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = sortValue(a[sortColumn]);
      const bVal = sortValue(b[sortColumn]);
      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected).map((i) => sortedData[i]));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
      return;
    }

    const allIndices = new Set(sortedData.map((_, i) => i));
    setSelectedRows(allIndices);
    onRowSelect?.(sortedData);
  };

  const allSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const someSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;
  const breakpoint = mobileClasses[mobileBreakpoint];
  const showCards = mobileMode === 'cards';

  if (loading) {
    return (
      <div className={cn('overflow-x-auto rounded-lg border border-sage-200', className)}>
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-sage-200 bg-sage-50">
            <tr>
              {selectable && <th className="w-12 px-4 py-3"></th>}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-sage-700"
                >
                  <div className="h-4 w-20 animate-pulse rounded bg-sage-200"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 bg-white">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {selectable && <td className="px-4 py-4"></td>}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-sage-100"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className={cn('overflow-x-auto rounded-lg border border-sage-200 bg-white', className)}>
        <div className="px-6 py-12 text-center">
          <p className="text-sage-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const desktopTable = (
    <div className={cn('overflow-x-auto rounded-lg border border-sage-200', className)}>
      <table className={cn('w-full', showCards && 'min-w-[640px]')}>
        <thead
          className={cn(
            'border-b border-sage-200 bg-sage-50',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <button
                  onClick={handleSelectAll}
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200',
                    allSelected
                      ? 'border-sage-600 bg-sage-600'
                      : someSelected
                        ? 'border-sage-300 bg-sage-300'
                        : 'border-sage-300 hover:border-sage-400'
                  )}
                  aria-label="Select all rows"
                >
                  {(allSelected || someSelected) && (
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  )}
                </button>
              </th>
            )}
            {columns.map((col) => {
              const sortState =
                sortColumn === col.key
                  ? sortDirection === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none';

              return (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-sage-700',
                    col.className
                  )}
                  aria-sort={sortable && col.sortable !== false ? sortState : undefined}
                >
                  {sortable && col.sortable !== false ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="group flex items-center gap-2 transition-colors hover:text-sage-900"
                    >
                      {col.header}
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-sage-200 bg-white">
          {sortedData.map((row, index) => (
            <tr
              key={index}
              className={cn(
                'transition-colors duration-150',
                striped && index % 2 === 1 && 'bg-sage-50/50',
                hoverable && 'hover:bg-sage-100/50',
                selectedRows.has(index) && 'bg-gold-50'
              )}
            >
              {selectable && (
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleRowSelect(index)}
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200',
                      selectedRows.has(index)
                        ? 'border-sage-600 bg-sage-600'
                        : 'border-sage-300 hover:border-sage-400'
                    )}
                    aria-label={`Select row ${index + 1}`}
                  >
                    {selectedRows.has(index) && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </button>
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-4 text-sm text-sage-900', col.className)}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const mobileCards = (
    <div className={cn('space-y-3', className)}>
      {sortedData.map((row, index) => (
        <article
          key={index}
          className={cn(
            'rounded-lg border border-sage-200 bg-white p-4 shadow-sm',
            selectedRows.has(index) && 'border-sage-400 bg-sage-50/40'
          )}
        >
          {selectable && (
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => handleRowSelect(index)}
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200',
                  selectedRows.has(index)
                    ? 'border-sage-600 bg-sage-600'
                    : 'border-sage-300 hover:border-sage-400'
                )}
                aria-label={`Select row ${index + 1}`}
              >
                {selectedRows.has(index) && (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                )}
              </button>
            </div>
          )}

          <dl className="space-y-2">
            {columns.map((col) => (
              <div key={col.key} className="grid grid-cols-2 gap-3 text-sm">
                <dt className="font-medium text-sage-700">{col.mobileLabel || col.header}</dt>
                <dd className="text-sage-900">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );

  if (!showCards) return desktopTable;

  return (
    <>
      <div className={breakpoint.cards}>{mobileCards}</div>
      <div className={breakpoint.table}>{desktopTable}</div>
    </>
  );
};
