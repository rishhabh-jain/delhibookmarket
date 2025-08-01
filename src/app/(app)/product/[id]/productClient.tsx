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
  Truck,
  RotateCcw,
  Award,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header-footer/Header";
import Footer from "@/components/home/Footer";
import UserReviews from "@/components/home/UserReviews";
import { ProductDescription } from "@/components/product/HTMLDescriptionRendered";
import { useCart } from "@/context/CartContext";
import {
  type DeliveryInfo,
  DeliveryTimeEstimator,
} from "@/utils/DeliveryTimeEstimator";
import { useRouter } from "next/navigation";

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
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 46,
    seconds: 54,
  });
  const [deliveryData, setDeliveryData] = useState<DeliveryInfo | null>(null);
  const currentProduct = product;
  const { addWooProduct, items } = useCart();

  const handleAddToCart = () => {
    if (isAdded) return;

    setIsLoading(true);

    addWooProduct(product, 1);

    setIsLoading(false);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
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

  const handleDirectCheckout = (product: WooProduct) => {
    // Add the product to existing cart (doesn't clear previous items)
    addWooProduct(product, quantity);

    // Navigate to checkout
    router.push("/checkout");
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-3 bg-white">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-3">
          <span>Home</span> <span className="mx-1">{">"}</span>
          <span>Products</span> <span className="mx-1">{">"}</span>
          <span>NONFICTION499</span> <span className="mx-1">{">"}</span>
          <span className="text-gray-900">{currentProduct?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <img
                src={
                  currentProduct?.images[0]?.src ||
                  "/placeholder.svg?height=500&width=350" ||
                  "/placeholder.svg"
                }
                alt={currentProduct?.images[0]?.alt || currentProduct?.name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {currentProduct?.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                SOLD BY DELHI BOOK MARKET.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-gray-800"></div>
                <span className="font-medium">Softcover</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-700">Goodread ratings</span>
                {renderStars(
                  Number.parseFloat(currentProduct?.average_rating ?? "")
                )}
              </div>
            </div>

            {/* Pricing and Trust Badges Combined */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pricing */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-500 line-through text-base">
                    ₹{currentProduct?.regular_price}
                  </span>
                  <span className="text-red-600 text-2xl font-bold">
                    ₹{currentProduct?.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(
                    Number.parseFloat(currentProduct?.average_rating ?? "")
                  )}
                  <span className="text-xs text-gray-600">
                    ({currentProduct?.rating_count} reviews)
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-1">
                  Inclusive of all taxes
                </p>
                <p className="text-xs text-gray-600">Shipping at just ₹39</p>
              </div>

              {/* Trust Badge */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-blue-900">
                      Razorpay
                    </div>
                    <div className="text-xs text-blue-700">
                      Trusted Business
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-700">Verified Business</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-700">Secured Payments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock, Quantity, and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">
                    {currentProduct?.stock_quantity} in stock
                  </span>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 h-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-3 py-1 min-w-[2rem] text-center text-sm">
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
                        className="px-2 h-8"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className={`w-full text-sm h-9 transition-all duration-300 ease-in-out relative overflow-hidden ${
                    isAdded
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-50"
                      : "bg-transparent hover:bg-gray-50"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : isAdded ? (
                      <>
                        <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
                        <span className="animate-in slide-in-from-right-2 duration-200">
                          Added to basket
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to basket</span>
                      </>
                    )}
                  </div>

                  {/* Success background animation */}
                  {isAdded && (
                    <div className="absolute inset-0 bg-green-100 animate-in slide-in-from-left duration-300 ease-out" />
                  )}
                </Button>

                <Button
                  onClick={() => {
                    handleDirectCheckout(product);
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white text-sm h-9 transition-colors duration-200"
                >
                  Buy Now
                </Button>

                {/* Cart counter animation */}
                {isAdded && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Item added to your basket</span>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 text-center">
                Hurry Up! Offer ends in
              </h3>
              <div className="flex justify-center gap-2">
                <div className="bg-white border border-gray-200 rounded p-2 min-w-[50px] text-center">
                  <div className="text-lg font-bold text-red-500">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-600">hrs</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2 min-w-[50px] text-center">
                  <div className="text-lg font-bold text-red-500">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-600">min</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2 min-w-[50px] text-center">
                  <div className="text-lg font-bold text-red-500">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-600">sec</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs font-medium">Cash on delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium">
                  Free shipping above 399
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium">Easy Replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium">Best Quality</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-black text-white hover:bg-gray-800 text-sm h-9"
              >
                Bulk Inquiry
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-red-500 text-white hover:bg-red-600 text-sm h-9"
              >
                <Heart className="w-3 h-3 mr-1" />
                Add to wishlist
              </Button>
            </div>

            {/* Delivery Check */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2">Delivery Check:</h3>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 h-8 text-xs"
                  onClick={() => {
                    const data = DeliveryTimeEstimator(pincode);
                    setDeliveryData(data);
                  }}
                >
                  CHECK
                </Button>
              </div>
              {deliveryData && (
                <div className="mt-2 p-2 rounded border bg-white text-xs text-gray-800">
                  <p>
                    <span className="font-semibold text-gray-900">
                      Delivery in:
                    </span>{" "}
                    {deliveryData.days !== null
                      ? `${deliveryData.days} day(s)`
                      : "N/A"}
                  </p>
                  {deliveryData.note && (
                    <p className="mt-1 text-gray-600">{deliveryData.note}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mx-4">
        <ProductDescription product={currentProduct} />
      </div>

      {/* User Reviews */}
      <div className="mt-4">
        <UserReviews />
      </div>

      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </>
  );
}
