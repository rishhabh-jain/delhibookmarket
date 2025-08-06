import React, { useEffect, useState } from "react";
import { X, AlertTriangle, Package, Minus, Plus, Trash2 } from "lucide-react";

interface StockIssueItem {
  product_id: number;
  product_name: string;
  requested_quantity: number;
  available_quantity: number;
  out_of_stock_quantity: number;
}

interface CartItem {
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
}

interface StockCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  outOfStockList: StockIssueItem[];
  cartItems: CartItem[];
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
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

  // Initialize local quantities from cart items
  useEffect(() => {
    const quantities: { [key: number]: number } = {};
    outOfStockList.forEach((item) => {
      const cartItem = cartItems.find((ci) => ci.id === item.product_id);
      if (cartItem && item.available_quantity > 0) {
        quantities[item.product_id] = item.available_quantity;
      }
    });
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

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  const handleUpdateAll = () => {
    // Update quantities for items with available stock
    Object.entries(localQuantities).forEach(([productId, quantity]) => {
      updateQuantity(Number(productId), quantity);
    });

    // Remove items that are completely out of stock
    outOfStockList.forEach((item) => {
      if (item.available_quantity === 0) {
        removeItem(item.product_id);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Stock Availability Issues
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
            {""}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            We found some issues with item availability in your cart. Please
            review and update your order below.
          </p>

          {/* Completely Out of Stock Items */}
          {completelyOutOfStock.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                <Package className="text-red-500" size={20} />
                Items Out of Stock
              </h3>
              {completelyOutOfStock.map((item) => {
                return (
                  <div
                    key={item.product_id}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
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
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Partially Out of Stock Items */}
          {partiallyOutOfStock.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-amber-600 flex items-center gap-2">
                <Package className="text-amber-500" size={20} />
                Limited Stock Items
              </h3>
              {partiallyOutOfStock.map((item) => {
                const currentQuantity =
                  localQuantities[item.product_id] || item.available_quantity;

                return (
                  <div
                    key={item.product_id}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          You requested: {item.requested_quantity} • Available:{" "}
                          {item.available_quantity}
                        </p>
                        <p className="text-sm text-amber-600 font-medium">
                          Only {item.available_quantity} items available (short
                          by {item.out_of_stock_quantity})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">
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
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                            {""}
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
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                            {""}
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
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
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
      </div>
    </div>
  );
};

export default StockCheckModal;
