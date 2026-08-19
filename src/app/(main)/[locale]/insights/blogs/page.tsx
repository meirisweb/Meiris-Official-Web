import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from 'next/dynamic';
const InsightsClient = dynamic(() => import('../InsightsClient'));
import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { urlFor } from "@/sanity/lib/image";

import { getLocalizedMetadata, resolveSanitySeo, getBreadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const resolvedSearch = searchParams ? await searchParams : {};
  const postId = resolvedSearch?.post;

  if (postId) {
    try {
      const post = await sanityFetch<any>({
        query: `*[_type == "blogPost" && _id == $postId][0]`,
        params: { postId },
      });

      if (post) {
        const postTitle = `${post.title} | MEIRIS Blogs`;
        const postDescription =
          post.details ||
          'Read the latest blogs and technological developments from Meiris.';
        const imageUrl = post.image
          ? urlFor(post.image).width(1200).height(630).url()
          : undefined;

        return getLocalizedMetadata({
          locale,
          path: '/insights/blogs',
          title: postTitle,
          description: postDescription,
          query: { post: postId },
          openGraph: {
            type: 'article',
            title: postTitle,
            description: postDescription,
            image: imageUrl,
          },
          twitter: {
            card: imageUrl ? 'summary_large_image' : 'summary',
            title: postTitle,
            description: postDescription,
            image: imageUrl,
          },
        });
      }
    } catch (e) {
      console.error('Error fetching post metadata:', e);
    }
  }

  let seoData = null;
  try {
    const doc = await sanityFetch<any>({
      query: `*[_type == "blogsPage" && language == $locale][0] { seo }`,
      params: { locale },
    });
    seoData = doc?.seo;
  } catch (e) {
    console.error('Error fetching blogs seo:', e);
  }

  return resolveSanitySeo({
    seoData,
    fallbackTitle: 'Blogs — MEIRIS Intelligent Power Conversion',
    fallbackDescription: 'Blogs, insights, and stories from Meiris.',
    path: '/insights/blogs',
    locale,
  });
}

// Revalidate the page every 3600 seconds (1 hour)
export const revalidate = 3600;

export default async function BlogsPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const resolvedSearch = searchParams ? await searchParams : {};
  const postId = resolvedSearch?.post;

  // Fetch the blogs page singleton
  let content = await sanityFetch<any>({
    query: `*[_type == "blogsPage" && language == $locale][0] {
      pageTitle,
      pageSubtitle
    }`,
    params: { locale }
  });

  if (!content) {
    content = await sanityFetch<any>({
      query: `*[_type == "blogsPage" && language == "en"][0] {
        pageTitle,
        pageSubtitle
      }`
    });
  }

  // Fetch standalone posts
  let posts = await sanityFetch<any[]>({
    query: `*[_type == "blogPost" && language == $locale] | order(coalesce(publishedAt, _createdAt) desc)`,
    params: { locale }
  });

  if (!posts || posts.length === 0) {
    posts = await sanityFetch<any[]>({
      query: `*[_type == "blogPost" && language == "en"] | order(coalesce(publishedAt, _createdAt) desc)`
    });
  }

  // Inject posts into content for client compatibility with InsightsClient
  if (content) {
    content.insightsItems = posts;
  }

  let activePost = null;
  if (postId && posts) {
    activePost = posts.find((p) => p._id === postId);
  }

  const jsonLd = activePost
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: activePost.title,
        description: activePost.details || 'Meiris Blog Post',
        image: activePost.image
          ? urlFor(activePost.image).width(1200).height(630).url()
          : 'https://www.siriem.com/favicon.ico',
        datePublished:
          activePost.publishedAt ||
          activePost._createdAt ||
          new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Meiris',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Meiris',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.siriem.com/favicon.ico',
          },
        },
      }
    : null;

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '' },
    { name: 'Insights', path: '/insights' },
    { name: 'Blogs', path: '/insights/blogs' },
  ], locale);

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#00E573] selection:text-black">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Suspense fallback={<div className="min-h-screen"></div>}>
        <InsightsClient data={content} />
      </Suspense>
    </div>
  );
}
