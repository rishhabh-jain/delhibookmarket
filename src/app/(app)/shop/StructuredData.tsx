// components/StructuredData.tsx
interface Product {
  id: number;
  name: string;
  permalink: string;
  price: string;
  images: Array<{ src: string; alt: string }>;
  stock_quantity: number;
  slug: string;
  total_sales: number;
}

interface StructuredDataProps {
  products: Product[];
  totalCount: number;
  searchTerm?: string;
}

export default function StructuredData({
  products,
  totalCount,
  searchTerm,
}: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: totalCount,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: product.permalink,
        image: product.images[0]?.src || "",
        description: `${product.name} - Available at our store`,
        sku: product.slug,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability:
            product.stock_quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Your Shop Name",
          },
        },
        ...(product.total_sales > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            reviewCount: product.total_sales,
          },
        }),
      },
    })),
  };

  // Add search-specific structured data if it's a search page
  if (searchTerm) {
    const searchStructuredData = {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: totalCount,
        itemListElement: structuredData.itemListElement,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(searchStructuredData),
          }}
        />
      </>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
