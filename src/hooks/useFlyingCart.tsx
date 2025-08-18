// hooks/useFlyingCart.ts
"use client";

import { useCallback } from 'react';

interface FlyingCartOptions {
  productImage: string;
  productName?: string;
  startElement: HTMLElement | null
  onAnimationComplete?: () => void;
}

export const useFlyingCart = () => {
  const animateToCart = useCallback(({
    productImage,
    productName = '',
    startElement,
    onAnimationComplete
  }: FlyingCartOptions) => {
    // Find the cart icon in the header
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
    if (!cartIcon || !startElement) {
      console.warn('Cart icon or start element not found');
      onAnimationComplete?.();
      return;
    }

    // Get positions
    const startRect = startElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create flying product element
    const flyingProduct = document.createElement('div');
    flyingProduct.className = 'flying-product';
    
    // Set initial position and styles
    flyingProduct.style.cssText = `
      position: fixed;
      top: ${startRect.top + startRect.height / 2 - 25}px;
      left: ${startRect.left + startRect.width / 2 - 25}px;
      width: 50px;
      height: 50px;
      background-image: url('${productImage}');
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      pointer-events: none;
      transform: scale(1);
      opacity: 1;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    // Add to DOM
    document.body.appendChild(flyingProduct);

    // Add cart shake animation styles if not already added
    if (!document.querySelector('#cart-shake-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-shake-styles';
      style.textContent = `
        @keyframes cart-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) scale(1.05); }
          75% { transform: translateX(3px) scale(1.05); }
        }
        
        @keyframes cart-bounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .cart-shake {
          animation: cart-shake 0.5s ease-in-out;
        }
        
        .cart-bounce {
          animation: cart-bounce 0.3s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }

    // Start animation after a small delay
    requestAnimationFrame(() => {
      const finalX = cartRect.left + cartRect.width / 2 - 25;
      const finalY = cartRect.top + cartRect.height / 2 - 25;
      
      flyingProduct.style.transform = `translate(${finalX - (startRect.left + startRect.width / 2 - 25)}px, ${finalY - (startRect.top + startRect.height / 2 - 25)}px) scale(0.3)`;
      flyingProduct.style.opacity = '0.8';
    });

    // Handle animation completion
    const handleAnimationEnd = () => {
      // Add shake effect to cart
      cartIcon.classList.add('cart-shake');
      
      setTimeout(() => {
        cartIcon.classList.remove('cart-shake');
        cartIcon.classList.add('cart-bounce');
        
        setTimeout(() => {
          cartIcon.classList.remove('cart-bounce');
        }, 300);
      }, 100);

      // Remove flying product
      setTimeout(() => {
        if (flyingProduct.parentNode) {
          flyingProduct.remove();
        }
        onAnimationComplete?.();
      }, 200);
    };

    // Listen for transition end
    flyingProduct.addEventListener('transitionend', handleAnimationEnd, { once: true });

    // Fallback cleanup
    setTimeout(() => {
      if (flyingProduct.parentNode) {
        flyingProduct.remove();
        onAnimationComplete?.();
      }
    }, 1500);
  }, []);

  return { animateToCart };
};