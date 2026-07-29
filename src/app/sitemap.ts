import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.siriem.com';

  const staticRoutes = [
    '',
    '/platform',
    '/products/meiris-charge',
    '/insights',
    '/about',
    '/team',
    '/careers',
    '/contact',
    '/resources',
    '/solutions/depot-infrastructure',
    '/solutions/charge-point-operators',
    '/solutions/hospitality-workplace',
    '/solutions/residential',
    '/solutions/custom-solutions',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    // Generate alternate languages map for this specific route
    const languages: Record<string, string> = {};
    
    routing.locales.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${route}`;
    });
    
    // Add default
    languages['x-default'] = `${baseUrl}/${routing.defaultLocale}${route}`;

    // For the <loc> tag itself, we typically list the default language URL
    const locUrl = `${baseUrl}/${routing.defaultLocale}${route}`;

    return {
      url: locUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages,
      },
    };
  });

  // Dynamically fetch published insight posts from Sanity
  let posts: Array<{ _id: string; _updatedAt?: string; publishedAt?: string }> = [];
  try {
    posts = await client.fetch<Array<{ _id: string; _updatedAt?: string; publishedAt?: string }>>(
      `*[_type == "insightPost" && language == "en"] { _id, _updatedAt, publishedAt }`
    );
  } catch (error) {
    console.error('Failed to fetch insight posts for sitemap:', error);
  }

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => {
    const route = `/insights?post=${post._id}`;
    const languages: Record<string, string> = {};

    routing.locales.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${route}`;
    });
    languages['x-default'] = `${baseUrl}/${routing.defaultLocale}${route}`;

    const locUrl = `${baseUrl}/${routing.defaultLocale}${route}`;
    const lastModified = post._updatedAt || post.publishedAt
      ? new Date(post._updatedAt || post.publishedAt!)
      : new Date();

    return {
      url: locUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages,
      },
    };
  });

  return [...sitemapEntries, ...postEntries];
}

