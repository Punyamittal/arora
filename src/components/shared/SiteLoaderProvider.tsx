"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import { peek } from "suspend-react";
import { cn } from "@/lib/utils";
import { gltfLoaderOptions } from "@/lib/gltfLoader";
import { SiteLoader } from "./SiteLoader";

const ARORA_MODEL_PATH = "/models/arora.glb";
const LEMON_MODEL_PATH = "/models/lemon.glb";
const MINT2_MODEL_PATH = "/models/mint2.glb";

function waitForWindowLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }

    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForGLTF(path: string, timeout = 120_000): Promise<boolean> {
  useGLTF.preload(
    path,
    gltfLoaderOptions.useDraco,
    gltfLoaderOptions.useMeshopt,
    gltfLoaderOptions.extendLoader
  );

  return new Promise((resolve) => {
    const start = Date.now();

    const check = () => {
      if (peek([GLTFLoader, path])) {
        resolve(true);
        return;
      }

      if (Date.now() - start > timeout) {
        console.error(`Timed out preloading ${path}`);
        resolve(false);
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SiteLoaderProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setProgress(5);
      await waitForWindowLoad();
      if (cancelled) return;

      setProgress(20);

      const aroraReady = await waitForGLTF(ARORA_MODEL_PATH);
      if (cancelled) return;
      setProgress(aroraReady ? 45 : 40);

      const lemonReady = await waitForGLTF(LEMON_MODEL_PATH);
      if (cancelled) return;
      setProgress(lemonReady ? 70 : 65);

      const mintReady = await waitForGLTF(MINT2_MODEL_PATH);
      if (cancelled) return;
      setProgress(mintReady ? 88 : 82);

      await import("@/components/shared/AroraCanModel");
      if (cancelled) return;

      setProgress(100);
      await wait(500);

      if (!cancelled) {
        const modelsReady = aroraReady && lemonReady && mintReady;
        if (!modelsReady) {
          console.warn("Some 3D models failed to preload; the page will still render.");
        }
        setReady(true);
      }
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
      {!hideOverlay && (
        <div
          className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center hero-gradient transition-opacity duration-700 ease-out",
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          onTransitionEnd={() => {
            if (ready) setHideOverlay(true);
          }}
        >
          <SiteLoader progress={progress} />
        </div>
      )}

      {ready ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </>
  );
}
