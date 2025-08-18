import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loading() {
  return (
     <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-600" />
        <span className="text-blue-700 font-medium">
          Finding perfect combos...
        </span>
      </div>
  )
}
