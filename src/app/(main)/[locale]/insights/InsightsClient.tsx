"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

export type SanityPost = {
  _id: string;
  title: string;
  postCategory?: string;
  publishedAt: string;
  details?: string;
  image?: any;
  contentCol1?: any;
  contentCol2?: any;
  isStatic?: boolean;
};

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-6">{children}</p>,
    h3: ({ children }: any) => <p className="mb-6 font-bold">{children}</p>,
    h2: ({ children }: any) => <h2 className="mb-6 text-[18px] md:text-[20px] font-bold mt-8">{children}</h2>,
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="mb-6 relative w-full aspect-video border border-black/10 rounded-sm overflow-hidden bg-black/5">
          <Image src={urlFor(value).width(800).url()} alt={value.alt || " " } fill className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, 800px" />
        </div>
      );
    }
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 space-y-3 mb-6 text-black/70">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
  }
};

export default function InsightsClient({ data }: { data?: any }) {
  const searchParams = useSearchParams();
  const postId = searchParams?.get('post');

  const categories: string[] = data?.tabCategories || [];
  
  const allPosts = data?.insightsItems || [];

  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Automatically open article if URL param is present
  useEffect(() => {
    if (postId && allPosts.length > 0) {
      const article = allPosts.find((p: any) => (p._id || p._key) === postId);
      if (article) {
        setSelectedArticle(article);
      }
    }
  }, [postId, allPosts]);

  const filteredPosts =
    activeTab === "All"
      ? allPosts
      : allPosts.filter((p: any) => p.postCategory === activeTab);

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
      window.history.pushState({}, '', window.location.pathname);
    }, 280);
  };

  return (
    <>
      <main className="mx-auto max-w-[1400px] px-6 md:px-12 pt-[120px] pb-32 overflow-hidden">
        {/* Hero Text */}
        <ScrollReveal className="max-w-4xl mb-16 md:mb-20">
          <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-bold tracking-tight text-black mb-5">
            {data?.pageTitle || "Insights"}
          </h1>
          {data?.pageSubtitle && (
            <p className="text-[16px] md:text-[18px] text-black/80 leading-relaxed font-medium">
              {data.pageSubtitle}
            </p>
          )}
        </ScrollReveal>

        {/* Tab Filters */}
        {categories.length > 0 && (
          <ScrollReveal delay={100} className="flex flex-wrap items-center gap-4 md:gap-10 border-b border-black/10 mb-16 px-2">
            <button
              onClick={() => setActiveTab("All")}
              className={`pb-4 text-[13px] md:text-[14px] font-bold transition-colors mb-[-1px] uppercase tracking-widest ${
                activeTab === "All"
                  ? "text-[#00E573] border-b-2 border-[#00E573]"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              All
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(cat)}
                className={`pb-4 text-[13px] md:text-[14px] font-bold transition-colors mb-[-1px] uppercase tracking-widest ${
                  activeTab === cat
                    ? "text-[#00E573] border-b-2 border-[#00E573]"
                    : "text-black/50 hover:text-black/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </ScrollReveal>
        )}

        {/* Card Grid */}
        <ScrollReveal key={activeTab} staggerChildren={true} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-20 text-center text-black/40 font-medium">
              No posts found in this category.
            </div>
          )}
          {filteredPosts.map((card: any, i: number) => (
            <div key={card._id || i} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col border border-black/10 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-[#fcfcfc] overflow-hidden">
              {/* Image Area */}
              <div className="aspect-square w-full bg-white relative border-b border-black/10">
                {card.image ? (
                  <Image src={urlFor(card.image).width(800).height(800).url()} alt={card.title} fill className="absolute inset-0 w-full h-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 bg-black/5 opacity-50" />
                )}
              </div>
              
              {/* Content Area */}
              <div className="bg-[#0a0a0a] text-white p-6 md:p-10 flex flex-col flex-grow">
                {/* Top Row: Tags + Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {card.postCategory && <span className="bg-white/20 text-[9px] md:text-[10px] font-bold tracking-widest px-2 md:px-3 py-1.5 uppercase rounded-sm">{card.postCategory}</span>}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase text-white/50">
                    {card.isStatic 
                      ? new Date(card.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
                      : card.publishedAt 
                        ? new Date(card.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() 
                        : ''}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-[18px] md:text-[22px] font-bold leading-relaxed mb-8">{card.title}</h3>
                
                {/* Subtitles (PDF Info) */}
                {card.details && (
                  <div className="mt-auto flex flex-col gap-1.5 mb-10">
                    {card.details.split('\n').map((line: string, idx: number) => (
                      <p key={idx} className="text-[12px] md:text-[13px] text-white/50 font-medium">{line}</p>
                    ))}
                  </div>
                )}
                
                {/* Button */}
                <button 
                  onClick={() => {
                    setSelectedArticle(card);
                    if (card._id) {
                      window.history.pushState({}, '', `?post=${card._id}`);
                    }
                  }}
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
                {selectedArticle.postCategory && <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-black/20 rounded-full">{selectedArticle.postCategory}</span>}
                {selectedArticle.publishedAt && <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/50">{new Date(selectedArticle.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>}
              </div>
              <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold tracking-widest uppercase leading-[1.4] text-black">
                {selectedArticle.title}
              </h1>
            </header>

            {/* Main Body (2 Columns on Desktop, 1 on Mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 text-[13px] md:text-[14px] leading-[1.9] text-[#333] font-medium tracking-wide text-justify md:text-left">
              
              {/* Column 1 */}
              <div>
                {selectedArticle.contentCol1 && (
                  selectedArticle.isStatic 
                    ? selectedArticle.contentCol1 
                    : <PortableText value={selectedArticle.contentCol1} components={portableTextComponents} />
                )}
              </div>

              {/* Column 2 */}
              <div>
                {selectedArticle.contentCol2 && (
                  selectedArticle.isStatic 
                    ? selectedArticle.contentCol2 
                    : <PortableText value={selectedArticle.contentCol2} components={portableTextComponents} />
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
