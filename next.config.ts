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
    deviceSizes: [360, 393, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
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
