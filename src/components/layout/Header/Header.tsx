'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { ROUTES, APP_CONFIG } from '@/constants';
import { UIMessages } from '@/messages';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart';
import { Navigation } from './Navigation';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth();
  const { itemCount } = useCart();

  const cartItemsCount = itemCount;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sage-gold/10 bg-background/90 backdrop-blur-xl transition-sophisticated">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sage-gold focus:px-4 focus:py-2 focus:text-sage-black focus:shadow-elegant-lg"
      >
        Saltar al contenido principal
      </a>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={ROUTES.HOME}
              className="flex items-center group transition-smooth"
            >
              <span className="text-xl font-bold text-sage-cream tracking-tighter">
                {APP_CONFIG.SITE_NAME}
              </span>
              <span className="ml-2 h-4 w-px bg-sage-gold opacity-0 group-hover:opacity-100 transition-sophisticated" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Search - Desktop */}
          <div className="hidden flex-1 max-w-md mx-8 lg:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-ivory/40 transition-sophisticated group-focus-within:text-sage-gold" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full rounded-lg border border-sage-surface-light bg-sage-surface py-2 pl-10 pr-4 text-sm text-sage-cream placeholder:text-sage-ivory/30 focus:border-sage-gold/40 focus:bg-sage-surface-light focus:outline-none focus:ring-2 focus:ring-sage-gold/10 transition-sophisticated"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link
              href={ROUTES.WISHLIST}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-sage-ivory/60 hover:bg-sage-surface-light hover:text-sage-gold transition-sophisticated"
              aria-label="Lista de deseos"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <ThemeToggle className="hidden sm:flex" />

            {/* Cart */}
            <Link
              href={ROUTES.CART}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-sage-ivory/60 hover:bg-sage-surface-light hover:text-sage-gold transition-sophisticated"
              aria-label={`Carrito${cartItemsCount > 0 ? `, ${cartItemsCount} productos` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-gold text-xs font-semibold text-sage-black shadow-gold">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu / Login */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <UserMenu user={user} />
                ) : (
                  <Link href={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                      <User className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{UIMessages.AUTH.LOGIN}</span>
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'lg:hidden transition-sophisticated overflow-hidden',
          isMobileMenuOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-sage-gold/10 bg-sage-surface/95 px-4 py-4 backdrop-blur-xl">
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-ivory/40 transition-sophisticated group-focus-within:text-sage-gold" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full rounded-lg border border-sage-surface-light bg-sage-surface-light py-2 pl-10 pr-4 text-sm text-sage-cream placeholder:text-sage-ivory/30 focus:border-sage-gold/40 focus:outline-none focus:ring-2 focus:ring-sage-gold/10 transition-sophisticated"
              />
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-sage-surface-light bg-sage-surface-light/70 p-3">
            <ThemeToggle compact={false} />
          </div>

          <Navigation mobile onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}
