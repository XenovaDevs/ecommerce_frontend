'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';
import { useAuth, type User as UserType } from '@/features/auth';

/**
 * @ai-context User dropdown menu in header.
 */

interface UserMenuProps {
  user: UserType;
}

const menuItems = [
  { label: UIMessages.ACCOUNT.PROFILE, href: ROUTES.PROFILE, icon: User },
  { label: UIMessages.ORDERS.MY_ORDERS, href: ROUTES.ORDERS, icon: Package },
  { label: UIMessages.ACCOUNT.WISHLIST, href: ROUTES.WISHLIST, icon: Heart },
  { label: UIMessages.ACCOUNT.ADDRESSES, href: ROUTES.ADDRESSES, icon: MapPin },
];

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </div>
        <span className="hidden sm:inline">{user.first_name}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-sage-surface-light bg-card py-1 shadow-elegant-lg">
          {/* User info */}
          <div className="border-b border-sage-surface-light px-4 py-3">
            <p className="text-sm font-medium text-card-foreground">{user.full_name}</p>
            <p className="text-xs text-sage-ivory/60">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-sage-ivory/75 transition-sophisticated hover:bg-sage-surface-light hover:text-sage-cream"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-sage-surface-light py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 transition-sophisticated hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              {UIMessages.AUTH.LOGOUT}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
