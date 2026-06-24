"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { revealTransition, smoothEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    up: { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 36 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ ...revealTransition, delay, ease: smoothEase }}
      className={cn("gpu-smooth", className)}
    >
      {children}
    </motion.div>
  );
}
