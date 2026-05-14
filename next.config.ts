import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build at .next/standalone so the Docker image
  // can ship without node_modules. Required by the GHCR workflow.
  output: 'standalone',
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
  async headers() {
    return [
      // Gzip-compressed Unity WebGL files
      {
        source: "/webgl/Build/:path*.js.gz",
        headers: [
          { key: "Content-Encoding", value: "gzip" },
          { key: "Content-Type", value: "application/javascript" },
        ],
      },
      {
        source: "/webgl/Build/:path*.wasm.gz",
        headers: [
          { key: "Content-Encoding", value: "gzip" },
          { key: "Content-Type", value: "application/wasm" },
        ],
      },
      {
        source: "/webgl/Build/:path*.data.gz",
        headers: [
          { key: "Content-Encoding", value: "gzip" },
          { key: "Content-Type", value: "application/octet-stream" },
        ],
      },
      // Brotli-compressed
      {
        source: "/webgl/Build/:path*.js.br",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/javascript" },
        ],
      },
      {
        source: "/webgl/Build/:path*.wasm.br",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/wasm" },
        ],
      },
      {
        source: "/webgl/Build/:path*.data.br",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/octet-stream" },
        ],
      },
    ];
  },
};

export default nextConfig;
