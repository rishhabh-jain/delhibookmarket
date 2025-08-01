// app/api/verify-razorpay-payment/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      wooOrderId,
    } = await req.json();

    // ✅ Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !wooOrderId
    ) {
      console.error("Missing required payment verification fields");
      return NextResponse.json(
        { status: "fail", reason: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Generate signature for verification
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // ✅ Verify signature
    if (generated_signature !== razorpay_signature) {
      console.error("Payment signature verification failed", {
        wooOrderId,
        razorpay_order_id,
        razorpay_payment_id,
      });

      return NextResponse.json(
        { status: "fail", reason: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log("✅ Payment signature verified successfully", {
      wooOrderId,
      razorpay_payment_id,
    });

    try {
      // ✅ Update WooCommerce order with more details
      const updateResponse = await axios.put(
        `https://delhibookmarket.com/wp-json/wc/v3/orders/${wooOrderId}`,
        {
          status: "processing",
          set_paid: true,
          payment_method: "razorpay",
          payment_method_title: "Razorpay",
          transaction_id: razorpay_payment_id, // Store Razorpay payment ID
          meta_data: [
            {
              key: "razorpay_order_id",
              value: razorpay_order_id,
            },
            {
              key: "razorpay_payment_id",
              value: razorpay_payment_id,
            },
            {
              key: "payment_verified_at",
              value: new Date().toISOString(),
            },
          ],
        },
        {
          auth: {
            username: process.env.WC_CONSUMER_KEY!,
            password: process.env.WC_CONSUMER_SECRET!,
          },
        }
      );

      console.log("✅ WooCommerce order updated successfully", {
        wooOrderId,
        status: updateResponse.status,
      });

      return NextResponse.json({
        status: "success",
        message: "Payment verified and order updated",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (wooError: any) {
      console.error("❌ Failed to update WooCommerce order:", {
        wooOrderId,
        error: wooError.response?.data || wooError.message,
      });

      // ⚠️ Payment was verified but order update failed
      // You might want to retry this or handle it specially
      return NextResponse.json(
        {
          status: "partial_success",
          reason: "Payment verified but order update failed",
          payment_id: razorpay_payment_id,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);

    return NextResponse.json(
      {
        status: "error",
        reason: "Internal server error during payment verification",
      },
      { status: 500 }
    );
  }
}
