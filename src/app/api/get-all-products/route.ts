// app/api/products/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

const api = axios.create({
  baseURL: "https://delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: process.env.WC_CONSUMER_KEY!,
    password: process.env.WC_CONSUMER_SECRET!,
  },
});

export async function GET() {
  try {
    let page = 1;
    const perPage = 100;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allProducts: any[] = [];
    let moreData = true;

    while (moreData) {
      const res = await api.get("products", {
        params: {
          per_page: perPage,
          page,
          _fields: "id,name,permalink,price,images,slug",
        },
      });

      const products = res.data;
      allProducts.push(...products);

      if (products.length < perPage) {
        moreData = false; // No more pages
      } else {
        page++;
      }
    }

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return NextResponse.json(
      { error: "Failed to fetch all products" },
      { status: 500 }
    );
  }
}
