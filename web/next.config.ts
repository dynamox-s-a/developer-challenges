import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*'],
  reactCompiler: true,
  output: 'standalone'
}

export default nextConfig
