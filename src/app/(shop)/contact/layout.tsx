import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponete en contacto con Le Pas Sage. Estamos para ayudarte con consultas, pedidos y soporte.',
  openGraph: {
    title: 'Contacto | Le Pas Sage',
    description: 'Ponete en contacto con Le Pas Sage.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
