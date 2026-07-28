export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Hero Section Skeleton */}
      <section className="bg-white pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div className="animate-pulse">
            <div className="h-14 bg-black/5 w-full mb-2"></div>
            <div className="h-14 bg-black/5 w-3/4 mb-8"></div>
            <div className="h-4 bg-black/5 w-2/3 mb-2"></div>
            <div className="h-4 bg-black/5 w-1/2"></div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-[2rem] bg-black/5 animate-pulse"></div>
        </div>
      </section>

      {/* Form Section Skeleton */}
      <section className="bg-[#f5f6f8] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 flex flex-col items-center">
          
          <div className="w-full max-w-[800px] aspect-[4/3] bg-black/5 rounded-[2rem] mb-16 animate-pulse"></div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[900px]">
            <div className="bg-black/5 h-48 rounded-3xl animate-pulse"></div>
            <div className="bg-black/5 h-48 rounded-3xl animate-pulse"></div>
            <div className="bg-black/5 h-48 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
