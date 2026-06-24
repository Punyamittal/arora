"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  rotate?: number;
}

export function FloatingElement({
  children,
  className,
  delay = 0,
  duration = 4,
  y = 12,
  x = 0,
  rotate = 3,
}: FloatingElementProps) {
  return (
    <motion.div
      className={cn("pointer-events-none select-none", className)}
      animate={{
        y: [-y / 2, y / 2, -y / 2],
        x: x ? [-x / 2, x / 2, -x / 2] : 0,
        rotate: [-rotate / 2, rotate / 2, -rotate / 2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
