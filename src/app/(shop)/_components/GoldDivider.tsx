'use client';

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sage-gold/40 to-transparent" />
      <div className="h-1.5 w-1.5 rotate-45 bg-sage-gold" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sage-gold/40 to-transparent" />
    </div>
  );
}
