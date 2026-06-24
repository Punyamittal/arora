"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { smoothEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SiteLoaderProps {
  className?: string;
  progress?: number;
}

const statusSteps = [
  { threshold: 100, text: "Welcome!" },
  { threshold: 88, text: "Final touches…" },
  { threshold: 70, text: "Polishing visuals…" },
  { threshold: 45, text: "Loading 3D models…" },
  { threshold: 20, text: "Loading assets…" },
  { threshold: 0, text: "Starting up…" },
];

function getStatus(progress: number) {
  return statusSteps.find((step) => progress >= step.threshold)?.text ?? "Loading…";
}

export function SiteLoader({ className, progress = 0 }: SiteLoaderProps) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  const status = getStatus(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: smoothEase }}
      className={cn("flex w-full max-w-xl flex-col items-center px-6", className)}
      aria-label={`Loading website, ${pct} percent`}
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.05, ease: smoothEase }}
      >
        <Image
          src="/logo.png"
          alt="Arora Lemon"
          width={480}
          height={172}
          className="h-40 w-auto sm:h-48 md:h-56"
          priority
        />
      </motion.div>

      <div className="mt-10 w-full">
        <div className="flex items-baseline justify-center gap-0.5">
          <motion.span
            key={pct}
            initial={{ opacity: 0.6, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: smoothEase }}
            className="font-heading text-6xl font-bold tabular-nums tracking-tight text-[#1a1a1a] sm:text-7xl"
          >
            {pct}
          </motion.span>
          <span className="pb-1 text-2xl font-semibold text-muted-foreground">%</span>
        </div>

        <div className="relative mt-7 h-3 overflow-hidden rounded-full bg-leaf/10 shadow-inner">
          <motion.div
            className="loader-progress-fill relative h-full rounded-full bg-gradient-to-r from-lemon via-lime to-leaf shadow-[0_0_20px_rgba(247,213,71,0.45)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.45, ease: smoothEase }}
          />
        </div>

        <motion.p
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: smoothEase }}
          className="mt-5 text-center text-sm font-medium tracking-wide text-muted-foreground"
        >
          {status}
        </motion.p>
      </div>
    </motion.div>
  );
}
