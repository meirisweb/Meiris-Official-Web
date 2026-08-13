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

  // The speed of the auto-scroll in pixels per second.
  // Reduced to 300 for a slower, more cinematic scroll experience.
  const SCROLL_SPEED_PER_SECOND = 300;

  // Track if we should show the button based on scroll position
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (!isAutoScrolling) {
      if (lenis) {
        // Stop the auto-scroll immediately
        lenis.scrollTo(lenis.scroll, { immediate: true });
      }
      return;
    }

    if (lenis) {
      // Calculate remaining distance and required duration for constant speed
      const remainingDistance = lenis.limit - lenis.scroll;
      if (remainingDistance <= 0) {
        setIsAutoScrolling(false);
        return;
      }
      const durationSeconds = remainingDistance / SCROLL_SPEED_PER_SECOND;
      
      // Let Lenis handle the perfectly smooth animation internally
      lenis.scrollTo(lenis.limit, {
        duration: durationSeconds,
        easing: (t: number) => t, // Linear easing for constant speed
      });
    }

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
      if (lenis && isAutoScrolling) {
        lenis.scrollTo(lenis.scroll, { immediate: true });
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
