import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    // For older Next.js versions (or keep for backward compatibility)
    domains: ['via.placeholder.com', 'img.youtube.com'],
    
    // For newer Next.js versions (recommended)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);