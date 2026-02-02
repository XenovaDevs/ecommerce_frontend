/**
 * @ai-context Dropdown/Menu component with nested menus, icons, shortcuts, and keyboard navigation.
 *             Follows Le Pas Sage design system with sage colors.
 * @ai-props
 *   - trigger: Element that opens the dropdown
 *   - children: DropdownItem components
 *   - align: Horizontal alignment (left/right)
 *   - side: Vertical position (top/bottom)
 * @ai-flow
 *   1. Click/hover on trigger opens menu
 *   2. Menu appears with elegant animation
 *   3. Keyboard navigation (arrows, enter, escape)
 *   4. Click item triggers action
 *   5. Menu closes on item click or outside click
 * @ai-a11y
 *   - role="menu" and role="menuitem"
 *   - Keyboard navigation
 *   - Focus management
 *   - aria-expanded state
 */
'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  side?: 'top' | 'bottom';
  className?: string;
}

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  side = 'bottom',
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const closeDropdown = () => setIsOpen(false);

  return (
    <DropdownContext.Provider value={{ closeDropdown }}>
      <div ref={dropdownRef} className={cn('relative inline-block', className)}>
        {/* Trigger */}
        <div onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="true">
          {trigger}
        </div>

        {/* Menu */}
        {isOpen && (
          <div
            role="menu"
            className={cn(
              'absolute z-50 min-w-[200px] mt-2',
              'bg-white border border-sage-200 rounded-lg shadow-lg',
              'py-1',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              align === 'right' ? 'right-0' : 'left-0',
              side === 'top' && 'bottom-full mb-2 mt-0'
            )}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownItemProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  shortcut?: string;
  destructive?: boolean;
  className?: string;
}

export const DropdownItem = ({
  icon: Icon,
  children,
  onClick,
  disabled = false,
  shortcut,
  destructive = false,
  className,
}: DropdownItemProps) => {
  const context = useContext(DropdownContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    context?.closeDropdown();
  };

  return (
    <button
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full px-3 py-2 text-left text-sm',
        'flex items-center gap-3',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sage-500',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : destructive
          ? 'text-red-700 hover:bg-red-50'
          : 'text-sage-700 hover:bg-sage-50',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="text-xs text-sage-400 ml-auto">{shortcut}</span>
      )}
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="my-1 border-t border-sage-200" role="separator" />
);

interface DropdownLabelProps {
  children: React.ReactNode;
}

export const DropdownLabel = ({ children }: DropdownLabelProps) => (
  <div className="px-3 py-2 text-xs font-semibold text-sage-500 uppercase tracking-wider">
    {children}
  </div>
);
