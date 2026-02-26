/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  swcMinify: true,
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://www.bscpro.nl',
  },
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard',
      },
    ]
  },
}

export default nextConfig
