import { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export interface LocalizedMetadataOptions {
  locale: string;
  path: string;
  title: string;
  description?: string;
  openGraph?: {
    type?: 'website' | 'article';
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    url?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    image?: string;
  };
  query?: Record<string, string | undefined>;
}

export function getLocalizedMetadata({
  locale,
  path,
  title,
  description,
  openGraph,
  twitter,
  query,
}: LocalizedMetadataOptions): Metadata {
  const cleanPath = path === '/' ? '' : path;
  
  // Format query strings if provided (e.g. ?post=ID)
  let queryString = '';
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    });
    const str = params.toString();
    if (str) {
      queryString = `?${str}`;
    }
  }

  const canonicalPath = `/${locale}${cleanPath}${queryString}`;

  const languages: Record<string, string> = {};
  routing.locales.forEach((l) => {
    languages[l] = `/${l}${cleanPath}${queryString}`;
  });

  // x-default points to the default locale variant
  languages['x-default'] = `/${routing.defaultLocale}${cleanPath}${queryString}`;

  const ogTitle = openGraph?.title || title;
  const ogDesc = openGraph?.description || description;
  const ogImage = openGraph?.image;
  const ogType = openGraph?.type || 'website';

  const twitterTitle = twitter?.title || ogTitle;
  const twitterDesc = twitter?.description || ogDesc;
  const twitterImage = twitter?.image || ogImage;

  return {
    title,
    ...(description && { description }),
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: ogTitle,
      ...(ogDesc && { description: ogDesc }),
      type: ogType,
      url: openGraph?.url || canonicalPath,
      siteName: 'MEIRIS',
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: openGraph?.imageAlt || ogTitle,
          },
        ],
      }),
    },
    twitter: {
      card: twitter?.card || (twitterImage ? 'summary_large_image' : 'summary'),
      title: twitterTitle,
      ...(twitterDesc && { description: twitterDesc }),
      ...(twitterImage && {
        images: [twitterImage],
      }),
    },
  };
}

import { urlFor } from '@/sanity/lib/image';

export function resolveSanitySeo({
  seoData,
  fallbackTitle,
  fallbackDescription,
  path,
  locale,
  type = 'website',
}: {
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    shareImage?: any;
  };
  fallbackTitle: string;
  fallbackDescription?: string;
  path: string;
  locale: string;
  type?: 'website' | 'article';
}): Metadata {
  const title = seoData?.metaTitle || fallbackTitle;
  const description = seoData?.metaDescription || fallbackDescription;
  let imageUrl: string | undefined;

  if (seoData?.shareImage) {
    try {
      imageUrl = urlFor(seoData.shareImage).width(1200).height(630).url();
    } catch (e) {
      console.error('Error generating share image URL:', e);
    }
  }

  const meta = getLocalizedMetadata({
    locale,
    path,
    title,
    description,
    openGraph: {
      type,
      title,
      description,
      image: imageUrl,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      image: imageUrl,
    },
  });

  if (seoData?.metaKeywords && seoData.metaKeywords.length > 0) {
    meta.keywords = seoData.metaKeywords;
  }

  return meta;
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path?: string }>,
  locale: string = 'en'
) {
  const baseUrl = 'https://www.siriem.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path && { item: `${baseUrl}/${locale}${item.path}` }),
    })),
  };
}


