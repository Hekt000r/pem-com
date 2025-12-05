import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
    images: {
    domains: ['lh3.googleusercontent.com', 'upload.wikimedia.org'], // for profile pics
    
  },

};

export default nextConfig;
