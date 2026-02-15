'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  THEME_COOKIE_NAME,
  THEME_MEDIA_QUERY,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from '../constants';

const THEME_SET = new Set<ThemePreference>(THEME_PREFERENCES);

interface ThemeContextValue {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  mounted: boolean;
  setThemePreference: (theme: ThemePreference) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_CYCLE_ORDER: ThemePreference[] = ['system', 'dark', 'light'];

const isThemePreference = (value: string | null): value is ThemePreference =>
  !!value && THEME_SET.has(value as ThemePreference);

const readStoredPreference = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const fromStorage = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemePreference(fromStorage)) {
    return fromStorage;
  }

  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`)
  );
  const fromCookie = cookieMatch?.[1] ? decodeURIComponent(cookieMatch[1]) : null;

  if (isThemePreference(fromCookie)) {
    return fromCookie;
  }

  return 'system';
};

const persistPreference = (preference: ThemePreference): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  document.cookie = `${THEME_COOKIE_NAME}=${preference}; Path=/; Max-Age=31536000; SameSite=Lax`;
};

const applyResolvedTheme = (theme: ResolvedTheme): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
};

const getInitialResolvedTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const currentTheme = document.documentElement.dataset.theme;
  if (currentTheme === 'dark' || currentTheme === 'light') {
    return currentTheme;
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Start with SSR-safe defaults, then sync on mount
  const [mounted, setMounted] = useState(false);
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const prefersDark = useMediaQuery(THEME_MEDIA_QUERY, true);

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (themePreference === 'system') {
      return prefersDark ? 'dark' : 'light';
    }

    return themePreference;
  }, [prefersDark, themePreference]);

  // Sync stored preference on mount
  useEffect(() => {
    setThemePreferenceState(readStoredPreference());
    setMounted(true);
  }, []);

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (mounted) {
      persistPreference(themePreference);
    }
  }, [themePreference, mounted]);

  const setThemePreference = useCallback((theme: ThemePreference) => {
    setThemePreferenceState(theme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemePreferenceState((current) => {
      const currentIndex = THEME_CYCLE_ORDER.indexOf(current);
      const nextIndex = (currentIndex + 1) % THEME_CYCLE_ORDER.length;
      return THEME_CYCLE_ORDER[nextIndex];
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themePreference,
      resolvedTheme,
      mounted,
      setThemePreference,
      cycleTheme,
    }),
    [cycleTheme, mounted, resolvedTheme, setThemePreference, themePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
