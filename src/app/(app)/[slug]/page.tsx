import React from "react";
import { Metadata } from "next";
import ProductClient, { WooProduct } from "../product/[id]/productClient";

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
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/get-single-product?slug=${slug}`,
      {
        next: { revalidate: 604800 }, // 1 week in seconds
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

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Delhi Book Market",
      description: "The requested product could not be found.",
      robots: "noindex, nofollow",
    };
  }

  const productTitle = product.name;
  const productDescription =
    product.short_description || extractTextFromHTML(product.description);
  const productImage = product.images?.[0]?.src;
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${product.permalink
    .split("/")
    .filter(Boolean)
    .pop()}`;
  const keywords = generateKeywords(product);

  return {
    title: `${productTitle} | Delhi Book Market`,
    description: productDescription,
    keywords: keywords,
    authors: [{ name: "Delhi Book Market" }],
    creator: "Delhi Book Market",
    publisher: "Delhi Book Market",

    // Open Graph
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: productUrl,
      title: `${productTitle} | Delhi Book Market`,
      description: productDescription,
      siteName: "Delhi Book Market",
      images: productImage
        ? [
            {
              url: productImage,
              width: 800,
              height: 600,
              alt: product.images?.[0]?.alt || productTitle,
              type: "image/jpeg",
            },
          ]
        : [],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: "@delhibookmarket", // Replace with actual Twitter handle
      creator: "@delhibookmarket",
      title: `${productTitle} | Delhi Book Market`,
      description: productDescription,
      images: productImage ? [productImage] : [],
    },

    // Additional metadata
    category: product.categories?.[0]?.name || "Books",

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: productUrl,
    },

    // Additional tags
    other: {
      "product:price:amount": product.sale_price || product.price,
      "product:price:currency": "INR",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:retailer_item_id": product.id.toString(),
      "og:price:amount": product.sale_price || product.price,
      "og:price:currency": "INR",
    },
  };
}

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
