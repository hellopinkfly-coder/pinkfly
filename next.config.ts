import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a stray lockfile exists in the
  // parent directory, which otherwise confuses Next's workspace detection).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
