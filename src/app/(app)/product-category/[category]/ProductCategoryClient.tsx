"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Header from "@/components/header-footer/Header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

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
}

interface ProductsResponse {
  products: Product[];
  hasNextPage: boolean;
  nextPage?: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

async function fetchProducts(
  category: string,
  page: number = 1,
  limit: number = 20,
  searchTerm: string = "",
  sortBy: string = "name"
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    c: category,
    page: page.toString(),
    limit: limit.toString(),
    search: searchTerm,
    sort: sortBy,
  });

  const response = await fetch(`/api/get-products-by-category?${params}`, {
    headers: {
      "Cache-Control": "max-age=259200", // 3 days in seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}

export default function ProductCategoryClient({
  initialProducts,
  category,
  categoryName,
}: {
  initialProducts: ProductsResponse;
  category: string;
  categoryName: string;
}) {
  const [searchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Updated useInfiniteQuery with better initialData logic
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["products", category, debouncedSearchTerm, sortBy],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts(category, pageParam, 20, debouncedSearchTerm, sortBy),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextPage as number) : undefined,
    initialData:
      initialProducts.products.length > 0
        ? {
            pages: [initialProducts], // Pass the entire response object
            pageParams: [1],
          }
        : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  console.log(data);

  // Trigger fetch next page when the sentinel element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array of products
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) ?? [];
  }, [data]);

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price);
    return isNaN(numPrice) ? price : `₹${numPrice.toFixed(2)}`;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { text: "Out of Stock", variant: "destructive" as const };
    if (quantity < 5)
      return { text: "Low Stock", variant: "secondary" as const };
    return { text: "In Stock", variant: "default" as const };
  };

  if (isError) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">
              Error loading products: {error?.message}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 capitalize">
            {categoryName} Books
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-gray-200 rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No books found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {allProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock_quantity);
                const mainImage = product.images?.[0];

                return (
                  <Card
                    key={product.id}
                    className="group hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                        <Link href={`/${product.slug}`}>
                          <Image
                            src={
                              mainImage?.src ||
                              `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(
                                product.name
                              )}`
                            }
                            alt={mainImage?.alt || product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        </Link>
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={stockStatus.variant}
                            className="text-xs"
                          >
                            {stockStatus.text}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <Link href={`/${product.slug}`}>
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex flex-col justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          <Button
                            size="sm"
                            disabled={product.stock_quantity === 0}
                            className="h-8 px-3"
                          >
                            View Product
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Loading indicator for next page */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more books...</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => fetchNextPage()}
                    variant="outline"
                    disabled={isFetchingNextPage}
                  >
                    Load More
                  </Button>
                )}
              </div>
            )}

            {/* End of results indicator */}
            {!hasNextPage && allProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You have reached the end of the results
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
