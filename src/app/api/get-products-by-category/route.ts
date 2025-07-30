// app/api/products/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const api = axios.create({
  baseURL: "https://delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: process.env.WC_CONSUMER_KEY!,
    password: process.env.WC_CONSUMER_SECRET!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get("c");
    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const res = await api.get("products", {
      params: {
        category: categoryId,
        per_page: 8,
        orderby: "popularity", // Sort by popularity
        order: "desc", // Most popular first
        stock_status: "instock",
        _fields: "id,name,permalink,price,images,stock_quantity,slug", // Only fetch required fields
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
