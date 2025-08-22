"use client";

import {
  CartItem,
  CartItemUnion,
  ComboItem,
  FullProduct,
  ProductPage,
} from "@/app/types";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

interface CartState {
  items: CartItemUnion[];
  total: number;
  itemCount: number;
  isSidecartOpen: boolean;
}
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | {
      type: "ADD_COMBO";
      payload: Omit<ComboItem, "quantity"> & { quantity?: number };
    }
  | {
      type: "REMOVE_ITEM";
      payload: {
        id: number;
        variation?: {
          id: number;
        };
      };
    }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | {
      type: "ADD_PRODUCT_TO_COMBO";
      payload: { comboId: number; product: FullProduct };
    }
  | {
      type: "REMOVE_PRODUCT_FROM_COMBO";
      payload: { comboId: number; productId: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART" }
  | { type: "OPEN_SIDECART" }
  | { type: "CLOSE_SIDECART" }
  | { type: "TOGGLE_SIDECART" };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  addWooProductWithAnimation: (
    product: ProductPage,
    quantity?: number,
    delay?: number
  ) => Promise<void>;
  addWooProduct: (product: ProductPage, quantity?: number) => void;
  addCombo: (
    products: FullProduct[],
    discountPercent?: number,
    quantity?: number
  ) => number;
  removeItem: (payload: {
    id: number;
    variation?: {
      id: number;
    };
  }) => void;
  updateQuantity: (id: number, quantity: number) => void;
  addProductToCombo: (comboId: number, product: FullProduct) => void;
  removeProductFromCombo: (comboId: number, productId: number) => void;
  clearCart: () => void;
  isInStock: (id: number) => boolean;
  canAddToCart: (id: number, requestedQuantity: number) => boolean;
  openSidecart: () => void;
  closeSidecart: () => void;
  toggleSidecart: () => void;
  removeFreeItems: () => void;
  getComboById: (comboId: number) => ComboItem | undefined;
}

// Local storage key
const CART_STORAGE_KEY = "ecommerce_cart";

// Helper function to generate combo name
const generateComboName = (products: FullProduct[]): string => {
  const names = products.map((p) => p.name).join(" + ");
  return `Buy ${names}`;
};

// Helper function to generate unique combo ID
const generateComboId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000000);
};

// Helper function to calculate combo price
const calculateComboPrice = (
  products: FullProduct[],
  discountPercent: number = 0
): number => {
  const totalPrice = products.reduce((sum, product) => {
    const price = product.sale_price
      ? parseFloat(product.sale_price)
      : parseFloat(product.regular_price || product.price);
    return sum + price;
  }, 0);

  return totalPrice * (1 - discountPercent / 100);
};

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [], total: 0, itemCount: 0, isSidecartOpen: false };
  }

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const { total, itemCount } = calculateTotals(parsedCart.items || []);
      return {
        items: parsedCart.items || [],
        total,
        itemCount,
        isSidecartOpen: false,
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
  product: ProductPage
): Omit<CartItem, "quantity"> => {
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
    stock_status: product.stock_status as
      | "instock"
      | "outofstock"
      | "onbackorder",
    permalink: product.permalink,
    isPromotional: product.isPromotional || false,
    type: "product" as const,
    variation: product.variation
      ? {
          id: product.variation.id,
          name: product.variation.name,
        }
      : null,
  };
};

