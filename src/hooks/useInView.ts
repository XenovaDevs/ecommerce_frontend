'use client';

import { useState, useRef, useCallback } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView({
  threshold = 0.15,
  rootMargin = '0px',
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || (triggerOnce && isInView)) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const visible = entry.isIntersecting;
          setIsInView(visible);
          if (visible && triggerOnce) {
            observerRef.current?.disconnect();
          }
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, triggerOnce, isInView]
  );

  return { ref, isInView };
}
