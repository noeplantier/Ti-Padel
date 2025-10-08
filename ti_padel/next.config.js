/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Correction pour le workspace root
  outputFileTracingRoot: process.cwd(),
  // Suppression de l'option invalide suppressHydrationWarning
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig