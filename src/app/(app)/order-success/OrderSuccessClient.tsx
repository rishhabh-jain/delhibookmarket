"use client";

import { trackConversion } from "@/lib/gtag";
import {
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Package,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
interface OrderData {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency_symbol: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    image: {
      src: string;
    };
    sku: string;
  }>;
  shipping_total: string;
}

// Extend the Window interface to include ___gcfg and renderOptIn
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ___gcfg?: any;
    renderOptIn?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gapi?: any;
  }
}

export default function Component() {
  // Mock order_id for demo - in real app this would come from useSearchParams
  const order_id = useSearchParams().get("order_id");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order_id) {
      fetchOrderData(order_id);
    } else {
      setError("No order ID provided");
      setLoading(false);
    }
  }, [order_id]);

  const fetchOrderData = async (orderId: string) => {
    try {
      // Mock API call - replace with actual API call

      const response = await fetch(`/api/fetch-order-details/${orderId}`);

      const data = await response.json();

      console.log(data);
      setOrderData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Track conversion when page loads
    // You can pass a unique transaction ID here
    if (order_id && orderData) {
      trackConversion(order_id, Number(orderData?.total));
    }
  }, [order_id, orderData]);

  useEffect(() => {
    // Only run when we have orderData
    if (!orderData?.id || !orderData?.billing?.email) {
      console.log("Waiting for order data...", { orderData });
      return;
    }

    console.log("Order data available, loading Google Survey script...");

    const getEstimatedDeliveryDate = () => {
      const today = new Date();
      today.setDate(today.getDate() + 10);
      return today.toISOString().split("T")[0];
    };

    // Set up Google language configuration
    window.___gcfg = {
      lang: "en_US",
    };

    // Define global callback function FIRST (exactly like Google's example)
    window.renderOptIn = function () {
      console.log("renderOptIn called with orderData:", orderData);

      window.gapi.load("surveyoptin", function () {
        console.log("surveyoptin loaded, rendering with data:", {
          merchant_id: 5083721488,
          order_id: orderData.id.toString(), // Convert to string like in example
          email: orderData.billing.email,
          delivery_country: "IN",
          estimated_delivery_date: getEstimatedDeliveryDate(),
          opt_in_style: "CENTER_DIALOG",
        });

        window.gapi.surveyoptin.render({
          merchant_id: 5083721488,
          order_id: orderData.id.toString(), // Google expects string
          email: orderData.billing.email,
          delivery_country: "IN",
          estimated_delivery_date: getEstimatedDeliveryDate(),
          opt_in_style: "CENTER_DIALOG", // Added style option
        });
      });
    };

    // Create script exactly like Google's example
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
    script.async = true;
    script.defer = true;

    script.onload = () => console.log("Google API script loaded successfully");
    script.onerror = () => console.error("Failed to load Google API script");

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.renderOptIn;
      delete window.___gcfg;
    };
  }, [orderData]); // This will re-run when orderData changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error || "Order not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Script id="google-ads-conversion" strategy="afterInteractive">
        console.log(&quot;TRIGGERED&quot;)
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-623851782/4HOmCJXn3ugYEIbyvKkC',
            'transaction_id': '${order_id}'
          });
        `}
      </Script> */}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Header */}

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank You, {orderData.billing.first_name}!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your order has been successfully placed
            </p>
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Order #{orderData.number}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Confirmation */}
              <div className="bg-white rounded-lg shadow-md border-0">
                <div className="p-6 pb-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold">Order Confirmed</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    We have accepted your order and we are getting it ready. A
                    confirmation email has been sent to{" "}
                    <span className="font-medium text-gray-900">
                      {orderData.billing.email}
                    </span>
                  </p>
                  <p>We will sent you tracking id on whatsapp and on email</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md border-0">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {orderData.line_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image.src}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            SKU: {item.sku}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {orderData.currency_symbol}
                            {item.total}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">
                            Shipping: {orderData.currency_symbol}
                            {orderData.shipping_total}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            Total: {orderData.currency_symbol}
                            {orderData.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-white rounded-lg shadow-md border-0">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">
                    Customer Details
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">
                              {orderData.billing.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">
                              {orderData.billing.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Billing Address
                              </p>
                              <div className="text-sm space-y-1">
                                <p className="font-medium">
                                  {orderData.billing.first_name}{" "}
                                  {orderData.billing.last_name}
                                </p>
                                <p>{orderData.billing.address_1}</p>
                                {orderData.billing.address_2 && (
                                  <p>{orderData.billing.address_2}</p>
                                )}
                                <p>{orderData.billing.city}</p>
                                <p>
                                  {orderData.billing.state}{" "}
                                  {orderData.billing.postcode}
                                </p>
                                <p>{orderData.billing.country}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start space-x-3">
                            <Package className="w-4 h-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Shipping Address
                              </p>
                              <div className="text-sm space-y-1">
                                <p className="font-medium">
                                  {orderData.shipping.first_name}{" "}
                                  {orderData.shipping.last_name}
                                </p>
                                <p>{orderData.shipping.address_1}</p>
                                {orderData.shipping.address_2 && (
                                  <p>{orderData.shipping.address_2}</p>
                                )}
                                <p>{orderData.shipping.city}</p>
                                <p>
                                  {orderData.shipping.state}{" "}
                                  {orderData.shipping.postcode}
                                </p>
                                <p>{orderData.shipping.country}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md border-0">
                <div className="space-y-3">
                  <Link href="/">
                    <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Continue Shopping
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-md border-0">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          orderData.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm">Order Received</p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            orderData.date_created
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          ["processing", "completed"].includes(orderData.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div>
                        <p
                          className={`font-medium text-sm ${
                            ["processing", "completed"].includes(
                              orderData.status
                            )
                              ? ""
                              : "text-gray-500"
                          }`}
                        >
                          Processing
                        </p>
                        <p className="text-xs text-gray-400">Within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          orderData.status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div>
                        <p
                          className={`font-medium text-sm ${
                            orderData.status === "completed"
                              ? ""
                              : "text-gray-500"
                          }`}
                        >
                          Shipped
                        </p>
                        <p className="text-xs text-gray-400">
                          2-3 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm text-gray-500">
                          Delivered
                        </p>
                        <p className="text-xs text-gray-400">
                          5-7 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
