import Header from "@/components/header-footer/Header";
import Footer from "@/components/home/Footer";

export default function Loading() {
  return (
    <>
      <Header />

      {/* Search Section */}

      <div className="max-w-6xl mx-auto px-10 bg-white">
        {/* Breadcrumb Skeleton */}
        <nav className="text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <span className="mx-2">{">"}</span>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <span className="mx-2">{">"}</span>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <span className="mx-2">{">"}</span>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image Skeleton */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Format */}
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-gray-200 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Pricing Skeleton */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>

            {/* Stock Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            {/* Quantity Skeleton */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 animate-pulse"></div>
                  <div className="px-4 py-2 min-w-[3rem] text-center">
                    <div className="h-5 bg-gray-200 rounded w-6 mx-auto animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            </div>

            {/* Buy Now Button Skeleton */}
            <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>

        {/* Trust Badges Skeleton */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Countdown Timer Skeleton */}
        <div className="text-center mb-8">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="flex justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[80px]"
              >
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse"></div>
        </div>

        {/* Delivery Check Skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
          <div className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* User Reviews Skeleton */}
      <div className="mt-6 max-w-6xl mx-auto px-10">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
}
