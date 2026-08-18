import type { Metadata } from "next";
import Image from "next/image";
import ctaEngineers from "@/assets/cta-engineers.jpg";
import dynamic from 'next/dynamic';
const ContactForm = dynamic(() => import('./ContactForm'));

import { getLocalizedMetadata, resolveSanitySeo } from "@/lib/seo";
import { client } from "@/sanity/lib/client";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  let seoData = null;
  try {
    const doc = await client.fetch(
      `*[_type == "contactPage" && language == $locale][0] { seo }`,
      { locale }
    );
    seoData = doc?.seo;
  } catch (e) {
    console.error('Error fetching contact seo:', e);
  }

  return resolveSanitySeo({
    seoData,
    fallbackTitle: "Contact Us — MEIRIS Intelligent Power Conversion",
    fallbackDescription: "Connect with our experts to discuss intelligent charging solutions designed for tomorrow's mobility.",
    path: '/contact',
    locale,
  });
}

export const revalidate = 60; // Fetch fresh data from Sanity every 60s

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  // Fetch the contact page document for this locale. Fallback to English if not found.
  const contactPage = await client.fetch(
    `*[_type == "contactPage" && language == $locale][0] {
      ...,
      "imageUrl": hero.image.asset->url
    }`,
    { locale }
  ) || await client.fetch(
    `*[_type == "contactPage" && language == "en"][0] {
      ...,
      "imageUrl": hero.image.asset->url
    }`
  );

  if (!contactPage) {
    return (
      <div className="relative min-h-screen bg-white text-black flex items-center justify-center">
        <p>Contact page content not found.</p>
      </div>
    );
  }

  const { hero, form, contactCards, imageUrl } = contactPage;

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#00E573] selection:text-black">

      {/* Hero Section */}
      <section className="bg-white pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div>
            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-black pr-8 font-[family-name:var(--font-primary)]">
              {hero?.title}
            </h1>
            <p className="mt-8 text-[13px] md:text-[14px] leading-[1.6] text-gray-500 font-medium font-[family-name:var(--font-secondary)] max-w-[400px]">
              {hero?.subtitle}
            </p>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={hero?.title || "Contact Us Hero"}
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

      {/* Form Section */}
      <section className="bg-[#f5f6f8] py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12">

          <ContactForm data={form} />

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[700px] mt-16 mx-auto">
            {/* Card 1: Email (Black, Green, White) */}
            <div className="bg-[#111111] text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-white/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M2 4l10 8 10-8"></path>
              </svg>
              <h3 className="text-[14px] font-bold mb-3 text-white font-[family-name:var(--font-primary)]">{contactCards?.email?.title}</h3>
              <p className="text-[12px] md:text-[13px] text-white/60 leading-[1.6] font-medium font-[family-name:var(--font-secondary)] whitespace-pre-line">
                {contactCards?.email?.emails}
              </p>
            </div>

            {/* Card 2: Phone / Call Experts (White, Black, Green) */}
            <div className="bg-white text-black rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <h3 className="text-[14px] font-bold mb-3 font-[family-name:var(--font-primary)]">{contactCards?.phone?.title}</h3>
              <p className="text-[12px] md:text-[13px] text-gray-500 leading-[1.6] font-medium font-[family-name:var(--font-secondary)]">
                {contactCards?.phone?.number}<br />
                {contactCards?.phone?.hours}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
