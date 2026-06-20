import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth).*)",
        destination: `${process.env.BACKEND_API_URL || "http://127.0.0.1:8000"}/:path`,
      },
    ];
  },
};

export default nextConfig;