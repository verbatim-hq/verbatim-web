"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  /** When true, each direct child staggers in with ~80ms between them. */
  stagger?: boolean;
}

export function FadeIn({ children, delay = 0, stagger = false }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          const reveal = () => el.classList.add("is-visible");
          if (delay > 0) {
            setTimeout(reveal, delay);
          } else {
            reveal();
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={stagger ? "fade-in-stagger" : "fade-in-section"}
    >
      {children}
    </div>
  );
}
