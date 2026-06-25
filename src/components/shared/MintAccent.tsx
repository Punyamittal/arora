"use client";

import { useEffect, useState } from "react";
import { ProductModel3D } from "@/components/shared/ProductModel3D";
import { cn } from "@/lib/utils";

const DEFAULT_MINT_MODEL_PATH = "/models/mint2.glb";
const MINT_LOAD_DELAY_MS = 1_500;

interface MintAccentProps {
  seed: string;
  className?: string;
  size?: "sm" | "md";
  scale?: number;
  modelPath?: string;
}

export function MintAccent({
  className,
  size = "sm",
  scale = 2.4,
  modelPath = DEFAULT_MINT_MODEL_PATH,
}: MintAccentProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), MINT_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute z-0", className)}
    >
      <ProductModel3D
        modelPath={modelPath}
        size={size}
        scale={scale}
        autoRotate
        rotateSpeed={0.55}
        motionIntensity={1.5}
        cameraDistance={3.6}
        className="h-20 w-16 sm:h-24 sm:w-20 md:h-28 md:w-24"
      />
    </div>
  );
}
