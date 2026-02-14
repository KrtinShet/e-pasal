import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@baazarify/ui', '@baazarify/storefront-builder'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
