// app/products/page.tsx
import React, { Suspense } from "react";
import ShopClient from "./ShopClient";
import StructuredData from "./StructuredData";

interface ProductImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

interface Product {
  id: number;
  name: string;
  permalink: string;
  price: string;
  images: ProductImage[];
  stock_quantity: number;
  slug: string;
  total_sales: number;
}

interface ShopResponse {
  products: Product[];
  hasNextPage: boolean;
  nextPage: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const query = await searchParams;
  const queryParams = new URLSearchParams(query);

  // Ensure we're getting page 1 for initial load
  queryParams.set("page", "1");
  queryParams.set("limit", "20");

  let initialData: ShopResponse | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(
      `https://delhibookmarket.com/api/sort-products?${queryParams.toString()}`,
      {
        next: { revalidate: 259200 }, // ✅ cache for 3 days
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    initialData = await res.json();
  } catch (err) {
    console.error("Error fetching initial products:", err);
    error = "Failed to load initial products";
  }

  // Generate metadata for SEO
  const searchTerm = query.search || "";
  const category = query.c || "";
  const sort = query.sort || "popularity";

  return (
    <>
      {/* Add structured data for SEO */}
      {initialData && (
        <StructuredData
          products={initialData.products}
          totalCount={initialData.totalCount}
          searchTerm={query.search}
        />
      )}

      {/* SEO-friendly server-rendered content */}
      <div>
        {initialData && (
          <>
            {/* Server-rendered product list for SEO */}
            <div style={{ display: "none" }} id="seo-products">
              {initialData.products.map((product) => (
                <div key={product.id}>
                  <h2>{product.name}</h2>
                  <p>Price: ₹{product.price}</p>
                  <p>Stock: {product.stock_quantity}</p>
                  {product.images[0] && (
                    <img
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      style={{ display: "none" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <Suspense fallback={<div>Loading products...</div>}>
          <ShopClient
            initialData={initialData}
            error={error}
            searchParamsString={queryParams.toString()}
          />
        </Suspense>
      </div>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const query = await searchParams;
  const searchTerm = query.search || "";
  const category = query.c || "";

  let title = "Products - Your Shop";
  let description = "Browse our collection of quality products";

  if (searchTerm) {
    title = `Search "${searchTerm}" - Your Shop`;
    description = `Search results for "${searchTerm}". Find the best products at great prices.`;
  } else if (category && category !== "all") {
    title = `Category ${category} - Your Shop`;
    description = `Browse products in ${category} category. Quality products at competitive prices.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}
