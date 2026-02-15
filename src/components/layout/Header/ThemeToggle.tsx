'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';
import { useTheme, type ThemePreference } from '@/features/theme';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

const themeLabels: Record<ThemePreference, string> = {
  system: 'Sistema',
  dark: 'Oscuro',
  light: 'Claro',
};

const themeIcons: Record<ThemePreference, ComponentType<{ className?: string }>> = {
  system: Monitor,
  dark: Moon,
  light: Sun,
};

const toggleOptions: ThemePreference[] = ['system', 'dark', 'light'];

export function ThemeToggle({ compact = true, className }: ThemeToggleProps) {
  const { themePreference, resolvedTheme, setThemePreference, cycleTheme } = useTheme();

  const ThemeIcon = themeIcons[themePreference];
  const buttonLabel = `Tema: ${themeLabels[themePreference]} (actual: ${themeLabels[resolvedTheme]})`;

  if (compact) {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg text-sage-ivory/65 transition-sophisticated hover:bg-sage-surface-light hover:text-sage-gold',
          className
        )}
        title={buttonLabel}
        aria-label={buttonLabel}
      >
        <ThemeIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs uppercase tracking-[0.2em] text-sage-ivory/45">Tema</p>
      <div
        role="radiogroup"
        aria-label="Seleccion de tema"
        className="grid grid-cols-3 gap-2 rounded-xl border border-sage-surface-light bg-sage-surface p-1.5"
      >
        {toggleOptions.map((option) => {
          const Icon = themeIcons[option];
          const isActive = themePreference === option;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setThemePreference(option)}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-sophisticated',
                isActive
                  ? 'bg-sage-gold text-sage-black shadow-gold'
                  : 'text-sage-ivory/65 hover:bg-sage-surface-hover hover:text-sage-cream'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{themeLabels[option]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
