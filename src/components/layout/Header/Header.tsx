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
import { UserMenu } from './UserMenu';

/**
 * @ai-context Sophisticated Header component for Le Pas Sage ecommerce.
 *             Implements minimalist black/white/gold design with luxury aesthetic.
 * @ai-flow
 *   1. Renders logo, navigation, search, cart icon, user menu
 *   2. Mobile: hamburger menu toggles navigation drawer with smooth animation
 *   3. Auth state determines user menu vs login button
 *   4. Sticky header with backdrop blur for premium feel
 * @ai-a11y
 *   - Skip to main content link with focus state
 *   - Mobile menu properly announced
 *   - Cart badge with descriptive aria-label
 *   - All interactive elements keyboard accessible
 * @ai-security
 *   - User authentication state checked before rendering sensitive UI
 */

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth();
  const { itemCount } = useCart();

  const cartItemsCount = itemCount;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sage-gray-200 bg-sage-white/95 backdrop-blur-md transition-sophisticated">
      {/* Skip to main content - Enhanced visibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sage-black focus:px-4 focus:py-2 focus:text-sage-white focus:shadow-elegant-lg"
      >
        Saltar al contenido principal
      </a>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Sophisticated typography */}
          <div className="flex items-center">
            <Link
              href={ROUTES.HOME}
              className="flex items-center group transition-smooth"
            >
              <span className="text-xl font-bold text-sage-black tracking-tighter">
                {APP_CONFIG.SITE_NAME}
              </span>
              <span className="ml-2 h-4 w-px bg-sage-gold opacity-0 group-hover:opacity-100 transition-sophisticated" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Search - Desktop - Refined styling */}
          <div className="hidden flex-1 max-w-md mx-8 lg:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-gray-400 transition-sophisticated group-focus-within:text-sage-black" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full rounded-lg border border-sage-gray-300 bg-sage-gray-50 py-2 pl-10 pr-4 text-sm text-sage-black placeholder:text-sage-gray-400 focus:border-sage-black focus:bg-sage-white focus:outline-none focus:ring-2 focus:ring-sage-black/10 transition-sophisticated"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist - Sophisticated styling */}
            <Link
              href={ROUTES.WISHLIST}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-sage-gray-600 hover:bg-sage-gray-100 hover:text-sage-black transition-sophisticated"
              aria-label="Lista de deseos"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart - Enhanced with gold badge */}
            <Link
              href={ROUTES.CART}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-sage-gray-600 hover:bg-sage-gray-100 hover:text-sage-black transition-sophisticated"
              aria-label={`Carrito${cartItemsCount > 0 ? `, ${cartItemsCount} productos` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-gold text-xs font-semibold text-sage-white shadow-gold">
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
                    <Button variant="ghost" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      {UIMessages.AUTH.LOGIN}
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

      {/* Mobile Navigation - Enhanced animation */}
      <div
        className={cn(
          'lg:hidden transition-sophisticated overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-sage-gray-200 px-4 py-4 bg-sage-gray-50/50 backdrop-blur-sm">
          {/* Mobile Search - Refined styling */}
          <div className="mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-gray-400 transition-sophisticated group-focus-within:text-sage-black" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full rounded-lg border border-sage-gray-300 bg-sage-white py-2 pl-10 pr-4 text-sm text-sage-black placeholder:text-sage-gray-400 focus:border-sage-black focus:outline-none focus:ring-2 focus:ring-sage-black/10 transition-sophisticated"
              />
            </div>
          </div>
          <Navigation mobile onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}
