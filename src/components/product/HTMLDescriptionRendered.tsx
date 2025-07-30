"use client";
import { useMemo } from "react";

interface HtmlDescriptionRendererProps {
  htmlContent: string;
  title?: string;
  className?: string;
}
interface WooProduct {
  id: number;
  name: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }[];
  stock_quantity: number;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: string[];
  attributes: string[];
  average_rating: string;
  rating_count: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  _links: {
    self: {
      href: string;
      targetHints: {
        allow: ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")[];
      };
    }[];
    collection: {
      href: string;
    }[];
  };
}

export default function HtmlDescriptionRenderer({
  htmlContent,
  title = "Description:",
  className = "",
}: HtmlDescriptionRendererProps) {
  // Basic HTML sanitization - removes potentially dangerous elements and attributes
  const sanitizeHtml = (html: string): string => {
    // Remove script tags and their content
    let sanitized = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Remove dangerous event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

    // Remove dangerous attributes
    sanitized = sanitized.replace(
      /\s*(javascript:|data:|vbscript:)[^"'\s>]*/gi,
      ""
    );

    return sanitized;
  };

  const sanitizedHtml = useMemo(() => {
    if (!htmlContent) return "";
    return sanitizeHtml(htmlContent);
  }, [htmlContent]);

  if (!htmlContent) {
    return null;
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      )}

      <div
        className="prose prose-slate max-w-none
          prose-headings:text-gray-900 prose-headings:font-semibold
          prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6
          prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5
          prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
          prose-h4:text-base prose-h4:mb-2 prose-h4:mt-3
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-em:text-gray-800 prose-em:italic
          prose-ul:my-4 prose-ul:pl-6
          prose-ol:my-4 prose-ol:pl-6
          prose-li:text-gray-700 prose-li:mb-1 prose-li:leading-relaxed
          prose-blockquote:border-l-4 prose-blockquote:border-blue-200 
          prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 
          prose-code:rounded prose-code:text-sm prose-code:text-gray-800
          prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg 
          prose-pre:overflow-x-auto prose-pre:text-sm
          prose-table:w-full prose-table:border-collapse
          prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 
          prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
          prose-img:rounded-lg prose-img:shadow-sm prose-img:max-w-full prose-img:h-auto
          prose-hr:border-gray-200 prose-hr:my-6
        "
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}

// Usage example component
export function ProductDescription({ product }: { product: WooProduct }) {
  const description = product?.description || product?.short_description;

  return (
    <HtmlDescriptionRenderer
      htmlContent={description}
      title="Description:"
      className="mb-8"
    />
  );
}
