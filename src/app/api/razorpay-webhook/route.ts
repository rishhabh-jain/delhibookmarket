// app/api/razorpay-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Read raw body for signature verification
  const rawBody = await req.text();

  console.log("🔔 Incoming Razorpay Webhook");

  // Verify Razorpay signature
  const shasum = crypto.createHmac("sha256", webhookSecret!);
  shasum.update(rawBody);
  const digest = shasum.digest("hex");

  const razorpaySignature = req.headers.get("x-razorpay-signature");
  if (digest !== razorpaySignature) {
    return NextResponse.json({ status: "invalid signature" }, { status: 400 });
  }

  const body = JSON.parse(rawBody);
  const event = body.event;
  const payload = body.payload;

  console.log("📢 Event Type:", event);

  try {
    if (event === "payment.captured") {
      const payment = payload.payment.entity;
      const wooOrderId = payment.notes?.woo_order_id;

      console.log("✅ Payment Captured for Woo Order ID:", wooOrderId);
      console.log("💰 Payment Amount:", payment.amount / 100, "INR");

      if (!wooOrderId) {
        console.error("No Woo order ID in Razorpay notes");
        return NextResponse.json(
          { status: "missing woo_order_id" },
          { status: 400 }
        );
      }

      const wooUpdatePayload = {
        status: "processing",
        set_paid: true,
        transaction_id: payment.id, // Razorpay payment ID
        payment_method: "razorpay",
        payment_method_title: "Razorpay",
        meta_data: [
          { key: "_razorpay_payment_id", value: payment.id },
          { key: "_razorpay_order_id", value: payment.order_id },
          { key: "_razorpay_signature", value: payment.signature || "" },
          { key: "_razorpay_amount", value: payment.amount / 100 },
          { key: "_razorpay_currency", value: payment.currency },
          { key: "_razorpay_email", value: payment.email || "" },
          { key: "_razorpay_contact", value: payment.contact || "" },
        ],
      };

      // Update WooCommerce order to "processing" and set as paid
      const res = await axios.put(
        `https://shop.delhibookmarket.com/wp-json/wc/v3/orders/${wooOrderId}`,
        wooUpdatePayload,
        {
          auth: {
            username: process.env.WC_CONSUMER_KEY!,
            password: process.env.WC_CONSUMER_SECRET!,
          },
        }
      );

      console.log("🛠 WooCommerce Update Response:", res.data);
    }

    if (event === "payment.failed") {
      const payment = payload.payment.entity;
      const wooOrderId = payment.notes?.woo_order_id;

      console.log("❌ Payment Failed for Woo Order ID:", wooOrderId);
      console.log("📄 Failure Reason:", payment.error_description || "N/A");

      if (!wooOrderId) {
        console.error("No Woo order ID in Razorpay notes for failed payment");
        return NextResponse.json(
          { status: "missing woo_order_id" },
          { status: 400 }
        );
      }

      // WooCommerce payload for failed payment
      const wooUpdatePayload = {
        status: "failed",
        transaction_id: payment.id || "",
        payment_method: "razorpay",
        payment_method_title: "Razorpay",
        meta_data: [
          { key: "_razorpay_payment_id", value: payment.id || "" },
          { key: "_razorpay_order_id", value: payment.order_id || "" },
          { key: "_razorpay_amount", value: payment.amount / 100 || 0 },
          { key: "_razorpay_currency", value: payment.currency || "" },
          { key: "_razorpay_email", value: payment.email || "" },
          { key: "_razorpay_contact", value: payment.contact || "" },
          { key: "_razorpay_error_code", value: payment.error_code || "" },
          {
            key: "_razorpay_error_description",
            value: payment.error_description || "",
          },
        ],
      };

      // Update WooCommerce order
      const res = await axios.put(
        `https://shop.delhibookmarket.com/wp-json/wc/v3/orders/${wooOrderId}`,
        wooUpdatePayload,
        {
          auth: {
            username: process.env.WC_CONSUMER_KEY!,
            password: process.env.WC_CONSUMER_SECRET!,
          },
        }
      );

      console.log("🛠 WooCommerce Failed Status Update Response:", res.data);
    }

    console.log("✅ Webhook Processed Successfully");

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
