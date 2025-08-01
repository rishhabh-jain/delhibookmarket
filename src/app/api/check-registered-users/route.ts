// app/api/users/find-by-email/route.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { NextRequest } from "next/server";

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!, // Your WooCommerce store URL
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: NextRequest) {
  try {
    // Get email from query parameters
    const email = request.nextUrl.searchParams.get("email");

    // Validate email parameter
    if (!email) {
      return Response.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Search for user by email using WooCommerce API
    const response = await WooCommerce.get("customers", {
      email: email,
      per_page: 1, // We only need one result
      _feilds: "id,email",
    });

    console.log(response.data);

    // Check if user exists
    if (response.data && response.data.length > 0) {
      const user = response.data[0];

      // Return user data (excluding sensitive information)
      return Response.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } else {
      // User not found, return null
      return Response.json({
        success: true,
        user: null,
        message: "User not found",
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("WooCommerce API Error:", error);

    // Handle different types of errors
    if (error.response) {
      // WooCommerce API returned an error
      return Response.json(
        {
          error: "WooCommerce API error",
          details: error.response.data || error.message,
        },
        { status: error.response.status || 500 }
      );
    } else if (error.request) {
      // Network error
      return Response.json(
        { error: "Network error - could not reach WooCommerce API" },
        { status: 503 }
      );
    } else {
      // Other error
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}
