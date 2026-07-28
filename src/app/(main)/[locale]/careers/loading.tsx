export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Hero Section Skeleton */}
      <section className="bg-white pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-16 items-center">
          <div className="max-w-xl animate-pulse">
            <div className="h-3 bg-black/5 w-24 mb-6"></div>
            <div className="h-14 bg-black/5 w-full mb-3"></div>
            <div className="h-14 bg-black/5 w-3/4 mb-8"></div>
            <div className="h-4 bg-black/5 w-full mb-2"></div>
            <div className="h-4 bg-black/5 w-5/6"></div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-[2rem] bg-black/5 animate-pulse"></div>
        </div>
      </section>

      {/* Form Section Skeleton */}
      <section className="bg-[#111111] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/5 w-3/4 mb-3"></div>
            <div className="h-12 bg-[#00E573]/20 w-1/2 mb-6"></div>
            <div className="h-3 bg-white/5 w-full mb-2"></div>
            <div className="h-3 bg-white/5 w-2/3 mb-12"></div>
            <div className="h-4 bg-white/5 w-48"></div>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-[2rem] p-8 aspect-square animate-pulse"></div>
        </div>
      </section>
    </div>
  );
}
