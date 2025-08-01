import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { NextRequest, NextResponse } from "next/server";

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!, // Your WooCommerce store URL
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Validate order ID
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order details from WooCommerce
    const response = await WooCommerce.get(`orders/${orderId}`);

    return NextResponse.json(response.data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching order details:", error);

    // Handle WooCommerce API errors
    if (error.response) {
      const { status, data } = error.response;
      return NextResponse.json(
        {
          error: data.message || "Failed to fetch order details",
          code: data.code || "api_error",
        },
        { status: status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
