export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      <main className="mx-auto max-w-[1400px] px-6 md:px-12 pt-[120px] pb-32 overflow-hidden">
        {/* Hero Text Skeleton */}
        <div className="max-w-4xl mb-16 md:mb-20 animate-pulse">
          <div className="h-14 bg-black/5 rounded-md w-1/2 mb-5"></div>
          <div className="h-4 bg-black/5 rounded-md w-3/4"></div>
        </div>

        {/* Tab Filters Skeleton */}
        <div className="flex gap-4 md:gap-10 border-b border-black/10 mb-16 px-2 animate-pulse">
          <div className="h-4 bg-black/5 w-12 mb-4"></div>
          <div className="h-4 bg-black/5 w-24 mb-4"></div>
          <div className="h-4 bg-black/5 w-20 mb-4"></div>
          <div className="h-4 bg-black/5 w-32 mb-4"></div>
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col border border-black/10 animate-pulse">
              <div className="aspect-[4/3] w-full bg-black/5"></div>
              <div className="h-[250px] bg-[#0a0a0a]/5 p-6 md:p-10 flex flex-col">
                <div className="h-3 bg-black/10 w-1/4 mb-6"></div>
                <div className="h-5 bg-black/10 w-full mb-2"></div>
                <div className="h-5 bg-black/10 w-3/4 mb-8"></div>
                
                <div className="mt-auto">
                  <div className="h-3 bg-black/10 w-1/2 mb-2"></div>
                  <div className="h-3 bg-black/10 w-2/3 mb-10"></div>
                  <div className="h-12 bg-black/10 w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
