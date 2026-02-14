import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
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

const playfairDisplay = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lepasage.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_CONFIG.SITE_NAME} | Tienda Online Premium`,
    template: `%s | ${APP_CONFIG.SITE_NAME}`,
  },
  description: 'Le Pas Sage: tienda online de productos premium con envío a todo el país. Calidad excepcional, diseño sofisticado y atención personalizada.',
  keywords: [
    'le pas sage', 'tienda online', 'productos premium', 'ecommerce argentina',
    'compras online', 'envío gratis', 'calidad premium', 'diseño sofisticado',
  ],
  authors: [{ name: 'Le Pas Sage' }],
  creator: 'Le Pas Sage',
  publisher: 'Le Pas Sage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteUrl,
    siteName: APP_CONFIG.SITE_NAME,
    title: `${APP_CONFIG.SITE_NAME} | Tienda Online Premium`,
    description: 'Descubrí nuestra selección curada de productos premium. Calidad excepcional, diseño sofisticado.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${APP_CONFIG.SITE_NAME} - Tienda Online Premium`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.SITE_NAME} | Tienda Online Premium`,
    description: 'Descubrí nuestra selección curada de productos premium. Calidad excepcional, diseño sofisticado.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} min-h-screen antialiased`}
      >
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
