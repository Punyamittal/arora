"use client";

import { Texture, type Object3D } from "three";
import { GLTFLoader, type GLTFLoader as GLTFLoaderType, type GLTFLoaderPlugin } from "three-stdlib";

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
const LARGE_FILE_TIMEOUT_MS = 180_000;
const inFlightBuffers = new Map<string, Promise<ArrayBuffer>>();
const loadedBuffers = new Map<string, ArrayBuffer>();
const loadedScenes = new Map<string, Promise<Object3D>>();

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
  const cached = loadedBuffers.get(absoluteUrl);
  if (cached) return cached;

  const existing = inFlightBuffers.get(absoluteUrl);
  if (existing) return existing;

  const task = (async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_FETCH_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(
        () => controller.abort(),
        LARGE_FILE_TIMEOUT_MS
      );

      try {
        const response = await fetch(absoluteUrl, {
          cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for ${absoluteUrl}`);
        }

        const buffer = await response.arrayBuffer();
        if (buffer.byteLength === 0) {
          throw new Error(`Empty response for ${absoluteUrl}`);
        }

        loadedBuffers.set(absoluteUrl, buffer);
        return buffer;
      } catch (error) {
        lastError = error;
        if (attempt < MAX_FETCH_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    throw lastError ?? new Error(`Failed to fetch ${absoluteUrl}`);
  })().finally(() => {
    inFlightBuffers.delete(absoluteUrl);
  });

  inFlightBuffers.set(absoluteUrl, task);
  return task;
}

export function prefetchModel(path: string): Promise<ArrayBuffer> {
  return fetchModelBuffer(path);
}

export function clearModelCache(path?: string) {
  if (!path) {
    loadedBuffers.clear();
    inFlightBuffers.clear();
    loadedScenes.clear();
    return;
  }

  const absoluteUrl = resolveModelUrl(path);
  loadedBuffers.delete(absoluteUrl);
  inFlightBuffers.delete(absoluteUrl);
  loadedScenes.delete(absoluteUrl);
}

function parseGltfScene(path: string, buffer: ArrayBuffer): Promise<Object3D> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    configureProductGltfLoader(loader);
    loader.parse(
      buffer,
      resolveModelUrl(path),
      (gltf) => resolve(gltf.scene),
      (error) => reject(error)
    );
  });
}

/** Fetch + parse a GLB and cache both the buffer and parsed scene. */
export function loadGltfScene(path: string): Promise<Object3D> {
  const absoluteUrl = resolveModelUrl(path);
  const cachedScene = loadedScenes.get(absoluteUrl);
  if (cachedScene) return cachedScene;

  const task = fetchModelBuffer(path)
    .then((buffer) => parseGltfScene(path, buffer))
    .catch((error) => {
      loadedScenes.delete(absoluteUrl);
      throw error;
    });

  loadedScenes.set(absoluteUrl, task);
  return task;
}

/** Hero-critical preload used before mounting the Three.js canvas. */
export function warmModel(path: string): Promise<Object3D> {
  return loadGltfScene(path);
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
