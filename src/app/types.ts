//Full product type definition
interface ProductImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface FullProduct {
  id: number;
  name: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: ProductImage[];
  slug: string;
  stock_quantity: number;
  isPromotional?: boolean;
}

export interface ProductPage {
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
  average_rating: string;
  rating_count: number;
  stock_status: string;
  isPromotional?: boolean;
}

//related product which will be coming from the API , SUPABASE RELATED PRODUCTS

export interface RelatedProduct {
  product_id: number;
  title: string;
  author?: string;
  categories: string[];
}

export interface PromoCode {
  amount: number;
  code: string;
  minimum_amount: number;
  description: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  quantity: number;
  image?: string;
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  permalink: string;
  isPromotional?: boolean;
  type: "product"; // Distinguish from combo
}

// Combo Item Interface
export interface ComboItem {
  id: number; // Unique combo ID (generated)
  name: string; // Custom combo name
  price: number; // Total combo price
  quantity: number;
  products: FullProduct[]; // Array of products in the combo
  discountPercent?: number; // Optional discount
  type: "combo"; // Distinguish from regular product
  image?: string; // Can use first product's image
  isPromotional?: boolean; // Optional promotional flag
}

export type CartItemUnion = CartItem | ComboItem;

 export interface LineItem {
    product_id: number;
    quantity: number;
    total?: string;
    subtotal?: string;
    total_tax?: string;
    subtotal_tax?: string;
    type?: string; // Added type to handle both product and combo
  }