import React from 'react'

export default function Error({error}: { error: string }) {
  return (
   <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
  )
}
