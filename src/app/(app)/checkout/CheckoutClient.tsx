"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ShoppingCart,
  Lock,
  Loader2,
  CheckCircle,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useDebounce } from "@uidotdev/usehooks";
import StockCheckModal from "./StockCheckModal";
import { useRouter } from "next/navigation";
import BookLoadingModal from "@/components/loading/CheckoutLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/Schemma/CheckOutSchemma";
import z, { set } from "zod";
import { useAlert } from "@/context/AlertContext";
import CustomerLoveSection from "@/components/CustomerloveSection";

// Mock useCart hook - replace with your actual implementation

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface StockIssueItem {
  product_id: number;
  product_name: string;
  requested_quantity: number;
  available_quantity: number;
  out_of_stock_quantity: number;
}

interface StockCheckResponse {
  out_of_stock_list: StockIssueItem[];
}
type CheckoutFormData = z.infer<typeof checkoutSchema>; // or define it manually if not using zod

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function CheckoutPage() {
  const { items, total, clearCart, updateQuantity, removeItem, canAddToCart } =
    useCart();
  const { showToast } = useAlert();

  const router = useRouter();
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [createAccount, setCreateAccount] = useState(false);
  const [reviewInvite, setReviewInvite] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFormPopulated, setIsFormPopulated] = useState(false);
  const [outOfStockList, setOutOfStockList] = useState<StockIssueItem[]>([]);
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const emailValue = watch("email"); // this will give you the current value of 'email'
  const shippingCost = 39;
  const COD_CHARGES = paymentMethod === "cod" ? 50 : 0;
  const finalTotal = total + shippingCost + COD_CHARGES;
  const debouncedSearchTerm = useDebounce(emailValue, 1000);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const searchUser = async () => {
      // If no search term, reset everything
      if (!debouncedSearchTerm) {
        console.log("Clearing user data");
        setHasSearched(false);
        setUser(null);
        setIsFormPopulated(false);
        return;
      }

      // Validate email format before making API call
      if (!isValidEmail(debouncedSearchTerm)) {
        console.log("Invalid email format, skipping search");
        setUser(null);
        setHasSearched(false);
        setIsFormPopulated(false);
        return;
      }

      // Skip if we already searched for this exact email
      if (hasSearched && user?.email === debouncedSearchTerm) {
        console.log("Already searched for this email");
        return;
      }

      console.log("Searching for user with valid email");
      setUserLoading(true);
      setHasSearched(true);

      try {
        const { data } = await axios.get(
          `/api/check-registered-users?email=${debouncedSearchTerm}`
        );
        const foundUser = data?.user;
        setUser(foundUser);

        if (foundUser && foundUser.billing) {
          const shipping = foundUser.billing;
          reset({
            email: debouncedSearchTerm,
            first_name: shipping.first_name || "",
            last_name: shipping.last_name || "",
            address_1: shipping.address_1 || "",
            address_2: shipping.address_2 || "",
            city: shipping.city || "",
            state: shipping.state || "",
            postcode: shipping.postcode || "",
            country: shipping.country || "",
            phone: shipping.phone || "",
          });
          setIsFormPopulated(true);
        } else {
          setIsFormPopulated(false);
        }
      } catch (error) {
        console.log("Error searching for user:", error);
        setUser(null);
        setIsFormPopulated(false);
      } finally {
        setUserLoading(false);
      }
    };

    searchUser();
  }, [debouncedSearchTerm, reset]);

  const handleUserRegistration = async () => {
    const customerData = {
      email: emailValue,
    };
    const response = await axios.post("/api/create-woo-customer", customerData);
    console.log(response.data);
  };

  const checkOutOfStock = async () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return false;
    }

    setIsCheckingStock(true);
    try {
      const product_list = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const { data }: { data: StockCheckResponse } = await axios.post(
        "/api/check-product-stock",
        {
          product_list,
        }
      );

      console.log("Stock check result:", data);

      if (data.out_of_stock_list.length > 0) {
        // There are stock issues - show modal
        setOutOfStockList(data.out_of_stock_list);
        setIsModalOpen(true);
        return false; // Indicate stock issues
      } else {
        // All items are in stock - proceed with checkout
        console.log("✅ All items are in stock!");
        return true; // Indicate no stock issues
      }
    } catch (error) {
      console.error("Error checking stock:", error);
      alert("Failed to check stock availability. Please try again.");
      return true; // Assume success to avoid blocking checkout
    } finally {
      setIsCheckingStock(false);
    }
  };

  const loadScript = useCallback((src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleCheckout = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const IS_ITEMS_IN_STOCK = await checkOutOfStock(); // optional: await this if it's async

      if (!IS_ITEMS_IN_STOCK) {
        setIsSubmitting(false);
        return; // Stop checkout if items are out of stock
      }

      const PAYMENT_METHOD = paymentMethod;
      const PAYMENT_METHOD_TITLE =
        paymentMethod === "cod" ? "cod" : "online_payment"; // replace with proper name
      const SET_PAID = "false"; //

      const BILLING = {
        first_name: data.first_name,
        last_name: data.last_name,
        address_1: data.address_1,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        email: data.email,
        phone: data.phone,
      };

      const SHIPPING = {
        first_name: data.first_name,
        last_name: data.last_name,
        address_1: data.address_1,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
      };

      const LINE_ITEMS = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const FEE_LINES = [
        {
          name: "COD Charges",
          total: "50",
          tax_status: "none",
        },
      ];

      // 1️⃣ Create WooCommerce order
      const wooRes = await axios.post("/api/create-woo-order", {
        payment_method: PAYMENT_METHOD,
        payment_method_title: PAYMENT_METHOD_TITLE,
        set_paid: SET_PAID,
        billing: BILLING,
        shipping: SHIPPING,
        line_items: LINE_ITEMS,
        fee_lines: PAYMENT_METHOD === "cod" ? FEE_LINES : [],
      });

      const wooOrderData = wooRes.data.data;

      // 2️⃣ COD? Skip Razorpay and redirect
      if (PAYMENT_METHOD === "cod") {
        clearCart();
        router.replace(`/order-success?order_id=${wooOrderData.id}`);
        return;
      }

      // 3️⃣ Load Razorpay checkout script
      const scriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!scriptLoaded) {
        alert(
          "Payment system failed to load. Please check your internet connection."
        );
        return;
      }

      console.log(wooOrderData);

      // 4️⃣ Create Razorpay order
      const razorpayRes = await axios.post("/api/create-razorpay-order", {
        amountInRupees: Math.round(total), // total in ₹, backend will convert to paise
        wooOrderId: wooOrderData.id,
      });

      const razorpayOrderData = razorpayRes.data;

      // 5️⃣ Razorpay checkout config
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: razorpayOrderData.amount,
        currency: "INR",
        name: "Delhi Book Market",
        description: "Book Order Payment",
        order_id: razorpayOrderData.id, // 🔥 Fix: should be Razorpay's order ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          setIsVerifyingPayment(true);
          // 👇 Hit your verification route
          await fetch("/api/verify-razorpay-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              wooOrderId: wooOrderData.id,
            }),
          });
          setIsVerifyingPayment(false);
          clearCart();
          router.replace(`/order-success?order_id=${wooOrderData.id}`);
        },
        prefill: {
          name: data.first_name + " " + data.last_name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleTestForm = () => {
  //   reset({
  //     email: "tester28@gmail.com",
  //     first_name: "THIS IS A TEST",
  //     last_name: "ORDER",
  //     address_1: "TESTING ADDRESS STREET NO TEST 28 _ ADDRESS LINE 1",
  //     address_2: "TESTING ADDRESS STREET NO TEST 28 _ ADDRESS LINE 2",
  //     city: "TESTING CITY",
  //     state: "haryana",
  //     postcode: "122011",
  //     country: "india",
  //     phone: "9999999999",
  //   });
  // };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setOutOfStockList([]);
  };

  const handleContinueAfterUpdate = () => {
    // After user updates cart, proceed to checkout
  };

  useEffect(() => {
    if (createAccount) {
      handleUserRegistration();
    }
  }, [createAccount]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg">delhi book market</span>
          </Link>

          <Link
            href="/cart"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Back to Cart
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mobile Order Summary */}
        <div className="lg:hidden mb-6">
          <Collapsible
            open={showOrderSummary}
            onOpenChange={setShowOrderSummary}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-12 text-base bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Show Order Summary
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    ₹ {finalTotal.toFixed(2)}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={45}
                            height={60}
                            className="rounded border"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹ {item.price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border rounded">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={!canAddToCart(item.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (items.length <= 1) {
                                  showToast({
                                    variant: "warning",
                                    message:
                                      "Checkout must have atleast 1 item",
                                  });
                                  return;
                                }
                                removeItem(item.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Show message if cart is empty */}
                    {items.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Your cart is empty</p>
                      </div>
                    )}

                    {items.length > 0 && (
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹ {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>₹ {shippingCost.toFixed(2)}</span>
                        </div>
                        {paymentMethod === "cod" && (
                          <div className="flex justify-between">
                            <span>COD charges</span>
                            <span>₹ {50}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <span>Total</span>
                          <span>₹ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* {process.env.NODE_ENV == "development" && (
          <>
            <button
              className="p-4 border rounded-xl my-4 w-full"
              onClick={handleTestForm}
            >
              Fill the form
            </button>
          </>
        )} */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Form */}
          <form onSubmit={handleSubmit(handleCheckout)}>
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email *"
                    className="h-12"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}

                  {/* User Status Messages */}
                  {hasSearched && (
                    <div className=" flex flex-col gap-2">
                      {userLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking account...</span>
                        </div>
                      ) : user ? (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            You are logged in! Your details have been filled
                            automatically.
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* Checkbox for account creation */}
                          <label className="flex items-center gap-2 text text-gray-800">
                            <input
                              type="checkbox"
                              className="accent-blue-600"
                              checked={createAccount}
                              onChange={(e) =>
                                setCreateAccount(e.target.checked)
                              }
                            />
                            Create an account
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First name *"
                    className="h-12"
                    {...register("first_name")}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                  <Input
                    placeholder="Last name *"
                    className="h-12"
                    {...register("last_name")}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
                <Input
                  placeholder="Street address *"
                  className="h-12"
                  {...register("address_1")}
                />
                {errors.address_1 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.address_1.message}
                  </p>
                )}
                <Input
                  placeholder="Flat, suite, unit, etc."
                  className="h-12"
                  {...register("address_2")}
                />
                {errors.address_2 && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.address_2.message}
                  </p>
                )}
                <Input
                  placeholder="Town / City *"
                  className="h-12"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.city.message}
                  </p>
                )}
                <Input
                  placeholder="Postcode *"
                  className="h-12"
                  {...register("postcode")}
                />
                {errors.postcode && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.postcode.message}
                  </p>
                )}
                <Controller
                  name="country"
                  control={control}
                  defaultValue="india"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Country *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.country.message}
                  </p>
                )}
                <Controller
                  name="state"
                  control={control}
                  defaultValue="Haryana"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="State *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Search State</SelectLabel>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.state.message}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex">
                    <Select defaultValue="+91">
                      <SelectTrigger className="w-20 h-12 rounded-r-none border-r-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="10 digit mobile number *"
                      className="h-12 rounded-l-none flex-1"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Method */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Shipping Method
                </h2>
                <p className="text-sm text-gray-600">Shipping method</p>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="space-y-4">
                    {/* Flat Rate */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Flat Rate</span>
                      <span className="font-semibold text-gray-800">
                        ₹{shippingCost}.00
                      </span>
                    </div>

                    {/* COD Charges */}
                    {paymentMethod === "cod" && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">COD Charges</span>
                        <span className="font-semibold text-gray-800">
                          ₹50.00
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Payment Information
                </h2>
                <p className="text-sm text-gray-600">Payment information</p>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            R
                          </span>
                        </div>
                        <Label htmlFor="razorpay" className="font-medium">
                          Pay by Razorpay
                        </Label>
                        <span className="text-sm text-gray-600">
                          Credit Card/Debit Card/NetBanking
                        </span>
                      </div>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <p className="text-sm text-gray-600 mt-3 ml-9">
                        Pay securely by Credit or Debit card or Internet Banking
                        through Razorpay.
                      </p>
                    )}
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                          <span className="text-white text-xs">₹</span>
                        </div>
                        <Label htmlFor="cod" className="font-medium">
                          Cash on delivery
                        </Label>
                        <p>50rs extra charges</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
                  A humble request, please do not place your order on COD if you
                  are not sure about the purchase. As a small business, we face
                  losses on each returned and cancelled order!
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="review-invite"
                    checked={reviewInvite}
                    onCheckedChange={(checked) =>
                      setReviewInvite(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="review-invite"
                    className="text-sm leading-relaxed"
                  >
                    Would you like to be invited to review your order? Check
                    here to receive a message from CusRev (an independent
                    reviews service) with a review form.
                  </Label>
                </div>
              </div>

              {/* Place Order Button */}
              <Button className="w-full h-14 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700">
                <Lock className="w-5 h-5 mr-2" />
                Place Order Now ₹ {finalTotal}.00
              </Button>
            </div>
          </form>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-2xl font-bold">₹ {finalTotal}.00</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={45}
                        height={60}
                        className="rounded border"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                    </div>
                    <p className="font-semibold">₹ {item.price}</p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹ {total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹ {shippingCost}</span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between">
                      <span>COD charges</span>
                      <span>₹ {50}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹ {finalTotal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CustomerLoveSection />

      <StockCheckModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        outOfStockList={outOfStockList}
        cartItems={items}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onContinue={handleContinueAfterUpdate}
      />

      <BookLoadingModal
        isOrderProcessing={isSubmitting}
        isVerifying={isVerifyingPayment}
        isOpen={isSubmitting || isVerifyingPayment}
        onClose={() => {}}
      />
    </div>
  );
}
