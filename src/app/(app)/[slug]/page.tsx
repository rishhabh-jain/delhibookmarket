import React from "react";
import ProductClient, { WooProduct } from "../product/[id]/productClient";
import axios from "axios";

export const revalidate = 864000; // 10 days in seconds
export const dynamicParams = true;

const api = axios.create({
  baseURL: "https://shop.delhibookmarket.com/wp-json/wc/v3/",
  auth: {
    username: "ck_a40ec0ca8305b354802fb33d3d603cdda79086d6",
    password: "cs_eafa40614a8fbf870f9fe3b48138053dee2e1174",
  },
});

// Helper function to generate structured data
function generateStructuredData(product: WooProduct) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
          .split("/")
          .filter(Boolean)
          .pop()}#product`,
        name: product.name,
        description:
          product.short_description || extractTextFromHTML(product.description),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: product.images?.map((img: any) => img.src) || [],
        sku: product.id.toString(),
        brand: {
          "@type": "Brand",
          name: "Delhi Book Market",
        },
        category:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          product.categories?.map((cat: any) => cat.name).join(", ") || "",
        offers: {
          "@type": "Offer",
          price: product.sale_price || product.price,
          priceCurrency: "INR",
          availability:
            product.stock_status === "instock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 30 days from now
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
            .split("/")
            .filter(Boolean)
            .pop()}`,
          seller: {
            "@type": "Organization",
            name: "Delhi Book Market",
            url: process.env.NEXT_PUBLIC_BASE_URL,
          },
        },
        aggregateRating:
          product.rating_count > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: product.average_rating,
                reviewCount: product.rating_count,
                bestRating: "5",
                worstRating: "1",
              }
            : undefined,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
          .split("/")
          .filter(Boolean)
          .pop()}`,
        productID: product.id.toString(),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
          .split("/")
          .filter(Boolean)
          .pop()}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: process.env.NEXT_PUBLIC_BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Books",
            item: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.categories?.[0]?.name || "Category",
            item: `${process.env.NEXT_PUBLIC_BASE_URL}/product-category/all`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
              .split("/")
              .filter(Boolean)
              .pop()}`,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
          .split("/")
          .filter(Boolean)
          .pop()}#webpage`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
          .split("/")
          .filter(Boolean)
          .pop()}`,
        name: product.name,
        description:
          product.short_description || extractTextFromHTML(product.description),
        isPartOf: {
          "@type": "WebSite",
          "@id": `${process.env.NEXT_PUBLIC_BASE_URL}#website`,
          name: "Delhi Book Market",
          url: process.env.NEXT_PUBLIC_BASE_URL,
        },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      },
    ],
  };
}

// Helper function to extract text from HTML
function extractTextFromHTML(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);
}

// Helper function to generate keywords
function generateKeywords(product: WooProduct): string {
  const keywords = [
    product.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(product.categories?.map((cat: any) => cat.name) || []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(product.tags?.map((tag: any) => tag.name) || []),
    "book",
    "buy online",
    "Delhi Book Market",
    "paperback",
    "Indian books",
  ];
  return keywords.join(", ");
}

async function fetchProduct(slug: string) {
  let res;

  try {
    const slugRes = await api.get("products", {
      params: {
        slug,
        _fields:
          "id,name,permalink,price,regular_price,sale_price,description,short_description,images,stock_quantity,stock_status,categories,tags,attributes,average_rating,rating_count",
      },
    });

    res = { data: slugRes.data[0] };

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("ERROR FETCHING PRODUCT", error.response?.data);
    return null;
  }
}

// Generate metadata for SEO

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">
          Product ID is required
        </h1>
      </div>
    );
  }

  console.log(slug);

  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
      </div>
    );
  }

  const structuredData = generateStructuredData(product);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Product Component */}
      <ProductClient product={product} />
    </>
  );
}
