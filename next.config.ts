import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore les erreurs ESLint pendant la construction
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
