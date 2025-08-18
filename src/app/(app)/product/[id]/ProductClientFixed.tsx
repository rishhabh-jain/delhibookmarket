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
import { useFlyingCart } from "@/hooks/useFlyingCart";
import RelatedProducts from "@/components/related-product/RelatedProducts";
import { ProductPage } from "@/app/types";

interface ProductClientProps {
  product: ProductPage;
}

interface StockResponse {
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
}

export default function ProductClientFixed({ product }: ProductClientProps) {
  const { showToast } = useAlert();
  const { animateToCart } = useFlyingCart();

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
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const productImageRef = useRef<HTMLImageElement>(null);

  const checkStockPromiseRef = useRef<Promise<void> | null>(null);

  const checkStock = async () => {
    if (stockRef.current === "fresh") {
      setStockStatus({
        stock_quantity: stockStatus?.stock_quantity ?? 1,
        stock_status: stockStatus?.stock_status ?? "instock",
      });
    }
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
      setStockStatus(() => {
        return {
          stock_quantity: response.stock_quantity,
          stock_status: response.stock_status,
        };
      });
      stockRef.current = "fresh";
    } catch (error) {
      console.log("Error checking stock:", error);
      // Set fallback stock data from product prop
      setStockStatus({
        stock_quantity: currentProduct.stock_quantity,
        stock_status: currentProduct.stock_status as
          | "instock"
          | "outofstock"
          | "onbackorder",
      });
      stockRef.current = "cached";
    } finally {
      setIsStockDataFetched(true);
      setStockCheckLoading(false);
    }
  };

  // Helper function to check if product is out of stock (only for fresh data)
  const isProductOutOfStockFresh = () => {
    if (!stockStatus || stockRef.current !== "fresh") {
      return false; // Don't treat as out of stock if we don't have fresh data
    }

    return (
      stockStatus.stock_status === "outofstock" ||
      (stockStatus.stock_quantity !== null && stockStatus.stock_quantity <= 0)
    );
  };

  // Helper function to check if we should show out of stock
  const shouldShowOutOfStock = () => {
    // Only show out of stock when we have fresh data and it's actually out of stock
    if (stockRef.current === "fresh" && isStockDataFetched) {
      return isProductOutOfStockFresh();
    }
    return false;
  };

  const handleAddToCart = async () => {
    if (isAdded || isAddingToCart) return;

    setIsAddingToCart(true);
    const startElement = addButtonRef.current || productImageRef.current;

    try {
      // If stock data is not fetched yet, wait for it
      if (!isStockDataFetched) {
        setStockCheckLoading(true);
        await checkStockPromiseRef.current;
      }

      // Now we have fresh stock data, check if it's actually out of stock
      const currentStockStatus = stockStatus || {
        stock_quantity: currentProduct.stock_quantity,
        stock_status: currentProduct.stock_status,
      };

      // Only check for out of stock if we have fresh data
      if (stockRef.current === "fresh" && isProductOutOfStockFresh()) {
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

      animateToCart({
        productImage: product.images[0]?.src || "/placeholder-book.jpg",
        productName: product.name,
        startElement,
        onAnimationComplete: () => {
          // Add to cart after animation
          addWooProduct(
            {
              ...currentProduct,
              stock_quantity: currentStockStatus.stock_quantity,
              stock_status: currentStockStatus.stock_status,
            },
            quantity
          );
          setIsAddingToCart(false);
        },
      });

      // addWooProduct(
      //   {
      //     ...currentProduct,
      //     stock_quantity: currentStockStatus.stock_quantity,
      //     stock_status: currentStockStatus.stock_status,
      //   },
      //   quantity
      // );

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
        await checkStock();
      }

      // Now we have fresh stock data, check if it's actually out of stock
      const currentStockStatus = stockStatus || {
        stock_quantity: currentProduct.stock_quantity,
        stock_status: currentProduct.stock_status,
      };

      // Only check for out of stock if we have fresh data
      if (stockRef.current === "fresh" && isProductOutOfStockFresh()) {
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
      return {
        quantity: stockStatus.stock_quantity,
        status: stockStatus.stock_status,
        isInStock: !isProductOutOfStockFresh(),
      };
    }
    // Fallback to product data
    return {
      quantity: currentProduct.stock_quantity,
      status: currentProduct.stock_status,
      isInStock:
        currentProduct.stock_quantity > 0 &&
        currentProduct.stock_status === "instock",
    };
  };

  const { quantity: stockQuantity, isInStock } = getCurrentStock();

  // Helper function to get button text for Add to Cart
  const getAddToCartButtonText = () => {
    if (stockCheckLoading) return "Checking stock...";
    if (shouldShowOutOfStock()) return "Out of stock";
    return "Add to basket";
  };

  // Helper function to get button text for Buy Now
  const getBuyNowButtonText = () => {
    if (isBuyingNow) return "Processing...";
    if (stockCheckLoading) return "Checking stock...";
    if (shouldShowOutOfStock()) return "Out of stock";
    return "Buy Now";
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
          {/* Product Image  */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Image
                ref={productImageRef}
                src={
                  currentProduct?.images[0]?.src ||
                  "/placeholder.svg?height=500&width=350" ||
                  "/placeholder.svg"
                }
                alt={currentProduct?.images[0]?.alt || currentProduct?.name}
                width={270}
                height={300}
                className="mx-auto rounded-lg shadow-md"
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

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                {stockCheckLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span className="text-gray-600">
                      Checking availability...
                    </span>
                  </>
                ) : shouldShowOutOfStock() ? (
                  <>
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Out of stock</span>
                  </>
                ) : isStockDataFetched && stockRef.current === "fresh" ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Available</span>
                  </>
                ) : null}
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
                  {stockCheckLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span className="text-gray-600">Checking stock...</span>
                    </>
                  ) : isStockDataFetched && stockRef.current === "fresh" ? (
                    <>
                      {shouldShowOutOfStock() ? (
                        <>
                          <X className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Out of stock</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">
                            {stockQuantity} in stock
                          </span>
                        </>
                      )}
                    </>
                  ) : null}
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
                        disabled={stockCheckLoading || shouldShowOutOfStock()}
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
                        disabled={stockCheckLoading || shouldShowOutOfStock()}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  ref={addButtonRef}
                  variant="outline"
                  className={`w-full text-sm h-9 transition-all duration-300 ease-in-out relative overflow-hidden ${
                    isAdded
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-50"
                      : "bg-transparent hover:bg-gray-50"
                  }`}
                  onClick={handleAddToCart}
                  disabled={
                    isAddingToCart ||
                    shouldShowOutOfStock() ||
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
                        <span>{getAddToCartButtonText()}</span>
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
                    isBuyingNow || shouldShowOutOfStock() || stockCheckLoading
                  }
                >
                  {getBuyNowButtonText()}
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
              currentProduct={{
                ...product,
                slug: product.permalink.split("/").filter(Boolean).pop() ?? "/",
              }}
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
            <BulkInquiryButton />
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
      <ProductDescription product={currentProduct} className="mx-4" />
      <UserReviews className="mt-4" />
      <Footer />
    </>
  );
}

const BulkInquiryButton = () => {
  return (
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
  );
};
