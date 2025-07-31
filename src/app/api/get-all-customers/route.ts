// app/api/customers/route.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { NextRequest } from "next/server";

// Initialize WooCommerce API
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!, // Your WooCommerce store URL
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export async function GET(request: NextRequest) {
  try {
    // Get query parameters

    const page = 2;
    const perPage = 5; // Fixed at 5 customers per page as requested

    // Validate page number
    if (page < 1) {
      return Response.json(
        { error: "Page number must be greater than 0" },
        { status: 400 }
      );
    }

    // Build query parameters for WooCommerce API
    const queryParams = {
      page: page,
      per_page: perPage,
    };

    // Get customers from WooCommerce API
    const response = await WooCommerce.get("customers", queryParams);

    // Extract pagination info from headers
    const totalCustomers = parseInt(response.headers["x-wp-total"]) || 0;
    const totalPages = parseInt(response.headers["x-wp-totalpages"]) || 0;

    // Format customer data (excluding sensitive information)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customers = response.data.map((customer: any) => ({
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      username: customer.username,
      date_created: customer.date_created,
      date_modified: customer.date_modified,
      avatar_url: customer.avatar_url,
      role: customer.role,
      billing: {
        first_name: customer.billing.first_name,
        last_name: customer.billing.last_name,
        company: customer.billing.company,
        address_1: customer.billing.address_1,
        address_2: customer.billing.address_2,
        city: customer.billing.city,
        state: customer.billing.state,
        postcode: customer.billing.postcode,
        country: customer.billing.country,
        phone: customer.billing.phone,
      },
      shipping: {
        first_name: customer.shipping.first_name,
        last_name: customer.shipping.last_name,
        company: customer.shipping.company,
        address_1: customer.shipping.address_1,
        address_2: customer.shipping.address_2,
        city: customer.shipping.city,
        state: customer.shipping.state,
        postcode: customer.shipping.postcode,
        country: customer.shipping.country,
      },
      is_paying_customer: customer.is_paying_customer,
      orders_count: customer.orders_count,
      total_spent: customer.total_spent,
    }));

    // Return paginated response
    return Response.json({
      success: true,
      data: {
        customers: customers,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_customers: totalCustomers,
          total_pages: totalPages,
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("WooCommerce API Error:", error);

    // Handle different types of errors
    if (error.response) {
      // WooCommerce API returned an error
      return Response.json(
        {
          error: "WooCommerce API error",
          details: error.response.data || error.message,
        },
        { status: error.response.status || 500 }
      );
    } else if (error.request) {
      // Network error
      return Response.json(
        { error: "Network error - could not reach WooCommerce API" },
        { status: 503 }
      );
    } else {
      // Other error
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }
}
