import type { Metadata } from "next";
import Image from "next/image";
import platformModule from "@/assets/platform-module.jpg";
// platformFirmware import removed as it's now exclusively used in PlatformParallax
import PlatformParallax from "./PlatformParallax";
import { resolveSanitySeo } from "@/lib/seo";
import { sanityFetch } from '@/sanity/lib/sanityFetch';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  let seoData = null;
  try {
    const doc = await sanityFetch<any>({
      query: `*[_type == "platformPage" && language == $locale][0] { seo }`,
      params: { locale },
    });
    seoData = doc?.seo;
  } catch (e) {
    console.error('Error fetching platform seo:', e);
  }

  return resolveSanitySeo({
    seoData,
    fallbackTitle: "Platform — MEIRIS Intelligent Power Conversion",
    fallbackDescription: "From grid input to precision output — a vertically integrated power conversion architecture built on Silicon Carbide devices and proprietary firmware.",
    path: '/platform',
    locale,
  });
}

const GREEN = "oklch(0.78 0.19 155)";

export const revalidate = 60;

export default async function PlatformPage({ params: { locale } }: { params: { locale: string } }) {
  let platformPage = await sanityFetch<any>({
    query: `*[_type == "platformPage" && language == $locale][0]`,
    params: { locale },
  });

  if (!platformPage && locale !== 'en') {
    platformPage = await sanityFetch<any>({
      query: `*[_type == "platformPage" && language == "en"][0]`,
      params: { locale: 'en' },
    });
  }

  return (
    <div className="relative bg-black text-white">
      {/* Parallax scrolling sections 1–8 */}
      <PlatformParallax platformModule={platformModule} locale={locale} cmsData={platformPage || {}} />
    </div>
  );
}
