import { FullProduct } from "@/app/types";

export const fullProductToWooProduct = (product: FullProduct) => ({
  id: product.id,
  name: product.name,
  permalink: product.permalink,
  price: product.price,
  regular_price: product.price,
  sale_price: "",
  images: product.images,
  stock_quantity: product.stock_quantity,
  stock_status: "instock" as const,
  slug: product.slug,

})