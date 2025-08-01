// app/api/create-razorpay-order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: "rzp_test_LMc8Zk4wMhF3xW",
  key_secret: "4SKNlfqmphm7vAtkNwyNmBRN",
});

export async function POST(req: Request) {
  const { amountInRupees, wooOrderId } = await req.json();

  const order = await razorpay.orders.create({
    amount: amountInRupees * 100, // in paise
    currency: "INR",
    receipt: `woo_${wooOrderId}`, // helpful when linking later
    payment_capture: true,
  });

  return NextResponse.json(order);
}
