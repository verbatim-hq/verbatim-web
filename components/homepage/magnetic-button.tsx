"use client";

import { useRef, useCallback, type ReactNode, type CSSProperties } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href: string;
  style?: CSSProperties;
  className?: string;
  subcaption?: string;
}

export function MagneticButton({
  children,
  href,
  style,
  className,
  subcaption,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const shiftX = (x / (rect.width / 2)) * 4;
      const shiftY = (y / (rect.height / 2)) * 4;
      el.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.02)`;
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px) scale(1)";
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <a
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          transition:
            "transform 0.3s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.2s ease",
          ...style,
        }}
      >
        {children}
      </a>
      {subcaption && (
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-faint)",
            letterSpacing: "0.01em",
          }}
        >
          {subcaption}
        </span>
      )}
    </div>
  );
}
