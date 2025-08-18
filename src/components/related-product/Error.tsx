import { ShoppingBag } from 'lucide-react'
import React from 'react'

export default function Error({error}: { error: string }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">
              Unable to load related products
            </p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
  )
}
