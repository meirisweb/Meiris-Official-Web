"use client";
import { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import solDepot from "@/assets/sol-depot.jpg";
import solCharge from "@/assets/sol-charge.jpg";
import solHospitality from "@/assets/sol-hospitality.jpg";
import platformModule from "@/assets/platform-module.jpg";

export default function ProductsPage({ data }: { data?: any }) {
  const lenis = useLenis();
  const [activeCategory, setActiveCategory] = useState<'ac' | 'dc' | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Fallback to hardcoded arrays if Sanity data is missing
  const acModels = data?.acModels?.length ? data.acModels : [
    { id: '3.3', name: '3.3 kW', formFactor: 'Compact wall mount', useCase: 'Home / residential bay', spec: 'Single-phase, overnight charging' },
    { id: '7.4', name: '7.4 kW', formFactor: 'Compact wall mount', useCase: 'Home / residential bay', spec: 'Single-phase, faster overnight' },
    { id: '11', name: '11 kW', formFactor: 'Wall mount / pedestal', useCase: 'Workplace / apartment complex', spec: 'Three-phase' },
    { id: '22', name: '22 kW', formFactor: 'Pedestal', useCase: 'Workplace / commercial car park', spec: 'Three-phase, higher throughput' },
  ];

  const dcModels = data?.dcModels?.length ? data.dcModels : [
    { id: '30', name: '30 kW', formFactor: 'Compact pedestal', useCase: 'Cab / light EV depot', spec: 'Si/SiC-based, compact footprint' },
    { id: '60', name: '60 kW', formFactor: 'Floor mounted', useCase: 'Cab / light commercial depot', spec: 'Si/SiC-based' },
    { id: '120', name: '120 kW', formFactor: 'Floor mounted', useCase: 'Bus / truck depot, highway site', spec: 'Si/SiC-based, high power' },
    { id: '180', name: '180 kW', formFactor: 'Floor mounted', useCase: 'Bus / truck depot, highway site', spec: 'Si/SiC-based, high power' },
    { id: '240', name: '240 kW', formFactor: 'Floor mounted', useCase: 'Heavy commercial depot, HPC hub', spec: 'MEIRIS CHARGE Plus flagship, Si/SiC based' },
    { id: '360', name: '360 kW', formFactor: 'Floor mounted', useCase: 'Ultra-high power, HPC hub', spec: 'Si/SiC based, Multi-module, high-throughput' },
  ];

  // Animation and selected model state
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [animState, setAnimState] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');

  const heroRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10");
            entry.target.classList.add("opacity-100", "translate-y-0");

            const children = entry.target.querySelectorAll('.animate-on-scroll');
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.remove("opacity-0", "translate-y-10");
                child.classList.add("opacity-100", "translate-y-0");
              }, 150 + i * 150);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    [heroRef, productsRef, servicesRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [activeCategory]);

  // Lock body scroll when detail view is open
  useEffect(() => {
    if (activeCategory !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset animation states when closing
      setActiveModelIndex(0);
      setAnimState('idle');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCategory]);

  const handleModelChange = (newIndex: number) => {
    if (newIndex === activeModelIndex || animState !== 'idle') return;

    setAnimationDirection(newIndex > activeModelIndex ? 'right' : 'left');
    setAnimState('exiting');

    setTimeout(() => {
      setActiveModelIndex(newIndex);
      setAnimState('entering');

      setTimeout(() => {
        setAnimState('idle');
      }, 50); // Small delay to let browser apply 'entering' layout before animating to 'idle'
    }, 300); // Wait for exit animation to complete
  };

  const currentModels = activeCategory === 'ac' ? acModels : activeCategory === 'dc' ? dcModels : [];
  const activeModel = currentModels[activeModelIndex] || acModels[0];

  // Derive CSS classes based on animation state
  const textClasses = animState === 'idle'
    ? 'opacity-100 transition-opacity duration-300'
    : 'opacity-0 transition-opacity duration-300';


  // Touch & Mouse swipe handlers
  const minSwipeDistance = 50;
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Bulletproof block against Lenis hijacking native scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const preventLenis = (e: Event) => e.stopPropagation();
    el.addEventListener('wheel', preventLenis, { passive: false });
    el.addEventListener('touchmove', preventLenis, { passive: false });
    return () => {
      el.removeEventListener('wheel', preventLenis);
      el.removeEventListener('touchmove', preventLenis);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    touchEndRef.current = null;
    if ('targetTouches' in e) {
      touchStartRef.current = e.targetTouches[0].clientX;
    } else {
      touchStartRef.current = (e as React.MouseEvent).clientX;
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if ('targetTouches' in e) {
      touchEndRef.current = e.targetTouches[0].clientX;
    } else {
      if (e.buttons === 1 && touchStartRef.current !== null) {
        touchEndRef.current = (e as React.MouseEvent).clientX;
      }
    }
  };

  const onTouchEndHandler = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeModelIndex < currentModels.length - 1) {
      handleModelChange(activeModelIndex + 1);
    } else if (isRightSwipe && activeModelIndex > 0) {
      handleModelChange(activeModelIndex - 1);
    }
    
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveCategory(null);
      setActiveModelIndex(0);
      setIsClosing(false);
    }, 500); // wait for fade-out duration
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeCategory !== null) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeCategory]);

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#111111] text-white selection:bg-[#00D384] selection:text-black">

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex w-full min-h-screen flex-col justify-center bg-black overflow-hidden opacity-0 translate-y-10 transition duration-1000 ease-out"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            {/* Mobile / Tablet View Image (< 1024px) */}
            {data?.hero?.mobileImageUrl ? (
              <div className="absolute inset-0 block lg:hidden">
                <Image
                  src={data.hero.mobileImageUrl}
                  alt="Hero Background Mobile"
                  fill
                  className="h-full w-full object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : null}

            {/* Default View Image (Laptops & Desktops >= 1024px, or fallback for all screens if mobile image not set) */}
            <div className={`absolute inset-0 ${data?.hero?.mobileImageUrl ? 'hidden lg:block' : ''}`}>
              {data?.hero?.imageUrl ? (
                <Image src={data.hero.imageUrl} alt="Hero Background" fill className="h-full w-full object-cover" sizes="100vw" priority />
              ) : (
                <Image src={solCharge} alt="Hero Background" className="h-full w-full object-cover" placeholder="blur" priority />
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10"></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-center px-8 md:px-16 py-12 md:py-24 pt-[120px] md:pt-[140px]">
          <h1 className="max-w-4xl text-[clamp(2.5rem,min(4.5vw,6.8vh),4.5rem)] font-bold leading-[1.05] tracking-tight whitespace-pre-line">
            {data?.hero?.title || "Engineered for harsh operating conditions.\nBuilt to deliver every time."}
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-white/90 whitespace-pre-line">
            {data?.hero?.description || "AC chargers for residential and workplace dwell-time charging. DC fast chargers for fleets, depots and highway corridors. Dynamic Load Balancing for intelligent multi-charger site management."}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={scrollToProducts}
              className="bg-[#00D384] text-black px-6 py-3 text-[13px] font-bold tracking-wide rounded-sm cursor-pointer hover:bg-[#00c261] transition-colors flex items-center gap-2"
            >
              <span>{data?.hero?.btnHowItWorks || data?.hero?.btnTalk || "See how it works"}</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section
        ref={productsRef}
        className="flex flex-col justify-center bg-[#111111] pt-16 pb-12 transition duration-1000 ease-out opacity-0 translate-y-10 px-8 md:px-16"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">

            {/* AC Chargers Card (Fully clickable) */}
            <div
              onClick={() => setActiveCategory('ac')}
              className="flex flex-col animate-on-scroll opacity-0 translate-y-10 transition duration-700 ease-out cursor-pointer group max-w-[600px] mx-auto lg:ml-auto lg:mr-0 w-full"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-black border border-white/5">
                {data?.categories?.acCard?.imageUrl ? (
                  <Image src={data.categories.acCard.imageUrl} alt="AC Chargers Module" fill className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <Image src={platformModule} alt="AC Chargers Module" className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105" placeholder="blur" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-10 pointer-events-none w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                  <div className="flex-1">
                    <h2 className="text-[clamp(1.75rem,min(3.0vw,4.5vh),2.5rem)] font-bold tracking-tight whitespace-pre-line">{data?.categories?.acCard?.title || "AC Chargers"}</h2>
                    <div className="mt-4 text-[11px] text-white/80 space-y-2 whitespace-pre-line">
                      {data?.categories?.acCard?.subtitles ? (
                        <p>{data.categories.acCard.subtitles}</p>
                      ) : (
                        <>
                          <p>3.3 · 7.4 · 11 · 22 kW</p>
                          <p>Bidirectional Distributed Dispenser Systems</p>
                        </>
                      )}
                      <div className="flex items-center gap-2 text-white font-medium pt-2">
                        {data?.categories?.acCard?.btnText || "Explore Range"} <span className="font-light">→</span>
                      </div>
                    </div>
                  </div>
                  {data?.categories?.acCard?.brochureUrl && (
                    <a
                      href={data.categories.acCard.brochureUrl}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="pointer-events-auto bg-[#00D384] text-black px-5 py-3 text-[11px] md:text-[12px] font-bold rounded-sm hover:bg-[#00c261] transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      {data?.categories?.acCard?.downloadBtnText || "Download AC Chargers Brochure"}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* DC Fast Chargers Card (Fully clickable) */}
            <div
              onClick={() => setActiveCategory('dc')}
              className="flex flex-col animate-on-scroll opacity-0 translate-y-10 transition duration-700 ease-out cursor-pointer group max-w-[600px] mx-auto lg:mr-auto lg:ml-0 w-full"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-black border border-white/5">
                {data?.categories?.dcCard?.imageUrl ? (
                  <Image src={data.categories.dcCard.imageUrl} alt="DC Fast Chargers Module" fill className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <Image src={platformModule} alt="DC Fast Chargers Module" className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-85 group-hover:scale-105" placeholder="blur" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-10 pointer-events-none w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                  <div className="flex-1">
                    <h2 className="text-[clamp(1.75rem,min(3.0vw,4.5vh),2.5rem)] font-bold tracking-tight leading-[1.1] whitespace-pre-line">
                      {data?.categories?.dcCard?.title || "DC Fast\nChargers"}
                    </h2>
                    <div className="mt-4 text-[11px] text-white/80 space-y-2 whitespace-pre-line">
                      {data?.categories?.dcCard?.subtitles ? (
                        <p>{data.categories.dcCard.subtitles}</p>
                      ) : (
                        <>
                          <p>30 · 60 · 120 · 180 · 240 · 360 kW</p>
                          <p>Bidirectional Distributed Dispenser Systems</p>
                        </>
                      )}
                      <div className="flex items-center gap-2 text-white font-medium pt-2">
                        {data?.categories?.dcCard?.btnText || "Explore Range"} <span className="font-light">→</span>
                      </div>
                    </div>
                  </div>
                  {data?.categories?.dcCard?.brochureUrl && (
                    <a
                      href={data.categories.dcCard.brochureUrl}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="pointer-events-auto bg-[#00D384] text-black px-5 py-3 text-[11px] md:text-[12px] font-bold rounded-sm hover:bg-[#00c261] transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      {data?.categories?.dcCard?.downloadBtnText || "Download DC Chargers Brochure"}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Detail View Overlay */}
      {activeCategory !== null && (
        <div className={`fixed inset-0 z-50 flex flex-col pointer-events-auto bg-transparent ${isClosing ? 'animate-out fade-out duration-500' : 'animate-in fade-in duration-500'
          }`}>
          {/* Spacer to push content below Navbar */}
          <div className="h-[99px] flex-shrink-0 bg-transparent cursor-pointer" onClick={handleClose}></div>

          {/* Scrollable Modal Content */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 min-h-0 bg-white text-black overflow-y-auto lg:overflow-hidden relative overscroll-contain"
            style={{ touchAction: 'pan-y' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
            onMouseDown={onTouchStart}
            onMouseMove={onTouchMove}
            onMouseUp={onTouchEndHandler}
            onMouseLeave={onTouchEndHandler}
            data-lenis-prevent="true"
          >
            <div className="flex flex-col min-h-full lg:h-full">
              {/* Top Header & Navigation */}
              <div className="flex items-center justify-between px-4 py-4 md:px-10 lg:py-4 2xl:py-[4vh] border-b border-black/10 flex-shrink-0 relative">

                {/* --- DESKTOP VIEW --- */}
                <button
                  onClick={() => handleModelChange(Math.max(0, activeModelIndex - 1))}
                  className="hidden lg:block text-black/50 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={activeModelIndex === 0}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div className="hidden lg:flex gap-3 xl:gap-10 text-[10px] lg:text-[11px] font-bold tracking-wide overflow-x-auto scrollbar-hide px-2 lg:px-4 mx-auto">
                  {currentModels.map((model: any, idx: number) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(idx)}
                      className={`px-4 py-2 lg:px-5 lg:py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${activeModelIndex === idx
                        ? 'bg-[#00D384] text-white shadow-sm scale-105'
                        : 'text-black/40 hover:text-black'
                        }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>

                <div className="hidden lg:flex items-center gap-4 xl:gap-10">
                  <button
                    onClick={() => handleModelChange(Math.min(currentModels.length - 1, activeModelIndex + 1))}
                    className="text-black/50 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={activeModelIndex === currentModels.length - 1}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                  <button onClick={handleClose} className="text-black/40 hover:text-black transition-colors p-2 -mr-2 cursor-pointer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 md:w-7 md:h-7"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* --- MOBILE VIEW --- */}
                <div className="lg:hidden flex items-center justify-center gap-8 absolute inset-x-0 pointer-events-none z-0">
                  <button
                    onClick={() => handleModelChange(Math.max(0, activeModelIndex - 1))}
                    className="pointer-events-auto text-black/50 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={activeModelIndex === 0}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <div className={`pointer-events-auto bg-[#00D384] text-white px-5 py-2 rounded-full text-[12px] font-bold tracking-wide shadow-sm text-center ${textClasses}`}>
                    {activeModel?.name}
                  </div>
                  <button
                    onClick={() => handleModelChange(Math.min(currentModels.length - 1, activeModelIndex + 1))}
                    className="pointer-events-auto text-black/50 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={activeModelIndex === currentModels.length - 1}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
                <button onClick={handleClose} className="lg:hidden ml-auto relative z-10 text-black/40 hover:text-black transition-colors p-2 -mr-2 cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col lg:flex-row relative lg:min-h-0 lg:overflow-hidden">
                {/* Left Text */}
                <div className={`order-2 lg:order-1 w-full lg:w-[45%] p-4 sm:p-6 pt-0 lg:p-6 2xl:p-[clamp(1.5rem,6vh,4rem)] lg:pt-4 flex flex-col justify-center z-10 lg:overflow-y-auto scrollbar-hide ${textClasses}`}>
                  <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.5rem] 2xl:text-[clamp(2.5rem,min(4vw,7vh),4rem)] font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-6 2xl:mb-[clamp(1.5rem,4vh,2.5rem)] tracking-tight">
                    Model {activeModel?.name}
                  </h2>
                  <div className="text-[1rem] sm:text-[1.1rem] md:text-[1.25rem] lg:text-[1.15rem] 2xl:text-[clamp(1.15rem,min(1.5vw,3vh),1.75rem)] font-bold leading-[1.3] tracking-tight text-black flex flex-col gap-4 sm:gap-5 md:gap-8 lg:gap-4 2xl:gap-[clamp(1rem,3vh,2rem)]">
                    <div>
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] uppercase tracking-widest text-black/40 block mb-1 md:mb-2">Form Factor</span>
                      {activeModel?.formFactor}
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] uppercase tracking-widest text-black/40 block mb-1 md:mb-2">Key Use Case</span>
                      {activeModel?.useCase}
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] uppercase tracking-widest text-black/40 block mb-1 md:mb-2">Notable Spec</span>
                      {activeModel?.spec}
                    </div>
                  </div>
                </div>

                <div className={`order-1 lg:order-2 w-full lg:w-[55%] relative flex items-center justify-center lg:justify-start py-4 sm:py-8 md:py-12 lg:py-4 2xl:py-[4vh] px-4 sm:px-6 lg:pl-0 lg:h-full`}>
                  <div className={`w-[140px] sm:w-[200px] md:w-[260px] lg:w-full lg:h-full flex-shrink-0 lg:flex-shrink relative z-10 ${textClasses}`}>
                    <Image src={activeModel?.imageUrl || "/images/ChargerDemo.png"} alt={`Model ${activeModel?.name}`} width={480} height={900} className="w-full h-auto lg:h-full lg:w-auto lg:max-w-full object-contain object-center lg:object-left" />
                  </div>
                  <div className="absolute bottom-2 right-4 lg:bottom-4 lg:right-8 text-[9px] md:text-[10px] text-black/40 pointer-events-none z-20">
                    {activeCategory === 'ac' ? (data?.categories?.acCard?.imageDisclaimer || "The image is for illustrative purposes only.") : (data?.categories?.dcCard?.imageDisclaimer || "The image is for illustrative purposes only.")}
                  </div>
                </div>
              </div>

              {/* Bottom Green Bar */}
              <div className="w-full flex-shrink-0 bg-[#00D384] py-4 sm:py-6 px-4 sm:px-6 lg:py-4 2xl:py-[3.5vh] lg:px-10 text-white font-bold text-[1.25rem] sm:text-[1.5rem] lg:text-[1.25rem] 2xl:text-[clamp(1.25rem,min(1.5vw,3.5vh),1.75rem)] tracking-tight">
                {activeCategory === 'ac' ? (data?.categories?.acCard?.title || 'AC Chargers') : (data?.categories?.dcCard?.title || 'DC Fast Chargers')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Everything After Delivery (Services Grid) */}
      <section
        ref={servicesRef}
        className="flex flex-col justify-center bg-[#111111] pb-24 pt-8 opacity-0 translate-y-10 transition duration-1000 ease-out px-8 md:px-16"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <h2 className="text-[clamp(1.5rem,min(2.5vw,3.8vh),2rem)] font-bold tracking-tight text-white mb-12">
            {data?.servicesSection?.heading || "Everything after delivery."}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll opacity-0 translate-y-10 transition duration-700 ease-out">
            {(data?.servicesSection?.services || [
              {
                title: 'Pan-India Service Support',
                description: 'Nationwide coverage with local technical expertise and spares.',
                badge: null,
              },
              {
                title: 'Turnkey EPC Implementation',
                description: 'End-to-end project execution — civil, electrical, installation, commissioning.',
                badge: null,
              },
              {
                title: 'Warranty Operations',
                description: 'Multi-year warranty with defined uptime commitment.',
                badge: 'Up to 98% uptime',
              },
              {
                title: 'End of Life Management',
                description: 'Responsible decommissioning, component recovery and recycling programme.',
                badge: null,
              }
            ]).map((service: any, i: number) => (
              <div
                key={i}
                className="bg-[#EAEAEA] p-10 flex flex-col h-full min-h-[300px]"
              >
                <h3 className="text-[14px] md:text-[15px] font-bold text-black leading-tight">{service.title}</h3>
                <p className="mt-4 text-[12px] md:text-[13px] text-black/60 leading-relaxed">
                  {service.description}
                </p>
                {service.badge && (
                  <div className="mt-auto pt-6">
                    <span className="inline-block bg-[#00D384]/20 text-[#00a854] text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-sm">
                      {service.badge}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
