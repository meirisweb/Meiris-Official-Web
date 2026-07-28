import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ctaEngineers from "@/assets/cta-engineers.jpg";
import dynamic from 'next/dynamic';
const CareersForm = dynamic(() => import('./CareersForm'));

import { getLocalizedMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return getLocalizedMetadata({
    locale,
    path: '/careers',
    title: "Careers — Meiris Intelligent Power Conversion",
    description: "Join a culture defined by technical precision, environmental consciousness, and the drive to disrupt the energy landscape.",
  });
}

export const revalidate = 60; // Fetch fresh data from Sanity every 60s

export default async function CareersPage({ params: { locale } }: { params: { locale: string } }) {
  // Fetch the careers page document for this locale. Fallback to English if not found.
  const careersPage = await client.fetch(
    `*[_type == "careersPage" && language == $locale][0] {
      ...,
      "imageUrl": hero.image.asset->url
    }`,
    { locale }
  ) || await client.fetch(
    `*[_type == "careersPage" && language == "en"][0] {
      ...,
      "imageUrl": hero.image.asset->url
    }`
  );

  if (!careersPage) {
    return (
      <div className="relative min-h-screen bg-white text-black flex items-center justify-center">
        <p>Careers page content not found.</p>
      </div>
    );
  }

  const { hero, cvUpload, imageUrl } = careersPage;

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#00E573] selection:text-black">
      
      {/* Hero Section */}
      <section className="bg-white pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-16 items-center">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#00E573] uppercase mb-6">
              {hero?.eyebrow || "WORK WITH US"}
            </p>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-black">
              {hero?.title || "Powering the Future of Mobility"}
            </h1>
            <p className="mt-8 text-[14px] leading-relaxed text-black/60">
              {hero?.description}
            </p>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt={hero?.title || "Careers Hero"} 
                className="absolute inset-0 w-full h-full object-cover" 
                fill
              />
            ) : (
              <Image 
                src={ctaEngineers} 
                alt="Engineers reviewing data" 
                className="absolute inset-0 w-full h-full object-cover" 
                placeholder="blur" 
              />
            )}
          </div>
        </div>
      </section>

      {/* CV Upload Section */}
      <section className="bg-[#111111] py-16 md:py-24 lg:py-32 text-white">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          <div>
            <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white">
              {cvUpload?.headingLine1 || "Don't see a fit?"}
            </h2>
            <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-[#00E573]">
              {cvUpload?.headingLine2 || "Send us your CV"}
            </h2>
            <p className="mt-6 text-[12px] leading-relaxed text-white/70 max-w-md">
              {cvUpload?.description}
            </p>
            <div className="mt-12 flex items-center gap-3 text-white/90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E573" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M2 4l10 8 10-8"></path>
              </svg>
              <span className="text-[12px] font-medium tracking-wide">{cvUpload?.email || "careers@meiris.energy"}</span>
            </div>
          </div>
          
          <CareersForm locale={locale} />
        </div>
      </section>

    </div>
  );
}
