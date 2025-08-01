"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// WooCommerce Product Interface
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

// Cart Item Interface
export interface CartItem {
  id: number;
  name: string;
  price: number; // Converted from string to number for calculations
  regular_price: number;
  sale_price: number;
  quantity: number;
  image?: string;
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  permalink: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isSidecartOpen: boolean; // Added sidecart state
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART" }
  | { type: "OPEN_SIDECART" } // Added sidecart actions
  | { type: "CLOSE_SIDECART" }
  | { type: "TOGGLE_SIDECART" };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  addWooProduct: (product: WooProduct, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isInStock: (id: number) => boolean;
  canAddToCart: (id: number, requestedQuantity: number) => boolean;
  openSidecart: () => void; // Added sidecart methods
  closeSidecart: () => void;
  toggleSidecart: () => void;
}

// Local storage key
const CART_STORAGE_KEY = "ecommerce_cart";

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [], total: 0, itemCount: 0, isSidecartOpen: false };
  }

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Recalculate totals to ensure consistency
      const { total, itemCount } = calculateTotals(parsedCart.items || []);
      return {
        items: parsedCart.items || [],
        total,
        itemCount,
        isSidecartOpen: false, // Always start with sidecart closed
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return { items: [], total: 0, itemCount: 0, isSidecartOpen: false };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  if (typeof window === "undefined") return;

  try {
    // Don't save sidecart state to localStorage, only cart items
    const { isSidecartOpen, ...cartData } = state;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Initial state
const initialState: CartState = loadCartFromStorage();

// Helper function to convert WooProduct to CartItem
const wooProductToCartItem = (
  product: WooProduct
): Omit<CartItem, "quantity"> => {
  // Use sale_price if available, otherwise use regular_price, fallback to price
  const currentPrice = product.sale_price
    ? parseFloat(product.sale_price)
    : parseFloat(product.regular_price || product.price);

  return {
    id: product.id,
    name: product.name,
    price: currentPrice,
    regular_price: parseFloat(product.regular_price || product.price),
    sale_price: product.sale_price ? parseFloat(product.sale_price) : 0,
    image: product.images.length > 0 ? product.images[0].src : undefined,
    stock_quantity: product.stock_quantity,
    stock_status: product.stock_status,
    permalink: product.permalink,
  };
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const { quantity = 1, ...itemData } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemData.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, { ...itemData, quantity }];
      }

      const { total, itemCount } = calculateTotals(newItems);

      newState = {
        items: newItems,
        total,
        itemCount,
        isSidecartOpen: true, // Automatically open sidecart when item is added
      };
      break;
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      const { total, itemCount } = calculateTotals(newItems);

      newState = {
        items: newItems,
        total,
        itemCount,
        isSidecartOpen: state.isSidecartOpen,
      };
      break;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter((item) => item.id !== id);
        const { total, itemCount } = calculateTotals(newItems);

        newState = {
          items: newItems,
          total,
          itemCount,
          isSidecartOpen: state.isSidecartOpen,
        };
      } else {
        const newItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );

        const { total, itemCount } = calculateTotals(newItems);

        newState = {
          items: newItems,
          total,
          itemCount,
          isSidecartOpen: state.isSidecartOpen,
        };
      }
      break;
    }

    case "CLEAR_CART": {
      newState = {
        items: [],
        total: 0,
        itemCount: 0,
        isSidecartOpen: state.isSidecartOpen,
      };
      break;
    }

    case "LOAD_CART": {
      newState = loadCartFromStorage();
      break;
    }

    case "OPEN_SIDECART": {
      newState = { ...state, isSidecartOpen: true };
      break;
    }

    case "CLOSE_SIDECART": {
      newState = { ...state, isSidecartOpen: false };
      break;
    }

    case "TOGGLE_SIDECART": {
      newState = { ...state, isSidecartOpen: !state.isSidecartOpen };
      break;
    }

    default:
      return state;
  }

  // Save to localStorage after every state change (except sidecart state changes)
  if (
    action.type !== "OPEN_SIDECART" &&
    action.type !== "CLOSE_SIDECART" &&
    action.type !== "TOGGLE_SIDECART"
  ) {
    saveCartToStorage(newState);
  }
  return newState;
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount (client-side only)
  React.useEffect(() => {
    dispatch({ type: "LOAD_CART" });
  }, []);

  const addItem = (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const addWooProduct = (product: WooProduct, quantity: number = 1) => {
    const cartItem = wooProductToCartItem(product);
    dispatch({ type: "ADD_ITEM", payload: { ...cartItem, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const isInStock = (id: number): boolean => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.stock_status === "instock" : false;
  };

  const canAddToCart = (id: number, requestedQuantity: number): boolean => {
    const item = state.items.find((item) => item.id === id);
    if (!item) return false;

    if (item.stock_status !== "instock") return false;

    const currentQuantityInCart = item.quantity;
    return currentQuantityInCart + requestedQuantity <= item.stock_quantity;
  };

  // Sidecart methods
  const openSidecart = () => {
    dispatch({ type: "OPEN_SIDECART" });
  };

  const closeSidecart = () => {
    dispatch({ type: "CLOSE_SIDECART" });
  };

  const toggleSidecart = () => {
    dispatch({ type: "TOGGLE_SIDECART" });
  };

  const value: CartContextType = {
    ...state,
    addItem,
    addWooProduct,
    removeItem,
    updateQuantity,
    clearCart,
    isInStock,
    canAddToCart,
    openSidecart,
    closeSidecart,
    toggleSidecart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
