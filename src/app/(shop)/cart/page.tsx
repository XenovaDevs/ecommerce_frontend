import type { Metadata } from 'next';
import { CartPageContent } from '@/features/cart/components/CartPageContent';

export const metadata: Metadata = {
  title: 'Carrito de compras',
  description: 'Tu carrito de compras',
};

export default function CartPage() {
  return <CartPageContent />;
}
