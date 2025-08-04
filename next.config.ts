import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shop.delhibookmarket.com",
        // Optional: pathname: "/wp-content/uploads/**" for tighter control
      },
      {
        protocol: "https",
        hostname: "delhibookmarket.com",
        // Optional: pathname: "/wp-content/uploads/**" for tighter control
      },
    ],
  },
  reactStrictMode: false,
  async redirects() {
    return [
      // Redirect malformed shop URLs to home (more specific patterns first)
      {
        source: "/shop-2%3Fmin_price=:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/shop-:slug*%3F:query*", // shop-X with URL encoded query params
        destination: "/",
        permanent: false,
      },
      {
        source: "/shop-:slug*", // General shop- malformed URLs
        destination: "/",
        permanent: false,
      },
      // Catch URLs with malformed filtering parameters
      {
        source: "/:path*filtering%3D1:rest*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*filter_product_cat%3D:rest*",
        destination: "/",
        permanent: false,
      },
      // General catch for any URL with malformed query parameters
      {
        source: "/:path*%3F:query*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/:path*max_price%3D:rest*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
