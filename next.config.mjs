/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'www.bscpro.nl', 'bscpro.nl'],
  },
  // Environment variables are loaded from .env.local
  // Use process.env.NEXT_PUBLIC_SITE_URL in your code
}

export default nextConfig
