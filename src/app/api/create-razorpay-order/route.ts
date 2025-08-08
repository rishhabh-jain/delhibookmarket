// app/api/create-razorpay-order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amountInRupees, wooOrderId } = await req.json();

    if (!amountInRupees || !wooOrderId) {
      return NextResponse.json(
        { error: "amountInRupees and wooOrderId are required" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100), // in paise
      currency: "INR",
      receipt: `woo_${wooOrderId}`, // helpful for manual matching
      payment_capture: true, // auto-capture
      notes: {
        woo_order_id: wooOrderId.toString(), // 🔥 stored for webhook
        source: "delhibookmarket", // optional, for tracking
      },
    });

    return NextResponse.json(order);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
