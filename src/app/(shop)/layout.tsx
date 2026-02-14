import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { getOrganizationSchema, getWebsiteSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: {
    template: '%s | Le Pas Sage',
    default: 'Le Pas Sage | Tienda Online Premium',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebsiteSchema()),
        }}
      />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
