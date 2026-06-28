import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['*'],
  // Tree-shake large barrel packages not optimized by Next's defaults.
  // (lucide-react, @headlessui/react, react-icons/* are already optimized by default.)
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@fortawesome/react-fontawesome",
    ],
  },
  images: {
    // Serve modern formats for the thumbnail-heavy catalog.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
