/**
 * @ai-context Tabs component for organizing content with animated indicator.
 *             Supports horizontal/vertical layouts with sage/gold design system.
 * @ai-props
 *   - tabs: Array of tab objects with id, label, icon, badge, content
 *   - defaultTab: Initially active tab ID
 *   - onChange: Callback when tab changes
 *   - variant: Visual style (default/pills/underline)
 *   - orientation: Layout direction (horizontal/vertical)
 * @ai-flow
 *   1. Renders tab buttons with icons/badges
 *   2. Tracks active tab state
 *   3. Animates indicator on tab change
 *   4. Renders active tab content
 *   5. Keyboard navigation (arrow keys)
 * @ai-a11y
 *   - Uses role="tablist", role="tab", role="tabpanel"
 *   - aria-selected on active tab
 *   - Keyboard navigation with arrow keys
 *   - Focus management
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  orientation = 'horizontal',
  className,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Update indicator position
  useEffect(() => {
    const activeElement = tabRefs.current[activeTab];
    if (activeElement) {
      if (orientation === 'horizontal') {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
        });
      } else {
        setIndicatorStyle({
          top: activeElement.offsetTop,
          height: activeElement.offsetHeight,
        });
      }
    }
  }, [activeTab, orientation]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((t) => t.id === tabs[currentIndex].id);

    let nextIndex = currentEnabledIndex;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
      } else if (e.key === 'ArrowRight') {
        nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
      }
    } else {
      if (e.key === 'ArrowUp') {
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
      } else if (e.key === 'ArrowDown') {
        nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
      }
    }

    if (nextIndex !== currentEnabledIndex) {
      e.preventDefault();
      const nextTab = enabledTabs[nextIndex];
      handleTabChange(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn('flex', orientation === 'vertical' ? 'flex-row gap-6' : 'flex-col', className)}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          'relative',
          orientation === 'horizontal' ? 'flex border-b border-sage-200' : 'flex flex-col w-48 border-r border-sage-200'
        )}
      >
        {/* Animated indicator */}
        {variant === 'underline' && (
          <div
            className={cn(
              'absolute bg-sage-600 transition-all duration-300 ease-out',
              orientation === 'horizontal' ? 'bottom-0 h-0.5' : 'right-0 w-0.5'
            )}
            style={indicatorStyle}
          />
        )}

        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'relative px-4 py-3 text-sm font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                orientation === 'horizontal' ? 'flex-shrink-0' : 'text-left',
                variant === 'pills' &&
                  cn(
                    'rounded-lg mx-1 my-0.5',
                    isActive
                      ? 'bg-sage-100 text-sage-900'
                      : 'text-sage-600 hover:bg-sage-50 hover:text-sage-900'
                  ),
                variant === 'default' &&
                  cn(
                    isActive
                      ? 'text-sage-900 border-b-2 border-sage-600'
                      : 'text-sage-600 hover:text-sage-900 border-b-2 border-transparent'
                  ),
                variant === 'underline' &&
                  cn(
                    isActive ? 'text-sage-900' : 'text-sage-600 hover:text-sage-900'
                  )
              )}
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={cn(
                      'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full',
                      isActive
                        ? 'bg-sage-600 text-white'
                        : 'bg-sage-200 text-sage-700'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={activeTab}
        className={cn(
          'focus:outline-none',
          orientation === 'horizontal' ? 'mt-4' : 'flex-1'
        )}
        tabIndex={0}
      >
        {activeTabContent}
      </div>
    </div>
  );
};
