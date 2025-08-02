"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, Search, ShoppingCart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCart } from "@/context/CartContext";
import BookSearchBar from "../search/Searchbar";

export default function Header() {
  const { items, total } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const topCategories = [
    { name: "Fiction", href: "/product-category/fiction" },
    { name: "Self Help", href: "/product-category/self-help" },
    { name: "Finance", href: "/product-category/finance" },
    { name: "Startup/Business", href: "/product-category/business" },
    { name: "Bestsellers", href: "/product-category/all" },
    { name: "Romance", href: "/product-category/romance" },
    { name: "Trading/Stock", href: "/product-category/finance" },
    { name: "Manga", href: "/product-category/manga" },
  ];

  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Main header */}
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo and mobile menu */}
            <div className="flex items-center gap-4">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-gray-100"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full overflow-y-auto">
                    <nav className="flex flex-col p-4 space-y-1">
                      <a
                        href="shop.delhibookmarket.com/my-account-2/"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Account
                      </a>

                      <Link
                        href="/"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home
                      </Link>

                      {/* Top Categories with nested items */}
                      <Collapsible
                        open={isCategoriesOpen}
                        onOpenChange={setIsCategoriesOpen}
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <span>Top Categories</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              isCategoriesOpen ? "rotate-90" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {topCategories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>

                      <Link
                        href="/prouduct-category/fiction"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Fiction Books
                      </Link>

                      <Link
                        href="/product-category/all"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        All Books / Categories
                      </Link>

                      <Link
                        href="/product-category/non-fiction"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Non Fiction Books
                      </Link>

                      <a
                        href="https://panel.shipmozo.com/track-order/nOXNBKEHQtjiM0VPIA8U"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Track Order
                      </a>

                      <a
                        href="https://shop.delhibookmarket.com/contact/"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Contact Us
                      </a>

                      <a
                        href="https://shop.delhibookmarket.com/bulk-order-dropshipping/"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Bulk Order/Dropshipping
                      </a>

                      <Link
                        href="/product-category/manga"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Manga Books
                      </Link>

                      <Link
                        href="/product-category/combos"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Combos
                      </Link>

                      <a
                        href="https://shop.delhibookmarket.com/vendor-registration-3/"
                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sell Textbooks
                      </a>

                      {/* Wishlist for mobile */}
                      {/* <div className="border-t border-gray-200 pt-4 mt-4">
                        <Link
                          href="/wishlist"
                          className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                      </div> */}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

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
              <BookSearchBar />
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
        </div>

        {/* Promotional banner */}
        <Link href="/promo-code">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-2.5 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="animate-marquee whitespace-nowrap">
                <span className="inline-block font-medium tracking-wide text-sm px-8">
                  CLICK TO CHECK SALE OFFERS
                </span>
                <span className="inline-block font-medium tracking-wide text-sm px-8">
                  CLICK TO CHECK SALE OFFERS
                </span>
              </div>
            </div>
          </div>
        </Link>
      </header>
    </div>
  );
}
