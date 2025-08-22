import React, { useEffect, useState } from "react";
import {  AlertTriangle, Package, Minus, Plus, Trash2 } from "lucide-react";
import { CartItemUnion } from "@/app/types";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAlert } from "@/context/AlertContext";

interface BaseStockIssueItem {
  product_id: number;
  product_name: string;
  requested_quantity: number;
  available_quantity: number;
  out_of_stock_quantity: number;
}

interface ProductStockIssueItem extends BaseStockIssueItem {
  type: "product";
}

interface ComboStockIssueItem extends BaseStockIssueItem {
  type: "combo";
  combo_id: number;
}

type StockIssueItem = ProductStockIssueItem | ComboStockIssueItem;

interface StockCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  outOfStockList: StockIssueItem[];
  cartItems: CartItemUnion[];
  updateQuantity: (id: number, quantity: number) => void;
 removeItem: (payload: {
    id: number;
    variation?: {
      id: number;
    };
  }) => void;
  onContinue?: () => void;
}

const StockCheckModal: React.FC<StockCheckModalProps> = ({
  isOpen,
  onClose,
  outOfStockList,
  cartItems,
  updateQuantity,
  removeItem,
  onContinue,
}) => {
  const [localQuantities, setLocalQuantities] = useState<{
    [key: number]: number;
  }>({});

  const { removeProductFromCombo } = useCart();
  const { showToast } = useAlert();
  // Initialize local quantities from cart items
  useEffect(() => {
    const quantities: { [key: number]: number } = {};
    console.log("OUT OF STOCK LIST", outOfStockList);
    outOfStockList.forEach((item) => {
      console.log("Cart Items", cartItems);
      console.log("outOfStockList Item", item);
      const cartItem = cartItems.find((ci) => ci.id === item.product_id);
      if (cartItem && item.available_quantity > 0) {
        quantities[item.product_id] = item.available_quantity;
      }
    });
    console.log("Initial local quantities:", quantities);
    setLocalQuantities(quantities);
  }, [outOfStockList, cartItems]);

  if (!isOpen) return null;

  const handleQuantityChange = (
    productId: number,
    newQuantity: number,
    maxQuantity: number
  ) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setLocalQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
  };

  const handleRemoveItem = (
    productId: number,
    type: "product" | "combo",
    combo_id?: number
  ) => {
    if (type === "combo") {
      if (combo_id !== undefined) {
        removeProductFromCombo(combo_id, productId);
      }
      showToast({
        message: "Item removed from combo",
        variant: "success",
      });
    } else {
      removeItem({id : productId});
      showToast({
        message: "Item removed from cart",
        variant: "success",
      });
    }
  };

  const handleUpdateAll = () => {
    // Update quantities for items with available stock
    Object.entries(localQuantities).forEach(([productId, quantity]) => {
      updateQuantity(Number(productId), quantity);
    });

    // Remove items that are completely out of stock
    outOfStockList.forEach((item) => {
      if (item.available_quantity === 0) {
        if (item.type === "combo") {
          removeProductFromCombo(item.combo_id, item.product_id);
          showToast({
            message: "Item removed from combo, cart has been updated",
            variant: "success",
          });
          return;
        }
        showToast({
          message: "Item removed from cart, cart has been updated",
          variant: "success",
        });
        removeItem({id : item.product_id});
      }
    });

    if (onContinue) {
      onContinue();
    }
    onClose();
  };

  const completelyOutOfStock = outOfStockList.filter(
    (item) => item.available_quantity === 0
  );
  const partiallyOutOfStock = outOfStockList.filter(
    (item) => item.available_quantity > 0
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-500" size={24} />
              <SheetTitle className="text-xl font-semibold text-gray-900">
                Stock Availability Issues
              </SheetTitle>
            </div>
            <SheetDescription className="text-gray-600 mt-2">
              We found some issues with item availability in your cart. Please
              review and update your order below.
            </SheetDescription>
          </SheetHeader>

          {/* Content */}
          <div className="space-y-6 py-4">
            {/* Completely Out of Stock Items */}
            {completelyOutOfStock.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                  <Package className="text-red-500" size={20} />
                  Items Out of Stock
                </h3>
                <div className="space-y-3">
                  {completelyOutOfStock.map((item) => {
                    return (
                      <div
                        key={item.product_id}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {item.product_name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Requested: {item.requested_quantity} • Available:{" "}
                              {item.available_quantity}
                            </p>
                            <p className="text-sm text-red-600 font-medium">
                              This item is currently out of stock
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (item.type === "product") {
                                handleRemoveItem(item.product_id, item.type);
                              } else {
                                handleRemoveItem(
                                  item.product_id,
                                  item.type,
                                  item.combo_id
                                );
                              }
                            }}
                            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Partially Out of Stock Items */}
            {partiallyOutOfStock.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-amber-600 flex items-center gap-2">
                  <Package className="text-amber-500" size={20} />
                  Limited Stock Items
                </h3>
                <div className="space-y-3">
                  {partiallyOutOfStock.map((item) => {
                    const currentQuantity =
                      localQuantities[item.product_id] ||
                      item.available_quantity;

                    return (
                      <div
                        key={item.product_id}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                      >
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {item.product_name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              You requested: {item.requested_quantity} •
                              Available: {item.available_quantity}
                            </p>
                            <p className="text-sm text-amber-600 font-medium">
                              Only {item.available_quantity} items available
                              (short by {item.out_of_stock_quantity})
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 flex-shrink-0">
                              Update quantity:
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    currentQuantity - 1,
                                    item.available_quantity
                                  )
                                }
                                disabled={currentQuantity <= 1}
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-12 text-center font-medium">
                                {currentQuantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    currentQuantity + 1,
                                    item.available_quantity
                                  )
                                }
                                disabled={
                                  currentQuantity >= item.available_quantity
                                }
                                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">
                              (Max: {item.available_quantity})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateAll}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Update Cart & Continue
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StockCheckModal;
