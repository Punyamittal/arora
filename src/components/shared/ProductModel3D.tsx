"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { clearModelCache, prefetchModel } from "@/lib/gltfLoader";
import { MODEL_PATHS } from "@/lib/modelPaths";
import type { ProductModel3DProps } from "./AroraCanModel";
import { ModelErrorBoundary } from "./ModelErrorBoundary";
import { ModelPlaceholder } from "./ModelPlaceholder";

const AroraCanModel = dynamic(
  () => import("./AroraCanModel").then((mod) => mod.ProductModel3D),
  {
    ssr: false,
    loading: () => <ModelPlaceholder />,
  }
);

const sizeMap = {
  sm: "h-52 w-36 sm:h-60 sm:w-44",
  md: "h-56 w-40 sm:h-64 sm:w-48 md:h-72 md:w-52",
  lg: "h-64 w-44 sm:h-80 sm:w-56 md:h-96 md:w-72",
  xl: "h-[min(20rem,52vh)] w-[min(14rem,72vw)] sm:h-[26rem] sm:w-72 md:h-[30rem] md:w-80",
  "2xl":
    "h-[min(24rem,58vh)] w-full max-w-[18rem] sm:h-[32rem] sm:max-w-[24rem] md:h-[38rem] md:max-w-[28rem]",
};

export function ProductModel3D({
  modelPath,
  className,
  size = "lg",
  ...props
}: ProductModel3DProps) {
  const resolvedPath = modelPath ?? MODEL_PATHS.arora;
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const containerClass = cn(
    "relative mx-auto max-w-full shrink-0",
    sizeMap[size],
    className
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    prefetchModel(resolvedPath)
      .then(() => {
        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedPath, attempt]);

  const retry = useCallback(() => {
    clearModelCache(resolvedPath);
    setAttempt((value) => value + 1);
  }, [resolvedPath]);

  if (status === "loading") {
    return <ModelPlaceholder className={containerClass} />;
  }

  if (status === "error") {
    return (
      <button
        type="button"
        onClick={retry}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-[2rem] border border-leaf/20 bg-lemon/10 px-4 text-center text-sm text-muted-foreground transition-colors hover:bg-lemon/15",
          containerClass
        )}
      >
        <span>3D preview unavailable</span>
        <span className="font-medium text-leaf">Tap to retry</span>
      </button>
    );
  }

  return (
    <ModelErrorBoundary modelPath={resolvedPath} className={containerClass}>
      <AroraCanModel
        {...props}
        modelPath={resolvedPath}
        size={size}
        className="absolute inset-0 h-full w-full"
      />
    </ModelErrorBoundary>
  );
}
