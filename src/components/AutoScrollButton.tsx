"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { useLenis } from "lenis/react";

import { usePathname } from "next/navigation";

export default function AutoScrollButton() {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lenis = useLenis();
  const pathname = usePathname();

  // The speed of the auto-scroll in pixels per frame.
  const SCROLL_SPEED = 17;

  // Track if we should show the button based on scroll position
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    // If not auto-scrolling, clear any active RAF
    if (!isAutoScrolling) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    // The loop that performs the scrolling
    const scrollStep = () => {
      if (lenis) {
        // If we reach the bottom, stop
        if (lenis.scroll >= lenis.limit) {
          setIsAutoScrolling(false);
          return;
        }
        // Scroll down by SCROLL_SPEED pixels immediately without animation easing
        lenis.scrollTo(lenis.scroll + SCROLL_SPEED, { immediate: true });
      } else {
        // Fallback if Lenis isn't ready
        window.scrollBy(0, SCROLL_SPEED);
      }
      rafRef.current = requestAnimationFrame(scrollStep);
    };

    // Start loop
    rafRef.current = requestAnimationFrame(scrollStep);

    // Event listeners to detect manual interaction and abort auto-scroll
    const handleInterrupt = (e: Event) => {
      // If we are auto-scrolling, stop it.
      if (isAutoScrolling) {
        setIsAutoScrolling(false);
      }
    };

    // Listen for wheel, touch, and mousedown (but avoid stopping if they just clicked the button itself)
    const handleDocumentInterrupt = (e: Event) => {
      // Don't interrupt if clicking the auto-scroll button itself
      const target = e.target as HTMLElement;
      if (target.closest('.auto-scroll-btn')) {
        return;
      }
      handleInterrupt(e);
    };

    window.addEventListener("wheel", handleDocumentInterrupt, { passive: true });
    window.addEventListener("touchstart", handleDocumentInterrupt, { passive: true });
    window.addEventListener("mousedown", handleDocumentInterrupt, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("wheel", handleDocumentInterrupt);
      window.removeEventListener("touchstart", handleDocumentInterrupt);
      window.removeEventListener("mousedown", handleDocumentInterrupt);
    };
  }, [isAutoScrolling, lenis]);

  // Use Lenis scroll event to fade out the button after scrolling past the first section
  useLenis((scrollInstance) => {
    if (scrollInstance.scroll > (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 500)) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  });

  // Only render on the platform page
  if (!pathname?.includes('/platform')) {
    return null;
  }

  return (
    <button
      onClick={() => setIsAutoScrolling(!isAutoScrolling)}
      className={`auto-scroll-btn fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] hidden md:flex items-center justify-center bg-transparent text-white border-[1px] border-white/55 font-bold text-[10px] px-[20px] py-[10px] uppercase tracking-[1.5px] rounded-[3px] cursor-pointer transition-all duration-500 hover:border-white hover:bg-white/10 hover:-translate-y-1 ${!showButton ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-label={isAutoScrolling ? "PAUSE SCROLL" : "AUTO SCROLL"}
    >
      {isAutoScrolling ? "PAUSE SCROLL" : "AUTO SCROLL"}
    </button>
  );
}
