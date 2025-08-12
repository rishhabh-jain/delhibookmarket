"use client";
import { useEffect, useRef, useState } from "react";
import {
  Star,
  Check,
  Minus,
  Plus,
  Shield,
  CreditCard,
  Truck,
  RotateCcw,
  Award,
  ShoppingCart,
  X,
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
import { useAlert } from "@/context/AlertContext";
import CountDownTimer from "@/components/product/CountDownTimer";
import Image from "next/image";
import axios from "axios";
import RelatedProducts from "@/components/RelatedProducts";

export interface WooProduct {
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

interface StockResponse {
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
}

export default function ProductClient({ product }: ProductClientProps) {
  const { showToast } = useAlert();
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [stockStatus, setStockStatus] = useState<StockResponse | null>(null);
  const [isStockDataFetched, setIsStockDataFetched] = useState(false);
  const [stockCheckLoading, setStockCheckLoading] = useState(false);
  const router = useRouter();

  const [deliveryData, setDeliveryData] = useState<DeliveryInfo | null>(null);
  const currentProduct = product;
  const { addWooProduct } = useCart();

  const stockRef = useRef("cached");

  const checkStockPromiseRef = useRef<Promise<void> | null>(null);

  const checkStock = async () => {
    try {
      const {
        data: { response },
      } = await axios.post(
        "/api/check-stock-only",
        { id: currentProduct.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setStockStatus({
        stock_quantity: response.stock_quantity,
        stock_status: response.stock_status,
      });
      stockRef.current = "fresh";
    } catch (error) {
      console.log("Error checking stock:", error);
      // Set fallback stock data from product prop
      setStockStatus({
        stock_quantity: currentProduct.stock_quantity,
        stock_status: currentProduct.stock_status,
      });
    } finally {
      setIsStockDataFetched(true);
      setStockCheckLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (isAdded || isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      // If stock data is not fetched yet, wait for it
      if (!isStockDataFetched) {
        setStockCheckLoading(true);
        await checkStockPromiseRef.current;
      }

      // Check stock after ensuring data is fetched
      const currentStockStatus = stockStatus || {
        stock_quantity: currentProduct.stock_quantity,
        stock_status: currentProduct.stock_status,
      };

      if (
        currentStockStatus.stock_status === "outofstock" ||
        (currentStockStatus.stock_quantity !== null &&
          currentStockStatus.stock_quantity === 0)
      ) {
        showToast({
          variant: "warning",
          message: "This product is currently out of stock.",
        });
        return;
      }

      if (quantity > currentStockStatus.stock_quantity) {
        showToast({
          variant: "warning",
          message: `Only ${currentStockStatus.stock_quantity} items available in stock.`,
        });
        return;
      }

      addWooProduct(
        {
          ...currentProduct,
          stock_quantity: currentStockStatus.stock_quantity,
          stock_status: currentStockStatus.stock_status,
        },
        quantity
      );

      setIsAdded(true);
      showToast({
        variant: "success",
        message: "Product added to cart successfully!",
      });

      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast({
        variant: "warning",
        message: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDirectCheckout = async () => {
    if (isBuyingNow) return;

    setIsBuyingNow(true);

    try {
      // If stock data is not fetched yet, wait for it
      if (!isStockDataFetched) {
        setStockCheckLoading(true);
        await checkStockPromiseRef.current;
      }

      // Check stock after ensuring data is fetched
      const currentStockStatus = stockStatus || {
        stock_quantity: currentProduct.stock_quantity,
        stock_status: currentProduct.stock_status,
      };

      if (
        currentStockStatus.stock_status === "outofstock" ||
        (currentStockStatus.stock_quantity !== null &&
          currentStockStatus.stock_quantity === 0)
      ) {
        showToast({
          variant: "warning",
          message: "This product is currently out of stock.",
        });
        return;
      }

      if (quantity > currentStockStatus.stock_quantity) {
        showToast({
          variant: "warning",
          message: `Only ${currentStockStatus.stock_quantity} items available in stock.`,
        });
        return;
      }

      // Add the product to cart
      addWooProduct(
        {
          ...currentProduct,
          stock_quantity: currentStockStatus.stock_quantity,
          stock_status: currentStockStatus.stock_status,
        },
        quantity
      );

      // Navigate to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error during checkout:", error);
      showToast({
        variant: "warning",
        message: "Failed to proceed to checkout. Please try again.",
      });
    } finally {
      setIsBuyingNow(false);
    }
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

  useEffect(() => {
    const promise = checkStock();
    checkStockPromiseRef.current = promise;
  }, []);

  // Get current stock information
  const getCurrentStock = () => {
    if (stockStatus) {
      stockRef.current = "fresh";
      return {
        quantity: stockStatus.stock_quantity,
        status: stockStatus.stock_status,
        isInStock:
          stockStatus.stock_quantity > 0 &&
          stockStatus.stock_status === "instock",
      };
    }
    // Fallback to product data
    stockRef.current = "cached";
    return {
      quantity: currentProduct.stock_quantity,
      status: currentProduct.stock_status,
      isInStock:
        currentProduct.stock_quantity > 0 &&
        currentProduct.stock_status === "instock",
    };
  };

  const { quantity: stockQuantity, isInStock } = getCurrentStock();

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
          {/* Product Image  cccccccc*/}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Image
                src={
                  currentProduct?.images[0]?.src ||
                  "/placeholder.svg?height=500&width=350" ||
                  "/placeholder.svg"
                }
                alt={currentProduct?.images[0]?.alt || currentProduct?.name}
                width={300}
                height={400}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Product Detailsc */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {currentProduct?.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                SOLD BY DELHI BOOK MARKET.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                {!isInStock && stockRef.current === "cached" ? (
                  <></>
                ) : (
                  <>
                    {stockCheckLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : isInStock ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}

                    <span
                      className={`${
                        isInStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stockCheckLoading
                        ? "Checking availability..."
                        : isInStock
                        ? "Available"
                        : "Out of stock"}
                    </span>
                  </>
                )}
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
                  {!isInStock && stockRef.current === "cached" ? (
                    <></>
                  ) : (
                    <>
                      {stockCheckLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : isInStock ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-${isInStock ? "green" : "red"}-600`}
                      >
                        {stockCheckLoading
                          ? "Checking stock..."
                          : `${stockQuantity} in stock`}
                      </span>
                    </>
                  )}
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
                        disabled={stockCheckLoading}
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
                          setQuantity(Math.min(stockQuantity, quantity + 1))
                        }
                        className="px-2 h-8"
                        disabled={stockCheckLoading}
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
                  disabled={
                    isAddingToCart ||
                    (!isInStock && stockRef.current === "fresh") ||
                    stockCheckLoading
                  }
                >
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {isAddingToCart ? (
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
                        <span>
                          {stockCheckLoading
                            ? "Checking stock..."
                            : !isInStock && stockRef.current == "cached"
                            ? "Add to basket"
                            : "Out of stock"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Success background animation */}
                  {isAdded && (
                    <div className="absolute inset-0 bg-green-100 animate-in slide-in-from-left duration-300 ease-out" />
                  )}
                </Button>

                <Button
                  onClick={handleDirectCheckout}
                  className="w-full bg-black hover:bg-gray-800 text-white text-sm h-9 transition-colors duration-200"
                  disabled={
                    isBuyingNow ||
                    (!isInStock && stockRef.current === "fresh") ||
                    stockCheckLoading
                  }
                >
                  {isBuyingNow ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : stockCheckLoading ? (
                    "Checking stock..."
                  ) : !isInStock && stockRef.current == "cached" ? (
                    "Buy Now"
                  ) : (
                    "Out of stock"
                  )}
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

            <RelatedProducts
              productId={product.id.toString()}
              title={product.name}
            />

            {/* Countdown Timer */}
            <CountDownTimer
              initialTime={{ hours: 1, minutes: 0, seconds: 0 }}
              title="Limited Time Offer"
              subtitle="Hurry up! This offer expires soon."
            />

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
              <a href="https://shop.delhibookmarket.com/bulk-order-dropshipping/">
                <Button
                  variant="outline"
                  className="flex-1 bg-black text-white hover:bg-gray-800 text-sm h-9"
                >
                  Bulk Inquiry
                </Button>
              </a>
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
