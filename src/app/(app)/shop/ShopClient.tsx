"use client";

import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Header from "@/components/header-footer/Header";
import Footer from "@/components/home/Footer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

interface ShopClientProps {
  initialData: ShopResponse | null;
  error: string | null;
  searchParamsString: string;
}

const fetchProducts = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam: number;
  queryKey: string[];
}): Promise<ShopResponse> => {
  const [, searchParamsString] = queryKey;

  // Create URLSearchParams and set the page
  const params = new URLSearchParams(searchParamsString);
  params.set("page", pageParam.toString());
  params.set("limit", "20");

  const response = await fetch(`/api/sort-products?${params.toString()}`, {
    headers: {
      "Cache-Control": "max-age=259200", // 3 days in seconds
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export default function ShopClient({
  initialData,
  error,
  searchParamsString,
}: ShopClientProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error: queryError,
  } = useInfiniteQuery({
    queryKey: ["products", searchParamsString],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Use server-rendered data as initial data
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
  });

  const searchParams = useSearchParams();

  const max_price = searchParams.get("max-price");
  const min_price = searchParams.get("min-price");

  useEffect(() => {
    console.log("CHANGED");
  }, [max_price, min_price]);

  // Show server-side error if initial fetch failed
  if (error && !initialData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">{error} 😢</div>
      </div>
    );
  }

  if (isLoading && !initialData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError && !initialData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">
          Failed to load products 😢
          <br />
          <span className="text-sm text-gray-600">
            {queryError instanceof Error ? queryError.message : "Unknown error"}
          </span>
        </div>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) || [];
  const totalCount = data?.pages[0]?.totalCount || initialData?.totalCount || 0;
  const currentHasNextPage =
    data?.pages[data.pages.length - 1]?.hasNextPage ??
    initialData?.hasNextPage ??
    false;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Only show loading state if we don't have initial data */}
        {!initialData && isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {allProducts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Showing {allProducts.length} of {totalCount} products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {allProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                  priority={index < 8} // Prioritize first 8 images for LCP
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              {currentHasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </span>
                  ) : (
                    "Load More Products"
                  )}
                </button>
              )}
              {!currentHasNextPage && allProducts.length > 0 && (
                <p className="text-gray-500">No more products to load</p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

// Product Card Component with SEO optimizations
function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const mainImage = product.images?.[0];

  return (
    <Link href={`/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative">
          {mainImage ? (
            <img
              src={mainImage.src}
              alt={mainImage.alt || product.name}
              className="w-full h-full object-contain"
              loading={priority ? "eager" : "lazy"}
              // Add structured data attributes
              itemProp="image"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info with microdata */}
        <div className="p-4" itemScope itemType="https://schema.org/Product">
          <h3
            className="font-semibold text-gray-900 mb-2 line-clamp-2"
            title={product.name}
            itemProp="name"
          >
            {product.name}
          </h3>

          <div className="flex justify-between items-center mb-2">
            <span
              className="text-lg font-bold text-blue-600"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <span itemProp="price">₹{product.price}</span>
              <meta itemProp="priceCurrency" content="INR" />
              <meta
                itemProp="availability"
                content={
                  product.stock_quantity > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
                }
              />
            </span>
          </div>

          <Link
            href={`/${product.slug}`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 text-center"
            itemProp="url"
          >
            View Product
          </Link>

          {/* Hidden structured data */}
          <meta itemProp="sku" content={product.slug} />
          <div
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
            style={{ display: "none" }}
          >
            <meta itemProp="ratingValue" content="5" />
            <meta
              itemProp="reviewCount"
              content={product.total_sales.toString()}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
