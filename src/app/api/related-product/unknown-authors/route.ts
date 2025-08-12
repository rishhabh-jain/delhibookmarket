import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "refinedProductsNew.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const unknownAuthors = data
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (product: any) => product.author === "Unknown"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((product: any) => {
        return {
          id: product.id,
          author: product.author,
          categories: product.categories,
          description: product.description,
          title: product.title,
        };
      });

    // Write filtered data to unknown-authors.json in project root
    const outputPath = path.join(process.cwd(), "unknown-authors.json");
    fs.writeFileSync(outputPath, JSON.stringify(unknownAuthors, null, 2));

    return new Response(JSON.stringify(unknownAuthors), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
