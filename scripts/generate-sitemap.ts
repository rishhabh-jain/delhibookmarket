// scripts/generate-sitemap.ts
import fs from "fs";

async function fetchAllProducts() {
  const res = await fetch("https://delhibookmarket.com/api/get-all-products");
  const products = await res.json();

  return products;
}

async function generateSitemap() {
  const siteUrl = "https://delhibookmarket.com";
  const products = await fetchAllProducts();

  const urls = products
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: { permalink: string }) => `
    <url>
      <loc>${siteUrl}/${p.permalink.split("/").filter(Boolean).pop()}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  fs.writeFileSync("public/sitemap.xml", xml);
  console.log("✅ sitemap.xml generated!");
}

generateSitemap();
