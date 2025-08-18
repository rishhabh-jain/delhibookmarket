"use client";

import type React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FullProduct } from "@/app/types";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import Loading from "./Loading";
import Error from "./Error";
import { useRelatedProductCarousel } from "./useRelatedProductCarousel";
import Image from "next/image";
import { ComboProduct } from "../combo/Combo";
import { useEffect, useState, useRef } from "react";
import {
  ProductFlyAnimation,
  useProductAnimation,
} from "@/hooks/useProductComboAnimation";
import { useCart } from "@/context/CartContext";
import { useAlert } from "@/context/AlertContext";

interface Props {
  productId: string;
  title: string;
  currentProduct: FullProduct;
  comboProducts?: FullProduct[];
  onAddProductToCombo?: (product: FullProduct) => void; //When a product is added to the combo
  onRemoveProductFromCombo?: (productId: number) => void; //When a product is removed from the combo
  onComboAddedToCart?: (products: FullProduct[]) => void; //When the combo is added to the cart
}

export default function RelatedProducts({
  currentProduct,
  productId,
  title,
  // onAddProductToCombo,
  onComboAddedToCart,
}: Props) {
  const { relatedProducts, loading, error } = useRelatedProducts(
    productId,
    title
  );
  const [comboProducts, setComboProducts] = useState<FullProduct[]>([]);
  const [resetCount, setResetCount] = useState(0);
  const [currentCombo, setCurrentCombo] = useState<number | null>(null);
  const { addProductToCombo } = useCart();
  // Animation hook and refs
  const { animationState, startAnimation } = useProductAnimation();
  const comboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (relatedProducts.length > 0) {
      // Initial load: pick first 3
      if (comboProducts.length === 0 && resetCount === 0) {
        setComboProducts([currentProduct, ...relatedProducts.slice(0, 2)]);
      }
      // After removal: load next 3
      else if (comboProducts.length === 0 && resetCount > 0) {
        const nextSet = relatedProducts.slice(resetCount, resetCount + 3);
        setComboProducts(nextSet);
      }
    }
  }, [relatedProducts, comboProducts.length, resetCount]);

  // whenever combo empties, bump resetCount
  useEffect(() => {
    if (comboProducts.length === 0 && relatedProducts.length > 0) {
      setResetCount((prev) => prev + 3);
    }
  }, [comboProducts, relatedProducts]);

  const { showToast } = useAlert();

  const handleAddToCombo = (product: FullProduct) => {
    if (currentCombo) {
      console.log("GONE TO THE COMBO", currentCombo);
      addProductToCombo(currentCombo, product);
    }
    setComboProducts((prev) => {
      // check if product already exists
      const alreadyExists = prev.some((p) => p.id === product.id);

      if (alreadyExists) {
        return prev; // don't add duplicates
      }

      return [...prev, product]; // safe to add
    });
  };

  // function to remove a product
  const handleRemoveFromCombo = (productId: number) => {
    if (comboProducts.length <= 2) {
      showToast({
        variant: "warning",
        message: "A combo must have atleast 2 products",
      });
      return;
    }
    setComboProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const {
    carouselRef,
    visibleCount,
    handleTouchStart,
    handleTouchEnd,
    nextSlide,
    prevSlide,
    currentIndex,
    MobileCarouselNavigation,
  } = useRelatedProductCarousel({
    relatedProducts,
  });

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (relatedProducts.length === 0) return null;

  const maxIndex = Math.max(0, relatedProducts.length - visibleCount);

  return (
    <>
      {/* Product Flying Animation Overlay */}
      <ProductFlyAnimation
        {...animationState}
        product={animationState.animatingProduct}
      />

      <ComboProduct
        onChange={(e) => {
          setCurrentCombo(e);
          console.log("Combo has been created of ID :", e);
        }}
        ref={comboRef}
        productId={productId}
        title={title}
        onComboAddedToCart={onComboAddedToCart}
        comboProducts={comboProducts}
        onAddToCombo={handleAddToCombo}
        onRemoveFromCombo={handleRemoveFromCombo}
      />

      <section className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between ">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Related Products
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Discover more products you might like
              </p>
            </div>
            {relatedProducts.length > visibleCount && (
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
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  data-product-card
                  className="flex-none w-[50%] sm:w-[300px] md:w-[280px] lg:w-[260px] xl:w-[240px] 2xl:w-[220px] bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
                >
                  <Link
                    href={
                      product.permalink?.split("/").filter(Boolean).pop() ?? "/"
                    }
                  >
                    {product.images && product.images.length > 0 && (
                      <div className="relative overflow-hidden bg-gray-50">
                        <Image
                          width={300}
                          height={300}
                          src={product.images[0].src || "/placeholder.svg"}
                          alt={
                            product.images[0].alt ??
                            product.name ??
                            "Product image"
                          }
                          className="w-full h-48 sm:h-52 lg:h-48 object-contain transition-transform duration-500 group-hover:scale-105 p-4"
                          loading="lazy"
                          data-product-image
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="p-4 sm:p-5 space-y-3">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                      </h3>
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

                  {/* Add to Combo Button - Outside of Link */}
                  <div className="px-4 pb-4">
                    {!comboProducts.some((p) => p.id === product.id) && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // Get the product image element for animation start
                          const productCard = e.currentTarget.closest(
                            "[data-product-card]"
                          );
                          const productImage = productCard?.querySelector(
                            "[data-product-image]"
                          );

                          if (productImage && comboRef.current) {
                            startAnimation(
                              product,
                              productImage as HTMLElement,
                              comboRef.current
                            );
                          }

                          // Delay the actual addition to show animation
                          setTimeout(() => {
                            window.scrollBy({
                              top: -100,
                              behavior: "smooth",
                            });
                            handleAddToCombo(product);
                          }, 100);
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Combo
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile navigation */}
          {MobileCarouselNavigation}
        </div>
      </section>
    </>
  );
}
