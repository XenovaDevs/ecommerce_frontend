import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explorá nuestra colección completa de productos premium. Filtros avanzados, envío a todo el país.',
  openGraph: {
    title: 'Productos | Le Pas Sage',
    description: 'Explorá nuestra colección completa de productos premium.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
