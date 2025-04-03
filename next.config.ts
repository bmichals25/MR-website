import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Improve Netlify compatibility
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.netlify.app', '*.netlify.com'],
    },
  },
  
  // Use by Netlify adapter
  distDir: '.next',
};

export default nextConfig;
