// app/api/product/route.ts
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
    const id = request.nextUrl.searchParams.get("id");
    const slug = request.nextUrl.searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json(
        { error: "Either product ID or slug is required" },
        { status: 400 }
      );
    }

    let res;

    if (id) {
      res = await api.get(`products/${id}`, {
        params: {
          _fields:
            "id,name,permalink,price,regular_price,sale_price,description,short_description,images,stock_quantity,stock_status,categories,tags,attributes,average_rating,rating_count",
        },
      });
    } else if (slug) {
      const slugRes = await api.get("products", {
        params: {
          slug,
          _fields:
            "id,name,permalink,price,regular_price,sale_price,description,short_description,images,stock_quantity,stock_status,categories,tags,attributes,average_rating,rating_count",
        },
      });

      if (!slugRes.data.length) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      res = { data: slugRes.data[0] };
    }

    if (
      res?.data.stock_status !== "instock" ||
      (res.data.stock_quantity !== null && res.data.stock_quantity <= 0)
    ) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching product:", error);

    if (error.response?.status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
