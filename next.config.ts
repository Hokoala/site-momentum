import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'postprocessing'],
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
