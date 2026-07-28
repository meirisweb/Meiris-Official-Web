export default function Loading() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Hero Section Skeleton */}
      <section className="relative flex flex-col md:flex-row h-auto md:h-screen min-h-[100dvh] md:min-h-[700px] pt-[68px] bg-[#0c0c0c] w-full">
        {/* Left Content */}
        <div className="w-full md:w-1/2 px-6 md:pl-20 md:pr-12 py-12 z-10 flex flex-col flex-1 justify-center animate-pulse">
          <div className="h-16 bg-white/10 w-3/4 mb-6"></div>
          <div className="h-16 bg-white/10 w-1/2 mb-6"></div>
          
          <div className="h-4 bg-white/10 w-2/3 mb-2"></div>
          <div className="h-4 bg-white/10 w-1/2 mb-10"></div>
          
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-white/10 rounded-sm"></div>
            <div className="h-12 w-48 bg-white/10 rounded-sm"></div>
          </div>
        </div>
        
        {/* Right Block */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%] bg-white/5 rounded-l-[4rem] animate-pulse"></div>
      </section>

      {/* Map Section Skeleton */}
      <section className="bg-black py-16 md:py-32 px-6 md:px-20 border-t border-white/10">
        <div className="mx-auto max-w-[1200px] animate-pulse">
          <div className="h-10 bg-white/10 w-3/4 mb-4"></div>
          <div className="h-10 bg-white/10 w-1/2 mb-16"></div>
          
          <div className="w-full bg-white/5 rounded-2xl md:rounded-3xl aspect-[4/3] md:aspect-[16/9] max-h-[700px] mb-10"></div>
          
          <div className="w-full bg-[#eefaf3]/5 rounded-xl p-6 md:p-8 border border-white/5 h-32"></div>
        </div>
      </section>
      
      {/* Features Grid Skeleton */}
      <section className="bg-[#171717] py-16 md:py-32 px-6 md:px-20 border-t border-white/5">
        <div className="mx-auto max-w-[1400px] animate-pulse">
          <div className="h-10 bg-white/10 w-1/2 mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-white/5 rounded-2xl p-8 h-32 bg-white/5"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
