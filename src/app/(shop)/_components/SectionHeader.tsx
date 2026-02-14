'use client';

import { GoldDivider } from './GoldDivider';
import ShinyText from '@/components/reactbits/TextAnimations/ShinyText/ShinyText';
import SplitText from '@/components/reactbits/TextAnimations/SplitText/SplitText';

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
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <ShinyText
        text={eyebrow}
        className="text-xs font-semibold uppercase tracking-[0.25em]"
        color="rgb(191, 155, 96)"
        shineColor="rgb(217, 191, 145)"
        speed={3}
        spread={120}
      />
      <SplitText
        text={title}
        tag="h2"
        className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] leading-[1.1] ${
          light ? 'text-sage-white' : 'text-sage-black'
        }`}
        delay={60}
        duration={0.8}
        splitType="words"
        textAlign={align === 'center' ? 'center' : 'left'}
        from={{ opacity: 0, y: 30 }}
        to={{ opacity: 1, y: 0 }}
      />
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
