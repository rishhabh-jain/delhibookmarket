"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Gift,
  Truck,
  ShoppingBag,
  BoxIcon as Bottle,
  Percent,
  Tag,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "./header-footer/Header";
import Footer from "./home/Footer";

const promoOffers = [
  {
    id: 1,
    title: "Free Shipping",
    description: "Get free shipping on your order",
    code: "FREESHIPPING",
    minOrder: 399,
    icon: Truck,
    gradient: "from-emerald-400 to-teal-500",
    bgPattern: "bg-emerald-50",
    textColor: "text-emerald-800",
  },
  {
    id: 2,
    title: "Free Jute Bag",
    description: "Get a complimentary eco-friendly jute bag",
    code: "FREEBAG",
    minOrder: 999,
    icon: ShoppingBag,
    gradient: "from-amber-400 to-orange-500",
    bgPattern: "bg-amber-50",
    textColor: "text-amber-800",
  },
  {
    id: 3,
    title: "Free Bottle",
    description: "Get a free premium bottle with your order",
    code: "FREEBOTTLE",
    minOrder: 699,
    icon: Bottle,
    gradient: "from-blue-400 to-cyan-500",
    bgPattern: "bg-blue-50",
    textColor: "text-blue-800",
  },
  {
    id: 7,
    title: "Free Diary",
    description: "Get a complimentary premium diary with your order",
    code: "FREEDIARY",
    minOrder: 499,
    icon: BookOpen,
    gradient: "from-indigo-400 to-purple-500",
    bgPattern: "bg-indigo-50",
    textColor: "text-indigo-800",
  },
  {
    id: 4,
    title: "Summer Sale",
    description: "10% off on all orders",
    code: "SUMMERSALE",
    minOrder: 599,
    discount: "10% OFF",
    icon: Percent,
    gradient: "from-purple-400 to-pink-500",
    bgPattern: "bg-purple-50",
    textColor: "text-purple-800",
  },
  {
    id: 5,
    title: "Reader's Special",
    description: "₹200 off on Orders above ₹1999",
    code: "READERS2K",
    minOrder: 1999,
    discount: "₹200 OFF",
    icon: Tag,
    gradient: "from-rose-400 to-red-500",
    bgPattern: "bg-rose-50",
    textColor: "text-rose-800",
  },
  {
    id: 6, // also fixed the duplicate id!
    title: "Reader's Special",
    description: "₹300 off on Orders above ₹2999",
    code: "READERS3K",
    minOrder: 2999,
    discount: "₹300 OFF", // also fixed this typo from "3200 OFF"
    icon: Tag,
    gradient: "from-pink-500 to-red-600",
    bgPattern: "bg-pink-50",
    textColor: "text-pink-800",
  },
];

export default function PromoSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <Header />
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Exclusive Offers & Deals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock amazing savings with our special promo codes. Limited time
              offers you don&apos;t want to miss!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoOffers.map((offer) => {
              const IconComponent = offer.icon;
              return (
                <Card
                  key={offer.id}
                  className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${offer.bgPattern}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-full bg-gradient-to-br ${offer.gradient} text-white shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {offer.discount && (
                        <Badge
                          variant="secondary"
                          className={`${offer.textColor} bg-white/80 font-bold text-sm px-3 py-1`}
                        >
                          {offer.discount}
                        </Badge>
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${offer.textColor}`}>
                      {offer.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="space-y-3">
                      <div
                        className={`p-3 rounded-lg bg-white/70 border-2 border-dashed ${offer.textColor.replace(
                          "text-",
                          "border-"
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono font-bold text-lg ${offer.textColor}`}
                          >
                            {offer.code}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(offer.code)}
                            className={`${offer.textColor} hover:bg-white/50 p-2`}
                          >
                            {copiedCode === offer.code ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Gift className="w-4 h-4" />
                        <span>
                          On orders above{" "}
                          <span className="font-semibold text-gray-800">
                            ₹{offer.minOrder}
                          </span>
                        </span>
                      </div>
                    </div>

                    <Button
                      className={`w-full mt-4 bg-gradient-to-r ${offer.gradient} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105`}
                      onClick={() => copyToClipboard(offer.code)}
                    >
                      {copiedCode === offer.code ? "Copied!" : "Copy Code"}
                    </Button>
                  </CardContent>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500" />
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              * Terms and conditions apply. Offers cannot be combined. Valid for
              limited time only.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
