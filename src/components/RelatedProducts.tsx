"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RelatedProduct {
  product_id: string;
  title: string;
  author?: string;
  categories: string[];
}

interface FullProduct {
  id: number;
  name: string;
  price: string;
  images: { src: string; alt?: string }[];
  permalink: string;
}

interface Props {
  productId: string;
  title: string;
}

export default function RelatedProducts({ productId, title }: Props) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [fullProducts, setFullProducts] = useState<
    (RelatedProduct & Partial<FullProduct>)[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<FullProduct[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch products.json from public folderrrrrr
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: FullProduct[]) => setAllProducts(data))
      .catch(() => setError("Failed to load product data"));
  }, []);

  // Fetch related products from your API
  useEffect(() => {
    async function fetchRelated() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/related-product/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId, title }),
        });
        const json = await res.json();
        if (json.relatedProducts) {
          setRelatedProducts(json.relatedProducts);
        } else if (json.error) {
          setError(json.error);
        }
      } catch {
        setError("Failed to fetch related products");
      }
      setLoading(false);
    }

    if (productId) {
      fetchRelated();
    }
  }, [productId]);

  // Map relatedProducts with full product info
  useEffect(() => {
    if (allProducts.length === 0 || relatedProducts.length === 0) return;

    const enriched = relatedProducts.map((rp) => {
      const full = allProducts.find((p) => p.id === Number(rp.product_id));
      return {
        ...rp,
        price: full?.price,
        images: full?.images,
        permalink: full?.permalink,
        name: full?.name,
      };
    });

    setFullProducts(enriched);
  }, [allProducts, relatedProducts]);

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 2.5;
    const width = window.innerWidth;
    if (width >= 1536) return 6; // 2xl: 6 products
    if (width >= 1280) return 5; // xl: 5 products
    if (width >= 1024) return 4; // lg: 4 products
    if (width >= 768) return 3; // md: 3 products
    if (width >= 640) return 2.5; // sm: 2.5 products
    return 2; // xs: 2 products (minimum 2 cards on mobile)
  };

  const [visibleCount, setVisibleCount] = useState(2.5);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardWidth = container.scrollWidth / fullProducts.length;
      const scrollPosition = index * cardWidth;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, fullProducts.length - visibleCount);
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const handleTouchStart = useRef<number>(0);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const touchStart = handleTouchStart.current;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse"
              >
                <div className="bg-gray-200 rounded-lg h-40 sm:h-48 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">
              Unable to load related products
            </p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (fullProducts.length === 0) return null;

  const maxIndex = Math.max(0, fullProducts.length - visibleCount);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Related Products
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover more products you might like
            </p>
          </div>
          {fullProducts.length > visibleCount && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="h-10 w-10 bg-white hover:bg-gray-50 border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous products</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="h-10 w-10 bg-white hover:bg-gray-50 border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next products</span>
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onTouchStart={(e) =>
              (handleTouchStart.current = e.touches[0].clientX)
            }
            onTouchEnd={handleTouchEnd}
          >
            {fullProducts.map((product) => (
              <Link
                href={
                  product.permalink?.split("/").filter(Boolean).pop() ?? "/"
                }
                key={product.product_id}
                className="flex-none w-[280px] sm:w-[300px] md:w-[280px] lg:w-[260px] xl:w-[240px] 2xl:w-[220px] bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                {product.images && product.images.length > 0 && (
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0].src || "/placeholder.svg"}
                      alt={
                        product.images[0].alt || product.title || product.name
                      }
                      className="w-full h-48 sm:h-52 lg:h-48 object-contain transition-transform duration-500 group-hover:scale-105 p-4"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-4 sm:p-5 space-y-3">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                    {product.title || product.name}
                  </h3>
                  {product.author && (
                    <p className="text-sm text-gray-600 line-clamp-1 font-medium">
                      by {product.author}
                    </p>
                  )}
                  {product.price && (
                    <div className="flex items-center justify-between pt-2">
                      <p className="font-bold text-lg text-blue-600">
                        ₹{product.price}
                      </p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                          View Details
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        {fullProducts.length > visibleCount && (
          <div className="mt-6 md:hidden">
            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: Math.min(maxIndex + 1, 5) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? "bg-blue-600 w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                )
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="h-9 px-4 bg-white hover:bg-gray-50 border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="h-9 px-4 bg-white hover:bg-gray-50 border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
