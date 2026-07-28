import type { Metadata } from "next";
import Link from "next/link";
import RecommendedSetup from "./RecommendedSetup";
import CustomSection2 from "./CustomSection2";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PersistentContactPrompt from "@/components/ui/PersistentContactPrompt";
import { getLocalizedMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const locale = resolvedParams?.locale || 'en';
  
  // Optionally fetch dynamic SEO data from Sanity here if added in future
  
  return getLocalizedMetadata({
    locale,
    path: `/solutions/${slug}`,
    title: "Solutions — Meiris Intelligent Power Conversion",
    description: "Charging infrastructure built around your fleet's schedule.",
  });
}

function Marker({ num, top, left, labelOnTop = true }: { num: number; top: string; left: string; labelOnTop?: boolean }) {
  return (
    <div 
      className="absolute flex flex-col items-center gap-2 group cursor-pointer z-10"
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
    >
      {labelOnTop && (
        <div className="bg-[#e6ebf0] text-black/60 text-[7px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
          MEIRIS CONVERSION STAGE
        </div>
      )}
      <div className="w-6 h-6 bg-[#00E573] rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-[0_0_15px_rgba(0,229,115,0.3)] group-hover:scale-110 transition-transform">
        {num}
      </div>
      {!labelOnTop && (
        <div className="bg-[#e6ebf0] text-black/60 text-[7px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
          MEIRIS CONVERSION STAGE
        </div>
      )}
    </div>
  );
}

export const revalidate = 60; // Disable caching to fetch live data from Sanity

