// app/api/check-stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

interface ProductRequest {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductRequest = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const fields = "stock_status,stock_quantity";

    // Fetch only required fields
    const response = await WooCommerce.get(
      `products?include[]=${id}&_fields=${fields}`
    );

    return NextResponse.json({
      response: response.data[0],
    });
  } catch (error) {
    console.error("Stock check error:", error);

    return NextResponse.json(
      {
        error: "Failed to check stock",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