// Helper function to calculate totals
const calculateTotals = (items: CartItemUnion[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => {
    if (item.type === "combo") {
      // Count combo as 1 item, or count individual products
      return sum + item.quantity;
    }
    return sum + item.quantity;
  }, 0);
  return { total, itemCount };
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const { quantity = 1, ...itemData } = action.payload;
      const existingItemIndex = state.items.findIndex((item) => {
        if (item.type !== "product") return false;

        // If both have variations → match by product + variation
        if (item.variation?.id && itemData.variation?.id) {
          return (
            item.id === itemData.id &&
            item.variation.id === itemData.variation.id
          );
        }

        // If neither has variation → match only by product
        if (!item.variation?.id && !itemData.variation?.id) {
          return item.id === itemData.id;
        }

        // One has variation, the other doesn’t → not the same item
        return false;
      });

      let newItems: CartItemUnion[];

      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex && item.type === "product"
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          { ...itemData, quantity, type: "product" } as CartItem,
        ];
      }

      const { total, itemCount } = calculateTotals(newItems);

      newState = {
        items: newItems,
        total,
        itemCount,
        isSidecartOpen: true,
      };
      break;
    }

    case "ADD_COMBO": {
      const { quantity = 1, ...comboData } = action.payload;
      const newItems = [
        ...state.items,
        { ...comboData, quantity, type: "combo" } as ComboItem,
      ];
      const { total, itemCount } = calculateTotals(newItems);

      newState = {
        items: newItems,
        total,
        itemCount,
        isSidecartOpen: true,
      };
      break;
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => {
        if (item.type !== "product") return item.id !== action.payload.id;

        // If both have variations → match by product + variation
        if (item.variation?.id && action.payload.variation?.id) {
          return !(
            item.id === action.payload.id &&
            item.variation.id === action.payload.variation.id
          );
        }

        // If neither has variation → match only by product
        if (!item.variation?.id && !action.payload.variation?.id) {
          return item.id !== action.payload.id;
        }

        // One has variation, the other doesn’t → keep the item
        return true;
      });

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
        const newItems = state.items.filter((item) => {
          if (item.type === "product") {
            return item.id !== id;
          } else {
            return item.id !== id;
          }
        });
        const { total, itemCount } = calculateTotals(newItems);

        newState = {
          items: newItems,
          total,
          itemCount,
          isSidecartOpen: state.isSidecartOpen,
        };
      } else {
        const newItems = state.items.map((item) => {
          if (item.type === "product" && item.id === id) {
            return { ...item, quantity };
          } else if (item.type === "combo" && item.id === id) {
            return { ...item, quantity };
          }
          return item;
        });

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

    case "ADD_PRODUCT_TO_COMBO": {
      const { comboId, product } = action.payload;
      const newItems = state.items.map((item) => {
        if (item.type === "combo" && String(item.id) === String(comboId)) {
          const updatedProducts = [...item.products, product];
          const updatedPrice = calculateComboPrice(
            updatedProducts,
            item.discountPercent
          );
          const updatedName = generateComboName(updatedProducts);

          return {
            ...item,
            products: updatedProducts,
            price: updatedPrice,
            name: updatedName,
          };
        }
        return item;
      });

      const { total, itemCount } = calculateTotals(newItems);

      newState = {
        items: newItems,
        total,
        itemCount,
        isSidecartOpen: state.isSidecartOpen,
      };
      break;
    }

    case "REMOVE_PRODUCT_FROM_COMBO": {
      const { comboId, productId } = action.payload;
      const newItems = state.items
        .map((item) => {
          if (item.type === "combo" && item.id === comboId) {
            const updatedProducts = item.products.filter(
              (p) => p.id !== productId
            );

            // If only one product left, you might want to convert back to regular item
            // or remove the combo entirely
            if (updatedProducts.length === 0) {
              return null; // Will be filtered out
            }

            const updatedPrice = calculateComboPrice(
              updatedProducts,
              item.discountPercent
            );
            const updatedName = generateComboName(updatedProducts);

            return {
              ...item,
              products: updatedProducts,
              price: updatedPrice,
              name: updatedName,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItemUnion[];

      const { total, itemCount } = calculateTotals(newItems);

      newState = {
        items: newItems,
        total,
        itemCount,
        isSidecartOpen: state.isSidecartOpen,
      };
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

  React.useEffect(() => {
    dispatch({ type: "LOAD_CART" });
  }, []);

  const addItem = (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const addWooProduct = (product: ProductPage, quantity: number = 1) => {
    const cartItem = wooProductToCartItem(product);
    dispatch({ type: "ADD_ITEM", payload: { ...cartItem, quantity } });
  };

  const addWooProductWithAnimation = async (
    product: ProductPage,
    quantity: number = 1,
    delay: number = 800
  ) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const cartItem = wooProductToCartItem(product);
        dispatch({ type: "ADD_ITEM", payload: { ...cartItem, quantity } });
        resolve();
      }, delay);
    });
  };

  const addCombo = (
    products: FullProduct[],
    discountPercent: number = 10,
    quantity: number = 1
  ): number => {
    const comboId = generateComboId();
    const comboName = generateComboName(products);
    const comboPrice = calculateComboPrice(products, discountPercent);
    const comboImage = products[0]?.images[0]?.src;

    const combo: Omit<ComboItem, "quantity"> = {
      id: comboId,
      name: comboName,
      price: comboPrice,
      products,
      discountPercent,
      type: "combo",
      image: comboImage,
    };

    dispatch({ type: "ADD_COMBO", payload: { ...combo, quantity } });
    return comboId;
  };

  const addProductToCombo = (comboId: number, product: FullProduct) => {
    dispatch({ type: "ADD_PRODUCT_TO_COMBO", payload: { comboId, product } });
  };

  const removeProductFromCombo = (comboId: number, productId: number) => {
    dispatch({
      type: "REMOVE_PRODUCT_FROM_COMBO",
      payload: { comboId, productId },
    });
  };

  const getComboById = (comboId: number): ComboItem | undefined => {
    const item = state.items.find(
      (item) => item.type === "combo" && item.id === comboId
    );
    return item?.type === "combo" ? item : undefined;
  };

  const removeFreeItems = () => {
    const promotionalItem = state.items.find(
      (item) => item.type === "product" && item.isPromotional
    );
    if (promotionalItem) {
      console.log("Removing promotional item:", promotionalItem.name);
      removeItem({ id: promotionalItem.id });
    }
  };

  const removeItem = ({
    id,
    variation,
  }: {
    id: number;
    variation?: {
      id: number;
    };
  }) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, variation } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const isInStock = (id: number): boolean => {
    const item = state.items.find(
      (item) => item.type === "product" && item.id === id
    );
    return item && item.type === "product"
      ? item.stock_status === "instock"
      : false;
  };

  const canAddToCart = (id: number, requestedQuantity: number): boolean => {
    const item = state.items.find(
      (item) => item.type === "product" && item.id === id
    );
    if (!item || item.type !== "product") return false;

    if (item.stock_status !== "instock") return false;

    const currentQuantityInCart = item.quantity;
    return currentQuantityInCart + requestedQuantity <= item.stock_quantity;
  };

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
    addCombo,
    removeItem,
    updateQuantity,
    addWooProductWithAnimation,
    addProductToCombo,
    removeProductFromCombo,
    clearCart,
    isInStock,
    canAddToCart,
    openSidecart,
    closeSidecart,
    toggleSidecart,
    removeFreeItems,
    getComboById,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  const pathname = usePathname();

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const { items, removeItem } = context;

  useEffect(() => {
    if (pathname !== "/checkout") {
      removeFreeItems();
    }
  }, [pathname, context, items]);

  const removeFreeItems = () => {
    const promotionalItem = items.find(
      (item) => item.type === "product" && item.isPromotional
    );
    if (promotionalItem) {
      console.log("Removing promotional item:", promotionalItem.name);
      removeItem({ id: promotionalItem.id });
    }
  };

  return context;
};
