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
      {
        source: "/cart-2",
        destination: "https://shop.delhibookmarket.com/cart-2",
        permanent: false,
      },
      {
        source: "/sale-offers",
        destination: "/promo-code",
        permanent: false,
      },
      {
        source: "/diwali-offers",
        destination: "/promo-code",
        permanent: false,
      },
      {
        source: "/apple-touch-icon.png",
        destination: "/",
        permanent: false,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/",
        permanent: false,
      },
      {
        source: "/apple-touch-icon-120x120-precomposed.png",
        destination: "/",
        permanent: false,
      },
      {
        source: "/about-us",
        destination: "https://shop.delhibookmarket.com/about-us",
        permanent: false,
      },
      {
        source: "/shipping-policy",
        destination: "https://shop.delhibookmarket.com/shipping-policy",
        permanent: false,
      },
      {
        source: "/sellbooks",
        destination: "https://shop.delhibookmarket.com/sellbooks",
        permanent: false,
      },
      {
        source: "/terms-and-conditions",
        destination: "https://shop.delhibookmarket.com/terms-and-conditions",
        permanent: false,
      },
      {
        source: "/returns-refunds-policy",
        destination: "https://shop.delhibookmarket.com/returns-refunds-policy",
        permanent: false,
      },
      {
        source: "/customer-reviews",
        destination: "https://shop.delhibookmarket.com/customer-reviews",
        permanent: false,
      },
      {
        source: "/wishlist",
        destination: "https://shop.delhibookmarket.com/wishlist",
        permanent: false,
      },
      {
        source: "/wp-login.php",
        destination: "https://shop.delhibookmarket.com/wp-login.php",
        permanent: false,
      },
      {
        source: "/xmlrpc.php",
        destination: "https://shop.delhibookmarket.com/xmlrpc.php",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "https://shop.delhibookmarket.com/contact",
        permanent: false,
      },
      {
        source: "/vendor-registration-3",
        destination: "https://shop.delhibookmarket.com/vendor-registration-3",
        permanent: false,
      },
      {
        source: "/apple-touch-icon-120x120.png",
        destination:
          "https://shop.delhibookmarket.com/apple-touch-icon-120x120.png",
        permanent: false,
      },
      {
        source: "/checkout-2",
        destination: "https://shop.delhibookmarket.com/checkout-2",
        permanent: false,
      },
      {
        source: "/bulk-order-dropshipping",
        destination: "https://shop.delhibookmarket.com/bulk-order-dropshipping",
        permanent: false,
      },
      {
        source: "/my-account-2",
        destination: "https://shop.delhibookmarket.com/my-account-2",
        permanent: false,
      },
      {
        source: "/faqs",
        destination: "https://shop.delhibookmarket.com/faqs",
        permanent: false,
      },
      {
        source: "/wp-cron.php",
        destination: "https://shop.delhibookmarket.com/wp-cron.php",
        permanent: false,
      },
      // Handle these paths with query parameters as well
      {
        source: "/cart-2/:path*",
        destination: "https://shop.delhibookmarket.com/cart-2/:path*",
        permanent: false,
      },
      {
        source: "/checkout-2/:path*",
        destination: "https://shop.delhibookmarket.com/checkout-2/:path*",
        permanent: false,
      },
      {
        source: "/my-account-2/:path*",
        destination: "https://shop.delhibookmarket.com/my-account-2/:path*",
        permanent: false,
      },

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
