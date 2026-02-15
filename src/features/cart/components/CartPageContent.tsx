'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types';

function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 animate-slide-up">
        <div className="mb-3 h-10 w-56 rounded-lg bg-gradient-to-r from-sage-surface-light to-sage-surface animate-shimmer" />
        <div className="h-6 w-80 rounded-lg bg-gradient-to-r from-sage-surface-light to-sage-surface animate-shimmer" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="space-y-6 lg:col-span-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} variant="elevated" className="border border-sage-surface-light bg-sage-surface">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
                <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer sm:h-32 sm:w-32" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 rounded-lg bg-sage-surface-light animate-pulse" />
                  <div className="h-4 w-24 rounded-lg bg-sage-surface-light animate-pulse" />
                  <div className="h-10 w-32 rounded-lg bg-sage-surface-light animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card variant="glass" className="border border-sage-surface-light bg-sage-surface">
          <CardContent className="p-8">
            <div className="h-8 w-48 rounded-lg bg-sage-surface-light animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CartPageContent() {
  const { items, totals, isLoading, updateItem, removeItem, clearCart } = useCart();
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const isEmpty = items.length === 0;

  const handleQuantityChange = async (item: CartItem, nextQuantity: number) => {
    if (pendingItemId) return;

    const maxStock = item.product.stock > 0 ? item.product.stock : undefined;
    const boundedQuantity = maxStock ? Math.min(nextQuantity, maxStock) : nextQuantity;

    setPendingItemId(item.id);
    try {
      if (boundedQuantity <= 0) {
        await removeItem(item.id);
      } else {
        await updateItem(item.id, boundedQuantity);
      }
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (pendingItemId) return;

    setPendingItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setPendingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-20 w-20 text-sage-ivory/35" />}
          title={UIMessages.CART.EMPTY}
          description="Agrega productos a tu carrito para continuar comprando"
          action={
            <Link href={ROUTES.PRODUCTS}>
              <Button size="xl" variant="gold">
                {UIMessages.CART.EMPTY_CTA}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-sage-gold/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-sage-cream sm:text-5xl">{UIMessages.CART.TITLE}</h1>
          <p className="mt-3 text-base text-sage-ivory/55 sm:text-lg">
            {items.length} producto{items.length !== 1 ? 's' : ''} en tu carrito
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-6 lg:col-span-2 animate-slide-in-left">
            {items.map((item) => {
              const isPending = pendingItemId === item.id;
              const lineTotal = item.product.price * item.quantity;
              const maxStock = item.product.stock > 0 ? item.product.stock : undefined;
              const imageUrl = item.product.image || '/images/placeholder-product.svg';

              return (
                <Card key={item.id} variant="elevated" hoverable className="group border border-sage-surface-light bg-sage-surface">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
                    <Link
                      href={item.product.slug ? ROUTES.PRODUCT_DETAIL(item.product.slug) : ROUTES.PRODUCTS}
                      className="h-28 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover sm:h-32 sm:w-32"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={item.product.slug ? ROUTES.PRODUCT_DETAIL(item.product.slug) : ROUTES.PRODUCTS}
                            className="text-lg font-semibold text-sage-cream hover:text-sage-gold"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-sage-ivory/45">
                            {formatCurrency(item.product.price)} c/u
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isPending}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-sage-ivory/40 transition-all duration-200 hover:bg-red-950/30 hover:text-red-300 disabled:opacity-50"
                          aria-label="Eliminar del carrito"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex items-center rounded-xl border border-sage-surface-hover bg-sage-surface-light shadow-sm">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={isPending}
                            className="rounded-l-xl px-4 py-2 text-sage-ivory/70 transition-colors hover:bg-sage-surface-hover hover:text-sage-cream disabled:opacity-50"
                            aria-label="Disminuir cantidad"
                          >
                            <span className="text-lg font-semibold">-</span>
                          </button>
                          <span className="w-12 text-center text-base font-bold text-sage-cream">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={isPending || (maxStock !== undefined && item.quantity >= maxStock)}
                            className="rounded-r-xl px-4 py-2 text-sage-ivory/70 transition-colors hover:bg-sage-surface-hover hover:text-sage-cream disabled:opacity-50"
                            aria-label="Aumentar cantidad"
                          >
                            <span className="text-lg font-semibold">+</span>
                          </button>
                        </div>
                        <span className="text-lg font-bold text-sage-cream sm:text-xl">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 text-sm font-semibold text-sage-gold transition-all duration-200 hover:gap-3"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                {UIMessages.CART.CONTINUE_SHOPPING}
              </Link>

              <Button
                variant="ghost"
                onClick={handleClearCart}
                isLoading={isClearing}
                disabled={isClearing}
                className="w-full text-red-300 hover:bg-red-950/30 hover:text-red-200 sm:w-auto"
              >
                Vaciar carrito
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit animate-slide-in-right">
            <Card variant="glass" className="border border-sage-surface-light bg-sage-surface">
              <CardContent className="p-8">
                <h2 className="font-display text-2xl font-bold text-sage-cream">
                  {UIMessages.CHECKOUT.ORDER_SUMMARY}
                </h2>

                <div className="mt-8 space-y-4 border-t border-sage-surface-hover pt-6">
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-sage-ivory/55">{UIMessages.CART.SUBTOTAL}</span>
                    <span className="font-semibold text-sage-cream">{formatCurrency(totals.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="font-medium text-sage-ivory/55">{UIMessages.CART.SHIPPING}</span>
                    <span className="font-semibold text-sage-cream">A calcular</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-base text-green-300">
                      <span className="font-medium">Descuento</span>
                      <span className="font-semibold">-{formatCurrency(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-sage-surface-hover pt-4">
                    <span className="text-xl font-bold text-sage-cream">{UIMessages.CART.TOTAL}</span>
                    <span className="text-2xl font-bold text-sage-gold">{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                <Link href={ROUTES.CHECKOUT}>
                  <Button className="mt-8 w-full" size="xl" variant="gold">
                    {UIMessages.CART.CHECKOUT}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="mt-6 text-center text-sm leading-relaxed text-sage-ivory/45">
                  Impuestos incluidos. Envio calculado en el checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
