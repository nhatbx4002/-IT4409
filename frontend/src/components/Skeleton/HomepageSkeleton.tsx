import { Skeleton } from "@/components/ui/skeleton";

export function HomepageSkeleton() {
  return (
    <div className="min-h-screen bg-white skeleton-shimmer">

      {/* Hero Skeleton */}
      <div className="relative h-screen">
        <Skeleton className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 px-6">
            <Skeleton className="h-20 w-96 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }} />
            <Skeleton className="h-6 w-64 mx-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
            <Skeleton className="h-12 w-48 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
          </div>
        </div>
      </div>

      {/* Featured Collections Skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            <Skeleton className="h-1 w-24 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <Skeleton className="aspect-3/4 mb-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-8 w-32 mx-auto mb-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-4 w-24 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Carousel Skeleton */}
      <div className="py-16 bg-white border-y border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            <Skeleton className="h-1 w-24 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
          </div>
          <div className="flex gap-12 items-center justify-center overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-32 shrink-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            <Skeleton className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
            <Skeleton className="h-4 w-96 mx-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <Skeleton className="aspect-3/4 mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-6 w-3/4 mb-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-5 w-1/2 mb-2" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-6 w-6 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotion Banner Skeleton */}
      <div className="relative py-32 overflow-hidden">
        <Skeleton className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <Skeleton className="h-16 w-96 mx-auto mb-4" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
          <Skeleton className="h-6 w-64 mx-auto mb-8" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
          <Skeleton className="h-20 w-80 mx-auto mb-8" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
          <Skeleton className="h-12 w-48 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
        </div>
      </div>

      {/* Editorial Section Skeleton */}
      <div className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            <Skeleton className="h-1 w-24 mx-auto" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-4/5 mb-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-8 w-3/4 mb-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-4 w-full mb-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-4 w-5/6 mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
                <Skeleton className="h-6 w-32" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instagram Gallery Skeleton */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            <Skeleton className="h-1 w-24 mx-auto mb-4" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
            <Skeleton className="h-6 w-48 mx-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
