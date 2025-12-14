/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['ti-padel.com', 'www.ti-padel.com'],
  },
  outputFileTracingRoot: process.cwd(),
  experimental: {
    esmExternals: false
  },
  
  // Configuration pour éviter les boucles de redirection
  async redirects() {
    return [
      // Redirection WWW vers non-WWW (ou inversement selon votre préférence)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.ti-padel.com',
          },
        ],
        destination: 'https://ti-padel.com/:path*',
        permanent: true,
      },
    ]
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Important: Désactiver le trailing slash qui peut causer des redirections
  trailingSlash: false,
  
  // Éviter les redirections automatiques de Next.js
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig