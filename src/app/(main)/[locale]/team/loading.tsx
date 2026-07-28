export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      <main className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        <div className="animate-pulse mb-12 md:mb-20">
          <div className="h-12 bg-black/5 w-64"></div>
        </div>

        <div className="flex flex-col gap-32">
          {[...Array(3)].map((_, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-24 items-center animate-pulse">
                
                {/* Image Skeleton */}
                <div className={`w-full aspect-[4/5] bg-black/5 relative ${isEven ? 'order-1' : 'order-1 md:order-2'}`}></div>
                
                {/* Text Content Skeleton */}
                <div className={`flex flex-col justify-center ${isEven ? 'order-2' : 'order-2 md:order-1'}`}>
                  <div className="h-6 bg-black/5 w-1/3 mb-3"></div>
                  <div className="h-10 bg-black/5 w-3/4 mb-6"></div>
                  <div className="h-4 bg-black/5 w-full mb-3"></div>
                  <div className="h-4 bg-black/5 w-5/6 mb-3"></div>
                  <div className="h-4 bg-black/5 w-4/5 mb-3"></div>
                  <div className="h-4 bg-black/5 w-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
