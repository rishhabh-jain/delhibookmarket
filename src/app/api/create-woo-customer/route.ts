// app/api/customers/route.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { NextRequest, NextResponse } from "next/server";

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!, // Your WooCommerce store URL
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const customerData = await request.json();

    // Validate required environment variables
    if (
      !process.env.WC_STORE_URL ||
      !process.env.WC_CONSUMER_KEY ||
      !process.env.WC_CONSUMER_SECRET
    ) {
      return NextResponse.json(
        { error: "Missing WooCommerce configuration" },
        { status: 500 }
      );
    }

    // Create customer using WooCommerce API
    const response = await WooCommerce.post("customers", customerData);

    return NextResponse.json({
      success: true,
      customer: response.data,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating customer:", error);

    // Handle WooCommerce API errors
    if (error.response) {
      return NextResponse.json(
        {
          error: "Failed to create customer",
          details: error.response.data,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
