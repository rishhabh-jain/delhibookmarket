import { useEffect, useState, useCallback } from "react"
import { FullProduct, RelatedProduct } from "@/app/types"

export function useRelatedProducts(productId: string, title: string) {
  const [allProducts, setAllProducts] = useState<FullProduct[]>([])
  const [partialRelatedProducts, setPartialRelatedProducts] = useState<RelatedProduct[]>([])
  const [relatedProducts, setRelatedProducts] = useState<FullProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all products
  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data: FullProduct[]) => setAllProducts(data))
      .catch(() => setError("Failed to load product data"))
  }, [])

  // Fetch related products
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
          setPartialRelatedProducts(json.relatedProducts)
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

  // Merge related products with full info
  useEffect(() => {
    if (!allProducts.length || !partialRelatedProducts.length) return

    const enriched = partialRelatedProducts
      .map((rp) => allProducts.find((p) => p.id === Number(rp.product_id)))
      .filter((full): full is FullProduct => full !== undefined)

    setRelatedProducts(enriched)
  }, [allProducts, partialRelatedProducts])

  // Manual updater function
  const updateRelatedProducts = useCallback(
    (products: FullProduct[]) => {
      setRelatedProducts(products)
    },
    []
  )

  return { relatedProducts, loading, error, updateRelatedProducts }
}
