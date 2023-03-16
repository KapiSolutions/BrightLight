/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
  i18n: {
    locales: ["default", "en", "pl"],
    defaultLocale: "default",
    localeDetection: false,
  },
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; form-action 'self'; style-src 'self'; script-src 'self' 'https://firestore.googleapis.com' 'https://securetoken.googleapis.com' 'https://google-analytics.com' 'https://ajax.googleapis.com' 'https://googletagmanager.com' 'https://identitytoolkit.googleapis.com' 'https://cdn.lr-in-prod.com' 'https://vitals.vercel-insights.com/' ;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // {
          //   key: 'Permissions-Policy',
          //   value: "camera=(); battery=(self); geolocation=(); microphone=('https://a-domain.com')",
          // },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
