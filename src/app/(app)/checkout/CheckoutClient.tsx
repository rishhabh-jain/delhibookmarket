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
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
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

// Mock useCart hook - replace with your actual implementation
interface CheckoutFormData {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string; // optional field
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
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

export default function CheckoutPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
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
  const [CODcharges, setCodCharges] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>();

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
      return;
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
      } else {
        // All items are in stock - proceed with checkout
        console.log("✅ All items are in stock!");
      }
    } catch (error) {
      console.error("Error checking stock:", error);
      alert("Failed to check stock availability. Please try again.");
    } finally {
      setIsCheckingStock(false);
    }
  };

  const handleCheckout = async (data: CheckoutFormData) => {
    checkOutOfStock();
    try {
      const PAYMENT_METHOD = paymentMethod;
      const PAYMENT_METHOD_TITLE = "TODO";
      const SET_PAID = "FALSE";
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
      const LINE_ITEMS = items.map((item) => {
        return { product_id: item.id, quantity: item.quantity };
      });
      const FEE_LINES = [
        {
          name: "COD Charges",
          total: "50",
          tax_status: "none",
        },
      ];
      const response = await axios.post("/api/create-woo-order", {
        payment_method: PAYMENT_METHOD,
        payment_method_title: PAYMENT_METHOD_TITLE,
        set_paid: SET_PAID,
        billing: BILLING,
        shipping: SHIPPING,
        line_items: LINE_ITEMS,
        fee_lines: paymentMethod === "cod" ? FEE_LINES : [],
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
      alert("Unexpected error occured");
    }
  };

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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg">delhi book market</span>
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
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

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
                    required
                    {...register("email")}
                  />

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
                    required
                    {...register("first_name")}
                  />
                  <Input
                    placeholder="Last name *"
                    className="h-12"
                    required
                    {...register("last_name")}
                  />
                </div>
                <Input
                  placeholder="Street address *"
                  className="h-12"
                  required
                  {...register("address_1")}
                />
                <Input
                  placeholder="Flat, suite, unit, etc."
                  className="h-12"
                  {...register("address_2")}
                />
                <Input
                  placeholder="Town / City *"
                  className="h-12"
                  required
                  {...register("city")}
                />
                <Input
                  placeholder="Postcode *"
                  className="h-12"
                  required
                  {...register("postcode")}
                />
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
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  defaultValue="haryana"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="State (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex">
                    <Select defaultValue="+91">
                      <SelectTrigger className="w-20 h-12 rounded-r-none border-r-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="10 digit mobile number *"
                      className="h-12 rounded-l-none flex-1"
                      required
                      {...register("phone")}
                    />
                  </div>
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

      <StockCheckModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        outOfStockList={outOfStockList}
        cartItems={items}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onContinue={handleContinueAfterUpdate}
      />
    </div>
  );
}
