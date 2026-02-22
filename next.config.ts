import type { NextConfig } from "next";
import { resolve } from "path";
import createBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isProduction = process.env.NODE_ENV === 'production';
const normalizeBasePath = (value: string | undefined): string => {
  if (!value || value === '/') {
    return '';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
};
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_APP_BASE_PATH);
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const apiOrigin = (() => {
  try {
    return new URL(apiUrl).origin;
  } catch {
    return 'http://localhost:8000';
  }
})();
const parsedApiOrigin = new URL(apiOrigin);

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  turbopack: {
    root: resolve(import.meta.dirname || "."),
  },
  images: {
    dangerouslyAllowLocalIP: !isProduction,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: parsedApiOrigin.protocol.replace(':', '') as 'http' | 'https',
        hostname: parsedApiOrigin.hostname,
        port: parsedApiOrigin.port || undefined,
        pathname: '/storage/**',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
