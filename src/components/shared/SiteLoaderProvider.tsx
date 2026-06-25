"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { warmModel } from "@/lib/gltfLoader";
import { CRITICAL_MODEL_PATHS } from "@/lib/modelPaths";
import { SiteLoader } from "./SiteLoader";

/** Never block the splash longer than this — page renders underneath immediately. */
const MAX_SPLASH_MS = 4_500;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SiteLoaderProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    void Promise.allSettled(CRITICAL_MODEL_PATHS.map((path) => warmModel(path)));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setProgress(35);
      await wait(MAX_SPLASH_MS / 2);
      if (cancelled) return;

      setProgress(72);
      await wait(MAX_SPLASH_MS / 2);
      if (cancelled) return;

      setProgress(100);
      setReady(true);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <>
      {children}

      {!hideOverlay && (
        <div
          className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center hero-gradient transition-opacity duration-300 ease-out",
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          onTransitionEnd={() => {
            if (ready) setHideOverlay(true);
          }}
        >
          <SiteLoader progress={progress} />
        </div>
      )}
    </>
  );
}
