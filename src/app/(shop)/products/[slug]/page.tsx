'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Truck, Shield, ChevronLeft } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { useProduct } from '@/features/products';
import { useCart } from '@/features/cart';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants';

/**
 * @ai-context Product detail page showing full product information.
 */

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

  if (error) {
    return notFound();
  }

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="h-8 w-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-shimmer mb-10" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl animate-shimmer shadow-lg" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
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

  const mainImage = product.images[selectedImage]?.url || '/images/placeholder-product.png';
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Button & Breadcrumb */}
      <div className="mb-10 animate-slide-up">
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group mb-4"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver a productos
        </Link>
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href={ROUTES.PRODUCTS} className="hover:text-primary transition-colors">
            Productos
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={ROUTES.CATEGORY_DETAIL(product.category.slug)}
                className="hover:text-primary transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="animate-slide-in-left">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 mb-4 shadow-xl border border-gray-100 group">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {hasDiscount && (
              <Badge variant="glow" size="lg" className="absolute left-5 top-5 shadow-2xl">
                -{discountPercentage}%
              </Badge>
            )}
            {product.is_new && (
              <Badge variant="gradient-sage" size="lg" className="absolute left-5 top-16" pulse>
                Nuevo
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === index
                      ? 'border-primary shadow-lg ring-2 ring-primary/20'
                      : 'border-gray-200 hover:border-gray-300 shadow-sm'
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

        {/* Product Info */}
        <div className="animate-slide-in-right">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight lg:text-5xl">{product.name}</h1>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-bold text-gray-900 lg:text-5xl">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-2xl text-gray-400 line-through">
                {formatCurrency(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">{product.short_description}</p>
          )}

          {/* Stock Status */}
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

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="mt-8">
              <label className="mb-3 block text-base font-semibold text-gray-900">
                Cantidad
              </label>
              <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-l-xl"
                >
                  <span className="text-lg font-semibold">−</span>
                </button>
                <span className="w-16 text-center text-base font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-5 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-r-xl"
                >
                  <span className="text-lg font-semibold">+</span>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 flex gap-4">
            <Button
              size="xl"
              variant="gradient-sage"
              className="flex-1 shadow-xl shadow-primary/20"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              isLoading={isAddingToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
            <Button size="xl" variant="outline" className="shadow-sm hover:shadow-md">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline" className="shadow-sm hover:shadow-md">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Envío a todo el país</p>
                <p className="text-sm text-gray-600">Recíbelo en 3-5 días hábiles</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Compra protegida</p>
                <p className="text-sm text-gray-600">Garantía de devolución de 30 días</p>
              </div>
            </div>
          </div>

          {/* SKU */}
          {product.sku && (
            <p className="mt-6 text-sm font-medium text-gray-500">
              Código: <span className="text-gray-700">{product.sku}</span>
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <Card variant="elevated" className="mt-16 animate-fade-in">
          <CardContent className="p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 lg:text-3xl">
              Descripción del producto
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </CardContent>
        </Card>
      )}

      {/* Related Products Placeholder */}
      <div className="mt-20 animate-fade-in">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
              Productos relacionados
            </h2>
            <p className="mt-2 text-gray-600">
              También te puede interesar
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-shimmer shadow-sm hover:shadow-xl transition-all duration-300 hover-lift" />
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
