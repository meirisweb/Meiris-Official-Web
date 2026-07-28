"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: boolean;
}

export default function ScrollReveal({ children, className = "", delay = 0, staggerChildren = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (ref.current) {
                ref.current.classList.remove("opacity-0", "translate-y-10");
                ref.current.classList.add("opacity-100", "translate-y-0");
                
                if (staggerChildren) {
                  const childrenNodes = ref.current.querySelectorAll('.animate-on-scroll');
                  childrenNodes.forEach((child, i) => {
                    setTimeout(() => {
                      child.classList.remove("opacity-0", "translate-y-10");
                      child.classList.add("opacity-100", "translate-y-0");
                    }, 150 + i * 150);
                  });
                }
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay, staggerChildren]);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-10 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
