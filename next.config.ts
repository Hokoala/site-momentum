import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  transpilePackages: ['three', 'postprocessing'],
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.js',
    },
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'canvas',
    });
    return config;
  },
};

export default nextConfig;
