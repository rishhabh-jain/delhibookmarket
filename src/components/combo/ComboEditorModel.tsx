import { ComboItem, FullProduct } from "@/app/types";
import { useCart } from "@/context/CartContext";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus, Search, X } from "lucide-react";
import Image from "next/image";
import { useAlert } from "@/context/AlertContext";
interface ComboEditorProps {
  combo: ComboItem;
  onClose?: () => void;
}

export const ComboEditor: React.FC<ComboEditorProps> = ({ combo, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FullProduct[]>([]);
  const [allProducts, setAllProducts] = useState<FullProduct[]>([]);
  const [showSearch, setShowSearch] = useState(false); // New state for toggling search
  const { addProductToCombo, removeProductFromCombo, getComboById } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("COMBO IN EDITOR", combo);

  const {showToast}=useAlert()

  const currentCombo = getComboById(combo.id);

  const { relatedProducts: allRelatedProducts, error } = useRelatedProducts(
    currentCombo?.products[0]?.id?.toString() ?? "",
    currentCombo?.name ?? ""
  );

  const updateRelatedProducts = useCallback(() => {
    setRelatedProducts(allRelatedProducts);
  }, [allRelatedProducts]);

  useEffect(() => {
    updateRelatedProducts();
  }, [updateRelatedProducts]);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        // Convert to FullProduct format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wooProducts: FullProduct[] = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          permalink: product.permalink,
          price: product.price,
          regular_price: product.price,
          sale_price: "",
          images: product.images || [],
          stock_quantity: product.stock_quantity || 10,
          stock_status: "instock" as const,
        }));
        setAllProducts(wooProducts);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !currentCombo?.products.some((p) => p.id === product.id)
      )
      .slice(0, 5); // Limit results

    setSearchResults(filtered);
  }, [searchTerm, allProducts, currentCombo?.products]);

  useEffect(() => {
    if (!allRelatedProducts.length) return;

    setRelatedProducts(
      allRelatedProducts.filter(
        (p) => !combo.products.some((cp) => cp.id === p.id)
      )
    );
  }, [allRelatedProducts, combo.products]);

  const handleAddProduct = async (product: FullProduct) => {
    setLoading(true);
    try {
      addProductToCombo(combo.id, product);
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding product to combo:", error);
    }
    setLoading(false);
  };

  const handleRemoveProduct = (productId: number) => {
    if(currentCombo ){
      if(currentCombo.products.length <=2){
        showToast({
          variant:"warning",
          message : "A combo must have atleast 2 products"
        })
        return
      }
    }
    removeProductFromCombo(combo.id, productId);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  if (!combo || !combo.id) {
    return <div className="p-4 text-center text-gray-500">Combo not found</div>;
  }

  if (!currentCombo) {
    return <div className="p-4 text-center text-gray-500">Combo not found</div>;
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md w-full"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Combo</h3>
          <p className="text-sm text-gray-600 ">
            {currentCombo.name.slice(0, 100)}...
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Current Products */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Current Products ({currentCombo.products.length})
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {currentCombo.products.map((product) => (
            <motion.div
              key={product.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-md group"
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="w-10 h-10 flex-shrink-0 bg-white rounded overflow-hidden border border-gray-200">
                {product.images && product.images[0] ? (
                  <Image
                    width={40}
                    height={40}
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <span className="text-xs">No img</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium text-gray-900 truncate">
                  {product.name.slice(0, 30)}
                </h5>
                <p className="text-xs text-gray-600">
                  ₹{parseFloat(product.price || "0").toFixed(2)}
                </p>
              </div>
              <motion.button
                onClick={() => handleRemoveProduct(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentCombo.products.length <= 1}
                title={
                  currentCombo.products.length <= 1
                    ? "Cannot remove last product"
                    : "Remove from combo"
                }
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Products Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            {showSearch ? "Search Products" : "Related Products"}
          </h4>
          <button
            onClick={toggleSearch}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showSearch ? (
              <>
                <ArrowLeft className="w-3 h-3" />
                Back
              </>
            ) : (
              <>
                <Search className="w-3 h-3" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Search Input - Only show when search is active */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="relative mb-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product List - Related or Search Results */}
        <AnimatePresence mode="wait">
          {showSearch ? (
            // Search Results
            <motion.div
              key="search-results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {searchResults.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((product) => (
                    <motion.div
                      key={product.id}
                      className="flex items-center gap-3 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer group"
                      onClick={() => handleAddProduct(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-white rounded overflow-hidden border border-gray-200">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <span className="text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h5>
                        <p className="text-xs text-gray-600">
                          ₹{parseFloat(product.price || "0").toFixed(2)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No products found for {searchTerm}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  Start typing to search products...
                </div>
              )}
            </motion.div>
          ) : (
            // Related Products
            <motion.div
              key="related-products"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {loading ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Loading related products...
                </div>
              ) : error ? (
                <div className="text-sm text-red-500 text-center py-4">
                  {error}
                </div>
              ) : relatedProducts.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {relatedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="flex items-center gap-3 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer group"
                      onClick={() => handleAddProduct(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-white rounded overflow-hidden border border-gray-200">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <span className="text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h5>
                        <p className="text-xs text-gray-600">
                          ₹{parseFloat(product.price || "0").toFixed(2)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  No related products found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Combo Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Total Price:
          </span>
          <span className="text-lg font-bold text-emerald-600">
            ₹{currentCombo.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Products: {currentCombo.products.length}</span>
          <span>
            {currentCombo.discountPercent && currentCombo.discountPercent > 0
              ? `${currentCombo.discountPercent}% discount applied`
              : "No discount"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Overlay component for modal usage

export const ComboEditorModal: React.FC<
  ComboEditorProps & { isOpen: boolean }
> = ({ combo, onClose, isOpen }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-white/10 backdrop-blur-sm"
      onClick={handleBackgroundClick}
    >
      <ComboEditor combo={combo} onClose={onClose} />
    </div>
  );
};
