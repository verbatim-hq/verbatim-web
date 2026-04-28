"use client";

import { motion } from "framer-motion";

export function VerbatimPulse({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="h-[3px] w-full overflow-hidden bg-transparent">
        <motion.div
          className="h-full w-1/3 bg-[var(--color-blue)]"
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "300%"] }}
          transition={{
            duration: 1.2,
            ease: [0.2, 0.8, 0.2, 1],
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>
    </div>
  );
}

