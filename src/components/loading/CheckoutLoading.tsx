"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookLoadingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function BookLoadingModal({
  isOpen,
  onClose,
}: BookLoadingModalProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const loadingTexts = [
    "Turning the pages of your order...",
    "Writing your story in our ledger...",
    "Bookmarking your purchase...",
    "Crafting your literary adventure...",
    "Binding your order with care...",
    "Penning the final chapter...",
    "Sealing your book collection...",
    "Adding chapters to your library...",
  ];

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, loadingTexts.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-amber-200">
        {/* Close button - optional */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Book Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Book Cover */}
            <div className="w-32 h-40 bg-gradient-to-br from-amber-700 to-amber-900 rounded-r-lg shadow-lg relative overflow-hidden">
              {/* Book Spine */}
              <div className="absolute left-0 top-0 w-2 h-full bg-amber-800" />

              {/* Animated Pages */}
              <div className="absolute right-0 top-2 bottom-2 left-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 bg-cream rounded-r origin-left"
                    style={{
                      backgroundColor: "#fefdf8",
                      animation: `flipPage 3s infinite ease-in-out`,
                      animationDelay: `${i * 0.2}s`,
                      zIndex: 8 - i,
                    }}
                  />
                ))}
              </div>

              {/* Book Title */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-amber-100 text-xs font-serif text-center px-2">
                  <div className="font-bold">YOUR</div>
                  <div className="font-bold">ORDER</div>
                </div>
              </div>
            </div>

            {/* Book Shadow */}
            <div className="absolute -bottom-2 -right-2 w-32 h-40 bg-black/20 rounded-r-lg -z-10 blur-sm" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-serif text-gray-800 font-semibold">
            Processing Your Order
          </h3>

          <p
            className="text-gray-600 font-medium transition-all duration-500 ease-in-out min-h-[1.5rem]"
            key={currentTextIndex}
          >
            {loadingTexts[currentTextIndex]}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-1 pt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 text-amber-300 opacity-30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>

        <div className="absolute bottom-4 right-4 text-amber-300 opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes flipPage {
          0%,
          20% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateY(-90deg);
            opacity: 0.7;
          }
          80%,
          100% {
            transform: rotateY(-180deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
