import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBreadcrumbSchema, getProductSchema } from '@/lib/structured-data';
import { APP_CONFIG } from '@/constants';
import { getProductBySlug, getProductsForStaticParams } from '@/features/products/services/products.server';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getProductsForStaticParams();
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: `Producto no encontrado | ${APP_CONFIG.SITE_NAME}`,
    };
  }

  const description = product.meta_description || product.short_description || product.description || APP_CONFIG.SITE_DESCRIPTION;
  const image = product.images?.[0]?.url || '/og-image.png';

  return {
    title: `${product.name} | ${APP_CONFIG.SITE_NAME}`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
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
      <ProductDetailClient product={product} />
    </>
  );
}
