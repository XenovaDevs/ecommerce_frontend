import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Navegá nuestras categorías y encontrá exactamente lo que buscás. Colecciones curadas de productos premium.',
  openGraph: {
    title: 'Categorías | Le Pas Sage',
    description: 'Navegá nuestras categorías y encontrá lo que buscás.',
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
