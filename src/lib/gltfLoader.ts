"use client";

import { Texture } from "three";
import { useGLTF } from "@react-three/drei";
import type { GLTFLoader as GLTFLoaderType, GLTFLoaderPlugin } from "three-stdlib";

type GltfImageDef = {
  bufferView?: number;
  mimeType?: string;
  uri?: string;
};

type GltfParser = {
  json: { images: GltfImageDef[] };
  sourceCache: Record<number, Promise<Texture>>;
  getDependency: (type: string, index: number) => Promise<ArrayBuffer>;
  loadImageSource: (sourceIndex: number, loader: unknown) => Promise<Texture>;
};

type GltfLoadResult = Parameters<NonNullable<GLTFLoaderType["load"]>>[1] extends (
  result: infer R
) => void
  ? R
  : unknown;

const EMBEDDED_IMAGE_PLUGIN_NAME = "ARORA_embedded_image_fix";
const MAX_FETCH_RETRIES = 3;
const inFlightBuffers = new Map<string, Promise<ArrayBuffer>>();

export function resolveModelUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (typeof window === "undefined") {
    return path;
  }
  return new URL(path, window.location.origin).href;
}

async function fetchModelBuffer(url: string): Promise<ArrayBuffer> {
  const absoluteUrl = resolveModelUrl(url);
  const existing = inFlightBuffers.get(absoluteUrl);
  if (existing) return existing;

  const task = (async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_FETCH_RETRIES; attempt++) {
      try {
        const response = await fetch(absoluteUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for ${absoluteUrl}`);
        }
        return await response.arrayBuffer();
      } catch (error) {
        lastError = error;
        if (attempt < MAX_FETCH_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        }
      }
    }

    throw lastError ?? new Error(`Failed to fetch ${absoluteUrl}`);
  })().finally(() => {
    inFlightBuffers.delete(absoluteUrl);
  });

  inFlightBuffers.set(absoluteUrl, task);
  return task;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function loadEmbeddedImage(
  bufferView: ArrayBuffer,
  mimeType: string
): Promise<Texture> {
  const blob = new Blob([bufferView], { type: mimeType });

  if (typeof createImageBitmap !== "undefined") {
    try {
      const bitmap = await createImageBitmap(blob);
      const texture = new Texture(bitmap);
      texture.needsUpdate = true;
      return texture;
    } catch {
      // Fall back to data URL when bitmap decode fails (large embedded PNGs).
    }
  }

  const dataUrl = await blobToDataURL(blob);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const texture = new Texture(image);
  texture.needsUpdate = true;
  return texture;
}

function patchEmbeddedImageLoading(parser: GltfParser) {
  const originalLoadImageSource = parser.loadImageSource.bind(parser);

  parser.loadImageSource = (sourceIndex, loader) => {
    const sourceDef = parser.json.images[sourceIndex];

    if (sourceDef.bufferView === undefined) {
      return originalLoadImageSource(sourceIndex, loader);
    }

    if (parser.sourceCache[sourceIndex] !== undefined) {
      return parser.sourceCache[sourceIndex].then((texture) => texture.clone());
    }

    const promise = parser
      .getDependency("bufferView", sourceDef.bufferView)
      .then((bufferView) =>
        loadEmbeddedImage(bufferView, sourceDef.mimeType ?? "image/png")
      );

    parser.sourceCache[sourceIndex] = promise;
    return promise;
  };
}

function toLoadError(error: unknown): ErrorEvent {
  const message = error instanceof Error ? error.message : String(error);
  return new ErrorEvent("error", { message });
}

function patchReliableGlbLoading(loader: GLTFLoaderType) {
  const originalLoad = loader.load.bind(loader);

  loader.load = ((
    url: string,
    onLoad?: (result: GltfLoadResult) => void,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (event: ErrorEvent) => void
  ) => {
    if (typeof url !== "string" || !url.toLowerCase().includes(".glb")) {
      return originalLoad(
        url,
        onLoad ?? (() => {}),
        onProgress,
        onError
      );
    }

    void fetchModelBuffer(url)
      .then((buffer) => {
        loader.parse(
          buffer,
          resolveModelUrl(url),
          (gltf) => onLoad?.(gltf),
          (error) => onError?.(toLoadError(error))
        );
      })
      .catch((error) => onError?.(toLoadError(error)));
  }) as typeof loader.load;
}

let configuredLoaders: WeakSet<GLTFLoaderType> | null = null;

/** Reliable embedded-texture + fetch loading for large GLB files. */
export function configureProductGltfLoader(loader: GLTFLoaderType) {
  configuredLoaders ??= new WeakSet();
  if (configuredLoaders.has(loader)) return;
  configuredLoaders.add(loader);

  patchReliableGlbLoading(loader);

  loader.register((parser) => {
    patchEmbeddedImageLoading(parser as unknown as GltfParser);

    return {
      name: EMBEDDED_IMAGE_PLUGIN_NAME,
    } as GLTFLoaderPlugin & { name: string };
  });
}

export const gltfLoaderOptions = {
  useDraco: false as const,
  useMeshopt: false as const,
  extendLoader: configureProductGltfLoader,
};

export function preloadGltfModel(path: string) {
  useGLTF.preload(
    path,
    gltfLoaderOptions.useDraco,
    gltfLoaderOptions.useMeshopt,
    gltfLoaderOptions.extendLoader
  );
}
