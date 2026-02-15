import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import { APP_CONFIG } from '@/constants';
import { AuthProvider } from '@/features/auth';
import { CartProvider } from '@/features/cart';
import { ThemeProvider } from '@/features/theme';
import {
  THEME_COOKIE_NAME,
  THEME_MEDIA_QUERY,
  THEME_STORAGE_KEY,
} from '@/features/theme/constants';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lepasage.com';

const themeInitializerScript = `
  (() => {
    const THEME_STORAGE_KEY = '${THEME_STORAGE_KEY}';
    const THEME_COOKIE_NAME = '${THEME_COOKIE_NAME}';
    const THEMES = new Set(['system', 'dark', 'light']);

    const getPreferenceFromCookie = () => {
      const match = document.cookie.match(new RegExp('(?:^|; )' + THEME_COOKIE_NAME + '=([^;]*)'));
      return match && match[1] ? decodeURIComponent(match[1]) : null;
    };

    const normalizePreference = (value) => (THEMES.has(value) ? value : 'system');

    try {
      const fromStorage = window.localStorage.getItem(THEME_STORAGE_KEY);
      const rawPreference = fromStorage || getPreferenceFromCookie() || 'system';
      const preference = normalizePreference(rawPreference);
      const isSystemDark = window.matchMedia('${THEME_MEDIA_QUERY}').matches;
      const resolved = preference === 'system' ? (isSystemDark ? 'dark' : 'light') : preference;

      const root = document.documentElement;
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
    } catch {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.style.colorScheme = 'dark';
    }
  })();
`;

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
