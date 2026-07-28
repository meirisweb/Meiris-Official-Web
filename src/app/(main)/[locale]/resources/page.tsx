
import type { Metadata } from "next";
import { getLocalizedMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import dynamic from 'next/dynamic';
const ResourcesClient = dynamic(() => import('./ResourcesClient'));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  return getLocalizedMetadata({
    locale,
    path: '/resources',
    title: "Resources — Meiris Intelligent Power Conversion",
    description: "Brochures, datasheets, and technical specifications for Meiris products and solutions.",
  });
}
import { sanityFetch } from "@/sanity/lib/sanityFetch";

export const revalidate = 60; // Fetch fresh data from Sanity every 60s

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // Fetch the resources page document for this locale. Fallback to English if not found.
  let content = await sanityFetch<any>({
    query: `*[_type == "resourcesPage" && language == $locale][0] {
      pageTitle,
      pageSubtitle,
      tabCategories
    }`,
    params: { locale }
  });

  if (!content) {
    content = await sanityFetch<any>({
      query: `*[_type == "resourcesPage" && language == "en"][0] {
        pageTitle,
        pageSubtitle,
        tabCategories
      }`
    });
  }

  // Fetch standalone posts
  let posts = await sanityFetch<any[]>({
    query: `*[_type == "resourcePost" && language == $locale] | order(_createdAt desc) {
      _id,
      cardTitle,
      cardCategory,
      cardVersion,
      cardUploadDate,
      "thumbnailUrl": cardThumbnail.asset->url,
      "fileUrl": cardFile.asset->url,
      "fileExtension": cardFile.asset->extension,
      "fileSize": cardFile.asset->size
    }`,
    params: { locale }
  });

  if (!posts || posts.length === 0) {
    posts = await sanityFetch<any[]>({
      query: `*[_type == "resourcePost" && language == "en"] | order(_createdAt desc) {
        _id,
        cardTitle,
        cardCategory,
        cardVersion,
        cardUploadDate,
        "thumbnailUrl": cardThumbnail.asset->url,
        "fileUrl": cardFile.asset->url,
        "fileExtension": cardFile.asset->extension,
        "fileSize": cardFile.asset->size
      }`
    });
  }

  // Inject posts into content for client compatibility
  if (content) {
    content.resourceItems = posts;
  }

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#00E573] selection:text-black">
      <ResourcesClient data={content || {}} />
    </div>
  );
}
