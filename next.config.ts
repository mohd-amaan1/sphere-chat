import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Railway deployment
  output: "standalone", // Creates optimized production build
  reactStrictMode: true,

  // Optional: Enable WebSocket support
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
    };
    return config;
  },

  // Optional: Add security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  
};

export default nextConfig;