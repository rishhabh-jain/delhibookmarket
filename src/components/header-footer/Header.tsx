"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import BookSearchBar from "../search/Searchbar";

export default function Header() {
  const { items, total } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Main header */}
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo and mobile menu */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Menu</span>
              </Button>

              <Link href="/" className="flex items-center">
                <img
                  src="/DBMLOGO-Photoroom.png"
                  alt="DELHI BOOK MARKET logo"
                  className="h-8 w-auto -ml-4"
                />
              </Link>
            </div>

            {/* Center section - Search (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search books, authors, genres..."
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist button */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-gray-100"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>

              {/* Cart section */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-3 py-2 border border-gray-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{total}
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900 sm:hidden">
                  ₹{total}
                </div>

                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 hover:bg-white/80 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-xs">
                        {items.length}
                      </Badge>
                    )}
                    <span className="sr-only">Cart ({items.length} items)</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <BookSearchBar />
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/categories"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Categories
                </Link>
                <Link
                  href="/bestsellers"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Bestsellers
                </Link>
                <Link
                  href="/new-arrivals"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  New Arrivals
                </Link>
                <Link
                  href="/offers"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Offers
                </Link>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    href="/wishlist"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>

        {/* Promotional banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-2.5 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="animate-marquee whitespace-nowrap">
              <span className="inline-block font-medium tracking-wide text-sm px-8">
                🚚 FREE SHIPPING ON ORDERS ABOVE ₹499 | 📚 FLAT 20% OFF ON FIRST
                ORDER | 🎉 NEW ARRIVALS EVERY WEEK | 💝 SPECIAL DISCOUNTS FOR
                STUDENTS
              </span>
              <span className="inline-block font-medium tracking-wide text-sm px-8">
                🚚 FREE SHIPPING ON ORDERS ABOVE ₹499 | 📚 FLAT 20% OFF ON FIRST
                ORDER | 🎉 NEW ARRIVALS EVERY WEEK | 💝 SPECIAL DISCOUNTS FOR
                STUDENTS
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
