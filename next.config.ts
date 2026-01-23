import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  /* config options here */
  reactCompiler: true,
}

export default nextConfig
