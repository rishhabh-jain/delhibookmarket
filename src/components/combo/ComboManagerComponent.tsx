import { useState } from "react";
import { FullProduct } from "@/app/types";
import RelatedProducts from "../related-product/RelatedProducts";
import { ComboProduct } from "./Combo";


export default function ComboManager({ productId, title }: { productId: string; title: string }) {
  const [comboProducts, setComboProducts] = useState<FullProduct[]>([]);

  // Add product
  const handleAddToCombo = (product: FullProduct) => {
    setComboProducts((prev) =>
      prev.find((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  // Remove product
  const handleRemoveFromCombo = (productId: number) => {
    setComboProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div className="space-y-6">
      <ComboProduct
        comboProducts={comboProducts}
        onRemoveFromCombo={handleRemoveFromCombo}
      />
      <RelatedProducts
        productId={productId}
        title={title}
        comboProducts={comboProducts}
        onAddToCombo={handleAddToCombo}
        onRemoveFromCombo={handleRemoveFromCombo} // 👈 pass same fn here
      />
    </div>
  );
}
