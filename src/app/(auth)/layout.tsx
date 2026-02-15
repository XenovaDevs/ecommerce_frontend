import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG, ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Autenticacion',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8 sm:py-12">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sage-gold/[0.08] blur-[90px]" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sage-gold/[0.06] blur-[90px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 0.8px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 w-full text-center">
        <Link href={ROUTES.HOME} className="group inline-block">
          <span className="font-display text-3xl font-bold tracking-tight text-sage-cream sm:text-4xl">
            {APP_CONFIG.SITE_NAME}
          </span>
          <span className="mx-auto mt-1 block h-px w-0 bg-sage-gold transition-all duration-500 group-hover:w-full" />
        </Link>

        <p className="mx-auto mt-3 max-w-md text-sm text-sage-ivory/45">
          Accede a tu cuenta para gestionar pedidos, direcciones y favoritos.
        </p>
      </div>

      <main className="relative z-10 mt-8 w-full max-w-md sm:max-w-lg">{children}</main>

      <p className="relative z-10 mt-8 px-4 text-center text-xs text-sage-ivory/35">
        &copy; {new Date().getFullYear()} {APP_CONFIG.SITE_NAME}. Todos los derechos reservados.
      </p>
    </div>
  );
}
