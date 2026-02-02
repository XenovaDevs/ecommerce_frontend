'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

/**
 * @ai-context Account layout with sidebar navigation for user account pages.
 */

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
          <div className="h-10 w-72 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-shimmer mb-10" />
          <div className="grid lg:grid-cols-4 gap-10">
            <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl animate-shimmer shadow-lg" />
            <div className="lg:col-span-3 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl animate-shimmer shadow-lg" />
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
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Mi cuenta</h1>
        <p className="mt-3 text-lg text-gray-600">
          Gestiona tu perfil y preferencias
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 animate-slide-in-left">
          <Card variant="elevated" className="sticky top-24">
            <CardContent className="p-6">
              <nav className="space-y-2">
                {accountNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-primary to-primary/70 text-white shadow-lg shadow-primary/25'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar sesión
                  </button>
                </div>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 animate-slide-in-right">{children}</main>
      </div>
    </div>
  );
}
