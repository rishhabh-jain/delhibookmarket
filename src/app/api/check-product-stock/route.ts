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
  product_id: number;
  quantity: number;
}

interface WooCommerceProduct {
  id: number;
  name: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number;
  manage_stock: boolean;
}

interface OutOfStockItem {
  product_id: number;
  product_name: string;
  requested_quantity: number;
  available_quantity: number;
  out_of_stock_quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const product_list: ProductRequest[] = body.product_list;

    if (!product_list || !Array.isArray(product_list)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected product_list array." },
        { status: 400 }
      );
    }

    if (product_list.length === 0) {
      return NextResponse.json({
        out_of_stock_list: [],
      });
    }

    // Extract unique product IDs
    const productIds = [
      ...new Set(product_list.map((item) => item.product_id)),
    ];

    // Build the include query parameters
    const includeParams = productIds.map((id) => `include[]=${id}`).join("&");

    // Define the fields we need
    const fields = "id,name,stock_status,stock_quantity,manage_stock";

    // Fetch products from WooCommerce
    const response = await WooCommerce.get(
      `products?${includeParams}&_fields=${fields}`
    );

    const products: WooCommerceProduct[] = response.data;

    // Create a map for quick product lookup
    const productMap = new Map<number, WooCommerceProduct>();
    products.forEach((product) => {
      productMap.set(product.id, product);
    });

    const out_of_stock_list: OutOfStockItem[] = [];

    // Check stock for each product in the request
    for (const item of product_list) {
      const product = productMap.get(item.product_id);

      if (!product) {
        // Product not found - treat as completely out of stock
        out_of_stock_list.push({
          product_id: item.product_id,
          product_name: "Product not found",
          requested_quantity: item.quantity,
          available_quantity: 0,
          out_of_stock_quantity: item.quantity,
        });
        continue;
      }

      // Check if product is out of stock
      if (product.stock_status === "outofstock") {
        out_of_stock_list.push({
          product_id: product.id,
          product_name: product.name,
          requested_quantity: item.quantity,
          available_quantity: 0,
          out_of_stock_quantity: item.quantity,
        });
        continue;
      }

      // If stock is managed, check available quantity
      if (product.manage_stock) {
        const availableStock = product.stock_quantity;

        if (availableStock < item.quantity) {
          // Not enough stock available
          const outOfStockQuantity =
            item.quantity - Math.max(0, availableStock);

          out_of_stock_list.push({
            product_id: product.id,
            product_name: product.name,
            requested_quantity: item.quantity,
            available_quantity: Math.max(0, availableStock),
            out_of_stock_quantity: outOfStockQuantity,
          });
        }
      }
      // If stock is not managed and status is 'instock', assume sufficient stock
      // If status is 'onbackorder', you might want to handle this case differently
    }

    return NextResponse.json({
      out_of_stock_list,
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
