"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
}

export function TiltCard({ children }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        const glare = glareRef.current;
        if (!card || !glare) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotateX = ((y - cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
        card.style.boxShadow =
          "0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)";

        const gx = (x / rect.width) * 100;
        const gy = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.07) 0%, transparent 55%)`;
        glare.style.opacity = "1";
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    card.style.boxShadow =
      "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px var(--border)";
    glare.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        padding: "36px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px var(--border)",
        transition:
          "transform 0.45s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.35s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Glare overlay */}
      <div
        ref={glareRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: "inherit",
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
