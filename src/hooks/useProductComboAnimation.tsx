// hooks/useProductAnimation.ts
import { useState, useCallback } from 'react';
import { FullProduct } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AnimationState {
  isAnimating: boolean;
  animatingProduct: FullProduct | null;
  startPosition: { x: number; y: number } | null;
  endPosition: { x: number; y: number } | null;
}

export const useProductAnimation = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    animatingProduct: null,
    startPosition: null,
    endPosition: null,
  });

  const startAnimation = useCallback((
    product: FullProduct,
    startElement: HTMLElement,
    endElement: HTMLElement
  ) => {
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();

    setAnimationState({
      isAnimating: true,
      animatingProduct: product,
      startPosition: {
        x: startRect.left + startRect.width / 2,
        y: startRect.top + startRect.height / 2,
      },
      endPosition: {
        x: endRect.left + endRect.width / 2,
        y: endRect.top + endRect.height / 2,
      },
    });

    // Reset after animation completes
    setTimeout(() => {
      setAnimationState({
        isAnimating: false,
        animatingProduct: null,
        startPosition: null,
        endPosition: null,
      });
    }, 800);
  }, []);

  return {
    animationState,
    startAnimation,
  };
};

interface ProductFlyAnimationProps {
  isAnimating: boolean;
  product: FullProduct | null;
  startPosition: { x: number; y: number } | null;
  endPosition: { x: number; y: number } | null;
}

export const ProductFlyAnimation: React.FC<ProductFlyAnimationProps> = ({
  isAnimating,
  product,
  startPosition,
  endPosition,
}) => {
  if (!isAnimating || !product || !startPosition || !endPosition) {
    return null
  }

  const deltaX = endPosition.x - startPosition.x
  const deltaY = endPosition.y - startPosition.y

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50 pointer-events-none"
        style={{
          left: startPosition.x - 60,
          top: startPosition.y - 80,
          willChange: "transform, opacity",
        }}
        initial={{
          scale: 1,
          opacity: 1,
          rotate: 0,
        }}
        animate={{
          x: deltaX + 30,
          y: deltaY + 40,
          scale: 0.3,
          opacity: 0.8,
          rotate: 8,
        }}
        exit={{
          opacity: 0,
          scale: 0.1,
          rotate: 15,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
      >
        <div className="w-32 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform-gpu">
          {/* Product Image */}
          <div className="aspect-[3/4] relative overflow-hidden">
            {product.images && product.images[0] ? (
              <Image
                width={128}
                height={170}
                src={product.images[0].src || "/placeholder.svg"}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <span className="text-2xl">📖</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-2 space-y-1">
            <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
            <p className="text-sm font-bold text-blue-600">₹{product.price}</p>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 w-32 bg-blue-500/20 rounded-xl"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{
            scale: 1.05,
            opacity: 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Primary particle */}
          <motion.div
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
              x: [-16, -32],
              y: [-8, -16],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />

          {/* Secondary particle */}
          <motion.div
            className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              x: [-12, -24],
              y: [4, 8],
            }}
            transition={{
              duration: 0.4,
              delay: 0.1,
              ease: "easeOut",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
