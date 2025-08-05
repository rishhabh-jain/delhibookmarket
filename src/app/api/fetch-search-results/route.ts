import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const api = axios.create({
  baseURL: "https://shop.delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: process.env.WC_CONSUMER_KEY!,
    password: process.env.WC_CONSUMER_SECRET!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10; // Changed from 9 to 20
    const search = searchParams.get("s") || "";

    // Build API parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiParams: any = {
      page: page,
      per_page: limit,
      orderby: "popularity",
      order: "desc",
      stock_status: "instock",
      _fields: "id,name,permalink,price,images,stock_quantity,slug,total_sales",
    };

    // Add search parameter if provided
    if (search.trim()) {
      apiParams.search = search.trim();
    }

    const res = await api.get("products", {
      params: apiParams,
    });

    // Get total count from headers
    const totalCount = parseInt(res.headers["x-wp-total"] || "0");
    const totalPages = parseInt(res.headers["x-wp-totalpages"] || "1");
    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : undefined;

    return new NextResponse(
      JSON.stringify({
        products: res.data,
        hasNextPage,
        nextPage,
        totalCount,
        currentPage: page,
        totalPages,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to fetch products";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
