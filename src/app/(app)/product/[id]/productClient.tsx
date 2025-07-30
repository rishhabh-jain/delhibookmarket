"use client";
import { useState, useEffect } from "react";
import {
  Star,
  Check,
  Minus,
  Plus,
  Heart,
  Shield,
  CreditCard,
  Headphones,
  Truck,
  RotateCcw,
  Award,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header-footer/Header";
import Footer from "@/components/home/Footer";
import UserReviews from "@/components/home/UserReviews";
import { ProductDescription } from "@/components/product/HTMLDescriptionRendered";
import { useCart } from "@/context/CartContext";

interface WooProduct {
  id: number;
  name: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }[];
  stock_quantity: number;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: string[];
  attributes: string[];
  average_rating: string;
  rating_count: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  _links: {
    self: {
      href: string;
      targetHints: {
        allow: ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")[];
      };
    }[];
    collection: {
      href: string;
    }[];
  };
}

interface ProductClientProps {
  product: WooProduct;
}

export default function ProductClient({ product }: ProductClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 46,
    seconds: 54,
  });

  const currentProduct = product;

  const { addWooProduct, items } = useCart();

  const handleAddToCart = () => {
    addWooProduct(product, 1);
    console.log(items);
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <section className="container mx-auto px-4 lg:px-6 py-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-12 pr-4 bg-white border-gray-200 rounded-full h-14 text-lg shadow-sm focus:shadow-md transition-shadow"
            placeholder="Search by Title, Author, or ISBN..."
          />
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6  bg-white">
        {/* Breadcrumb */}

        <nav className="text-sm text-gray-600 mb-6">
          <span>Home</span> <span className="mx-2">{">"}</span>
          <span>Products</span> <span className="mx-2">{">"}</span>
          <span>NONFICTION499</span> <span className="mx-2">{">"}</span>
          <span className="text-gray-900">{currentProduct?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <img
                src={
                  currentProduct?.images[0]?.src ||
                  "/placeholder.svg?height=600&width=400"
                }
                alt={currentProduct?.images[0]?.alt || currentProduct?.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentProduct?.name}
              </h1>
              <p className="text-gray-600 font-medium">
                SOLD BY DELHI BOOK MARKET.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-gray-800"></div>
              <span className="font-medium">Softcover</span>
            </div>

            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-700">Goodread ratings</span>
              {renderStars(
                Number.parseFloat(currentProduct?.average_rating ?? "")
              )}
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gray-500 line-through text-lg">
                  ₹{currentProduct?.regular_price}
                </span>
                <span className="text-red-600 text-3xl font-bold">
                  ₹{currentProduct?.price}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {renderStars(
                  Number.parseFloat(currentProduct?.average_rating ?? "")
                )}
                <span className="text-gray-600">
                  ({currentProduct?.rating_count} reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-2">Inclusive of all taxes</p>
              <p className="text-gray-600">Shipping at just ₹39</p>
            </div>

            {/* Stock and Quantity */}
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-600">
                {currentProduct?.stock_quantity} in stock
              </span>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          currentProduct?.stock_quantity ?? 1,
                          quantity + 1
                        )
                      )
                    }
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={handleAddToCart}
                >
                  Add to basket
                </Button>
              </div>
            </div>

            <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg">
              Buy Now
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-blue-900">Razorpay</div>
                <div className="text-blue-700">Trusted Business</div>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  Verified <span className="text-gray-500">Business</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  Secured <span className="text-gray-500">Payments</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  Prompt <span className="text-gray-500">Support</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Hurry Up! Offer ends in
          </h3>
          <div className="flex justify-center gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-red-500">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-gray-600 text-sm">hours</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-red-500">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-gray-600 text-sm">minutes</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-red-500">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-gray-600 text-sm">seconds</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <span className="font-medium">Cash on delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-medium">Free shipping above 399</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-medium">Easy Replacement</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-medium">Best Quality</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            Bulk Inquiry
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            <Heart className="w-4 h-4 mr-2" />
            Add to wishlist
          </Button>
        </div>

        {/* Delivery Check */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Delivery:</h3>
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-3">
              Check Availability At
            </h4>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter Pincode/ Zipcode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8">
                CHECK
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
      </div>

      <div className="mx-4">
        <ProductDescription product={currentProduct} />
      </div>

      {/* User Reviews */}
      <div className="mt-6">
        <UserReviews />
      </div>

      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </>
  );
}
