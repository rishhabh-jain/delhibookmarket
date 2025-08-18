"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { ShoppingCart, Loader2, Tag, Check, X, Edit3 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { FullProduct } from "@/app/types";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { ShineBorder } from "../magicui/shine-border";
import Loading from "./Loading";
import Error from "./Error";
import Image from "next/image";
import Link from "next/link";
import TextType from "../text/TextHype";
interface Props {
  productId: string;
  title: string;
  comboProducts: FullProduct[];
  onAddToCart?: (products: FullProduct[]) => void;
  onComboAddedToCart?: (products: FullProduct[]) => void;
  onAddToCombo: (product: FullProduct) => void;
  onRemoveFromCombo: (productId: number) => void;
  onChange: (id: number) => void;
}

export const ComboProduct = forwardRef<HTMLDivElement, Props>(
  (
    {
      productId,
      title,
      onComboAddedToCart,
      comboProducts,
      onRemoveFromCombo,
      onChange,
    },
    ref
  ) => {
    const { loading, error } = useRelatedProducts(productId, title);

    // State for combo-in-progress (before adding to cart)
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [comboId, setComboId] = useState<number | null>(null);
    const [comboName, setComboName] = useState<string>("");

    const { addCombo, getComboById } = useCart();

    // Generate combo name when products change
    useEffect(() => {
      if (comboProducts.length > 0) {
        const names = comboProducts
          .map(
            (p) => p.name.replace(/\b[Bb]uy\b/g, "").trim() // remove all "Buy" words
          )
          .join(" + ");

        setComboName(` ${names}`);
      }
    }, [comboProducts]);

    // Calculate total price
    const totalPrice = comboProducts.reduce((sum, product) => {
      return sum + (product.price ? Number.parseFloat(product.price) : 0);
    }, 0);

    // Calculate discount (example: 10% combo discount)
    const discountPercent = 0;
    const discountedPrice = totalPrice * (1 - discountPercent / 100);
    const savings = totalPrice - discountedPrice;

    const handleAddComboToCart = async () => {
      setIsAdding(true);

      // Wait for a brief moment to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log(comboProducts);

      if (onComboAddedToCart && comboProducts.length > 0) {
        onComboAddedToCart(comboProducts);
      } else {
        // Use the new addCombo method
        const newComboId = addCombo(comboProducts, discountPercent, 1);
        setComboId(newComboId);

        console.log("Adding combo to cart:", {
          comboId: newComboId,
          name: comboName,
          products: comboProducts,
          discountPercent,
        });
        onChange(newComboId);
      }

      setIsAdding(false);
      setShowSuccess(true);
      setIsAddedToCart(true);

      // Hide success state after 2 seconds but keep button disabled
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    };

    // Get current combo data from cart
    console.log("CURRENT COMBO", comboId);
    const currentCombo = comboId ? getComboById(comboId) : null;

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    if (comboProducts.length === 0) return null;

    return (
      <motion.div
        ref={ref}
        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ShineBorder
          duration={10}
          shineColor={["#f0f", "#0ff"]}
          borderWidth={2}
          style={{ borderRadius: "12px" }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Success Overlay */}
        <SuccessOverlay
          showSuccess={showSuccess}
          relatedProducts={comboProducts}
        />

        {/* Header */}
        <div className="p-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-gray-900">
              {isAddedToCart ? "Your Combo" : "Frequently Bought Together"}
            </h3>
            {isAddedToCart && (
              <div className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" />
                In Cart
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600">
            {isAddedToCart
              ? `${currentCombo?.name || comboName}`
              : `Save 15% when you buy these together`}
          </p>
        </div>

        {/* Products in Rows - Compact */}
        <div className="p-3">
          <div className="space-y-2 mb-3">
            {comboProducts.map((product, index) => (
              <Link
                key={index}
                href={product.permalink.split("/").filter(Boolean).pop() || "/"}
              >
                <React.Fragment key={index}>
                  <motion.div
                    className="flex items-center gap-3 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 flex-shrink-0 bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
                      {product.images && product.images[0] ? (
                        <Image
                          width={50}
                          height={50}
                          src={product.images[0].src || "/placeholder.svg"}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-0.5 line-clamp-1">
                        {product.name}
                      </h4>
                      {product.price && (
                        <p className="text-sm font-bold text-gray-900">
                          ₹{Number.parseFloat(product.price).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Show remove button */}
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault(); // STOP Link navigation

                        e.stopPropagation();
                        onRemoveFromCombo(product.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Remove from combo"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                </React.Fragment>
              </Link>
            ))}
          </div>

          {/* Pricing Section */}
          <PricingSection
            isAddedToCart={isAddedToCart}
            totalPrice={totalPrice}
            discountedPrice={discountedPrice}
            savings={savings}
            currentCombo={currentCombo}
          />

          <div className="space-y-2">
            {!isAddedToCart ? (
              <motion.button
                onClick={handleAddComboToCart}
                disabled={isAdding || comboProducts.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding to Cart...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add Combo to Cart ({comboProducts.length} books)
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <div className="space-y-2">
                <motion.div
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Check className="w-4 h-4" />
                  Combo in Cart
                </motion.div>

                {/* Edit Combo Section */}
                <details className="group">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 transition-colors list-none flex items-center justify-center gap-1 py-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit combo</span>
                    <svg
                      className="w-3 h-3 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                    <p className="text-xs text-gray-600 mb-2">
                      Add more books from the related products below
                    </p>
                  </div>
                </details>
              </div>
            )}

            {/* Individual Product Links - More compact */}
            <IndividualProductLink relatedProducts={comboProducts} />
          </div>
        </div>
      </motion.div>
    );
  }
);

ComboProduct.displayName = "ComboProduct";

const IndividualProductLink: React.FC<{ relatedProducts: FullProduct[] }> = ({
  relatedProducts,
}) => {
  return (
    <details className="group">
      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors list-none flex items-center justify-center gap-1 py-1">
        <span>Or buy individually</span>
        <svg
          className="w-3 h-3 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="mt-1 pt-1 border-t border-gray-100 space-y-0.5">
        {relatedProducts.map((product, index) => (
          <Link
            key={index}
            href={product.permalink.split("/").filter(Boolean).pop() || "/"}
            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate px-2 py-0.5 rounded hover:bg-blue-50"
          >
            {product.name}
          </Link>
        ))}
      </div>
    </details>
  );
};

const PricingSection: React.FC<{
  isAddedToCart: boolean;
  totalPrice: number;
  discountedPrice: number;
  savings: number;
  currentCombo?: { quantity: number } | null;
}> = ({ isAddedToCart, totalPrice, currentCombo }) => {
  return (
    <motion.div
      className={`${
        isAddedToCart
          ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
          : "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100"
      } rounded-md p-3 mb-3 border`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm ">
            <span className="text-gray-600">Individual: </span>
            <span className="text-gray-500 line-through font-medium">
              ₹{totalPrice + (totalPrice / 100) * 15}
            </span>
          </div>

          <TextType
            text={[
              "Save Extra 10% on checkout through Discount Codes / Coupon codes",
            ]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor={false}
            cursorCharacter="|"
            className="text-black text-xs"
            textColors={["#000000"]}
          />
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-emerald-700">
            ₹{totalPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Show current combo quantity if in cart */}
      {isAddedToCart && currentCombo && (
        <div className="mt-2 pt-2 border-t border-emerald-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-700">Quantity in cart:</span>
            <span className="font-medium text-emerald-800">
              {currentCombo.quantity}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const SuccessOverlay: React.FC<{
  showSuccess: boolean;
  relatedProducts: FullProduct[];
}> = ({ showSuccess, relatedProducts }) => {
  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          className="absolute inset-0 bg-emerald-500/95 flex items-center justify-center z-50 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Check className="w-8 h-8" />
            </motion.div>
            <motion.h3
              className="text-lg font-bold mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Combo Added!
            </motion.h3>
            <motion.p
              className="text-sm opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {relatedProducts.length} items added to cart
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
