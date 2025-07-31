"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { sendCartToWooCommerce } from "@/utils/cartSync";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock useCart hook - replace with your actual implementation

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

export default function CartClient() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const cartItems = items.map((item) => {
    return { product_id: item.id, quantity: item.quantity };
  });

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > item.stock_quantity && item.stock_status === "instock") {
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleCheckout = async () => {
    console.log(cartItems);
    const result = await sendCartToWooCommerce(cartItems);

    console.log(result);

    if (result.status === "success") {
      if (result.session_id) {
        localStorage.setItem("woo_session_id", result.session_id);
      }
      // if (result.outOfStockProducts.length > 0) {
      //   alert("Some items are out of stock");
      //   return;
      // }
      // router.push(result.redirect_url);
      window.location.href = result.checkout_url;
    } else {
      alert("Something went wrong!");
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
    // toast({
    //   title: "Item Removed",
    //   description: `₹{item.name} has been removed from your cart`,
    // });
  };

  const getStockBadge = (item: CartItem) => {
    switch (item.stock_status) {
      case "outofstock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "onbackorder":
        return <Badge variant="secondary">On Backorder</Badge>;
      default:
        return item.stock_quantity <= 3 ? (
          <Badge variant="outline">Only {item.stock_quantity} left</Badge>
        ) : null;
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you have not added any books to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/books">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <Link href={item.permalink}>
                        <Image
                          src={
                            item.image ||
                            "/placeholder.svg?height=200&width=150&query=book cover"
                          }
                          alt={item.name}
                          width={100}
                          height={133}
                          className="rounded-md border object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          href={item.permalink}
                          className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-3">{getStockBadge(item)}</div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            ₹{item.price.toFixed(2)}
                          </span>
                          {item.regular_price > item.sale_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.regular_price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
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
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 text-right">
                        <span className="text-sm text-muted-foreground">
                          Subtotal:{" "}
                          <span className="font-semibold text-foreground">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={items.some(
                    (item) => item.stock_status === "outofstock"
                  )}
                >
                  Proceed to Checkout
                </Button>

                {items.some((item) => item.stock_status === "outofstock") && (
                  <p className="text-sm text-destructive mt-2 text-center">
                    Please remove out-of-stock items to continue
                  </p>
                )}

                <div className="mt-4 text-xs text-muted-foreground text-center">
                  <p>Free shipping on orders over ₹25</p>
                  <p>30-day return policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
