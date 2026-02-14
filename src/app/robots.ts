import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lepasage.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/profile/', '/orders/', '/addresses/', '/wishlist/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
