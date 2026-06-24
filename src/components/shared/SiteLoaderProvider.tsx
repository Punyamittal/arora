"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { preloadGltfModel, waitForGltfModel } from "@/lib/gltfLoader";
import { MODEL_PATHS } from "@/lib/modelPaths";
import { SiteLoader } from "./SiteLoader";

/** Never block the splash longer than this — page renders underneath immediately. */
const MAX_SPLASH_MS = 4_500;

type ModelAssetsContextValue = {
  aroraReady: boolean;
  mintReady: boolean;
};

const ModelAssetsContext = createContext<ModelAssetsContextValue>({
  aroraReady: false,
  mintReady: false,
});

export function useModelAssets() {
  return useContext(ModelAssetsContext);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SiteLoaderProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [progress, setProgress] = useState(8);
  const [aroraReady, setAroraReady] = useState(false);
  const [mintReady, setMintReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setProgress(15);

      const modelsTask = (async () => {
        preloadGltfModel(MODEL_PATHS.arora);
        const aroraOk = await waitForGltfModel(MODEL_PATHS.arora);
        if (cancelled) return;
        setAroraReady(aroraOk);
        setProgress(aroraOk ? 72 : 65);

        preloadGltfModel(MODEL_PATHS.mint2);
        const mintOk = await waitForGltfModel(MODEL_PATHS.mint2);
        if (cancelled) return;
        setMintReady(mintOk);
        setProgress(mintOk ? 90 : 84);
      })();

      await Promise.race([modelsTask, wait(MAX_SPLASH_MS)]);

      if (cancelled) return;

      setProgress(100);
      setReady(true);

      preloadGltfModel(MODEL_PATHS.lemon);
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
    <ModelAssetsContext.Provider value={{ aroraReady, mintReady }}>
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
    </ModelAssetsContext.Provider>
  );
}
