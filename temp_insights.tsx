"use client";

import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

// This type would ideally come from your CMS
type InsightArticle = {
  tag1: string;
  tag2: string;
  date: string;
  title: string;
  details: string;
  // CMS content fields:
  contentCol1?: React.ReactNode;
  contentCol2?: React.ReactNode;
};

const cards: InsightArticle[] = Array(6).fill({
  tag1: "PRESS",
  tag2: "HERO CHARGE PLUS",
  date: "01 JULY 2026",
  title: "Depot Deployment Case Study — Commercial Fleet Electrification",
  details: "PDF | 3.8 MB\nv1.2 - Uploaded 16 Jun 2026",
  contentCol1: (
    <>
      <p className="mb-6">For the first time in the history of the MEIRIS platform, our latest high-power commercial charging module will take center stage at the global automotive expo. This debut marks a highly significant milestone for the brand on the world's most exclusive stage. This event is part of a broader celebration of MEIRIS's heritage in precision power electronics, highlighting the perfect balance between technical innovation and bespoke installation.</p>
      <p className="mb-6 font-bold">The birth of a new standard</p>
      <p className="mb-6">At the global expo, a sanctuary of technical excellence, MEIRIS presents the Hero Charge Plus, the system that redefines the charging landscape. Inspired by the intersection of robust engineering and sleek design, this specific infrastructure stands as proof of the excellence of our R&D program.</p>
      <ul className="list-disc pl-5 space-y-3 mb-6 text-black/70">
        <li><strong>Authenticity:</strong> Every component is inspected by our engineers, where necessary updated using advanced materials and techniques.</li>
        <li><strong>Documentation:</strong> A dedicated book accompanies the system, certifying the installation process with original drawings and technical data.</li>
        <li><strong>Historical continuity:</strong> The program ensures that the pioneering spirit remains intact.</li>
      </ul>
      {/* CMS Image Placeholder */}
      <div className="aspect-video bg-black/5 w-full mb-6 flex flex-col items-center justify-center border border-black/10 rounded-sm">
         <svg className="w-8 h-8 text-black/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
         </svg>
         <span className="text-black/40 text-[10px] font-bold tracking-widest uppercase">CMS Image Slot</span>
      </div>
    </>
  ),
  contentCol2: (
    <>
      <p className="mb-6 font-bold">The Hero Charge Plus: the ultimate expression of power</p>
      <p className="mb-6">At the same time, within the curated exhibition, MEIRIS is displaying a masterpiece embodying the spirit of the commercial fleet program. It represents the pinnacle of our tailor-made philosophy, far beyond simple customization.</p>
      <ul className="list-disc pl-5 space-y-3 mb-6 text-black/70">
        <li><strong>New bodywork and identity:</strong> The architecture features an entirely new bespoke body, where every panel and surface has been redesigned to reflect a unique aesthetic narrative.</li>
        <li><strong>Technological evolution:</strong> Beneath its flowing lines, the unit has been upgraded with cutting-edge technology, including a newly developed thermal management system.</li>
        <li><strong>The "Unico" philosophy:</strong> This project represents the pinnacle of the special projects department, a creative sanctuary where the customer becomes co-author.</li>
      </ul>
      {/* CMS Image Placeholder */}
      <div className="aspect-video bg-black/5 w-full mb-6 flex flex-col items-center justify-center border border-black/10 rounded-sm">
         <svg className="w-8 h-8 text-black/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
         </svg>
         <span className="text-black/40 text-[10px] font-bold tracking-widest uppercase">CMS Image Slot</span>
      </div>
      <p className="mb-6 font-bold">A dialogue between eras</p>
      <p className="mb-6">From the historical preservation of earlier iterations to the visionary personalization of the Hero Charge Plus, MEIRIS reaffirms its identity as a creative sanctuary.</p>
      
      <div className="mt-12 pt-8 border-t border-black/10 text-[11px] text-black/60 space-y-1 font-bold tracking-widest uppercase">
        <p>Press Contacts</p>
        <p>MEIRIS Public Relations</p>
        <p>press@meiris.com</p>
      </div>
    </>
  )
});

