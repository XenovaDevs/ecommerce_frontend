'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

/**
 * @ai-context Navigation component for header links.
 */

interface NavigationProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const navItems = [
  { label: 'Inicio', href: ROUTES.HOME },
  { label: 'Productos', href: ROUTES.PRODUCTS },
  { label: 'Categorías', href: ROUTES.CATEGORIES },
  { label: 'Contacto', href: ROUTES.CONTACT },
];

export function Navigation({ mobile = false, onItemClick }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-primary/10 text-primary'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
