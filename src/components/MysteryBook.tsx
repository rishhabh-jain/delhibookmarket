"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { SURPRISE_BOOK } from "@/app/data/PROMOCODES";
import { BorderBeam } from "./magicui/border-beam";
import Image from "next/image";

const categories = [
  { id: "kids", name: "Kids", emoji: "🧸", variation_id: 64522 },
  { id: "non-fiction", name: "Non Fiction", emoji: "📚", variation_id: 64521 },
  {
    id: "mystery",
    name: "Mystery & Thriller",
    emoji: "🔍",
    variation_id: 64520,
  },
  { id: "romance", name: "Romance", emoji: "💕", variation_id: 64519 },
  { id: "teen", name: "Teen", emoji: "🌟", variation_id: 64518 },
  { id: "any", name: "ANY", emoji: "🎲", variation_id: 64523 },
];

export default function MysteryBookCard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { addWooProduct } = useCart();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = () => {
    const Findcategory = categories.find((category) => {
      return category.id === selectedCategory;
    });
    console.log("FINDCATEGORY ", Findcategory);
    console.log(
      `Adding mystery book from category: ${selectedCategory} to cart`
    );

    if (!Findcategory) {
      return;
    }
    addWooProduct({
      ...SURPRISE_BOOK,
      images: [
        {
          id: 1,
          src: "/mysterybook.png",
          alt: "Surprise book image",
          name: "Surprise book",
        },
      ],
      stock_quantity: 1,
      price: "49",
      regular_price: "99",
      sale_price: "49",
      variation: {
        id: Findcategory.variation_id,
        name: Findcategory.name,
      },
    });
    setIsSheetOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="cursor-pointer relative group"
          >
            {/* Animated Border Container */}
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 bg-[length:200%_200%] animate-gradient-xy">
              {/* Moving Border Animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-75"
                style={{
                  background:
                    "conic-gradient(from 0deg, #f43f5e, #a855f7, #06b6d4, #10b981, #f43f5e)",
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Inner Content Card */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                {/* Gradient Overlay */}
                <div className="absolute inset-0  opacity-60" />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center p-6 gap-6">
                    {/* Left Side - Details */}
                    <div className="flex-1 z-10">
                      <motion.h3
                        className="text-xl font-bold text-gray-900 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Buy Surprise Book <span className="text-sm text-rose-600">Pre loved / Used</span>
                      </motion.h3>

                      <motion.div
                        className="flex items-center gap-2 mb-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-3xl font-bold text-rose-600">
                          ₹49
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹149
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          75% OFF
                        </span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                      >
                        <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40">
                          <span className="flex items-center gap-2">
                            🎉 Buy Now
                          </span>
                        </Button>
                      </motion.div>
                    </div>

                    {/* Right Side - Enhanced Book Cover */}
                    <div className="relative z-10">
                      <motion.div
                        className="relative"
                        whileHover={{ rotateY: 12, rotateX: -5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        {/* Book Shadow */}
                        <div className="absolute inset-0 bg-black/20 rounded-xl blur-xl transform translate-x-2 translate-y-2" />

                        {/* Book Container */}
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden  shadow-2xl">
                          <Image
                            width={300}
                            height={300}
                            src="/question-Photoroom.png"
                            alt="Mystery Book Cover"
                            className="w-full h-full object-cover"
                          />

                          {/* Glossy Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />

                          {/* Question Mark Animation */}
                        </div>
                      </motion.div>

                      {/* Floating Sparkles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.8, 1.2, 0.8],
                            y: [-5, -15, -5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                          className={`absolute text-2xl ${
                            i === 0
                              ? "-top-2 -right-2"
                              : i === 1
                              ? "top-2 -left-3"
                              : "bottom-0 right-4"
                          }`}
                        >
                          ✨
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500" />
              </div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-rose-400 via-purple-400 to-cyan-400 rounded-3xl opacity-0 blur-xl"
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </SheetTrigger>

        <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] p-4">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold text-gray-900">
              Choose Your Mystery Category
            </SheetTitle>
            <SheetDescription className="sr-only">
              Select a book category for your surprise book purchase
            </SheetDescription>
          </SheetHeader>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-rose-500 text-white border-rose-500 shadow-lg"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Add to Cart Button */}
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart - ₹49
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </>
  );
}
