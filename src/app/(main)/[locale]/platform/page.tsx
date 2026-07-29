import type { Metadata } from "next";
import Image from "next/image";
import platformModule from "@/assets/platform-module.jpg";
// platformFirmware import removed as it's now exclusively used in PlatformParallax
import PlatformParallax from "./PlatformParallax";

import { resolveSanitySeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  return resolveSanitySeo({
    fallbackTitle: "Platform — Meiris Intelligent Power Conversion",
    fallbackDescription: "From grid input to precision output — a vertically integrated power conversion architecture built on Silicon Carbide devices and proprietary firmware.",
    path: '/platform',
    locale,
  });
}

const GREEN = "oklch(0.78 0.19 155)";

export default function PlatformPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="relative bg-black text-white">
      {/* Parallax scrolling sections 1–8 */}
      <PlatformParallax platformModule={platformModule} locale={locale} />
    </div>
  );
}
