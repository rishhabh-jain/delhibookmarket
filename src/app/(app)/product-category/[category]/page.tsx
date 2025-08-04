import React from "react";
import ProductCategoryClient from "./ProductCategoryClient";

// ISR: Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

async function fetchInitialProducts(category: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/get-products-by-category?c=${category}&page=1&limit=20`
    );

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status}`);
      return { products: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching initial products:", error);
    return { products: [] };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category } = await params;

  const categoryObject: Record<
    | "fiction"
    | "non-fiction"
    | "children"
    | "romance"
    | "self-help"
    | "combo"
    | "business"
    | "manga"
    | "finance"
    | "classic"
    | "all"
    | "box-sets",
    number | string
  > = {
    fiction: 538,
    "non-fiction": 555,
    children: 540,
    romance: 560,
    "self-help": 564,
    combo: 745,
    business: 528,
    manga: 549,
    finance: 539,
    classic: 529,
    all: "all",
    "box-sets": 746,
  };

  const categoryId =
    categoryObject[category.toLowerCase() as keyof typeof categoryObject];

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">
          Product Category is required
        </h1>
      </div>
    );
  }

  // Fetch initial products for SSR
  const { products } = await fetchInitialProducts(String(categoryId));

  return (
    <ProductCategoryClient
      initialProducts={products || []}
      category={category}
    />
  );
}
