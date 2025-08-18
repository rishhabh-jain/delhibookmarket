import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullProduct } from "@/app/types";

interface UseRelatedProductCarouselProps {
  relatedProducts: FullProduct[];
}

export function useRelatedProductCarousel({
  relatedProducts,
}: UseRelatedProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2.5);

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 2.5;
    const width = window.innerWidth;
    if (width >= 1536) return 6;
    if (width >= 1280) return 5;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 640) return 2.5;
    return 2;
  };

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, relatedProducts.length - visibleCount);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardWidth = container.scrollWidth / relatedProducts.length;
      const scrollPosition = index * cardWidth;
      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  // 📱 Mobile navigation component
  const MobileCarouselNavigation: ReactNode =
    relatedProducts.length > visibleCount ? (
      <div className="mt-6 md:hidden">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: Math.min(maxIndex + 1, 5) }).map((_, index) => (
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
          ))}
        </div>

        {/* Buttons */}
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
    ) : null;

  return {
    carouselRef,
    currentIndex,
    visibleCount,
    scrollToIndex,
    nextSlide,
    prevSlide,
    handleTouchStart,
    handleTouchEnd,
    MobileCarouselNavigation,
  };
}
