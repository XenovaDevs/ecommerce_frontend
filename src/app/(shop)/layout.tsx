import { Header, Footer } from '@/components/layout';

/**
 * @ai-context Shop layout with header and footer.
 *             Used for all public shop pages.
 */

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
