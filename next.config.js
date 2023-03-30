/** @type {import('next').NextConfig} */
let prod = process.env.NODE_ENV == "production";
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
        source: "/:path*",
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
              `default-src 'self' https://js.stripe.com https://vitals.vercel-insights.com https://www.google.com/recaptcha/ https://brightlight-443b7.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://aztro.sameerkumar.website https://translate.googleapis.com https://api.api-ninjas.com https://www.google.com/images/cleardot.gif; form-action 'self'; frame-src 'self' https://ko-fi.com/brightlightgypsy/ ; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' https://firebasestorage.googleapis.com data: ; script-src 'self' ${prod ? "" : "'unsafe-eval'"} https://js.stripe.com https://apis.google.com https://firestore.googleapis.com https://securetoken.googleapis.com https://google-analytics.com https://ajax.googleapis.com https://www.googletagmanager.com https://identitytoolkit.googleapis.com https://cdn.lr-in-prod.com https://vitals.vercel-insights.com/ https://pagead2.googlesyndication.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ ;`,
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
