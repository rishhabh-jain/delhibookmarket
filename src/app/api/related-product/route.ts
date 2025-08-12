import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Product = {
  ID: string;
  Name: string;
  Categories?: string;
  Description?: string;
  // other fields you don't care about for this extraction
};

type RefinedProduct = {
  id: string;
  author: string;
  categories: string[];
  description: string;
  title: string;
};

function extractData(product: Product): RefinedProduct {
  const id = product.ID;
  const name = product.Name;

  const regex = /^Buy\s+(.+?)\s+by\s+(.+)$/i;
  const match = name.match(regex);

  let title = "";
  let author = "";

  if (match) {
    title = match[1].trim();
    author = match[2].trim();

    // Remove 'Paperback' or 'Hardcover' if present at end of author string (case-insensitive)
    // Remove trailing "(Paperback)" or "(Hardcover)" or without parentheses too, case-insensitive
    // Remove trailing "(Paperback)" or "(Hardcover)" or without parentheses too, case-insensitive
    author = author.replace(/\s*\(?\b(paperback|hardcover)\b\)?$/i, "").trim();
  } else {
    title = name.replace(/^Buy\s+/i, "").trim();
    author = "Unknown";
    console.warn(
      `Failed to extract author for product ID ${id} with name: "${name}"`
    );
  }

  const categories = product.Categories
    ? product.Categories.split(",").map((cat) => cat.trim())
    : [];

  const description = product.Description
    ? product.Description.replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\\r|\\n/g, " ") // Remove literal "\r" and "\n" sequences (escaped in JSON)
        .replace(/\r|\n/g, " ") // Also remove actual newline and carriage return chars
        .replace(/\s+/g, " ") // Collapse multiple spaces into one
        .trim()
    : "";

  return { id, author, categories, description, title };
}

export async function GET() {
  try {
    // Assuming your products.json is in the public folder or somewhere accessible in your project
    const filePath = path.join(process.cwd(), "productRecommendation.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const products: Product[] = JSON.parse(fileData);

    const refinedProducts = products.map(extractData);

    const refinedPath = path.join(process.cwd(), "refinedProduct.json");
    await fs.writeFile(refinedPath, JSON.stringify(refinedProducts, null, 2));

    return NextResponse.json({
      message: "refinedProduct.json created successfully!",
      count: refinedProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to refine products", details: error },
      { status: 500 }
    );
  }
}
