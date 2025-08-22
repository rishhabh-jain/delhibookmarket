// app/api/products/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let page = 1;
    const perPage = 100;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allProducts: any[] = [];
    let moreData = true;

    while (moreData) {
      const wpRes = await axios.get(
        "https://shop.delhibookmarket.com/wp-json/wp/v2/product",
        {
          params: {
            per_page: perPage,
            page,
            status: "any",
            catalog_visibility: "any", // Include all visibility settings
            type: "any", // Include all product types
          },
          auth: {
            username: process.env.WC_CONSUMER_KEY!,
            password: process.env.WC_CONSUMER_SECRET!,
          },
        }
      );

      const products = wpRes.data;
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
