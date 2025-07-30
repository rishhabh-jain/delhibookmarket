"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/CartContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  quantity: number;
  image?: string;
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  permalink: string;
}

// Mock useCart hook - replace with your actual implementation

export function SideCart() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > item.stock_quantity && item.stock_status === "instock") {
      alert(`Only ${item.stock_quantity} copies available`);
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
  };

  const getStockBadge = (item: CartItem) => {
    switch (item.stock_status) {
      case "outofstock":
        return (
          <Badge variant="destructive" className="text-xs">
            Out of Stock
          </Badge>
        );
      case "onbackorder":
        return (
          <Badge variant="secondary" className="text-xs">
            On Backorder
          </Badge>
        );
      default:
        return item.stock_quantity <= 3 ? (
          <Badge variant="outline" className="text-xs">
            Only {item.stock_quantity} left
          </Badge>
        ) : null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some books to get started!
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/books">Browse Books</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <Link
                        href={item.permalink}
                        onClick={() => setIsOpen(false)}
                      >
                        <Image
                          src={
                            item.image ||
                            "/placeholder.svg?height=120&width=80&query=book cover"
                          }
                          alt={item.name}
                          width={60}
                          height={80}
                          className="rounded border object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link
                          href={item.permalink}
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-sm hover:text-primary transition-colors line-clamp-2 leading-tight"
                        >
                          {item.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-2">{getStockBadge(item)}</div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.regular_price > item.sale_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.regular_price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                            disabled={
                              item.stock_status === "outofstock" ||
                              (item.stock_status === "instock" &&
                                item.quantity >= item.stock_quantity)
                            }
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Cart Footer */}
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={items.some(
                    (item) => item.stock_status === "outofstock"
                  )}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>

              {items.some((item) => item.stock_status === "outofstock") && (
                <p className="text-xs text-destructive text-center">
                  Remove out-of-stock items to checkout
                </p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
