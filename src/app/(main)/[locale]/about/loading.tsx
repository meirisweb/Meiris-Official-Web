export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      <main className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        {/* Hero Text Skeleton */}
        <div className="max-w-4xl mb-12 md:mb-16 animate-pulse">
          <div className="h-12 bg-black/5 rounded-md w-3/4 mb-5"></div>
          <div className="h-4 bg-black/5 rounded-md w-full mb-3"></div>
          <div className="h-4 bg-black/5 rounded-md w-5/6"></div>
        </div>

        {/* Main Content Block Skeleton */}
        <div className="bg-[#f0fbf5] border-l-[4px] border-[#00E573]/20 p-6 sm:p-10 md:p-14 lg:p-16 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-black/5 rounded-md w-full"></div>
            <div className="h-4 bg-black/5 rounded-md w-full"></div>
            <div className="h-4 bg-black/5 rounded-md w-11/12"></div>
            <div className="h-4 bg-black/5 rounded-md w-4/5"></div>
            <div className="h-4 bg-black/5 rounded-md w-full"></div>
            <div className="h-4 bg-black/5 rounded-md w-3/4"></div>
          </div>
          
          <div className="h-px w-full bg-black/5 my-10"></div>
          <div className="h-3 bg-black/5 rounded-md w-1/2"></div>
        </div>
      </main>
    </div>
  );
}
