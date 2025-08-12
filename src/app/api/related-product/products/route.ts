import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { product_id, title } = await request.json();

    if (!product_id || !title) {
      return NextResponse.json(
        { error: "Missing product_id or title" },
        { status: 400 }
      );
    }

    // Call your updated PL/pgSQL function with product_id and title
    const { data: relatedProducts, error: relatedError } = await supabase.rpc(
      "match_similar_embeddings",
      {
        input_product_id: product_id,
        input_title: title,
        match_limit: 10,
      }
    );

    if (relatedError) {
      console.log(relatedError);
      return NextResponse.json(
        { error: relatedError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
