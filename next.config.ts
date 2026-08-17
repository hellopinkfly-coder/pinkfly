import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a stray lockfile exists in the
  // parent directory, which otherwise confuses Next's workspace detection).
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Temporary stock photography. When final assets land in /public these
    // remote patterns can be dropped entirely — see src/config/images.ts.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
