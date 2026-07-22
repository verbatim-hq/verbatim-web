"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: boolean;
  duration?: number;
}

export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  format = false,
  duration = 1200,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();

          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  const displayValue = format ? count.toLocaleString() : count;

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
