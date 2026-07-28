export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#111111] text-white">
      {/* Hero Section Skeleton */}
      <section className="relative flex w-full min-h-screen flex-col justify-center bg-black overflow-hidden animate-pulse">
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-center px-8 md:px-16 py-12 md:py-24 pt-[120px] md:pt-[140px]">
          <div className="h-16 bg-white/10 w-3/4 mb-4"></div>
          <div className="h-16 bg-white/10 w-1/2 mb-8"></div>
          
          <div className="h-4 bg-white/10 w-1/2 mb-2"></div>
          <div className="h-4 bg-white/10 w-2/3 mb-10"></div>
          
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-white/10 rounded-sm"></div>
            <div className="h-12 w-48 bg-white/10 rounded-sm"></div>
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="flex flex-col justify-center bg-[#111111] pt-24 pb-16 px-8 md:px-16 animate-pulse">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col border border-white/5">
              <div className="aspect-square w-full bg-white/5"></div>
              <div className="w-full bg-[#d9d9d9]/10 h-16"></div>
            </div>
            <div className="flex flex-col border border-white/5">
              <div className="aspect-square w-full bg-white/5"></div>
              <div className="w-full bg-[#d9d9d9]/10 h-16"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Grid Skeleton */}
      <section className="flex flex-col justify-center bg-[#111111] pb-24 pt-8 px-8 md:px-16 animate-pulse">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="h-10 w-1/3 bg-white/10 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 p-10 flex flex-col h-full min-h-[300px]">
                <div className="h-4 w-3/4 bg-white/10 mb-4"></div>
                <div className="h-3 w-full bg-white/10 mb-2"></div>
                <div className="h-3 w-5/6 bg-white/10 mb-2"></div>
                <div className="h-3 w-2/3 bg-white/10"></div>
                <div className="mt-auto pt-6">
                  <div className="h-6 w-1/2 bg-white/10 rounded-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
