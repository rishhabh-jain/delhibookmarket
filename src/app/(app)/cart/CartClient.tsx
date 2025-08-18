"use client";

import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Package,
  ShoppingCart,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import DeliveryChecker from "@/components/DeliveryChecker";
import { useState } from "react";
import { motion } from "framer-motion";
import { CartItem, CartItemUnion, ComboItem } from "@/app/types";
import Image from "next/image";
import { ComboEditorModal } from "@/components/combo/ComboEditorModel";

interface CartItemComponentProps {
  item: CartItemUnion;
  showControls?: boolean;
  className?: string;
}
// Mock useCart hook - replace with your actual implementation
export default function CartClient() {
  const { items, total, itemCount } = useCart();

  // const handleQuantityChange = (item: CartItem, newQuantity: number) => {
  //   if (newQuantity > item.stock_quantity && item.stock_status === "instock") {
  //     return;
  //   }
  //   updateQuantity(item.id, newQuantity);
  // };

  // const handleRemoveItem = (item: CartItem) => {
  //   removeItem(item.id);
  // };

  // const getStockBadge = (item: CartItem) => {
  //   switch (item.stock_status) {
  //     case "outofstock":
  //       return (
  //         <Badge variant="destructive" className="text-xs">
  //           Out of Stock
  //         </Badge>
  //       );
  //     case "onbackorder":
  //       return (
  //         <Badge variant="secondary" className="text-xs">
  //           On Backorder
  //         </Badge>
  //       );
  //     default:
  //       return item.stock_quantity <= 3 ? (
  //         <Badge variant="outline" className="text-xs">
  //           Only {item.stock_quantity} left
  //         </Badge>
  //       ) : null;
  //   }
  // };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen">
        <div className="max-w-md mx-auto text-center pt-16">
          <ShoppingBag className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base px-4">
            Looks like you have not added any books to your cart yet.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="font-semibold">Cart</h1>
            <p className="text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden sm:flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => {
                // const slug = item.permalink.split("/").filter(Boolean).pop();
                return (
                  <CartItemComponent key={item.id} item={item} showControls />
                );
              })}

              {/* Delivery Checker - Mobile */}
              <div className="sm:hidden">
                <Card>
                  <CardContent className="p-4">
                    <DeliveryChecker />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Delivery Checker - Desktop */}
            <div className="hidden sm:block lg:hidden">
              <Card>
                <CardContent className="p-4">
                  <DeliveryChecker />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-4">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  {/* Desktop Delivery Checker */}
                  <div className="hidden lg:block mb-6">
                    <DeliveryChecker />
                  </div>

                  <Link href="/checkout">
                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-medium"
                      // disabled={items.some(
                      //   (item) => item.stock_status === "outofstock"
                      // )}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>

                  {/* {items.some((item) => item.stock_status === "outofstock") && (
                    <p className="text-xs sm:text-sm text-destructive mt-2 text-center">
                      Please remove out-of-stock items to continue
                    </p>
                  )} */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}

      {/* Bottom padding for mobile to account for fixed bottom bar */}
      <div className="sm:hidden h-24"></div>
    </div>
  );
}

const RemoveButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Remove item"
    >
      <Trash2 className="w-4 h-4" />
    </motion.button>
  );
};

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  showControls = true,
  className = "",
}) => {
  const { updateQuantity, removeItem } = useCart();
  const [showComboEditor, setShowComboEditor] = useState(false);

  const handleQuantityChange = (item: CartItemUnion, newQuantity: number) => {
    if (item.type === "combo") {
      updateQuantity(item.id, newQuantity);
      return;
    } else {
      if (
        newQuantity > item.stock_quantity &&
        item.stock_status === "instock"
      ) {
        return;
      }
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const isCombo = item.type === "combo";
  const combo = isCombo ? (item as ComboItem) : null;
  const product = !isCombo ? (item as CartItem) : null;

  return (
    <>
      <div
        className={`bg-white border border-gray-200 rounded-lg p-3 sm:p-4 ${className}`}
      >
        <div
          className={`flex ${
            combo ? "flex-col" : "sm:flex-row"
          } gap-3 sm:gap-4 items-start sm:items-center`}
        >
          {/* Image */}
          <div
            className={`${
              combo ? "w-full" : "w-24"
            } flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200 relative`}
          >
            {isCombo ? (
              combo?.products && combo.products.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center gap-0.5 p-1">
                  {combo.products.map((p, i) => {
                    const productCount = combo.products.length;
                    // Dynamic sizing based on product count
                    const getSizeClass = () => {
                      if (productCount === 1) return "w-full h-full";
                      if (productCount === 2) return "w-1/2 h-full";
                      if (productCount === 3) return "w-1/3 h-4/5";
                      if (productCount === 4) return "w-1/4 h-3/4";
                      if (productCount === 5) return "w-1/5 h-3/5";
                      if (productCount === 6) return "w-1/6 h-1/2";
                      // For more than 6 products, use flex-1 with max-width constraints
                      return "flex-1 max-w-[12%] h-2/5 min-w-[8px]";
                    };

                    return (
                      <Image
                        key={i}
                        src={p.images?.[0]?.src}
                        alt={p.name}
                        className={`${getSizeClass()} object-contain rounded-sm shadow-sm transition-all duration-300 hover:scale-110`}
                        width={100}
                        height={100}
                      />
                    );
                  })}
                </div>
              ) : combo?.image ? (
                <Image
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-full object-contain"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-6 h-6" />
                </div>
              )
            ) : product?.image ? (
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            {/* Combo badge */}
            {isCombo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <Package className="w-3 h-3" /> Combo
              </span>
            )}

            {/* Name */}
            {/* {item.type === "combo" && (
              
            )} */}

            {item.type === "product" && (
              <Link
                href={
                  item.permalink.split("/").filter(Boolean).pop() ??
                  item.permalink
                }
              ></Link>
            )}

            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 line-clamp-2">
              {item.name}
            </h3>

            {/* Combo Details */}
            {isCombo && combo && (
              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-1">
                  {combo.products.length} products
                  {combo.discountPercent &&
                    combo.discountPercent > 0 &&
                    ` • ${combo.discountPercent}% discount`}
                </p>
                <details className="group">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 transition-colors list-none">
                    View products
                    <svg
                      className="inline w-3 h-3 ml-1 transition-transform group-open:rotate-180"
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
                  <div className="mt-1 pl-3 border-l-2 border-gray-200 space-y-1">
                    {combo.products.map((product, index) => (
                      <div key={product.id} className="text-xs text-gray-600">
                        {index + 1}. {product.name}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* Stock Status */}
            {!isCombo && product && product.stock_status !== "instock" && (
              <div className="mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {product.stock_status === "outofstock"
                    ? "Out of Stock"
                    : "On Backorder"}
                </span>
              </div>
            )}

            {/* Price + Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-600">
                    ₹{item.price.toFixed(2)} each
                  </p>
                )}
              </div>

              {showControls && (
                <div className="flex items-center gap-2">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      className="px-2 py-1 sm:px-3 hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-2 sm:px-3 py-1 text-sm font-medium border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      className="px-2 py-1 sm:px-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Edit combo */}
                  {isCombo && (
                    <motion.button
                      onClick={() => setShowComboEditor(true)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit combo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                  )}

                  {/* Remove */}
                  <RemoveButton onClick={handleRemove} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ComboEditorModal
        isOpen={showComboEditor}
        onClose={() => setShowComboEditor(false)}
        combo={combo!}
      />
    </>
  );
};
