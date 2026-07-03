"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add("revealed");
          }, delay);
          observer.unobserve(element);
        }
      },
      { threshold: 0.05, rootMargin: "50px" }
    );
    observer.observe(element);

    // Fallback: ensure content is visible even if the observer never fires
    const fallback = setTimeout(() => {
      element.classList.add("revealed");
    }, 3000 + delay);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}
