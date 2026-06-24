import { Texture } from "three";
import type { GLTFLoader } from "three-stdlib";

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

class EmbeddedImageFixPlugin {
  constructor(parser: GltfParser) {
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
}

let configuredLoaders: WeakSet<GLTFLoader> | null = null;

/** Reliable embedded-texture loading for large GLB files in Next.js dev. */
export function configureProductGltfLoader(loader: GLTFLoader) {
  loader.setCrossOrigin("anonymous");

  configuredLoaders ??= new WeakSet();
  if (configuredLoaders.has(loader)) return;
  configuredLoaders.add(loader);

  loader.register(
    (parser) => new EmbeddedImageFixPlugin(parser as unknown as GltfParser)
  );
}

export const gltfLoaderOptions = {
  useDraco: false as const,
  useMeshopt: false as const,
  extendLoader: configureProductGltfLoader,
};
