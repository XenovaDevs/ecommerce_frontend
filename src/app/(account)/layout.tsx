'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const accountNavigation = [
  { name: 'Mi perfil', href: ROUTES.PROFILE, icon: User },
  { name: 'Mis pedidos', href: ROUTES.ORDERS, icon: Package },
  { name: 'Direcciones', href: ROUTES.ADDRESSES, icon: MapPin },
  { name: 'Lista de deseos', href: ROUTES.WISHLIST, icon: Heart },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="mb-10 h-10 w-72 animate-shimmer rounded-xl bg-gradient-to-r from-sage-surface-light to-sage-surface" />
          <div className="grid gap-6 lg:grid-cols-4 lg:gap-10">
            <div className="h-80 animate-shimmer rounded-3xl bg-gradient-to-br from-sage-surface-light to-sage-surface" />
            <div className="h-96 animate-shimmer rounded-3xl bg-gradient-to-br from-sage-surface-light to-sage-surface lg:col-span-3" />
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 animate-slide-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-sage-cream sm:text-5xl">Mi cuenta</h1>
        <p className="mt-3 text-base text-sage-ivory/55 sm:text-lg">
          Gestiona tu perfil, pedidos y preferencias
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 lg:gap-10">
        <aside className="animate-slide-in-left lg:col-span-1">
          <Card variant="premium" className="lg:sticky lg:top-24">
            <CardContent className="p-6">
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                {accountNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 lg:w-full lg:text-base',
                        isActive
                          ? 'bg-gradient-to-r from-sage-gold/25 to-sage-gold/10 text-sage-gold ring-1 ring-sage-gold/30'
                          : 'text-sage-ivory/70 hover:bg-sage-surface-light hover:text-sage-cream'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                <div className="mt-4 border-t border-sage-surface-light/60 pt-4">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 lg:text-base"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar sesion
                  </button>
                </div>
              </nav>
            </CardContent>
          </Card>
        </aside>

        <main className="animate-slide-in-right lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
