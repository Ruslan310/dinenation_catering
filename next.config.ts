import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Оптимизация для продакшена
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'export',
}

export default nextConfig
