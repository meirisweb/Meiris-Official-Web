"use client";

import React, { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Image from "next/image";

type ResourceCard = {
  _id?: string;
  cardTitle?: string;
  cardCategory?: string;
  cardVersion?: string;
  cardUploadDate?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  fileExtension?: string;
  fileSize?: number; // in bytes
};

export default function ResourcesClient({ data }: { data: any }) {
  const categories: string[] = data?.tabCategories || [];
  const allResources: ResourceCard[] = data?.resourceItems || [];

  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredResources =
    activeTab === "All"
      ? allResources
      : allResources.filter((r: any) => r.cardCategory === activeTab);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Uploaded Date N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 md:px-12 pt-[120px] pb-32 overflow-hidden">
      {/* Hero Text */}
      <ScrollReveal className="max-w-4xl mb-16 md:mb-20">
        <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-bold tracking-tight text-black mb-5">
          {data?.pageTitle || "Resources"}
        </h1>
        {data?.pageSubtitle && (
          <p className="text-[16px] md:text-[18px] text-black/70 leading-relaxed font-medium max-w-3xl">
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
        {filteredResources.map((card, i) => (
          <div
            key={card._id || i}
            className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col border border-black/10 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-[#fcfcfc] overflow-hidden"
          >
            {/* Image Area */}
            <div className="aspect-[4/3] w-full bg-[#131b22] relative flex flex-col items-center justify-center">
              {card.thumbnailUrl ? (
                <Image
                  src={card.thumbnailUrl}
                  alt={card.cardTitle || "Resource Thumbnail"}
                  fill
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00E573]/10 opacity-50" />
                  <div className="relative w-48 h-24 border-2 border-[#00E573]/40 rounded-t-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,115,0.2)]">
                    <div className="text-[#00E573]/60 text-xs font-mono font-bold tracking-widest">
                      FILE ASSET
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Content Area */}
            <div className="bg-[#0a0a0a] text-white p-6 md:p-10 flex flex-col flex-grow">
              {/* Top Row: Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/20 text-[9px] md:text-[10px] font-bold tracking-widest px-2 md:px-3 py-1.5 uppercase rounded-sm">
                  {card.cardCategory || "DOCUMENT"}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[18px] md:text-[22px] font-bold leading-relaxed mb-8">
                {card.cardTitle}
              </h3>

              {/* Subtitles (PDF Info) */}
              <div className="mt-auto flex flex-col gap-1.5 mb-10">
                <p className="text-[12px] md:text-[13px] text-white/50 font-medium">
                  {card.fileExtension ? card.fileExtension.toUpperCase() : "DOC"} | {formatFileSize(card.fileSize)}
                </p>
                <p className="text-[12px] md:text-[13px] text-white/50 font-medium">
                  {card.cardVersion ? card.cardVersion + " - " : ""}Uploaded {formatDate(card.cardUploadDate)}
                </p>
              </div>

              {/* Button */}
              {card.fileUrl ? (
                <a
                  href={`${card.fileUrl}?dl=`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-black py-4 text-[11px] md:text-[12px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 hover:bg-white/90 transition-colors rounded-sm"
                >
                  ACCESS DOCUMENT
                </a>
              ) : (
                <button
                  disabled
                  className="w-full bg-white/30 text-white/50 py-4 text-[11px] md:text-[12px] font-bold tracking-widest uppercase flex justify-center items-center gap-2 rounded-sm cursor-not-allowed"
                >
                  NOT AVAILABLE
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <div className="col-span-full py-12 text-center text-black/50 font-medium">
            No resources available in this category.
          </div>
        )}
      </ScrollReveal>
    </main>
  );
}
