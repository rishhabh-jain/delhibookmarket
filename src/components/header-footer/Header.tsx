import React from "react";
import { Button } from "../ui/button";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function Header() {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-2">
                <div className="h-full w-full bg-white rounded-sm opacity-90"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  Delhi Book Market
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Your Literary Destination
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
              <span className="text-lg font-semibold text-gray-900">
                ₹ 0.00
              </span>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                  0
                </Badge>
                <span className="sr-only">Cart</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-500 py-2 text-center text-white">
          <span className="font-medium tracking-wide">
            FREE SHIPPING ON ORDERS ABOVE ₹499
          </span>
        </div>
      </header>
    </div>
  );
}
