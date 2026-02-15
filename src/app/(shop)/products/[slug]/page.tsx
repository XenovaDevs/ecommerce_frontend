'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Truck, Shield, ChevronLeft } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';
import { getProductSchema, getBreadcrumbSchema } from '@/lib/structured-data';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { useProduct } from '@/features/products';
import { useCart } from '@/features/cart';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;

  const { product, isLoading, error } = useProduct(slug);
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Le Pas Sage`;
    }
  }, [product]);

  if (error) {
    return notFound();
  }

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="mb-10 h-8 w-40 rounded-lg bg-gradient-to-r from-sage-surface-light to-sage-surface animate-shimmer" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer shadow-lg" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-10 w-3/4 rounded-lg bg-sage-surface-light animate-pulse" />
              <div className="h-8 w-1/3 rounded-lg bg-sage-surface-light animate-pulse" />
              <div className="h-24 rounded-xl bg-sage-surface-light animate-pulse" />
              <div className="h-14 rounded-xl bg-sage-surface-light animate-pulse" />
              <div className="h-12 rounded-xl bg-sage-surface-light animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const mainImage = product.images[selectedImage]?.url || '/images/placeholder-product.svg';
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addItem({
        product_id: product.id,
        quantity,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-sage-gold/[0.04] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductSchema(product)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBreadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'Productos', url: '/products' },
              ...(product.category ? [{ name: product.category.name, url: `/categories/${product.category.slug}` }] : []),
              { name: product.name, url: `/products/${product.slug}` },
            ])),
          }}
        />

        <div className="mb-10 animate-slide-up">
          <Link
            href={ROUTES.PRODUCTS}
            className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-sage-ivory/60 transition-colors hover:text-sage-gold"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver a productos
          </Link>
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 text-sm text-sage-ivory/45">
            <Link href={ROUTES.HOME} className="hover:text-sage-gold transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href={ROUTES.PRODUCTS} className="hover:text-sage-gold transition-colors">
              Productos
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={ROUTES.CATEGORY_DETAIL(product.category.slug)}
                  className="hover:text-sage-gold transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="font-medium text-sage-cream">{product.name}</span>
          </nav>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-slide-in-left">
            <div className="group relative mb-4 aspect-square overflow-hidden rounded-3xl border border-sage-surface-light bg-gradient-to-br from-sage-surface-light to-sage-surface-hover shadow-xl">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {hasDiscount && (
                <Badge variant="glow-gold" size="lg" className="absolute left-5 top-5 shadow-2xl">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.is_new && (
                <Badge variant="gradient-sage" size="lg" className="absolute left-5 top-16" pulse>
                  Nuevo
                </Badge>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImage === index
                        ? 'border-sage-gold shadow-gold'
                        : 'border-sage-surface-hover hover:border-sage-gold/40'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="animate-slide-in-right">
            <h1 className="font-display text-3xl font-bold leading-tight text-sage-cream sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 sm:gap-4">
              <span className="text-3xl font-bold text-sage-cream sm:text-4xl lg:text-5xl">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-sage-ivory/35 line-through sm:text-2xl">
                  {formatCurrency(product.compare_at_price!)}
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="mt-6 text-lg leading-relaxed text-sage-ivory/60">{product.short_description}</p>
            )}

            <div className="mt-8">
              {isOutOfStock ? (
                <Badge variant="danger" size="lg" className="text-sm">
                  Sin stock
                </Badge>
              ) : product.stock < 10 ? (
                <Badge variant="warning" size="lg" pulse className="text-sm">
                  Solo {product.stock} unidades disponibles
                </Badge>
              ) : (
                <Badge variant="success" size="lg" className="text-sm">
                  En stock
                </Badge>
              )}
            </div>

            {!isOutOfStock && (
              <div className="mt-8">
                <label className="mb-3 block text-base font-semibold text-sage-cream">
                  Cantidad
                </label>
                <div className="inline-flex items-center rounded-xl border border-sage-surface-hover bg-sage-surface-light shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-l-xl px-4 py-3 text-sage-ivory/70 transition-colors hover:bg-sage-surface-hover hover:text-sage-cream sm:px-5"
                  >
                    <span className="text-lg font-semibold">-</span>
                  </button>
                  <span className="w-16 text-center text-base font-bold text-sage-cream">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="rounded-r-xl px-4 py-3 text-sage-ivory/70 transition-colors hover:bg-sage-surface-hover hover:text-sage-cream sm:px-5"
                  >
                    <span className="text-lg font-semibold">+</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="xl"
                variant="gold"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                isLoading={isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold sm:w-auto"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold sm:w-auto"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10 space-y-4 rounded-2xl border border-sage-surface-light bg-sage-surface p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-gold/15 text-sage-gold">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-sage-cream">Envio a todo el pais</p>
                  <p className="text-sm text-sage-ivory/55">Recibelo en 3-5 dias habiles</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-gold/15 text-sage-gold">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-sage-cream">Compra protegida</p>
                  <p className="text-sm text-sage-ivory/55">Garantia de devolucion de 30 dias</p>
                </div>
              </div>
            </div>

            {product.sku && (
              <p className="mt-6 text-sm font-medium text-sage-ivory/45">
                Codigo: <span className="text-sage-ivory/70">{product.sku}</span>
              </p>
            )}
          </div>
        </div>

        {product.description && (
          <Card variant="elevated" className="mt-16 animate-fade-in border border-sage-surface-light bg-sage-surface">
            <CardContent className="p-8 lg:p-10">
              <h2 className="mb-6 font-display text-2xl font-bold text-sage-cream lg:text-3xl">
                Descripcion del producto
              </h2>
              <div
                className="prose prose-lg prose-invert max-w-none text-sage-ivory/60 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
              />
            </CardContent>
          </Card>
        )}

        <div className="mt-20 animate-fade-in">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-sage-cream lg:text-4xl">
                Productos relacionados
              </h2>
              <p className="mt-2 text-sage-ivory/55">Tambien te puede interesar</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer shadow-sm transition-all duration-300 hover:shadow-gold-glow hover-lift" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-sage-surface-light animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-sage-surface-light animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
