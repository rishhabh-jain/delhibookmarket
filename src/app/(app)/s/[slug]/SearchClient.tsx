"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ShoppingBag, Star, Package } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

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

interface SearchResponse {
  products: Product[];
  hasNextPage: boolean;
  nextPage?: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface SearchClientProps {
  searchQuery: string;
}

const fetchProducts = async ({
  pageParam = 1,
  queryKey,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): Promise<SearchResponse> => {
  const [, searchQuery] = queryKey;
  const params = new URLSearchParams({
    page: pageParam.toString(),
    s: searchQuery,
  });

  const response = await fetch(`/api/fetch-search-results?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export default function SearchClient({ searchQuery }: SearchClientProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", searchQuery],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    initialPageParam: 1,
  });

  const fetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (inView) {
      fetchNext();
    }
  }, [inView, fetchNext]);

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <Package className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Something went wrong
          </h3>
          <p className="mb-6 text-sm text-gray-600">
            {error instanceof Error ? error.message : "Failed to load products"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (allProducts.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gray-100 p-3">
              <ShoppingBag className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No products found
          </h3>
          <p className="text-sm text-gray-600">
            No results for {searchQuery}. Try different keywords.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-6">
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{allProducts.length}</span> of{" "}
            <span className="font-medium">{totalCount}</span> results for{" "}
            <span className="font-medium">{searchQuery}</span>
          </p>
        </div>

        {/* Products grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loading trigger */}
        <div ref={ref} className="py-8">
          {isFetchingNextPage && (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm text-gray-600">Loading more...</span>
            </div>
          )}
          {!hasNextPage && allProducts.length > 0 && (
            <p className="text-center text-sm text-gray-500">
              You have reached the end
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  const mainImage = product.images[0];
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-gray-300">
      <Link
        href={`/${product.permalink.split("/").filter(Boolean).pop()}`}
        className="block"
      >
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage.src || "/placeholder.svg"}
              alt={mainImage.alt || product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width={300}
              height={300}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xs font-medium px-2 py-1 bg-red-600 rounded">
                Out of Stock
              </span>
            </div>
          )}

          {/* Sales badge */}
          {product.total_sales > 0 && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center space-x-1 rounded-full bg-green-100 px-2 py-1">
                <Star className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  {product.total_sales}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-3">
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-green-600">
                ₹{product.price}
              </span>
              <span className="text-xs text-gray-500">
                Stock: {product.stock_quantity}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="aspect-square animate-pulse bg-gray-200"></div>
      <div className="p-3">
        <div className="mb-2 h-4 animate-pulse rounded bg-gray-200"></div>
        <div className="mb-3 h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div className="flex justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
