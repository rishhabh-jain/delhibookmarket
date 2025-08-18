/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { Plus, ShoppingCart, Loader2, Tag, Check } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface RelatedProduct {
  product_id: string
  title: string
  author?: string
  categories: string[]
}

interface ProductImage {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  src: string
  name: string
  alt: string
}

interface FullProduct {
  id: number
  name: string
  permalink: string
  price: string
  images: ProductImage[]
  slug: string
  total_sales: number
  stock_quantity: number
  status: string
}

interface Props {
  productId: string
  title: string
  onAddToCart?: (products: FullProduct[]) => void
  onAddToCombo?:(product : FullProduct)=>void
}

export const ComboProduct: React.FC<Props> = ({ productId, title, onAddToCart }) => {
  const [allProducts, setAllProducts] = useState<FullProduct[]>([])
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [fullProducts, setFullProducts] = useState<FullProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addWooProduct } = useCart()

  // Fetch all products
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: FullProduct[]) => setAllProducts(data))
      .catch(() => setError("Failed to load product data"))
  }, [])

  // Fetch related products from API
  useEffect(() => {
    async function fetchRelated() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/related-product/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId, title }),
        })
        const json = await res.json()
        if (json.relatedProducts) {
          setRelatedProducts(json.relatedProducts)
        } else if (json.error) {
          setError(json.error)
        }
      } catch {
        setError("Failed to fetch related products")
      }
      setLoading(false)
    }

    if (productId) {
      fetchRelated()
    }
  }, [productId, title])

  // Map relatedProducts with full product info
  useEffect(() => {
    if (!allProducts.length || !relatedProducts.length) return

    const enriched = relatedProducts
      .slice(0, 3)
      .map((rp) => allProducts.find((p) => p.id === Number(rp.product_id)))
      .filter((p): p is FullProduct => p !== undefined) // type guard

    setFullProducts(enriched)
  }, [allProducts, relatedProducts])

  // Calculate total price
  const totalPrice = fullProducts.reduce((sum, product) => {
    return sum + (product.price ? Number.parseFloat(product.price) : 0)
  }, 0)

  // Calculate discount (example: 10% combo discount)
  const discountPercent = 10
  const discountedPrice = totalPrice * (1 - discountPercent / 100)
  const savings = totalPrice - discountedPrice

  const handleAddComboToCart = async () => {
    setIsAdding(true)

    // Wait for a brief moment to show loading state
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (onAddToCart && fullProducts.length > 0) {
      for (const product of fullProducts) {
        console.log(product)
      }
    } else {
      // Default action - you can customize this
      for (const product of fullProducts) {
        console.log(product)
        addWooProduct(
          {
            ...product,
            stock_status: "instock",
            regular_price: "199",
            sale_price: "199",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            description: (product as any).description ?? "",
            short_description: (product as any).short_description ?? "",
            categories: (product as any).categories ?? [],
            average_rating: (product as any).average_rating ?? "0",
            rating_count: (product as any).rating_count ?? 0,
          },
          1,
        )
      }
      console.log("Adding combo to cart:", fullProducts)
    }

    setIsAdding(false)
    setShowSuccess(true)
    setIsAddedToCart(true)

    // Hide success state after 2 seconds but keep button disabled
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-600" />
        <span className="text-blue-700 font-medium">Finding perfect combos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
    )
  }

  if (fullProducts.length === 0) {
    return null
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute inset-0 bg-emerald-500/95 flex items-center justify-center z-50 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-center text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Check className="w-8 h-8" />
              </motion.div>
              <motion.h3
                className="text-lg font-bold mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Combo Added!
              </motion.h3>
              <motion.p
                className="text-sm opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {fullProducts.length} items added to cart
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-gray-900">Frequently Bought Together</h3>
        </div>
        <p className="text-xs text-gray-600">Save {discountPercent}% when you buy these together</p>
      </div>

      {/* Products in Rows - Compact */}
      <div className="p-3">
        <div className="space-y-2 mb-3">
          {fullProducts.map((product, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].src || "/placeholder.svg"}
                      alt={product.images[0].alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-0.5 line-clamp-1">{product.name}</h4>
                  {product.price && (
                    <p className="text-sm font-bold text-gray-900">₹{Number.parseFloat(product.price).toFixed(2)}</p>
                  )}
                </div>
                {index < fullProducts.length - 1 && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Plus className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-md p-3 mb-3 border border-emerald-100"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">Individual: </span>
              <span className="text-gray-500 line-through font-medium">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-700">₹{discountedPrice.toFixed(2)}</div>
              <div className="text-xs text-emerald-600 font-medium">Save ₹{savings.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.button
            onClick={handleAddComboToCart}
            disabled={isAdding || isAddedToCart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={!isAddedToCart ? { scale: 1.02 } : {}}
            whileTap={!isAddedToCart ? { scale: 0.98 } : {}}
            animate={
              isAdding
                ? {
                    background: "linear-gradient(to right, #10b981, #059669)",
                  }
                : isAddedToCart
                  ? {
                      background: "linear-gradient(to right, #10b981, #059669)",
                    }
                  : {}
            }
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding to Cart...
                </motion.div>
              ) : showSuccess || isAddedToCart ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Added to Cart
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add Combo to Cart
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Individual Product Links - More compact */}
          <details className="group">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors list-none flex items-center justify-center gap-1 py-1">
              <span>Or buy individually</span>
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-1 pt-1 border-t border-gray-100 space-y-0.5">
              {fullProducts.map((product, index) => (
                <a
                  key={index}
                  href={product.permalink}
                  className="block text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate px-2 py-0.5 rounded hover:bg-blue-50"
                >
                  {product.name}
                </a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </motion.div>
  )
}
