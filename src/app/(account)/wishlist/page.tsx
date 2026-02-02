'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/lib/utils';

/**
 * @ai-context Wishlist page showing user's saved products.
 */

// Mock wishlist data - replace with actual API integration
const mockWishlist = [
  {
    id: 1,
    product_id: 1,
    product: {
      id: 1,
      slug: 'producto-ejemplo-1',
      name: 'Producto Ejemplo 1',
      price: 29990,
      compare_at_price: 39990,
      images: [{ id: 1, url: '/images/placeholder-product.png', alt: 'Producto 1' }],
      stock: 10,
      is_new: true,
    },
  },
  {
    id: 2,
    product_id: 2,
    product: {
      id: 2,
      slug: 'producto-ejemplo-2',
      name: 'Producto Ejemplo 2',
      price: 49990,
      compare_at_price: null,
      images: [{ id: 2, url: '/images/placeholder-product.png', alt: 'Producto 2' }],
      stock: 5,
      is_new: false,
    },
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = async (itemId: number) => {
    setRemovingId(itemId);
    try {
      // TODO: Call API to remove from wishlist
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWishlistItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      // TODO: Call cart API
      console.log('Add to cart:', productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Lista de deseos
        </h2>
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tu lista de deseos está vacía
            </h3>
            <p className="text-gray-600 mb-6">
              Guarda tus productos favoritos para comprarlos más tarde
            </p>
            <Link href={ROUTES.PRODUCTS}>
              <Button>Explorar productos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lista de deseos</h2>
        <p className="text-sm text-gray-600">
          {wishlistItems.length} producto{wishlistItems.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => {
          const { product } = item;
          const hasDiscount =
            product.compare_at_price && product.compare_at_price > product.price;
          const discountPercentage = hasDiscount
            ? Math.round(
                ((product.compare_at_price! - product.price) /
                  product.compare_at_price!) *
                  100
              )
            : 0;

          return (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                {/* Product Image */}
                <Link href={ROUTES.PRODUCT_DETAIL(product.slug)}>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                    <img
                      src={product.images[0]?.url || '/images/placeholder-product.png'}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasDiscount && (
                      <Badge variant="danger" className="absolute left-2 top-2">
                        -{discountPercentage}%
                      </Badge>
                    )}
                    {product.is_new && (
                      <Badge variant="info" className="absolute left-2 top-12">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removingId === item.id}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-red-600 transition-colors disabled:opacity-50"
                  aria-label="Eliminar de favoritos"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <CardContent className="p-4">
                {/* Product Info */}
                <Link href={ROUTES.PRODUCT_DETAIL(product.slug)}>
                  <h3 className="font-medium text-gray-900 hover:text-primary transition-colors mb-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.compare_at_price!)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {product.stock === 0 ? (
                  <Badge variant="outline" className="mb-3">
                    Sin stock
                  </Badge>
                ) : product.stock < 10 ? (
                  <Badge variant="warning" className="mb-3">
                    Solo {product.stock} disponibles
                  </Badge>
                ) : (
                  <Badge variant="success" className="mb-3">
                    En stock
                  </Badge>
                )}

                {/* Add to Cart Button */}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
