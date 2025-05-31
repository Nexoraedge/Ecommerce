import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/seed/**', // Allow paths like /seed/mens-shirt1/800/800
      },
      {
        protocol:'https',
        hostname:'rukminim2.flixcart.com',
        pathname:'/**'
      }
    ],
  },
};

export default nextConfig;