export default async function SolutionsPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const resolvedParams = await params;
  const urlSlug = resolvedParams?.slug || 'depot-infrastructure';
  const locale = resolvedParams?.locale || 'en';

  // Fetch the solution document for this locale. Fallback to English if not found.
  let content = await client.fetch(
    `*[_type == "solution" && slug.current == $slug && language == $locale][0] {
      ...,
      "recommendedSetup": recommendedSetup {
        ...,
        "setupFeaturesOnly": setupFeaturesOnly[] {
          ...,
          "imageUrl": image.asset->url
        },
        "fleetsSetup": fleetsSetup[] {
          ...,
          "features": features[] {
            ...,
            "imageUrl": image.asset->url
          }
        }
      }
    }`,
    { slug: urlSlug, locale }
  ) || await client.fetch(
    `*[_type == "solution" && slug.current == $slug && language == "en"][0] {
      ...,
      "recommendedSetup": recommendedSetup {
        ...,
        "setupFeaturesOnly": setupFeaturesOnly[] {
          ...,
          "imageUrl": image.asset->url
        },
        "fleetsSetup": fleetsSetup[] {
          ...,
          "features": features[] {
            ...,
            "imageUrl": image.asset->url
          }
        }
      }
    }`,
    { slug: urlSlug }
  );

  // If still not found (e.g. unknown slug), fallback to 'depot-infrastructure'
  if (!content) {
    content = await client.fetch(
      `*[_type == "solution" && slug.current == "depot-infrastructure" && language == $locale][0] {
        ...,
        "recommendedSetup": recommendedSetup {
          ...,
          "setupFeaturesOnly": setupFeaturesOnly[] {
            ...,
            "imageUrl": image.asset->url
          },
          "fleetsSetup": fleetsSetup[] {
            ...,
            "features": features[] {
              ...,
              "imageUrl": image.asset->url
            }
          }
        }
      }`,
      { locale }
    ) || await client.fetch(
      `*[_type == "solution" && slug.current == "depot-infrastructure" && language == "en"][0] {
        ...,
        "recommendedSetup": recommendedSetup {
          ...,
          "setupFeaturesOnly": setupFeaturesOnly[] {
            ...,
            "imageUrl": image.asset->url
          },
          "fleetsSetup": fleetsSetup[] {
            ...,
            "features": features[] {
              ...,
              "imageUrl": image.asset->url
            }
          }
        }
      }`
    );
  }

  if (!content) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <p>Solution page content not found.</p>
      </div>
    );
  }

  // Destructure content from Sanity
  const { hero, featuresSection, customSection2, recommendedSetup, benefitsSection } = content;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#00E573] selection:text-black overflow-x-clip">

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row h-auto md:h-screen min-h-[100dvh] md:min-h-[700px] pt-[68px] bg-[#0c0c0c] w-full">
        {/* Left Content */}
        <div className="w-full md:w-1/2 px-6 md:pl-20 md:pr-12 py-12 z-10 flex flex-col flex-1 justify-center">
          <ScrollReveal>
            <h1 className="text-[clamp(2.5rem,4.5vw,4.5rem)] font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-xl">
              {hero?.heroTitle}
            </h1>
            <p className="text-[15px] md:text-[16px] text-white/80 max-w-xl mb-10 leading-relaxed font-[family-name:var(--font-secondary)]">
              {hero?.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#00E573] text-black px-6 py-3 text-[13px] font-bold tracking-wide transition-all hover:bg-white hover:-translate-y-0.5 rounded-sm">
                Talk to our expert
              </button>
              <button className="border border-white/20 text-white px-6 py-3 text-[13px] font-bold tracking-wide flex items-center gap-2 hover:bg-white/5 transition-all rounded-sm hover:-translate-y-0.5">
                See how it works 
                <span className="text-[14px] leading-none font-normal">→</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
        
        {/* Right Massive Gray Block */}
        <ScrollReveal delay={300} className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%] bg-[#e6e6e6] rounded-l-[4rem] shadow-2xl z-0">
          <div />
        </ScrollReveal>
      </section>

      {/* Interactive Map Section OR Custom Section 2 */}
      {customSection2?.heading ? (
        <CustomSection2 data={customSection2} />
      ) : (
        <section className="bg-black py-16 md:py-32 px-6 md:px-20 border-t border-white/10 relative">
          <div className="mx-auto max-w-[1200px]">
            <ScrollReveal>
              <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold text-white mb-16 max-w-4xl leading-[1.1] tracking-tight">
                {featuresSection?.mapHeading || (
                  <>
                    Running a fleet depot has its own set of challenges.<br />
                    Tap a marker to see where things typically go wrong.
                  </>
                )}
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={150}>
              <div className="w-full bg-white rounded-2xl md:rounded-3xl relative aspect-[4/3] md:aspect-[16/9] max-h-[700px] overflow-hidden mb-10 shadow-2xl p-4 md:p-8">
                {/* SVG Lines Connecting Markers */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="20%" y1="35%" x2="40%" y2="50%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="20%" y1="35%" x2="30%" y2="60%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="40%" y1="50%" x2="55%" y2="25%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="40%" y1="50%" x2="70%" y2="50%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="40%" y1="50%" x2="30%" y2="60%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="55%" y1="25%" x2="70%" y2="50%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="70%" y1="50%" x2="85%" y2="35%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="70%" y1="50%" x2="90%" y2="60%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="85%" y1="35%" x2="90%" y2="60%" stroke="black" strokeWidth="1" strokeOpacity="0.3" />
                </svg>
                
                {/* Markers */}
                <Marker num={1} top="35%" left="20%" />
                <Marker num={2} top="50%" left="40%" />
                <Marker num={3} top="25%" left="55%" labelOnTop={false} />
                <Marker num={4} top="50%" left="70%" />
                <Marker num={5} top="35%" left="85%" />
                <Marker num={6} top="60%" left="90%" />
                <Marker num={7} top="60%" left="30%" labelOnTop={false} />
                
                {/* Bottom text */}
                <div className="absolute bottom-8 right-10 text-[#00E573] text-[10px] font-medium tracking-wide">
                  {locale === 'es-419' ? 'Selecciona un marcador para explorar' : 'Select a marker to explore'}
                </div>
              </div>
            </ScrollReveal>
            
            {/* Over-heating / Quality Card */}
            <ScrollReveal delay={300}>
              <div className="w-full bg-[#eefaf3] rounded-xl p-6 md:p-8 border border-[#cbeadd] shadow-sm">
                <h3 className="text-[#0d6447] font-bold text-sm md:text-[13px] tracking-[0.1em] mb-3 uppercase">
                  {featuresSection?.cardTitle}
                </h3>
                <p className="text-[#374151] text-[14px] md:text-[15px] leading-relaxed max-w-5xl">
                  {featuresSection?.cardText}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* "One partner" Section */}
      <section className="bg-[#171717] py-16 md:py-32 px-6 md:px-20 relative border-t border-white/5">
        <div className="mx-auto max-w-[1400px]">
          <ScrollReveal>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-bold text-white mb-16 max-w-4xl leading-[1.05] tracking-tight">
              {featuresSection?.sectionHeading}
            </h2>
          </ScrollReveal>
          
          {featuresSection?.features && (
            <ScrollReveal staggerChildren={true} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuresSection.features.map((feature: any, i: number) => (
                <div key={i} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out border border-white/20 rounded-2xl p-8 flex flex-col gap-4 hover:bg-white/5">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/90 shadow-sm"></div>
                  <h3 className="text-white font-bold text-lg mt-3 pr-4 leading-tight">{feature.title}</h3>
                  <p className="text-white/50 text-[11px] leading-relaxed pr-2">{feature.desc}</p>
                </div>
              ))}
            </ScrollReveal>
          )}
        </div>
      </section>

      <RecommendedSetup setupData={recommendedSetup} />

      {/* Uptime Section */}
      <section className="bg-white pt-8 pb-16 md:pt-12 md:pb-32 px-6 md:px-20 relative border-t border-black/5">
        <div className="mx-auto max-w-[1000px]">
          <ScrollReveal>
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-bold text-black mb-16 text-center tracking-tight leading-tight">
              {benefitsSection?.benefitsHeading}
            </h2>
          </ScrollReveal>
          
          {benefitsSection?.benefits && (
            <ScrollReveal staggerChildren={true} className="flex flex-col gap-4">
              {benefitsSection.benefits.map((item: any, i: number) => (
                <div key={i} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out bg-[#f0f1f3] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 hover:bg-[#e6e8eb]">
                  <div className="w-6 h-6 rounded-full bg-[#00E573] flex-shrink-0 mt-1 md:mt-0 shadow-[0_0_15px_rgba(0,229,115,0.4)]"></div>
                  <div className="flex flex-col gap-1.5 flex-grow">
                    <h3 className="text-black font-bold text-[17px]">{item.heading}</h3>
                    <p className="text-black/60 text-[12px] leading-relaxed max-w-3xl font-medium">
                      {item.narrative}
                    </p>
                  </div>
                  {item.stat && (
                    <div className="bg-[#00E573] text-black text-[11px] font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-sm tracking-wide mt-2 md:mt-0 self-start md:self-auto uppercase">
                      {item.stat}
                    </div>
                  )}
                </div>
              ))}
            </ScrollReveal>
          )}
        </div>
      </section>

      <PersistentContactPrompt segmentName={hero?.heroTitle || urlSlug} />
    </div>
  );
}