export default function InsightsClient() {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Lock body scroll when article is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedArticle(null);
      setIsClosing(false);
    }, 280); // Wait just under the 300ms fade-out duration to prevent blinking
  };

  return (
    <>
      <main className="mx-auto max-w-[1400px] px-6 md:px-12 pt-[120px] pb-32 overflow-hidden">
        {/* Hero Text */}
        <ScrollReveal className="max-w-4xl mb-16 md:mb-20">
          <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-bold tracking-tight text-black mb-5">Insights Page</h1>
          <p className="text-[16px] md:text-[18px] text-black/80 leading-relaxed font-medium">
            A unified page with clear segmentation for Blogs, Press Releases and Announcements. All three content types are accessible from this single page via a persistent tab or filter row.
          </p>
        </ScrollReveal>

        {/* Tab Filters */}
        <ScrollReveal delay={100} className="flex flex-wrap items-center gap-4 md:gap-10 border-b border-black/10 mb-16 px-2">
          <button className="pb-4 text-[13px] md:text-[14px] font-bold text-[#00E573] border-b-2 border-[#00E573] mb-[-1px] uppercase tracking-widest">
            All
          </button>
          <button className="pb-4 text-[13px] md:text-[14px] font-bold text-black/50 hover:text-black/80 transition-colors mb-[-1px] uppercase tracking-widest">
            Press Releases
          </button>
          <button className="pb-4 text-[13px] md:text-[14px] font-bold text-black/50 hover:text-black/80 transition-colors mb-[-1px] uppercase tracking-widest">
            Announcement
          </button>
        </ScrollReveal>

        {/* Card Grid */}
        <ScrollReveal staggerChildren={true} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {cards.map((card, i) => (
            <div key={i} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col border border-black/10 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-[#fcfcfc] overflow-hidden">
              {/* Image Area */}
              <div className="aspect-square w-full bg-white relative border-b border-black/10">
                <div className="absolute inset-0 bg-black/5 opacity-50" />
              </div>
              
              {/* Content Area */}
              <div className="bg-[#0a0a0a] text-white p-6 md:p-10 flex flex-col flex-grow">
                {/* Top Row: Tags + Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 text-[9px] md:text-[10px] font-bold tracking-widest px-2 md:px-3 py-1.5 uppercase rounded-sm">{card.tag1}</span>
                    <span className="bg-white text-black text-[9px] md:text-[10px] font-bold tracking-widest px-2 md:px-3 py-1.5 uppercase rounded-sm">{card.tag2}</span>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase text-white/50">{card.date}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-[18px] md:text-[22px] font-bold leading-relaxed mb-8">{card.title}</h3>
                
                {/* Subtitles (PDF Info) */}
                <div className="mt-auto flex flex-col gap-1.5 mb-10">
                  {card.details.split('\n').map((line: string, idx: number) => (
                    <p key={idx} className="text-[12px] md:text-[13px] text-white/50 font-medium">{line}</p>
                  ))}
                </div>
                
                {/* Button */}
                <button 
                  onClick={() => setSelectedArticle(card)}
                  className="w-full bg-white text-black py-4 text-[11px] md:text-[12px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 hover:bg-white/90 transition-colors rounded-sm cursor-pointer"
                >
                  READ MORE
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </main>

      {/* Full Screen Article Modal */}
      {selectedArticle && (
        <div data-lenis-prevent className={`fixed inset-0 z-[9999] bg-[#e6e6e6] text-[#111] overflow-y-auto overscroll-contain ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-500'}`}>
          
          {/* Fixed Close Button */}
          <button 
            onClick={handleClose}
            className="fixed top-6 right-6 md:top-10 md:right-10 z-50 w-12 h-12 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors cursor-pointer rounded-full"
            aria-label="Close article"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Article Content */}
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-24 min-h-screen">
            
            {/* Header / Title */}
            <header className="mb-16 md:mb-24 text-center max-w-5xl mx-auto pt-8 md:pt-0">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-black/20 rounded-full">{selectedArticle.tag1}</span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/50">{selectedArticle.date}</span>
              </div>
              <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold tracking-widest uppercase leading-[1.4] text-black">
                {selectedArticle.title}
              </h1>
            </header>

            {/* Main Body (2 Columns on Desktop, 1 on Mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 text-[13px] md:text-[14px] leading-[1.9] text-[#333] font-medium tracking-wide text-justify md:text-left">
              
              {/* Column 1 */}
              <div>
                {selectedArticle.contentCol1}
              </div>

              {/* Column 2 */}
              <div>
                {selectedArticle.contentCol2}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
