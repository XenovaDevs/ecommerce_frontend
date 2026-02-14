import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG, ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Autenticación',
};

/**
 * @ai-context Auth layout - centered card layout without header/footer.
 *             Used for login, register, forgot password pages.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      {/* Logo */}
      <Link href={ROUTES.HOME} className="mb-8">
        <span className="text-2xl font-bold text-primary">
          {APP_CONFIG.SITE_NAME}
        </span>
      </Link>

      {/* Content */}
      <main className="w-full max-w-md sm:max-w-lg">{children}</main>

      {/* Footer */}
      <p className="mt-8 px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {APP_CONFIG.SITE_NAME}. Todos los derechos reservados.
      </p>
    </div>
  );
}
