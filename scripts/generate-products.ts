import fs from "fs";
import path from "path";
import axios from "axios";

// Type definitions
interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
}

interface WooCommerceProduct {
  id: number;
  name: string;
  permalink: string;
  price: string;
  images: ProductImage[];
  slug: string;
  total_sales?: number;
  stock_quantity?: number;
  status: "draft" | "pending" | "private" | "publish";
}

interface SearchIndexItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: ProductImage[];
  stock_quantity: number;
  total_sales: number;
  permalink: string;
  normalizedName: string;
  isComboProduct: boolean;
}

interface TopSellingProduct {
  id: number;
  name: string;
  total_sales: number;
  price: string;
}

interface ProductAnalytics {
  totalProducts: number;
  totalSales: number;
  comboProducts: number;
  averagePrice: number;
  topSellingProducts: TopSellingProduct[];
  generatedAt: string;
}

interface APIResponse {
  data: WooCommerceProduct[];
}

// Create axios instance with proper typing
const api = axios.create({
  baseURL: "https://shop.delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: "ck_a40ec0ca8305b354802fb33d3d603cdda79086d6",
    password: "cs_eafa40614a8fbf870f9fe3b48138053dee2e1174",
  },
});

// Helper function to normalize product names
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to detect combo/set products
function isComboProduct(name: string): boolean {
  return /\b(box\s*set|boxset|combo|series|collection|complete|pack)\b/i.test(
    name
  );
}

async function generateProducts(): Promise<void> {
  try {
    let page = 1;
    const perPage = 100;
    const allProducts: WooCommerceProduct[] = [];
    let moreData = true;

    console.log("🚀 Starting product fetch...");

    while (moreData) {
      console.log(`📦 Fetching page ${page}...`);

      const res: APIResponse = await api.get("products", {
        params: {
          per_page: perPage,
          page,
          // Include total_sales for search prioritization
          _fields:
            "id,name,permalink,price,images,slug,total_sales,stock_quantity,status",
        },
      });

      const products = res.data;
      allProducts.push(...products);
      console.log(
        `   ✓ Fetched ${products.length} products (Total: ${allProducts.length})`
      );

      if (products.length < perPage) {
        moreData = false;
      } else {
        page++;
      }

      // Add small delay to be respectful to the API
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
    }

    // Filter out products that are not published
    const publishedProducts = allProducts.filter(
      (product: WooCommerceProduct) => product.status === "publish"
    );

    console.log(
      `📊 Filtered to ${publishedProducts.length} published products`
    );

    // Create public/data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write full products data
    fs.writeFileSync(
      path.join(dataDir, "products.json"),
      JSON.stringify(publishedProducts, null, 2)
    );

    // Create optimized search index with all necessary fields for search
    const searchIndex: SearchIndexItem[] = publishedProducts.map(
      (product): SearchIndexItem => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images || [], // Ensure images is always an array
        stock_quantity: product.stock_quantity || 0,
        total_sales: product.total_sales || 0, // Important for search prioritization
        permalink: product.permalink,
        // Add normalized name for better search performance
        normalizedName: normalizeProductName(product.name),
        // Pre-calculate if it's a combo/set product for faster search
        isComboProduct: isComboProduct(product.name),
      })
    );

    fs.writeFileSync(
      path.join(dataDir, "search-index.json"),
      JSON.stringify(searchIndex, null, 2)
    );

    // Generate additional analytics
    const totalSales = publishedProducts.reduce(
      (sum, p) => sum + (p.total_sales || 0),
      0
    );
    const totalPrice = publishedProducts.reduce(
      (sum, p) => sum + parseFloat(p.price || "0"),
      0
    );

    const topSellingProducts: TopSellingProduct[] = publishedProducts
      .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
      .slice(0, 10)
      .map(
        (p): TopSellingProduct => ({
          id: p.id,
          name: p.name,
          total_sales: p.total_sales || 0,
          price: p.price,
        })
      );

    const analytics: ProductAnalytics = {
      totalProducts: publishedProducts.length,
      totalSales,
      comboProducts: searchIndex.filter((p) => p.isComboProduct).length,
      averagePrice: Math.round(totalPrice / publishedProducts.length),
      topSellingProducts,
      generatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(dataDir, "analytics.json"),
      JSON.stringify(analytics, null, 2)
    );

    // Log summary
    console.log("\n🎉 Generation Complete!");
    console.log(`✅ Generated data for ${publishedProducts.length} products`);
    console.log(
      `📊 Total sales across all products: ${analytics.totalSales.toLocaleString()}`
    );
    console.log(`📦 Combo/Set products: ${analytics.comboProducts}`);
    console.log(
      `💰 Average price: ₹${analytics.averagePrice.toLocaleString()}`
    );
    console.log(
      `🏆 Top selling product: ${topSellingProducts[0]?.name} (${topSellingProducts[0]?.total_sales} sales)`
    );
    console.log("\n📁 Files saved to public/data/:");
    console.log(
      `   - products.json (${(
        fs.statSync(path.join(dataDir, "products.json")).size /
        1024 /
        1024
      ).toFixed(2)} MB)`
    );
    console.log(
      `   - search-index.json (${(
        fs.statSync(path.join(dataDir, "search-index.json")).size /
        1024 /
        1024
      ).toFixed(2)} MB)`
    );
    console.log(
      `   - analytics.json (${(
        fs.statSync(path.join(dataDir, "analytics.json")).size / 1024
      ).toFixed(2)} KB)`
    );
  } catch (error) {
    console.error("❌ Error generating products:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request URL:", error.config?.url);
    }
    process.exit(1);
  }
}

// Export types for use in other files
export type {
  WooCommerceProduct,
  SearchIndexItem,
  ProductImage,
  ProductAnalytics,
  TopSellingProduct,
};

// Run the script if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateProducts();
}

export default generateProducts;
