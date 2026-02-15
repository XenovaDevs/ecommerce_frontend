'use client';

import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const getServerSnapshot = () => defaultValue;

  const getSnapshot = () => {
    if (typeof window === 'undefined') return defaultValue;
    return window.matchMedia(query).matches;
  };

  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const media = window.matchMedia(query);
    const handler = () => onStoreChange();
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
