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
    const res = await api.get("products", {
      params: {
        per_page: 100,
        orderby: "popularity",
        order: "desc",
        _fields: "slug",
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { error: "Failed to fetch top products" },
      { status: 500 }
    );
  }
}
