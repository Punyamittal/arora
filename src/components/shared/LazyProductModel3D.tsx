"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ProductModel3D } from "@/components/shared/ProductModel3D";
import { ModelPlaceholder } from "@/components/shared/ModelPlaceholder";
import type { ProductModel3DProps } from "@/components/shared/AroraCanModel";
import { cn } from "@/lib/utils";

export function LazyProductModel3D({
  className,
  ...props
}: ProductModel3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "120px 0px" });

  return (
    <div ref={ref} className={cn("relative mx-auto max-w-full", className)}>
      {inView ? (
        <ProductModel3D {...props} className="h-full w-full" />
      ) : (
        <ModelPlaceholder className="min-h-[inherit]" />
      )}
    </div>
  );
}
