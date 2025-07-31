import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "products.json"
    );
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error reading products file:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
