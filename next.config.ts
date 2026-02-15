import type { NextConfig } from "next";
import { resolve } from "path";
import createBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(import.meta.dirname || "."),
  },
};

export default withBundleAnalyzer(nextConfig);
