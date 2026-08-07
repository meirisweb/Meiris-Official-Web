import type { Metadata } from "next";
import Link from "next/link";
import DepotInfrastructureMap from "@/app/_components/DepotInfrastructureMap";
import CpoInfrastructureMap from "@/app/_components/CpoInfrastructureMap";
import HospitalityInfrastructureMap from "@/app/_components/HospitalityInfrastructureMap";
import ResidentialInfrastructureMap from "@/app/_components/ResidentialInfrastructureMap";
import RecommendedSetup from "./RecommendedSetup";
import CustomSection2 from "./CustomSection2";
import SolutionHeroButtons from "./SolutionHeroButtons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PersistentContactPrompt from "@/components/ui/PersistentContactPrompt";
import { getLocalizedMetadata, resolveSanitySeo, getBreadcrumbJsonLd } from "@/lib/seo";
import { client } from "@/sanity/lib/client";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const locale = resolvedParams?.locale || 'en';
  
  let solutionTitle = "Solutions — Meiris Intelligent Power Conversion";
  let solutionDesc = "Charging infrastructure built around your fleet's schedule.";
  let seoData = null;

  try {
    const solution = await client.fetch(
      `*[_type == "solution" && slug.current == $slug && language == $locale][0] { title, subtitle, seo }`,
      { slug, locale }
    );
    if (solution?.title) {
      solutionTitle = `${solution.title} — Meiris Intelligent Power Conversion`;
      if (solution?.subtitle) {
        solutionDesc = solution.subtitle;
      }
    }
    seoData = solution?.seo;
  } catch (e) {
    console.error("Error fetching solution metadata:", e);
  }
  
  return resolveSanitySeo({
    seoData,
    fallbackTitle: solutionTitle,
    fallbackDescription: solutionDesc,
    path: `/solutions/${slug}`,
    locale,
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
      "hero": hero {
        ...,
        "imageUrl": image.asset->url,
        "mobileImageUrl": mobileImage.asset->url
      },
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
      "hero": hero {
        ...,
        "imageUrl": image.asset->url,
        "mobileImageUrl": mobileImage.asset->url
      },
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
        "hero": hero {
          ...,
          "imageUrl": image.asset->url,
          "mobileImageUrl": mobileImage.asset->url
        },
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
        "hero": hero {
          ...,
          "imageUrl": image.asset->url,
          "mobileImageUrl": mobileImage.asset->url
        },
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: content.title || 'Meiris Electrification Solution',
    description:
      content.subtitle ||
      'Charging infrastructure built around your fleet schedule.',
    brand: {
      '@type': 'Brand',
      name: 'Meiris',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: '0',
      priceValidUntil: '2030-12-31',
      availability: 'https://schema.org/InStock',
      url: `https://www.siriem.com/${locale}/solutions/${urlSlug}`,
    },
  };

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '' },
    { name: 'Solutions', path: `/solutions/${urlSlug}` },
    { name: content.title || urlSlug, path: `/solutions/${urlSlug}` },
  ], locale);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#00E573] selection:text-black overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row h-auto lg:h-screen min-h-[100dvh] lg:min-h-[700px] pt-[68px] bg-[#0c0c0c] w-full overflow-hidden">
        {/* Mobile & Tablet Background Image (< 1024px) */}
        {(hero?.mobileImageUrl || hero?.imageUrl) && (
          <div className="block lg:hidden absolute inset-0 z-0 overflow-hidden">
            <img
              src={hero.mobileImageUrl || hero.imageUrl}
              alt={hero?.heroTitle || "Solution Hero Background"}
              className="w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/90 via-[#0c0c0c]/50 to-[#0c0c0c]"></div>
          </div>
        )}

        {/* Left Content */}
        <div className="w-full lg:w-1/2 px-6 md:px-12 lg:pl-20 lg:pr-12 py-12 md:py-16 relative z-10 flex flex-col flex-1 justify-center">
          <ScrollReveal>
            <h1 className="text-[clamp(2.5rem,4.5vw,4.5rem)] font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-xl">
              {hero?.heroTitle}
            </h1>
            <p className="text-[15px] md:text-[16px] text-white/80 max-w-xl mb-10 leading-relaxed font-[family-name:var(--font-secondary)]">
              {hero?.heroSubtitle}
            </p>
            <SolutionHeroButtons
              talkText={hero?.btnTalk || "Talk to our expert"}
              howItWorksText={hero?.btnHowItWorks || "See how it works"}
            />
          </ScrollReveal>
        </div>
        
        {/* Right Hero Image Area (Laptops & Desktops >= 1024px) */}
        <ScrollReveal delay={300} className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%] bg-[#1a1a1a] rounded-l-[4rem] shadow-2xl z-0 overflow-hidden">
          {hero?.imageUrl ? (
            <img
              src={hero.imageUrl}
              alt={hero?.heroTitle || "Solution Hero Image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#e6e6e6]" />
          )}
        </ScrollReveal>
      </section>

      {/* Interactive Map Section OR Custom Section 2 */}
      {customSection2?.heading ? (
        <CustomSection2 data={customSection2} />
      ) : (
        <section id="solution-next-section" className="bg-black py-16 md:py-32 px-6 md:px-20 border-t border-white/10 relative">
          <div className="mx-auto max-w-[1200px]">
            <ScrollReveal>
              <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold text-white mb-16 max-w-4xl leading-[1.1] tracking-tight">
                {featuresSection?.mapHeading || (
                  urlSlug === 'charge-point-operators' ? (
                    <>
                      Scaling public charging infrastructure has its own set of challenges.<br />
                      Tap a marker to see where things typically go wrong.
                    </>
                  ) : urlSlug === 'hospitality-workplace' ? (
                    <>
                      Providing premium charging amenities has its own set of challenges.<br />
                      Tap a marker to see where things typically go wrong.
                    </>
                  ) : urlSlug === 'residential' ? (
                    <>
                      Installing residential charging infrastructure has its own set of challenges.<br />
                      Tap a marker to see where things typically go wrong.
                    </>
                  ) : (
                    <>
                      Running a fleet depot has its own set of challenges.<br />
                      Tap a marker to see where things typically go wrong.
                    </>
                  )
                )}
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={150} className="mb-10 z-30 relative">
              {/* Mobile Swipe Instruction */}
              <div className="md:hidden flex items-center justify-center gap-3 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                {locale === 'es-419' || locale === 'es' ? 'Desliza para ver más' : 'Swipe to explore'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>

              {/* Scrollable Container for Mobile */}
              <div className="w-full overflow-x-auto md:overflow-visible hide-scrollbar pb-10 -mb-10 md:pb-0 md:mb-0 snap-x snap-proximity">
                <div className="w-[1000px] md:w-full relative aspect-[21/9] p-0">
                  {urlSlug === 'charge-point-operators' ? (
                    <CpoInfrastructureMap src="Charge-Point-Operators_qwmjoo" locale={locale} />
                  ) : urlSlug === 'hospitality-workplace' ? (
                    <HospitalityInfrastructureMap src="Hospitality-And-Workplace_guhvna" locale={locale} />
                  ) : urlSlug === 'residential' ? (
                    <ResidentialInfrastructureMap src="Residential_ywkugd" locale={locale} />
                  ) : (
                    <DepotInfrastructureMap src="Depot-Infrastructure_imbnbg" locale={locale} />
                  )}
                  
                  {/* Bottom text - hidden on mobile since we have swipe instructions */}
                  <div className="hidden md:block absolute bottom-8 right-10 text-[#00E573] text-[11px] font-bold tracking-widest uppercase z-10 bg-[#0c0c0c]/80 px-4 py-2 rounded-full backdrop-blur-md pointer-events-none">
                    {locale === 'es-419' || locale === 'es' ? 'Selecciona un marcador para explorar' : 'Select a marker to explore'}
                  </div>
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
