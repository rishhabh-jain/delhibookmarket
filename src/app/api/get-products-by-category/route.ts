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
    const categoryId = searchParams.get("c");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20"); // Changed from 9 to 20
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "name";

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Map sort parameter to WooCommerce orderby values
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

    // Build API parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiParams: any = {
      category: categoryId === "all" ? undefined : categoryId,
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
        headers: {
          "Cache-Control": "s-maxage=86400, stale-while-revalidate=59",
          "Content-Type": "application/json",
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
