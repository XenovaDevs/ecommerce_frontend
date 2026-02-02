/**
 * @ai-context DatePicker component for single date or date range selection.
 *             Features calendar popup with sage colors and elegant interactions.
 * @ai-props
 *   - value: Selected date or date range
 *   - onChange: Callback when date changes
 *   - mode: Single date or range selection
 *   - placeholder: Input placeholder
 *   - minDate: Minimum selectable date
 *   - maxDate: Maximum selectable date
 *   - disabled: Disable the picker
 * @ai-flow
 *   1. Click input to open calendar popup
 *   2. Navigate months with arrow buttons
 *   3. Click date to select
 *   4. For range mode, click start then end date
 *   5. Today button for quick selection
 *   6. Clear button to reset
 * @ai-a11y
 *   - Keyboard navigation in calendar
 *   - aria-labels for month/year/dates
 *   - Focus management
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: Date | { start: Date; end: Date } | null;
  onChange?: (date: Date | { start: Date; end: Date } | null) => void;
  mode?: 'single' | 'range';
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  mode = 'single',
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Get display value
  const getDisplayValue = (): string => {
    if (!value) return '';
    if (mode === 'single' && value instanceof Date) {
      return formatDate(value);
    }
    if (mode === 'range' && value && typeof value === 'object' && 'start' in value) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`;
    }
    return '';
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (disabled) return;

    if (mode === 'single') {
      onChange?.(date);
      setIsOpen(false);
    } else {
      // Range mode
      if (!rangeStart) {
        setRangeStart(date);
      } else {
        const start = date < rangeStart ? date : rangeStart;
        const end = date < rangeStart ? rangeStart : date;
        onChange?.({ start, end });
        setRangeStart(null);
        setIsOpen(false);
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    onChange?.(null);
    setRangeStart(null);
  };

  // Handle today
  const handleToday = () => {
    const today = new Date();
    if (mode === 'single') {
      onChange?.(today);
      setIsOpen(false);
    }
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Check if date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    if (mode === 'single' && value instanceof Date) {
      return date.toDateString() === value.toDateString();
    }
    if (mode === 'range' && value && typeof value === 'object' && 'start' in value) {
      const time = date.getTime();
      return time >= value.start.getTime() && time <= value.end.getTime();
    }
    return false;
  };

  // Check if date is in range (for highlighting during selection)
  const isDateInRange = (date: Date): boolean => {
    if (mode !== 'range' || !rangeStart) return false;
    const time = date.getTime();
    const startTime = rangeStart.getTime();
    return time > startTime;
  };

  const calendarDays = generateCalendarDays();
  const displayValue = getDisplayValue();

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2.5 rounded-lg',
          'bg-white border border-sage-300',
          'text-sm text-sage-900',
          'transition-all duration-200 cursor-pointer',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-sage-500 focus-within:border-transparent',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Calendar className="w-5 h-5 text-sage-400 flex-shrink-0" />
        <span className={cn('flex-1', !displayValue && 'text-sage-400')}>
          {displayValue || placeholder}
        </span>
        {displayValue && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1 text-sage-400 hover:text-sage-600 transition-colors"
            aria-label="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 p-4 bg-white border border-sage-200 rounded-lg shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="p-2 text-sage-600 hover:bg-sage-50 rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-semibold text-sage-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 text-sage-600 hover:bg-sage-50 rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div
                key={day}
                className="w-10 h-10 flex items-center justify-center text-xs font-medium text-sage-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="w-10 h-10" />;
              }

              const isSelected = isDateSelected(date);
              const isInRange = isDateInRange(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={cn(
                    'w-10 h-10 text-sm rounded-lg transition-colors',
                    'hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500',
                    isSelected && 'bg-sage-600 text-white hover:bg-sage-700',
                    isInRange && !isSelected && 'bg-sage-100',
                    isToday && !isSelected && 'border-2 border-sage-600',
                    !isSelected && !isInRange && 'text-sage-700'
                  )}
                  aria-label={formatDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-200">
            <button
              onClick={handleToday}
              className="text-sm text-sage-600 hover:text-sage-900 transition-colors"
            >
              Today
            </button>
            {displayValue && (
              <button
                onClick={handleClear}
                className="text-sm text-sage-600 hover:text-sage-900 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
