import Skeleton from "@/components/Skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Breadcrumb */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 text-sm">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton height={40} width="60%" className="mb-2" />
              <Skeleton height={16} width="40%" />
            </div>
            <div className="flex gap-3">
              <Skeleton height={40} width={100} className="rounded-xl" />
              <Skeleton height={40} width={100} className="rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gallery Section - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Main Product Image */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8c0-2.15 0-4.2-.85-5.73L12 2l4.58 4.58A8 8 0 0112 12z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Image Overlay Effects */}
                <div className="absolute top-4 right-4">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white/90 rounded-full backdrop-blur-sm animate-pulse"></div>
                    <div className="w-8 h-8 bg-white/90 rounded-full backdrop-blur-sm animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-6 border-t border-gray-200 rounded-b-xl">
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square bg-gray-100 rounded-lg animate-pulse ${
                        i === 0 ? 'ring-2 ring-green-500 ring-offset-2' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Section - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Product Title and Rating */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Skeleton height={32} width="85%" className="mb-2" />
                    <Skeleton height={16} width="60%" />
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <Skeleton height={32} width="40%" />
              </div>

              {/* Description */}
              <div className="mb-6">
                <Skeleton height={16} className="mb-2" />
                <Skeleton height={16} className="mb-2" />
                <Skeleton height={16} />
                <Skeleton height={16} width="90%" />
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <Skeleton height={20} width="35%" className="mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton height={12} width="40%" />
                      <Skeleton height={12} width="50%" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <Skeleton height={20} width="35%" className="mb-4" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="px-3 py-1 bg-gray-100 rounded-full animate-pulse">
                      <Skeleton height={16} width={60} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full animate-pulse"></div>
                      <Skeleton height={12} width="70%" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton height={52} width="100%" className="rounded-xl" />
                <Skeleton height={52} width="100%" className="rounded-xl" />
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded-full animate-pulse"></div>
                    <Skeleton height={12} width="60%" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-100 rounded-full animate-pulse"></div>
                    <Skeleton height={12} width="60%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="mb-8">
            <Skeleton height={28} width="25%" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="p-6">
                  <Skeleton height={20} width="80%" className="mb-3" />
                  <Skeleton height={16} width="60%" />
                  <div className="flex items-center justify-between mt-4">
                    <Skeleton height={20} width="40%" />
                    <Skeleton height={20} width="20%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
