// app/api/products/route.ts
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const api = axios.create({
  baseURL: "https://delhibookmarket.com/wp-json/wc/v3",
  auth: {
    username: process.env.WC_CONSUMER_KEY!,
    password: process.env.WC_CONSUMER_SECRET!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const {
      payment_method,
      payment_method_title,
      set_paid,
      billing,
      shipping,
      line_items,
      fee_lines,
    } = await request.json();

    const shipping_lines = [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate",
        total: "39.00",
      },
    ];

    // Create the order data object
    const orderData = {
      payment_method,
      payment_method_title,
      status: payment_method === "cod" ? "processing" : "pending",
      set_paid,
      billing,
      shipping,
      line_items,
      fee_lines,
      shipping_lines,
    };

    // Make the API call to create the order
    const response = await api.post("/orders", orderData);

    return NextResponse.json(
      {
        status: true,
        message: "Order created successfully",
        data: response.data,
      },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating order:", error);

    // Handle different types of errors
    if (error.response) {
      // WooCommerce API returned an error
      return NextResponse.json(
        {
          status: false,
          message: "Failed to create order",
          error: error.response.data,
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // Network error
      return NextResponse.json(
        {
          status: false,
          message: "Network error occurred",
        },
        { status: 503 }
      );
    } else {
      // Other error
      return NextResponse.json(
        {
          status: false,
          message: "Unexpected error occurred",
        },
        { status: 500 }
      );
    }
  }
}

// Example usage data (for reference)
const exampleData = {
  payment_method: "cod",
  payment_method_title: "Cash on Delivery",
  set_paid: false,
  billing: {
    first_name: "John",
    last_name: "Doe",
    address_1: "969 Market",
    city: "San Francisco",
    state: "CA",
    postcode: "94103",
    country: "US",
    email: "john.doe@example.com",
    phone: "(555) 555-5555",
  },
  shipping: {
    first_name: "John",
    last_name: "Doe",
    address_1: "969 Market",
    city: "San Francisco",
    state: "CA",
    postcode: "94103",
    country: "US",
  },
  line_items: [
    {
      product_id: 93,
      quantity: 2,
    },
    {
      product_id: 22,
      variation_id: 23,
      quantity: 1,
    },
  ],
  fee_lines: [
    {
      name: "COD Charges",
      total: "50",
      tax_status: "none",
    },
  ],
};
