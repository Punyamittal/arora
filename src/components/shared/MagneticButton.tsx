"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "white" | "green";
  onClick?: () => void;
  type?: "button" | "submit";
}

const variantStyles = {
  primary:
    "bg-lemon text-[#1a1a1a] hover:shadow-[0_8px_40px_rgba(247,213,71,0.5)] border-transparent",
  outline:
    "bg-transparent border-2 border-[#1a1a1a]/15 text-[#1a1a1a] hover:border-leaf hover:shadow-[0_8px_30px_rgba(76,175,80,0.2)]",
  white:
    "bg-white text-[#1a1a1a] hover:shadow-[0_8px_40px_rgba(255,255,255,0.4)] border-transparent",
  green:
    "bg-leaf text-white hover:shadow-[0_8px_40px_rgba(76,175,80,0.45)] border-transparent",
};

export function MagneticButton({
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-shadow duration-300",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
