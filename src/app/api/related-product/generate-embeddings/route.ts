import fs from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function cleanText(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST() {
  const supabase = await createClient();

  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "refinedProductsNew2.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(rawData).slice(1600, 1700); // first 100 products , batch 17

    // Prepare batch for Supabase insert
    const batchData = [];

    for (const product of products) {
      const description = cleanText(product.description || "");
      const author = product.author || "";
      const categories = Array.isArray(product.categories)
        ? product.categories
        : [];

      const embeddingInput = `
Title: ${product.title}
Author: ${author}
Categories: ${categories.join(", ")}
Description: ${description}
      `;

      // Get embedding
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: embeddingInput,
      });

      const embedding = embeddingRes.data[0].embedding;

      batchData.push({
        product_id: product.id.toString(),
        title: product.title,
        author,
        categories,
        description,
        embedding,
      });
    }

    // Insert whole batch at once
    const res = await supabase
      .from("book_embeddings")
      .upsert(batchData, { onConflict: "product_id" });

    console.log(res);

    if (res.error) {
      console.error("Supabase batch insert error occured 1 :", res.error);
      return NextResponse.json(
        { error: "Failed to insert embeddings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Processed and saved embeddings for ${batchData.length} products.`,
    });
  } catch (error) {
    console.error("Error in embedding batch processing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
