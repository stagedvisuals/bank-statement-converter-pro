/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://www.bscpro.nl/:path*',
        permanent: true,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://www.bscpro.nl',
  },
}

export default nextConfig
