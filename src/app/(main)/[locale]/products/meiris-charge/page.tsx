import type { Metadata } from "next";
import dynamic from 'next/dynamic';

const ProductsClient = dynamic(() => import('./ProductsClient'));
import { client } from "@/sanity/lib/client";

import { resolveSanitySeo, getBreadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  let seoData = null;
  try {
    const doc = await client.fetch(
      `*[_type == "productsPage" && language == $locale][0] { seo }`,
      { locale }
    );
    seoData = doc?.seo;
  } catch (e) {
    console.error('Error fetching products seo:', e);
  }

  return resolveSanitySeo({
    seoData,
    fallbackTitle: "Products — Meiris Intelligent Power Conversion",
    fallbackDescription: "Discover MEIRIS Charge: SiC-based DC fast chargers and intelligent power conversion products.",
    path: '/products/meiris-charge',
    locale,
  });
}

export default async function Page({ params }: { params: any }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const productsPage = await client.fetch(
    `*[_type == "productsPage" && language == $locale][0] {
      ...,
      hero {
        ...,
        "imageUrl": image.asset->url,
        "mobileImageUrl": mobileImage.asset->url
      },
      categories {
        acCard {
          ...,
          "imageUrl": image.asset->url
        },
        dcCard {
          ...,
          "imageUrl": image.asset->url
        }
      },
      acModels[] {
        ...,
        "imageUrl": image.asset->url
      },
      dcModels[] {
        ...,
        "imageUrl": image.asset->url
      }
    }`,
    { locale }
  ) || await client.fetch(
    `*[_type == "productsPage" && language == "en"][0] {
      ...,
      hero {
        ...,
        "imageUrl": image.asset->url,
        "mobileImageUrl": mobileImage.asset->url
      },
      categories {
        acCard {
          ...,
          "imageUrl": image.asset->url
        },
        dcCard {
          ...,
          "imageUrl": image.asset->url
        }
      },
      acModels[] {
        ...,
        "imageUrl": image.asset->url
      },
      dcModels[] {
        ...,
        "imageUrl": image.asset->url
      }
    }`
  );

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: 'Home', path: '' },
    { name: 'Products', path: '/products/meiris-charge' },
    { name: 'Meiris Charge', path: '/products/meiris-charge' },
  ], locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductsClient data={productsPage} />
    </>
  );
}
