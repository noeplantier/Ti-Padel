/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Configuration Turbopack (vide pour utiliser les valeurs par défaut)
  turbopack: {},

  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig