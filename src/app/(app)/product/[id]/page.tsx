import React from "react";
import ProductClient from "./productClient";

export const revalidate = 259200; // 72 hours in seconds

async function fetchProduct(productId: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/get-single-product?id=${productId}`,
      {
        cache: "force-cache", // Cache the product data
      }
    );

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">
          Product ID is required
        </h1>
      </div>
    );
  }

  const product = await fetchProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
      </div>
    );
  }

  return <ProductClient product={product} />;
}
