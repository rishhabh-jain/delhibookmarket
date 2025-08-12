import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const productsPath = path.join(process.cwd(), "refinedProductsNew.json");
  const knownAuthorsPath = path.join(process.cwd(), "known-authors2.json");
  const refinedProductsPath = path.join(
    process.cwd(),
    "refinedProductsNew2.json"
  );

  const productsRaw = await fs.readFile(productsPath, "utf-8");
  const knownAuthorsRaw = await fs.readFile(knownAuthorsPath, "utf-8");

  const products = JSON.parse(productsRaw);
  const knownAuthors = JSON.parse(knownAuthorsRaw);

  const knownAuthorsMap = new Map(
    knownAuthors.map((item: { id: string; author: string }) => [
      item.id,
      item.author,
    ])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refinedProducts = products.map((product: any) => {
    if (knownAuthorsMap.has(product.id)) {
      return { ...product, author: knownAuthorsMap.get(product.id) };
    }
    return product;
  });

  // Save the new refined file
  await fs.writeFile(
    refinedProductsPath,
    JSON.stringify(refinedProducts, null, 2),
    "utf-8"
  );

  return NextResponse.json({
    message: "refinedProducts.json created with updated authors",
    totalProducts: refinedProducts.length,
    updatedAuthorsCount: knownAuthors.length,
  });
}
