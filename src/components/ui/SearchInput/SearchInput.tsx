/**
 * @ai-context SearchInput component with debounced search, loading state, and keyboard shortcuts.
 *             Provides elegant search experience with sage design system.
 * @ai-props
 *   - value: Controlled input value
 *   - onChange: Callback when search value changes (debounced)
 *   - onSearch: Callback when search is executed
 *   - placeholder: Input placeholder text
 *   - loading: Show loading spinner
 *   - debounce: Debounce delay in milliseconds (default 300ms)
 *   - showShortcut: Display keyboard shortcut hint (⌘K)
 * @ai-flow
 *   1. User types in input
 *   2. Input is debounced before triggering onChange
 *   3. Shows loading spinner during search
 *   4. Clear button appears when input has value
 *   5. Supports keyboard shortcut (Cmd+K) to focus
 * @ai-a11y
 *   - Proper label association
 *   - Clear button has aria-label
 *   - Loading state communicated to screen readers
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  debounce?: number;
  showShortcut?: boolean;
  className?: string;
}

export const SearchInput = ({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  loading = false,
  debounce = 300,
  showShortcut = false,
  className,
}: SearchInputProps) => {
  const [value, setValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync with controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle input change with debounce
  const handleChange = (newValue: string) => {
    setValue(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounce);
  };

  // Handle clear
  const handleClear = () => {
    setValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  // Handle search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(value);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? (
          <Loader2 className="w-5 h-5 text-sage-400 animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-sage-400" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 py-2.5 rounded-lg',
          'bg-white border border-sage-300',
          'text-sm text-sage-900 placeholder:text-sage-400',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent',
          isFocused && 'border-sage-400'
        )}
        aria-label="Search"
        role="searchbox"
      />

      {/* Clear button or keyboard shortcut */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value ? (
          <button
            onClick={handleClear}
            className="p-1 text-sage-400 hover:text-sage-600 transition-colors"
            aria-label="Clear search"
            tabIndex={-1}
          >
            <X className="w-4 h-4" />
          </button>
        ) : showShortcut && !isFocused ? (
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-sage-500 bg-sage-100 rounded border border-sage-200">
            <span className="text-xs">⌘</span>K
          </kbd>
        ) : null}
      </div>
    </div>
  );
};
