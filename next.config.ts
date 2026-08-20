import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a stray lockfile exists in the
  // parent directory, which otherwise confuses Next's workspace detection).
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      // Images uploaded in the Sanity Studio.
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Seed stock photography, and any external URL an editor pastes into a
      // figure's "External image URL" field. Uploads are preferred — see
      // src/config/images.ts and sanity/schemas/objects/figure.ts.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
