'use client';

import { useInView } from '@/hooks/useInView';
import { GoldDivider } from './GoldDivider';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeaderProps) {
  const { ref, isInView } = useInView();
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div
      ref={ref}
      className={`max-w-2xl ${alignClass} transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
        {eyebrow}
      </span>
      <h2
        className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] leading-[1.1] ${
          light ? 'text-sage-white' : 'text-sage-black'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {description}
        </p>
      )}
      <GoldDivider className="mt-6 max-w-[120px] mx-auto" />
    </div>
  );
}
