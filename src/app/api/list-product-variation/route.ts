import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const api = axios.create({
  baseURL: "https://shop.delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: process.env.WC_CONSUMER_KEY!,
    password: process.env.WC_CONSUMER_SECRET!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "Please provide an ID !!",
        },
        {
          status: 401,
        }
      );
    }

    const { data: product } = await api.get(`products/${id}/variations`);
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: false,
        message: "Unexpected Error occured",
      },
      {
        status: 501,
      }
    );
  }
}
