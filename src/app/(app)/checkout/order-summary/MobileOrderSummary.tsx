"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ChevronDown,
  Package,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { ComboItem, CartItem } from "@/app/types"; // adjust import path
import { ComboEditorModal } from "@/components/combo/ComboEditorModel";
import { AlertVariant } from "@/context/AlertContext";

interface MobileOrderSummaryProps {
  showOrderSummary: boolean;
  setShowOrderSummary: (open: boolean) => void;
  finalTotal: number;
  total: number;
  shippingCost: number;
  items: (CartItem | ComboItem)[];
  paymentMethod: string;
  appliedCoupon: { description: string } | null;
  COUPON_DISCOUNT: number;
  showToast: (opts: {
    variant: AlertVariant;
    message: string;
    duration?: number;
  }) => void;
  removeCouponAndProduct: () => void;
  updateQuantity: (id: number, qty: number) => void;
  canAddToCart: (id: number, qty: number) => boolean;
  removeItem: (payload: {
    id: number;
    variation?: {
      id: number;
    };
  }) => void;
  showComboEditor: boolean;
  setShowComboEditor: (open: boolean) => void;
}

const MobileOrderSummary: React.FC<MobileOrderSummaryProps> = ({
  showOrderSummary,
  setShowOrderSummary,
  finalTotal,
  total,
  shippingCost,
  items,
  paymentMethod,
  appliedCoupon,
  COUPON_DISCOUNT,
  showToast,
  removeCouponAndProduct,
  updateQuantity,
  canAddToCart,
  removeItem,
  showComboEditor,
  setShowComboEditor,
}) => {
  return (
    <div className="lg:hidden mb-6">
      <Collapsible open={showOrderSummary} onOpenChange={setShowOrderSummary}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 text-base bg-transparent"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Show Order Summary
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">₹ {finalTotal.toFixed(2)}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {items.map((item) => {
                  const isCombo = item.type === "combo";
                  const combo = isCombo ? (item as ComboItem) : null;
                  const product = !isCombo ? (item as CartItem) : null;

                  return (
                    <div
                      key={item.id}
                      className={`${
                        isCombo ? "flex flex-col" : "flex"
                      } items-start gap-4 `}
                    >
                      {/* Image Preview */}
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
                                const getSizeClass = () => {
                                  if (productCount === 1)
                                    return "w-full h-full";
                                  if (productCount === 2) return "w-1/4 h-full";
                                  if (productCount === 3) return "w-1/4 h-4/5";
                                  if (productCount === 4) return "w-1/4 h-3/4";
                                  if (productCount === 5) return "w-1/5 h-3/5";
                                  if (productCount === 6) return "w-1/6 h-1/2";
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

                      {/* Details */}
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹ {item.price.toFixed(2)}
                        </p>
                        {item.type === "product" && item.variation && (
                          <p>{item.variation.name}</p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => {
                                removeCouponAndProduct();
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                );
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => {
                                removeCouponAndProduct();
                                updateQuantity(item.id, item.quantity + 1);
                              }}
                              disabled={!canAddToCart(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* {isCombo && (
                                <motion.button
                                  onClick={() => {
                                    if (combo) {
                                      setShowComboEditor(true);
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Edit combo"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </motion.button>
                              )} */}

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (items.length <= 1) {
                                showToast({
                                  variant: "warning",
                                  message: "Checkout must have atleast 1 item",
                                });
                                return;
                              }
                              removeCouponAndProduct();
                              if (item.type === "product") {
                                if (item.variation) {
                                  removeItem({
                                    id: item.id,
                                    variation: item.variation,
                                  });
                                }
                                removeItem({ id: item.id });
                              } else {
                                removeItem({ id: item.id });
                              }
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Combo Editor */}
                      <ComboEditorModal
                        isOpen={showComboEditor}
                        onClose={() => setShowComboEditor(false)}
                        combo={combo!}
                      />

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Empty Cart */}
                {items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                )}

                {/* Summary */}
                {items.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹ {shippingCost.toFixed(2)}</span>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="flex justify-between">
                        <span>COD charges</span>
                        <span>₹ {50}</span>
                      </div>
                    )}
                    {appliedCoupon && (
                      <div>
                        <div className="flex justify-between text-green-700">
                          <span>Coupon Applied</span>
                          <span>- ₹ {COUPON_DISCOUNT.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₹ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default memo(MobileOrderSummary);
