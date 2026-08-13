"use client";

import React, { useRef, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { GREEN } from "./Graphics";

interface Props {
  platformModule: StaticImageData;
  locale?: string;
}

const ProtectedVideo = ({ src, className }: { src: string, className?: string }) => {
  const [blobUrl, setBlobUrl] = useState<string>("");

  useEffect(() => {
    let objectUrl = "";
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(console.error);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!blobUrl) {
    return <div className={className} />;
  }

  return (
    <div className="relative w-full h-full" onContextMenu={(e) => e.preventDefault()}>
      <video
        src={blobUrl}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        controlsList="nodownload"
        disablePictureInPicture
      />
      <div className="absolute inset-0 z-10 bg-transparent" />
    </div>
  );
};

const Section1 = ({ t }: { t: any }) => (
  <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-28 pb-20">
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 md:gap-20 px-6 sm:px-10 md:grid-cols-[1.15fr_1fr] lg:px-16 z-10">
      <div>
        <h1 className="text-[clamp(2.25rem,min(6.0vw,9.0vh),5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white whitespace-pre-line">
          {t.s1_title}
        </h1>
        <p className="mt-6 md:mt-16 max-w-xl text-[14px] md:text-[clamp(1rem,min(1.8vw,2.7vh),1.35rem)] font-semibold leading-snug text-white">
          {t.s1_subtitle}
        </p>
        <p className="mt-4 md:mt-12 max-w-xl text-[12px] md:text-[clamp(0.85rem,min(1.3vw,2.0vh),1rem)] leading-[1.55] text-white/60">
          {t.s1_desc}
        </p>
      </div>
      <div className="flex items-center justify-center md:justify-end w-full relative">
        <div className="relative w-full scale-[1.25] md:scale-150 origin-center md:origin-right md:translate-x-16 lg:translate-x-24" style={{ maskImage: 'radial-gradient(50% 50% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(50% 50% at 50% 50%, black 50%, transparent 100%)' }}>
          <ProtectedVideo src="/api/media?id=Platform_Section_1_nnqcxk" className="w-full h-auto mix-blend-screen" />
        </div>
      </div>
    </div>
  </section>
);

const Section2 = ({ t }: { t: any }) => (
  <section className="relative py-24 md:py-32 bg-black flex items-center justify-center">
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 md:gap-20 px-6 sm:px-10 md:grid-cols-[1.15fr_1fr] lg:px-16">
      <div>
        <h2 className="text-[clamp(1.25rem,min(4vw,5vh),2.1rem)] 2xl:text-[clamp(1.5rem,min(4vw,5.5vh),3rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white whitespace-pre-line">
          {t.s2_t1}
        </h2>
        <p className="mt-4 max-w-xl text-[12px] xl:text-[13px] 2xl:text-[clamp(1.1rem,min(1.8vw,2.7vh),1.35rem)] font-semibold leading-snug text-white whitespace-pre-line">
          {t.s2_t2}
        </p>
        <div className="mt-6">
          <p className="max-w-xl text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-[clamp(1rem,min(1.4vw,2.1vh),1.1rem)] leading-[1.4] 2xl:leading-[1.55] text-white/55">
            {t.s2_t3}
          </p>
          <p className="mt-4 text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-[clamp(1rem,min(1.5vw,2.2vh),1.2rem)] text-white">
            {t.s2_t4}
          </p>
        </div>
        <div className="mt-8 border-l-2 pl-4 md:pl-6 border-[#00E573]">
          <p className="max-w-lg text-[12px] md:text-[clamp(0.85rem,min(1.2vw,1.8vh),1rem)] italic leading-[1.5] md:leading-[1.8] text-white/65">
            {t.s2_q}
          </p>
          <p className="mt-2 text-[11px] md:text-[12px] uppercase tracking-widest text-[#00E573]">
            {t.s2_qa}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center md:justify-end w-full relative">
        <div className="relative w-full scale-[1.25] md:scale-125 2xl:scale-150 origin-center md:origin-right md:translate-x-16 lg:translate-x-24" style={{ maskImage: 'radial-gradient(50% 50% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(50% 50% at 50% 50%, black 50%, transparent 100%)' }}>
          <ProtectedVideo src="/api/media?id=Platform_Section_2_ybbgym" className="w-full h-auto mix-blend-screen" />
        </div>
      </div>
    </div>
  </section>
);

const Section3Parallax = ({ t, isMobile, isTablet }: { t: any, isMobile: boolean, isTablet: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 0) {
        const scrolled = -rect.top;
        const total = rect.height - window.innerHeight;
        let p = scrolled / total;
        setProgress(Math.max(0, Math.min(1, p)));
      } else if (rect.top > 0) {
        setProgress(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function lerp(start: number, end: number): number {
    if (progress <= start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  }
  function rng(inS: number, inE: number, outS: number, outE: number): number {
    return outS + lerp(inS, inE) * (outE - outS);
  }

  const s3BoxOp = Math.min(lerp(0.0, 0.08), 1);
  const s3BoxW = rng(0.0, 0.12, 0, isMobile ? 100 : 45);
  const s3TextY = rng(0.0, 0.08, 40, 0);
  const s3DiagOp = lerp(0.05, 0.25);
  const s3MobileCardsOp = isMobile ? lerp(0.2, 0.3) : 1;
  const s3MobileTranslateX = isMobile ? rng(0.4, 0.95, 0, -178) : 0;
  
  const s3C1Op = lerp(0.35, 0.45);
  const s3C1Y = rng(0.35, 0.45, 40, 0);
  const s3C2Op = lerp(0.40, 0.50);
  const s3C2Y = rng(0.40, 0.50, 40, 0);
  const s3C3Op = lerp(0.45, 0.55);
  const s3C3Y = rng(0.45, 0.55, 40, 0);

  const s3FrameProgress = lerp(0.0, 1.0);
  const s3FrameIndex = Math.min(181, Math.max(1, Math.floor(s3FrameProgress * 181) + 1));
  const s3FramePadded = String(s3FrameIndex).padStart(3, '0');
  const s3FrameUrl = `https://res.cloudinary.com/efi3yigo/image/upload/v1786089532/ezgif-frame-${s3FramePadded}.jpg`;

  return (
    <div ref={containerRef} style={{ height: "350vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, width: "100%", height: "100vh", backgroundColor: "#000", overflow: "hidden", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center" }}>
        <div className="mx-auto w-full max-w-[1180px] flex flex-col justify-center relative px-4 md:px-6 sm:px-8 py-6 md:py-8 lg:px-10 pt-24 md:pt-0">
          <div className="hidden md:block absolute top-16 bottom-8 left-0 rounded-l-[2rem] z-0" style={{ width: `${s3BoxW}%`, opacity: s3BoxOp, background: "#e6e6e6" }} />
          <div className="relative z-10 flex flex-col">
            <div className="flex flex-col md:flex-row flex-1 min-h-0 items-center">
              <div className="w-full md:w-[45%] p-0 md:p-[2vh] 2xl:p-[4vh] pt-0 md:pt-[3vh] 2xl:pt-[5vh] text-white md:text-black" style={{ opacity: s3BoxOp, transform: `translateY(${s3TextY}px)` }}>
                <p className="text-[9px] md:text-[10px] font-bold tracking-widest text-[#00E573] md:text-black/50 uppercase">
                  {t.s3_t1}
                </p>
                <h2 className="mt-1 md:mt-[1.5vh] 2xl:mt-[3vh] text-[clamp(1.5rem,min(3.5vw,5.2vh),2.5rem)] 2xl:text-[clamp(1.75rem,min(3.5vw,5.2vh),3.5rem)] font-bold leading-[1.05] tracking-tight text-white md:text-black whitespace-pre-line">
                  {t.s3_t2}
                </h2>
                <p className="mt-2 md:mt-[1.5vh] 2xl:mt-[2.5vh] text-[11px] lg:text-[13px] 2xl:text-[clamp(12px,1.5vh,14px)] text-white/70 md:text-black/70 leading-[1.4] 2xl:leading-[1.5]">
                  {t.s3_t3}
                </p>
              </div>
              <div className="flex w-full md:w-[55%] items-center justify-center md:justify-end p-4 md:p-[2vh] 2xl:p-[3.5vh] md:pr-4 lg:pr-12" style={{ opacity: s3DiagOp }}>
                <div className="w-full max-w-[200px] md:max-w-none flex justify-center md:justify-end">
                  <img src={s3FrameUrl} alt="Three Layers Architecture" className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[600px] h-auto object-contain mix-blend-screen" />
                </div>
              </div>
            </div>
            <div className="flex md:grid flex-nowrap md:grid-cols-3 gap-4 px-4 md:px-12 pb-4 md:pb-[2vh] 2xl:pb-[3.5vh] mt-4 md:-mt-[2vh] 2xl:-mt-16" style={{ transform: isMobile ? `translateX(${s3MobileTranslateX}vw)` : "none" }}>
              <div className="shrink-0 w-[85vw] md:w-auto bg-[#2c2d2e] p-6 md:p-[2vh] 2xl:p-[3.5vh] text-white rounded-[1rem] md:rounded-none md:rounded-l-[1.5rem]" style={{ opacity: isMobile ? s3MobileCardsOp : s3C1Op, transform: isMobile ? "none" : `translateY(${s3C1Y}px)` }}>
                <h3 className="text-[13px] md:text-base font-semibold">{t.s3_c1_h}</h3>
                <p className="mt-2 md:mt-[1vh] 2xl:mt-[2vh] text-[12px] md:text-[13px] leading-[1.6] md:leading-relaxed text-white/50">{t.s3_c1_p}</p>
              </div>
              <div className="shrink-0 w-[85vw] md:w-auto bg-[#2c2d2e] p-6 md:p-[2vh] 2xl:p-[3.5vh] text-white rounded-[1rem] md:rounded-none" style={{ opacity: isMobile ? s3MobileCardsOp : s3C2Op, transform: isMobile ? "none" : `translateY(${s3C2Y}px)` }}>
                <h3 className="text-[13px] md:text-base font-semibold">{t.s3_c2_h}</h3>
                <p className="mt-2 md:mt-[1vh] 2xl:mt-[2vh] text-[12px] md:text-[13px] leading-[1.6] md:leading-relaxed text-white/50">{t.s3_c2_p}</p>
              </div>
              <div className="shrink-0 w-[85vw] md:w-auto bg-[#2c2d2e] p-6 md:p-[2vh] 2xl:p-[3.5vh] text-white rounded-[1rem] md:rounded-none md:rounded-r-[1.5rem]" style={{ opacity: isMobile ? s3MobileCardsOp : s3C3Op, transform: isMobile ? "none" : `translateY(${s3C3Y}px)` }}>
                <h3 className="text-[13px] md:text-base font-semibold">{t.s3_c3_h}</h3>
                <p className="mt-2 md:mt-4 text-[12px] md:text-[13px] leading-[1.6] md:leading-relaxed text-white/50">{t.s3_c3_p}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section4 = ({ t }: { t: any }) => (
  <section className="relative bg-white md:bg-black flex flex-col md:flex-row overflow-hidden">
    <div className="grid w-full grid-cols-1 md:grid-cols-2 relative flex-1 h-full">
      <div className="relative z-20 bg-white md:bg-[#e6e6e6] px-6 py-20 md:py-32 2xl:py-[10vh] md:px-16 lg:px-24 xl:px-32 flex flex-col justify-center">
        <div className="w-full text-black">
          <h2 className="text-[clamp(1.25rem,min(4vw,5vh),2.1rem)] 2xl:text-[clamp(1.5rem,min(4vw,5.5vh),3rem)] font-bold leading-[1.05] tracking-tight whitespace-pre-line">
            {t.s4_t1}
          </h2>
          <p className="mt-6 text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-[clamp(1rem,2vh,1.15rem)] leading-[1.4] 2xl:leading-[1.5] text-black/80">
            {t.s4_t2}
          </p>
          <p className="mt-4 text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-[clamp(1rem,2vh,1.15rem)] leading-[1.4] 2xl:leading-[1.5] text-black/80">
            {t.s4_t3}
          </p>
          <p className="mt-4 text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-[clamp(1rem,2vh,1.15rem)] leading-[1.4] 2xl:leading-[1.5] text-black/80">
            {t.s4_t4}
          </p>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-center px-6 py-6 md:py-32 2xl:py-[10vh] md:pl-16 mix-blend-normal md:mix-blend-screen bg-white md:bg-black">
        <div className="relative w-full max-w-[320px] md:max-w-[550px] 2xl:max-w-[650px] scale-100 md:scale-[1.35] 2xl:scale-[1.6]">
          <ProtectedVideo src="/api/media?id=Platform_Section_4_-_PC_Version_mllwn7" className="w-full h-auto hidden md:block contrast-125" />
          <ProtectedVideo src="/api/media?id=Platform_Section_4_-_Mobile_Version_qm9hhe" className="w-full h-auto md:hidden contrast-125" />
        </div>
      </div>
    </div>
  </section>
);

const Section5 = ({ t }: { t: any }) => (
  <section className="relative pt-6 md:pt-10 pb-16 md:pb-24 bg-[#050505] flex flex-col justify-center overflow-hidden">
    <div className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-6 sm:px-10 lg:px-12 z-10">
      <h2 className="text-[clamp(1.75rem,min(4.0vw,6.0vh),3.75rem)] font-bold leading-[1.05] tracking-tight text-white whitespace-pre-line">
        {t.s5_t1}
      </h2>
      <p className="mt-4 text-[13px] md:text-lg font-medium text-[#00E573]">
        {t.s5_t2}
      </p>
      <div className="mt-8 md:mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-[1rem] md:rounded-[1.5rem] border border-white/20 p-6 md:p-[3.5vh]">
          <p className="text-[12px] md:text-[14px] leading-relaxed text-white/80">{t.s5_c1}</p>
        </div>
        <div className="rounded-[1rem] md:rounded-[1.5rem] border border-white/20 p-6 md:p-[3.5vh]">
          <p className="text-[12px] md:text-[14px] leading-relaxed text-white/80">{t.s5_c2}</p>
        </div>
      </div>
      <div className="mt-12 border-l-2 pl-4 md:pl-6 border-[#00E573]">
        <p className="max-w-4xl text-[12px] md:text-[14px] italic leading-relaxed text-white/80">
          {t.s5_q}
        </p>
      </div>

      <div className="mt-8 md:mt-12 w-full relative">
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-black">
          <ProtectedVideo src="https://res.cloudinary.com/efi3yigo/video/upload/Platform_Section_6.mp4" className="w-full h-full object-cover mix-blend-screen" />
        </div>
      </div>
    </div>
  </section>
);

const Section7 = ({ t }: { t: any }) => (
  <section className="relative py-24 md:py-32 bg-black">
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 md:gap-16 px-6 md:px-8 md:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col">
        <h2 className="text-[clamp(1.5rem,min(4vw,5.5vh),3rem)] font-bold leading-[1.05] tracking-tight text-white whitespace-pre-line hidden xl:block">
          {t.s7_t1}
        </h2>
        <h2 className="text-[clamp(1.5rem,min(4vw,5.5vh),3rem)] font-bold leading-[1.05] tracking-tight text-white whitespace-pre-line xl:hidden">
          {t.s7_t1_mobile || t.s7_t1}
        </h2>
        <h3 className="mt-6 text-[14px] md:text-[16px] 2xl:text-[20px] font-semibold text-[#00E573] max-w-xl leading-tight">
          {t.s7_sub}
        </h3>
        <p className="mt-6 max-w-lg text-[11px] lg:text-[13px] 2xl:text-[16px] leading-[1.4] 2xl:leading-[1.5] text-white/75">
          {t.s7_t2}
        </p>
        <p className="mt-4 max-w-lg text-[11px] lg:text-[13px] 2xl:text-[16px] leading-[1.4] 2xl:leading-[1.5] text-white/75">
          {t.s7_t3}
        </p>
        <div className="mt-8 border-l-2 border-[#00E573] pl-4 md:pl-6">
          <p className="max-w-lg text-[12px] md:text-[15px] italic leading-[1.5] md:leading-relaxed text-white/85">
            {t.s7_q}
          </p>
        </div>
      </div>
      <div className="relative flex flex-col items-center">
        <div className="relative w-full max-w-[280px] md:max-w-[600px] scale-125 md:scale-100" style={{ maskImage: 'radial-gradient(50% 50% at 50% 50%, black 40%, transparent 90%)', WebkitMaskImage: 'radial-gradient(50% 50% at 50% 50%, black 40%, transparent 90%)' }}>
          <ProtectedVideo src="/api/media?id=Platform_Section_7_jne46l" className="w-full h-auto object-cover mix-blend-screen" />
        </div>
      </div>
    </div>
  </section>
);

const Section8 = ({ t }: { t: any }) => (
  <section className="relative py-24 md:py-32 bg-[#050505] pb-48">
    <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] px-6 md:px-10 lg:px-16">
      <div>
        <h2 className="text-[clamp(1.75rem,min(4.0vw,6.0vh),3.5rem)] font-bold leading-[1.05] tracking-tight text-white whitespace-pre-line">
          {t.s8_t1}
        </h2>
        <p className="mt-6 max-w-4xl text-[13px] md:text-[14px] leading-relaxed text-white/70 whitespace-pre-line">
          {t.s8_t2}
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden border border-white/10 rounded-2xl group">
          <Image src="/images/EV Charging Solutions - Platform.png" alt={t.s8_c1_t} fill className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
            <h3 className="text-[clamp(1.5rem,min(3.0vw,4.5vh),2rem)] font-bold tracking-tight text-white">{t.s8_c1_t}</h3>
            <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c1_p}</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden border border-white/10 rounded-2xl group">
          <Image src="/images/Solar - Platform.png" alt={t.s8_c2_t} fill className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
            <h3 className="text-[clamp(1.5rem,min(3.0vw,4.5vh),2rem)] font-bold tracking-tight text-white">{t.s8_c2_t}</h3>
            <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c2_p}</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden border border-white/10 rounded-2xl group">
          <Image src="/images/Railway - Platform.png" alt={t.s8_c3_t} fill className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
            <h3 className="text-[clamp(1.5rem,min(3.0vw,4.5vh),2rem)] font-bold tracking-tight text-white">{t.s8_c3_t}</h3>
            <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c3_p}</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden border border-white/10 rounded-2xl group">
          <Image src="/images/BESS - Platform.png" alt={t.s8_c4_t} fill className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
            <h3 className="text-[clamp(1.5rem,min(3.0vw,4.5vh),2rem)] font-bold tracking-tight text-white">{t.s8_c4_t}</h3>
            <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c4_p}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function PlatformParallax({ platformModule, locale }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const t = locale === 'es-419' ? {
    s1_title: "Conversión\nInteligente\nde Energía.",
    s1_subtitle: "Desde la entrada de red hasta la salida de precisión, una sola arquitectura integrada verticalmente.",
    s1_desc: "La Plataforma MEIRIS es una plataforma de conversión de energía de integración vertical, desarrollada con dispositivos de Carburo de Silicio (SiC) y firmware exclusivo, diseñada para convertir, gestionar y orquestar la energía con precisión.",

    s2_t1: "La energía está en todas partes.\nLa inteligencia no.",
    s2_t2: "La transición energética no es un problema de hardware.\nEs un problema de conversión.",
    s2_t3: "Cada Megavatio de generación renovable, cada vehículo eléctrico, cada sistema de baterías requiere conversión. Cada aspecto de la generación y el consumo de electricidad implica un elemento de conversión. La energía eléctrica bruta de la red debe transformarse, regularse y suministrarse con precisión a cada carga, cada vez. Con fuentes variables y perfiles de carga cambiantes, el problema de la conversión se ha vuelto más complejo. La eficiencia de esa conversión determina la eficiencia de todo el sistema energético. La eficiencia de conversión ya no se puede ignorar.",
    s2_t4: "MEIRIS se creó para solucionarlo de forma diferente.",
    s2_q: "“La brecha entre la energía eléctrica bruta y el suministro de energía inteligente y preciso es donde se construye la próxima generación de infraestructura energética.”",
    s2_qa: "— MEIRIS ENGINEERING",

    s3_t1: "ARQUITECTURA",
    s3_t2: "Tres capas.\nUna arquitectura.",
    s3_t3: "La base de silicio de los dispositivos de módulos de potencia de SiC de banda prohibida ancha, la precisión de una arquitectura de control exclusiva y algoritmos de firmware inteligentes que orquestan la conversión de energía en tiempo real. La Plataforma MEIRIS integra electrónica de potencia, arquitectura de control e inteligencia de firmware en un sistema unificado diseñado para la conversión de energía de alto rendimiento. Cada capa de la Plataforma MEIRIS está diseñada, desarrollada y es propiedad de MEIRIS.",
    s3_c1_h: "Base de silicio",
    s3_c1_p: "Módulos de potencia bidireccionales basados en SiC. Topologías de conmutación patentadas. 30 kW por módulo, escalable en paralelo.",
    s3_c2_h: "Arquitectura de control",
    s3_c2_p: "Controlador SoC, conmutación en tiempo real, protocolos de comunicación",
    s3_c3_h: "Inteligencia de firmware",
    s3_c3_p: "Algoritmos de control patentados. Enrutamiento de energía V2X. Respuesta a la demanda de la red, ISO 15118, OCPP y gestión predictiva.",

    s4_t1: "Conversión de energía,\nrepensada a nivel\nde silicio",
    s4_t2: "El núcleo de la plataforma está construido en torno al Carburo de Silicio — un semiconductor de banda prohibida ancha que opera a voltajes más altos, frecuencias de conmutación más altas y temperaturas de unión más altas que los dispositivos de silicio convencionales. Esta elección de material no es casual. Es la base de todas las ventajas de rendimiento posteriores.",
    s4_t3: "Cada módulo integra un rectificador activo basado en MOSFET de SiC en una configuración de puente activo trifásico, con Corrección Activa del Factor de Potencia que mantiene un factor de potencia cercano a la unidad. Diseñado para minimizar la energía reactiva y mejorar la calidad de energía del lado de la red. El resultado: conversión limpia para la red, distorsión armónica mínima y máxima utilización de la energía.",
    s4_t4: "Los módulos se combinan en paralelo. Cada bloque modular de 30 kW escala la salida total del sistema de 30 kW a 360 kW dentro de una sola arquitectura de sistema. Aumentar la capacidad de potencia ya no implica reemplazos ni modificaciones mayores.",
    s5_t1: "La energía tiene una dirección.\nNosotros eliminamos la restricción.",
    s5_t2: "La bidireccionalidad no es una característica. Es la arquitectura.",
    s5_c1: "La bidireccionalidad es nativa de los dispositivos de SiC. El mismo firmware que gestiona la carga puede gestionar la descarga. No hay cambio de modo.",
    s5_c2: "El resultado: los sistemas impulsados por MEIRIS pueden ser simultáneamente un sistema de suministro de energía y un sistema de recuperación de energía. Una batería de VE se convierte en un recurso de red despachable. Un banco de almacenamiento se convierte en un activo de regulación de frecuencia. Un nodo de energía distribuida se convierte en un participante interactivo con la red. La física de la conversión es idéntica en ambas direcciones. La inteligencia define la dirección, la magnitud y los tiempos.",
    s5_q: "“La arquitectura que carga una batería es la misma arquitectura que despacha su energía a la red. Eso no es una capacidad añadida. Es una forma diferente de pensar sobre la conversión de energía.”",

    s6_in: "Entrada",
    s6_out: "Salida",
    s6_flow: "Flujo Bidireccional",
    s6_stage: "Etapa de Conversión MEIRIS",

    s7_t1: "El firmware\nhace que la\nplataforma\nsea lo que es.",
    s7_t1_mobile: "El firmware hace que la\nplataforma sea lo que es.",
    s7_sub: "Algoritmos exclusivos. Orquestación de energía en tiempo real. Aplicación definida por software.",
    s7_t2: "Las unidades de control, basadas en una arquitectura y un firmware exclusivos, forman la capa de inteligencia que da coherencia a la plataforma en todas las condiciones de operación, perfiles de carga y contextos de aplicación.",
    s7_t3: "El firmware patentado orquesta el control de potencia en tiempo real, la gestión dinámica de carga, la optimización predictiva de energía y la integración a la red sin la latencia del middleware.",
    s7_q: "“El hardware define el límite de lo posible. El firmware define lo que realmente sucede. MEIRIS posee ambos.”",
    s7_img: "MEIRIS Intelligence Core",

    s8_t1: "Una plataforma. Múltiples aplicaciones.",
    s8_t2: "La arquitectura de la plataforma de módulos de potencia, la topología de control y la inteligencia del firmware son consistentes en todas las aplicaciones. El comportamiento específico de la aplicación se determina en la capa de software, no mediante el rediseño del hardware.",
    s8_m_t: "MÓDULO DE POTENCIA APILADO",
    s8_m_s: "Alta densidad de potencia • Refrigeración líquida • Escalable",
    s8_c1_t: "Soluciones de carga para VE",
    s8_c1_p: "Cargadores rápidos de CC · Cargadores de CA · Cargadores a bordo",
    s8_c2_t: "Solar",
    s8_c2_p: "Inversores de alta capacidad (>100 kVA)",
    s8_c3_t: "Ferroviario (Railway)",
    s8_c3_p: "Inversores de tracción · Convertidores auxiliares",
    s8_c4_t: "BESS (Battery Energy Storage Systems)",
    s8_c4_p: "Sistema de conversión de potencia (PCS)"
  } : {
    s1_title: "Intelligent\nPower\nConversion.",
    s1_subtitle: "From grid input to precision output, a single vertically integrated architecture.",
    s1_desc: "The MEIRIS Platform is a vertically integrated power conversion platform built using Silicon Carbide (SiC) devices & proprietary firmware, engineered to convert, manage, and orchestrate energy with precision.",

    s2_t1: "Energy is everywhere.\nIntelligence is not.",
    s2_t2: "The Energy Transition is not a hardware problem.\nIt is a conversion problem.",
    s2_t3: "Every Megawatt of renewable generation, every EV, every battery system requires conversion. Every aspect of electricity generation and consumption involves an element of conversion. Raw electrical energy from the grid must be transformed, regulated, and delivered with precision to every load, every time. With variable sources and changing load profiles the conversion problem has become more complex. The efficiency of that conversion determines the efficiency of the entire energy system. Conversion efficiency can no longer be ignored.",
    s2_t4: "MEIRIS was built to solve it differently.",
    s2_q: "“The gap between raw electrical energy and intelligent, precise power delivery is where the next generation of energy infrastructure is built.”",
    s2_qa: "— MEIRIS Engineering",

    s3_t1: "Architecture",
    s3_t2: "Three Layers.\nOne Architecture.",
    s3_t3: "The silicon foundation of wide-bandgap SiC power module devices, the precision of a proprietary control architecture and intelligent firmware algorithms that orchestrate energy conversion in real time. The MEIRIS Platform integrates power electronics, control architecture and firmware intelligence into a unified system designed for high-performance energy conversion. Every layer of the MEIRIS Platform is designed, developed, and owned by MEIRIS.",
    s3_c1_h: "Silicon Foundation",
    s3_c1_p: "SiC-based bidirectional power modules. Patented switching topologies. 30kW per module, scalable in parallel.",
    s3_c2_h: "Control Architecture",
    s3_c2_p: "System on Chip controller, real-time switching, communication protocols",
    s3_c3_h: "Firmware Intelligence",
    s3_c3_p: "Patented control algorithms. V2X energy routing. Grid demand response, ISO 15118, OCPP, and predictive management.",

    s4_t1: "Power Conversion,\nrethought at the\nSilicon Level",
    s4_t2: "The platform's core is built around Silicon Carbide — a wide-bandgap semiconductor that operates at higher voltages, higher switching frequencies, and higher junction temperatures than conventional Silicon devices. This material choice is not incidental. It is the foundation of every performance advantage that follows.",
    s4_t3: "Each module integrates an active rectifier built on SiC MOSFETs in a three-phase active bridge configuration with Active Power Factor Correction that maintains a power factor approaching unity. Designed to minimize reactive power and improve grid-side power quality. The result: grid-clean conversion, minimal harmonic distortion and maximum energy utilization.",
    s4_t4: "Modules combine in parallel. Each 30kW building block scales total system output from 30kW to 360kW within a single system architecture. Scaling up of power ratings no longer means replacement or major modifications.",
    s5_t1: "Power has a direction.\nWe removed the constraint.",
    s5_t2: "Bidirectionality is not a feature. It is the architecture.",
    s5_c1: "Bidirectionality is native to SiC devices. The same firmware that manages charging can manage discharge. There is no mode switch.",
    s5_c2: "The result: MEIRIS-powered systems can be simultaneously a power delivery system and an energy recovery system. An EV battery becomes a dispatchable grid resource. A storage bank becomes a frequency regulation asset. A distributed energy node becomes a grid-interactive participant. The physics of conversion are identical in both directions. The intelligence defines direction, magnitude, and timing.",
    s5_q: "“The architecture that charges a battery is the same architecture that dispatches its energy to the grid. That is not a capability addition. That is a different way of thinking about power conversion.”",

    s6_in: "Input",
    s6_out: "Output",
    s6_flow: "Bi-Directional Flow",
    s6_stage: "MEIRIS Conversion Stage",

    s7_t1: "The firmware\nmakes the\nplatform\nwhat it is.",
    s7_t1_mobile: "The firmware makes the\nplatform what it is.",
    s7_sub: "Proprietary algorithms. Real-time energy orchestration. Software-defined application.",
    s7_t2: "The controller units built on a proprietary architecture and firmware form the intelligence layer that makes the platform coherent across all operating conditions, load profiles, and application contexts",
    s7_t3: "Patented firmware orchestrates real-time power control, dynamic load management, predictive energy optimization, and grid integration without middleware latency.",
    s7_q: "“Hardware defines the boundary of what is possible. Firmware defines what actually happens. MEIRIS owns both.”",
    s7_img: "MEIRIS Intelligence Core",

    s8_t1: "One Platform. Multiple Applications",
    s8_t2: "The power module platform architecture, control topology, and firmware intelligence are consistent across applications. Application-specific behaviour is determined at the software layer — not through hardware redesign.",
    s8_m_t: "STACKED POWER MODULE",
    s8_m_s: "High Power Density • Liquid Cooled • Scalable",
    s8_c1_t: "EV Charging Solutions",
    s8_c1_p: "DC Fast Chargers · AC Chargers · Onboard Chargers",
    s8_c2_t: "Solar",
    s8_c2_p: "High output (>100 kVA) inverters",
    s8_c3_t: "Railway",
    s8_c3_p: "Traction inverters · Auxiliary converters",
    s8_c4_t: "BESS",
    s8_c4_p: "Power Conversion System (PCS)"
  };

  return (
    <div className="w-full bg-black text-white relative flex flex-col">
       <Section1 t={t} />
       <Section2 t={t} />
       <Section3Parallax t={t} isMobile={isMobile} isTablet={isTablet} />
       <Section4 t={t} />
       <Section5 t={t} />
       <Section7 t={t} />
       <Section8 t={t} />
    </div>
  );
}
