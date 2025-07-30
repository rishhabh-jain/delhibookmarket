"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  author: string;
  color: string;
}

interface BookCarouselProps {
  books: Book[];
}

export default function BookCarousel({ books }: BookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleBooks = 4;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + visibleBooks >= books.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, books.length - visibleBooks) : prevIndex - 1
    );
  };

  const displayBooks = () => {
    const result = [];
    for (let i = 0; i < visibleBooks; i++) {
      const index = (currentIndex + i) % books.length;
      result.push(books[index]);
    }
    return result;
  };

  return (
    <div className="relative">
      <div className="flex justify-center gap-4 py-4">
        {displayBooks().map((book) => (
          <div key={book.id} className="relative w-32 h-48 flex-shrink-0">
            <div className={`absolute inset-0 rounded-md ${book.color}`}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
              <span className="font-bold text-blue-600">{book.title}</span>
              <span className="text-xs text-gray-700">{book.author}</span>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
}
