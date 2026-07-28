import type { Metadata } from "next";
import Link from "next/link";
import { getLocalizedMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return getLocalizedMetadata({
    locale,
    path: '/about',
    title: "About Us — Meiris Intelligent Power Conversion",
    description: "Learn more about Meiris and our mission to electrify the world.",
  });
}

export const revalidate = 60; // Fetch fresh data from Sanity every 60s

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  // Fetch the about page document for this locale. Fallback to English if not found.
  const aboutPage = await client.fetch(
    `*[_type == "aboutPage" && language == $locale][0]`,
    { locale }
  ) || await client.fetch(
    `*[_type == "aboutPage" && language == "en"][0]`
  );

  if (!aboutPage) {
    return (
      <div className="relative min-h-screen bg-white text-black flex items-center justify-center">
        <p>About page content not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#00E573] selection:text-black">
      <main className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        {/* Hero Text */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-4 md:mb-5">
            {aboutPage.hero?.title || "About Us"}
          </h1>
          <p className="text-[15px] md:text-[17px] text-black/80 leading-relaxed font-medium">
            {aboutPage.hero?.subtitle}
          </p>
        </div>

        {/* Main Content Block */}
        <div className="bg-[#f0fbf5] border-l-[4px] border-[#00E573] p-6 sm:p-10 md:p-14 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
          <div className="space-y-6 text-[14px] md:text-[15px] lg:text-[16px] leading-loose text-black/80 font-medium">
            {aboutPage.mainContent ? (
              <PortableText value={aboutPage.mainContent} />
            ) : (
              <p>Content is coming soon.</p>
            )}
          </div>

          {aboutPage.portfolio && (
            <>
              {/* Separator Line */}
              <div className="h-px w-full bg-black/10 my-10"></div>

              {/* Bottom Info */}
              <div className="text-[12px] md:text-[13px] leading-relaxed text-black/80">
                <span className="font-bold text-black">{aboutPage.portfolio.label} </span> 
                {aboutPage.portfolio.description}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
