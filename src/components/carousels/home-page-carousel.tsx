"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
}

interface HomePageCarouselProps {
  products: Product[];
  title?: string;
}

export default function HomePageCarousel({
  products,
  title,
}: HomePageCarouselProps) {
  return (
    <div className="w-full mx-4">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {title}
        </h2>
      )}

      <style jsx global>{`
        .product-carousel .swiper-pagination {
          bottom: -40px !important;
          position: relative !important;
        }
        .product-carousel .swiper-pagination-bullet {
          background: #3b82f6 !important;
          opacity: 0.5;
        }
        .product-carousel .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        slidesPerView={2.5}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: {
            slidesPerView: 3.5,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 4.5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5.5,
            spaceBetween: 25,
          },
        }}
        className="product-carousel mb-12"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <Link href={`/${product.slug}/`}>
                <div className="relative aspect-[2/3] overflow-hidden cursor-pointer">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images?.[0]?.src || "/placeholder.svg"}
                      alt={product.images?.[0]?.alt || product.name}
                      width={500} // adjust as needed
                      height={500} // adjust as needed
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 480px) 40vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock_quantity <= 5 &&
                    product.stock_quantity > 0 && (
                      <Badge className="absolute top-1 right-1 bg-orange-500 text-xs px-1 py-0">
                        {product.stock_quantity} left
                      </Badge>
                    )}
                  {product.stock_quantity === 0 && (
                    <Badge className="absolute top-1 right-1 bg-red-500 text-xs px-1 py-0">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </Link>

              <div className="p-2 sm:p-3">
                <Link href={`/${product.slug}/`}>
                  <h3 className="font-medium text-xs sm:text-sm my-4 line-clamp-2 text-gray-800 leading-tight min-h-[2.5rem] sm:min-h-[2.8rem] cursor-pointer hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm sm:text-lg font-bold text-green-600">
                    ₹{product.price}
                  </span>
                </div>

                <Link href={`/${product.slug}/`}>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9 font-medium"
                    disabled={product.stock_quantity === 0}
                    asChild
                  >
                    <span>
                      {product.stock_quantity === 0
                        ? "Out of Stock"
                        : "View Now"}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
