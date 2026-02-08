import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose'],
  },
  webpack: config => {
    config.experiments = {
      topLevelAwait: true,
    }
    return config
  },
  allowedDevOrigins: ['*'],
  reactCompiler: true,
}

export default nextConfig
