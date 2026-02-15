import { STORAGE_KEYS } from '@/constants';

export const THEME_COOKIE_NAME = 'lps-theme-preference';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const THEME_STORAGE_KEY = STORAGE_KEYS.THEME_PREFERENCE;

export const THEME_PREFERENCES = ['system', 'dark', 'light'] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
