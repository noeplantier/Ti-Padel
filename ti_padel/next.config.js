/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint pendant le build
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  outputFileTracingRoot: process.cwd(),
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig