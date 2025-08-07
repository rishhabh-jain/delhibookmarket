// app/api/products/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

const api = axios.create({
  baseURL: "https://shop.delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: process.env.WC_CONSUMER_KEY!,
    password: process.env.WC_CONSUMER_SECRET!,
  },
});

export async function GET() {
  try {
    const allProducts = [];

    // Woo only gives max 100 per page, so get 5 pages
    for (let page = 1; page <= 5; page++) {
      const res = await api.get("products", {
        params: {
          per_page: 100,
          page,
          orderby: "popularity",
          order: "desc",
          _fields: "slug",
        },
      });

      allProducts.push(...res.data);
    }

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { error: "Failed to fetch top products" },
      { status: 500 }
    );
  }
}
