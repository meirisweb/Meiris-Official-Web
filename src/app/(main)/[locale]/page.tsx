
import Hero from '../../_components/Hero';
import Solutions from '../../_components/Solutions';
import LatestNews from '../../_components/LatestNews';
import Contact from '../../_components/Contact';
import { getLocalizedMetadata, resolveSanitySeo } from '@/lib/seo';
import type { Metadata } from 'next';

import { sanityFetch } from '@/sanity/lib/sanityFetch';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  let seoData = null;
  try {
    const doc = await sanityFetch<any>({
      query: `*[_type == "homePage" && language == $locale][0] { seo }`,
      params: { locale },
    });
    seoData = doc?.seo;
  } catch (e) {
    console.error('Error fetching home seo:', e);
  }

  return resolveSanitySeo({
    seoData,
    fallbackTitle: 'Meiris — The power conversion platform for global electrification',
    fallbackDescription: 'Meiris provides cutting-edge electrification solutions, power infrastructure, and technological innovation.',
    path: '/',
    locale,
  });
}

export const revalidate = 60; // Fetch fresh data from Sanity every 60s


export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  // Fetch the homepage document for this locale. Fallback to English if not found.
  const homePage = await sanityFetch<any>({
    query: `*[_type == "homePage" && language == $locale][0] {
      ...,
      solutionsSection {
        ...,
        solutions[] {
          ...,
          "imageUrl": image.asset->url
        }
      },
      contactSection {
        ...,
        "imageUrl": image.asset->url
      }
    }`,
    params: { locale }
  }) || await sanityFetch<any>({
    query: `*[_type == "homePage" && language == "en"][0] {
      ...,
      solutionsSection {
        ...,
        solutions[] {
          ...,
          "imageUrl": image.asset->url
        }
      },
      contactSection {
        ...,
        "imageUrl": image.asset->url
      }
    }`
  });

  // Fetch the latest 3 posts dynamically from the standalone insightPost documents
  let latestPosts = await sanityFetch<any[]>({
    query: `*[_type == "insightPost" && language == $locale] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
      title,
      publishedAt,
      "slug": _id,
      "imageUrl": image.asset->url + "?w=800&h=450&fit=crop"
    }`,
    params: { locale }
  });

  if (!latestPosts || latestPosts.length === 0) {
    latestPosts = await sanityFetch<any[]>({
      query: `*[_type == "insightPost" && language == "en"] | order(coalesce(publishedAt, _createdAt) desc)[0...3] {
        title,
        publishedAt,
        "slug": _id,
        "imageUrl": image.asset->url + "?w=800&h=450&fit=crop"
      }`
    });
  }


  if (!homePage) {
    return <div>Home page content not found.</div>;
  }

  return (
    <div className="main-wrapper">
      <Hero data={homePage.hero || {}} />
      <Solutions data={homePage.solutionsSection || {}} />
      <LatestNews data={{...(homePage.latestNewsSection || {}), posts: latestPosts}} locale={locale} />
      <Contact data={homePage.contactSection || {}} />
    </div>
  );
}
