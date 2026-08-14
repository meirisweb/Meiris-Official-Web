"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CustomSection2({ data }: { data: any }) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const selectedApp = data.apps.find((a: any) => a.id === selectedAppId);

  return (
    <section id="solution-next-section" className="bg-white py-16 md:py-32 px-6 md:px-20 relative border-t border-gray-200">
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
                onClick={() => setSelectedAppId(app.id)}
                className={`h-full border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedAppId === app.id 
                    ? "bg-white text-black border-[#00E573] shadow-[0_0_15px_rgba(0,229,115,0.15)]" 
                    : "bg-[#f0f1f3] text-black border-transparent hover:bg-[#e6e8eb]"
                }`}
              >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedAppId === app.id ? "bg-[#00E573] shadow-[0_0_10px_rgba(0,229,115,0.4)]" : "bg-gray-300"
                }`}>
                </div>
                <h4 className="font-bold text-[15px]">{app.title}</h4>
              </div>
              <p className="text-[13px] md:text-[14px] text-gray-500 leading-[1.6] font-medium font-[family-name:var(--font-secondary)]">
                {app.desc}
              </p>
              </div>
            </div>
          ))}
        </ScrollReveal>

        {/* Modal Popup for Tagline */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
              className="absolute inset-0" 
              onClick={() => setSelectedAppId(null)} 
            />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedAppId(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
              
              <h3 className="text-[#00E573] font-bold text-sm md:text-[14px] tracking-[0.1em] mb-4 uppercase flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E573] shadow-[0_0_8px_rgba(0,229,115,0.6)]"></span>
                {selectedApp.title}
              </h3>
              <p className="text-[#1f2937] text-[15px] md:text-[17px] font-medium leading-[1.7]">
                {selectedApp.details}
              </p>
            </div>
          </div>
        )}

        {/* Pain Points */}
        <div className="mt-8">
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
                <p className="text-[13px] md:text-[14px] text-gray-500 leading-[1.6] font-medium font-[family-name:var(--font-secondary)]">
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
