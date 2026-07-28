"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CustomSection2({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState(data.apps[0].id);

  const activeApp = data.apps.find((a: any) => a.id === activeTab) || data.apps[0];

  return (
    <section className="bg-white py-16 md:py-32 px-6 md:px-20 relative border-t border-gray-200">
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-[#1f2937] mb-2 max-w-4xl leading-[1.2] tracking-tight">
            {data.heading}
          </h2>
          <p className="text-gray-500 mb-12">
            {data.subHeading}
          </p>
        </ScrollReveal>

        {/* 8 Cards Grid */}
        <ScrollReveal staggerChildren={true} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {data.apps.map((app: any) => (
            <div key={app.id} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
              <div 
                onClick={() => setActiveTab(app.id)}
                className={`h-full border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                  activeTab === app.id 
                    ? "bg-white text-black border-[#00E573] shadow-[0_0_15px_rgba(0,229,115,0.15)]" 
                    : "bg-[#f0f1f3] text-black border-transparent hover:bg-[#e6e8eb]"
                }`}
              >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeTab === app.id ? "bg-[#00E573] shadow-[0_0_10px_rgba(0,229,115,0.4)]" : "bg-gray-300"
                }`}>
                </div>
                <h4 className="font-bold text-[15px]">{app.title}</h4>
              </div>
              <p className="text-[13px] text-black/60 font-medium">
                {app.desc}
              </p>
              </div>
            </div>
          ))}
        </ScrollReveal>

        {/* Active Tab Green Card */}
        <ScrollReveal>
          <div className="w-full bg-[#f0f1f3] rounded-xl p-6 md:p-8 border-l-4 border-l-[#00E573] shadow-sm mb-24">
            <h3 className="text-black font-bold text-sm md:text-[13px] tracking-[0.1em] mb-3 uppercase">
              {activeApp.title}
            </h3>
            <p className="text-black/70 text-[14px] md:text-[15px] font-medium leading-relaxed max-w-5xl">
              {activeApp.details}
            </p>
          </div>
        </ScrollReveal>

        {/* Pain Points */}
        <div className="mt-16">
          <ScrollReveal>
            <h3 className="text-xl md:text-2xl font-bold text-[#1f2937] mb-8">{data.painPointsHeading}</h3>
          </ScrollReveal>
          
          <ScrollReveal staggerChildren={true} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.painPoints.map((pp: any, idx: number) => (
              <div key={idx} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out w-full bg-[#f0f1f3] rounded-xl p-6 md:p-8 flex flex-col justify-start hover:bg-[#e6e8eb]">
                <h4 className="text-black font-bold text-[16px] mb-3 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00E573] shadow-[0_0_8px_rgba(0,229,115,0.4)]"></div>
                  {pp.title}
                </h4>
                <p className="text-black/60 text-[13px] leading-relaxed font-medium">
                  {pp.desc}
                </p>
              </div>
            ))}
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
