import React from "react";
import ProductCategoryClient from "./ProductCategoryClient";

export const revalidate = 259200; // 72 hours in seconds

async function fetchInitialProducts(category: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/get-products-by-category?c=${category}&page=1&limit=20`,
      {
        next: { revalidate: 259200 }, // Use Next.js 13+ cache syntax
      }
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
  const { products } = await fetchInitialProducts(category);

  return (
    <ProductCategoryClient
      initialProducts={products || []}
      category={category}
    />
  );
}
