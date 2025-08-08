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

    const categoryId = searchParams.get("c"); // optional now
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "popularity";
    const minPrice = searchParams.get("min-price");
    const maxPrice = searchParams.get("max-price");

    // Sort mapping
    let orderby = "popularity";
    let order = "desc";

    switch (sort) {
      case "name":
        orderby = "title";
        order = "asc";
        break;
      case "price-low":
        orderby = "price";
        order = "asc";
        break;
      case "price-high":
        orderby = "price";
        order = "desc";
        break;
      case "popularity":
        orderby = "popularity";
        order = "desc";
        break;
      default:
        orderby = "popularity";
        order = "desc";
    }

    // Build params dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiParams: Record<string, any> = {
      page,
      per_page: limit,
      orderby,
      order,
      stock_status: "instock",
      _fields: "id,name,permalink,price,images,stock_quantity,slug,total_sales",
    };

    // Optional filters
    if (categoryId && categoryId !== "all") {
      apiParams.category = categoryId;
    }
    if (search.trim()) {
      apiParams.search = search.trim();
    }
    if (minPrice) {
      apiParams.min_price = minPrice;
    }
    if (maxPrice) {
      apiParams.max_price = maxPrice;
    }

    const res = await api.get("products", { params: apiParams });

    const totalCount = parseInt(res.headers["x-wp-total"] || "0");
    const totalPages = parseInt(res.headers["x-wp-totalpages"] || "1");

    return NextResponse.json(
      {
        products: res.data,
        hasNextPage: page < totalPages,
        nextPage: page < totalPages ? page + 1 : undefined,
        totalCount,
        currentPage: page,
        totalPages,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, max-age=259200, stale-while-revalidate=86400", // 3 days cache, 1 day stale
        },
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
