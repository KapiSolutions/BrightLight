/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
  i18n: {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
