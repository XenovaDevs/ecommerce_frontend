import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { APP_CONFIG } from '@/constants';
import { AuthProvider } from '@/features/auth';
import { CartProvider } from '@/features/cart';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.SITE_NAME,
    template: `%s | ${APP_CONFIG.SITE_NAME}`,
  },
  description: APP_CONFIG.SITE_DESCRIPTION,
  keywords: ['ecommerce', 'tienda online', 'compras'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
