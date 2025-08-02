import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shop.delhibookmarket.com",
        // Optional: pathname: "/wp-content/uploads/**" for tighter control
      },
    ],
  },
};

export default nextConfig;
