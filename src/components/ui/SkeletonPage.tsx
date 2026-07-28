export default function SkeletonPage() {
  return (
    <div className="w-full min-h-screen bg-white p-8 md:p-12 lg:p-24 pt-32 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8">
        
        {/* Sidebar/Profile Skeleton */}
        <div className="w-full md:w-1/3 lg:w-1/4 h-[350px] bg-[#f8f9fa] border border-black/5 animate-pulse rounded-md flex flex-col relative overflow-hidden">
          {/* Top colored band */}
          <div className="h-24 bg-[#e9ecef] w-full"></div>
          {/* Avatar circle */}
          <div className="w-20 h-20 bg-[#dee2e6] rounded-full mx-auto -mt-10 border-4 border-[#f8f9fa]"></div>
          {/* Text lines */}
          <div className="mt-8 mx-auto w-3/4 h-3 bg-[#e9ecef] rounded-full"></div>
          <div className="mt-4 mx-auto w-1/2 h-2 bg-[#e9ecef] rounded-full"></div>
        </div>

        {/* Main Content List Skeleton */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
          
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full p-6 bg-[#f8f9fa] border border-black/5 animate-pulse rounded-md flex flex-col md:flex-row gap-6">
              {/* Left Circle/Image */}
              <div className="w-16 h-16 bg-[#e9ecef] rounded-full flex-shrink-0"></div>
              
              {/* Right Content */}
              <div className="w-full pt-2">
                <div className="w-1/3 h-4 bg-[#e9ecef] rounded-full mb-4"></div>
                <div className="w-full h-2 bg-[#e9ecef] rounded-full mb-3"></div>
                <div className="w-5/6 h-2 bg-[#e9ecef] rounded-full mb-8"></div>
                <div className="w-full h-2 bg-[#e9ecef] rounded-full mb-2"></div>
                <div className="w-4/5 h-2 bg-[#e9ecef] rounded-full"></div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
