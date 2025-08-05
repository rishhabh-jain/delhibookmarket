"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Truck,
  ShoppingBag,
  BoxIcon as Bottle,
  Percent,
  Tag,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    id: 6,
    title: "Reader's Special",
    description: "₹300 off on Orders above ₹2999",
    code: "READERS3K",
    minOrder: 2999,
    discount: "₹300 OFF",
    icon: Tag,
    gradient: "from-pink-500 to-red-600",
    bgPattern: "bg-pink-50",
    textColor: "text-pink-800",
  },
];

export default function CheckoutCoupons() {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="w-full max-w-2xl mx-auto">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 text-sm font-medium bg-transparent"
          >
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Show Available Coupons ({promoOffers.length})
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3">
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {promoOffers.map((offer) => {
              const IconComponent = offer.icon;
              return (
                <Card
                  key={offer.id}
                  className={`p-3 ${offer.bgPattern} border-l-4 border-l-transparent hover:border-l-current transition-colors`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${offer.gradient} text-white flex-shrink-0`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-semibold text-sm ${offer.textColor}`}
                          >
                            {offer.title}
                          </h4>
                          {offer.discount && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {offer.discount}
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {offer.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <code
                              className={`text-xs font-mono px-2 py-1 rounded ${offer.bgPattern} ${offer.textColor} border`}
                            >
                              {offer.code}
                            </code>
                            <span className="text-xs text-muted-foreground">
                              Min ₹{offer.minOrder}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(offer.code);
                      }}
                    >
                      {copiedCode === offer.code ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Click the copy icon to copy coupon codes. Apply them at checkout
              to save money!
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
