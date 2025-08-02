import fs from "fs";
import path from "path";
import axios from "axios";

const api = axios.create({
  baseURL: "https://shop.delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: "ck_a40ec0ca8305b354802fb33d3d603cdda79086d6",
    password: "cs_eafa40614a8fbf870f9fe3b48138053dee2e1174",
  },
});

async function generateProducts() {
  try {
    let page = 1;
    const perPage = 100;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allProducts: any[] = [];
    let moreData = true;

    console.log("Fetching products...");

    while (moreData) {
      const res = await api.get("products", {
        params: {
          per_page: perPage,
          page,
          _fields: "id,name,permalink,price,images,slug",
        },
      });

      const products = res.data;
      allProducts.push(...products);
      console.log(`Fetched ${allProducts.length} products so far...`);

      if (products.length < perPage) {
        moreData = false;
      } else {
        page++;
      }
    }

    // Create public/data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write full products data
    fs.writeFileSync(
      path.join(dataDir, "products.json"),
      JSON.stringify(allProducts, null, 2)
    );

    // Create optimized search index (smaller file for search)
    const searchIndex = allProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images, // ← Add this line
      stock_quantity: product.stock_quantity,
      permalink: product.permalink,
    }));
    fs.writeFileSync(
      path.join(dataDir, "search-index.json"),
      JSON.stringify(searchIndex, null, 2)
    );

    console.log(`✅ Generated data for ${allProducts.length} products`);
    console.log(`📁 Files saved to public/data/`);
  } catch (error) {
    console.error("❌ Error generating products:", error);
    process.exit(1);
  }
}

generateProducts();
