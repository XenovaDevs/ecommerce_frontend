import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lepasage.com';

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic product pages - fetch from API at build time
  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const [productsRes, categoriesRes] = await Promise.allSettled([
      fetch(`${apiUrl}/products?per_page=100`),
      fetch(`${apiUrl}/categories`),
    ]);

    if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
      const productsData = await productsRes.value.json();
      const products = productsData.data || [];
      productRoutes = products.map((product: { slug: string; updated_at?: string }) => ({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
      const categoriesData = await categoriesRes.value.json();
      const categories = categoriesData.data || [];
      categoryRoutes = categories.map((category: { slug: string; updated_at?: string }) => ({
        url: `${siteUrl}/categories/${category.slug}`,
        lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Silently continue with static routes only
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
