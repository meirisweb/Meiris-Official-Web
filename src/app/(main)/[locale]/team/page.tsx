import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import { resolveSanitySeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  return resolveSanitySeo({
    fallbackTitle: "Team — Meiris Intelligent Power Conversion",
    fallbackDescription: "Meet the engineering and leadership team behind Meiris.",
    path: '/team',
    locale,
  });
}

const navItems = [
  { label: "Platform", to: "/platform" },
  { label: "Products", to: "/products/meiris-charge" },
  { label: "Solutions", to: "/solutions" },
  { label: "Insights", to: "/insights" },
  { label: "About", to: "/about" },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-white">
      <svg width={small ? 20 : 28} height={small ? 20 : 28} viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="2" fill="white" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 12;
          return (
            <line
              key={i}
              x1={20 + Math.cos(a) * 6}
              y1={20 + Math.sin(a) * 6}
              x2={20 + Math.cos(a) * 18}
              y2={20 + Math.sin(a) * 18}
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <span className={`${small ? "text-[10px]" : "text-xs"} font-semibold tracking-[0.25em]`}>MEIRIS</span>
    </Link>
  );
}

export const revalidate = 60;

export default async function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  const teamMembers = await client.fetch(`*[_type == "teamMember" && (!defined(language) || language == $locale)] | order(order asc)`, { locale });

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#00E573] selection:text-black">
      
      <main className="mx-auto max-w-[1200px] px-6 md:px-8 lg:px-12 pt-36 md:pt-44 lg:pt-48 pb-12 md:pb-16 lg:pb-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-12 md:mb-20">
          CORE TEAM
        </h1>

        <div className="flex flex-col gap-32">
          {teamMembers.length === 0 && (
             <div className="py-20 text-center text-black/40 font-medium">
               No team members found. Add some in the Sanity Studio!
             </div>
          )}
          
          {/* CMS Members */}
          {teamMembers.map((member: any, index: number) => {
            const isEven = index % 2 === 0;

            return (
              <div key={member._id} className={`grid grid-cols-1 gap-10 md:gap-12 lg:gap-16 items-center ${isEven ? 'md:grid-cols-[320px_1fr] lg:grid-cols-[400px_1fr]' : 'md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_400px]'}`}>
                
                {/* Image */}
                <div className={`w-full max-w-[320px] md:max-w-none aspect-[4/5] bg-[#e5e5e5] shadow-lg relative overflow-hidden mx-auto md:mx-0 ${isEven ? 'order-1' : 'order-1 md:order-2'}`}>
                  {member.image ? (
                    <Image src={urlFor(member.image).width(800).height(1000).url()} alt={member.name} fill className="absolute inset-0 w-full h-full object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/30 font-semibold tracking-widest text-sm uppercase">
                      Image Placeholder
                    </div>
                  )}
                </div>
                
                {/* Text Content */}
                <div className={`flex flex-col justify-center ${isEven ? 'order-2' : 'order-2 md:order-1'}`}>
                  {member.role && (
                    <h3 className="text-xl md:text-2xl font-bold text-[#00E573] mb-3 leading-tight">
                      {member.role}
                    </h3>
                  )}
                  <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-black mb-6 tracking-tight">
                    {member.name}
                  </h2>
                  <div className="text-[14px] md:text-[15px] text-black/80 leading-loose font-medium text-justify whitespace-pre-wrap">
                    {member.bio}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      
    </div>
  );
}
