"use client";

import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, useGLTF } from "@react-three/drei";
import {
  MathUtils,
  MeshStandardMaterial,
  SRGBColorSpace,
  type Group,
  type Material,
  type Mesh,
  type Object3D,
  type Texture,
} from "three";
import { cn } from "@/lib/utils";
import { gltfLoaderOptions } from "@/lib/gltfLoader";

const DEFAULT_MODEL_PATH = "/models/arora.glb";
const MODEL_PATHS = [
  DEFAULT_MODEL_PATH,
  "/models/lemon.glb",
  "/models/mint2.glb",
] as const;

for (const path of MODEL_PATHS) {
  useGLTF.preload(
    path,
    gltfLoaderOptions.useDraco,
    gltfLoaderOptions.useMeshopt,
    gltfLoaderOptions.extendLoader
  );
}

const COLOR_TEXTURE_KEYS = ["map", "emissiveMap"] as const;
const DATA_TEXTURE_KEYS = [
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "aoMap",
] as const;

function cloneSceneWithMaterials(source: Object3D): Object3D {
  const cloned = source.clone(true);

  cloned.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) return;

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map((material) => material.clone())
      : mesh.material.clone();
  });

  prepareMaterials(cloned);
  return cloned;
}

function prepareMaterials(object: Object3D) {
  object.traverse((node) => {
    if (!(node as Mesh).isMesh) return;

    const mesh = node as Mesh;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material) => {
      if (!material) return;

      COLOR_TEXTURE_KEYS.forEach((key) => {
        const texture = (material as Material & Record<string, Texture | null>)[key];
        if (!texture) return;
        texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
      });

      DATA_TEXTURE_KEYS.forEach((key) => {
        const texture = (material as Material & Record<string, Texture | null>)[key];
        if (!texture) return;
        texture.needsUpdate = true;
      });

      if (!(material instanceof MeshStandardMaterial)) return;

      // Exports like arora.glb ship with metallicFactor: 1, which makes label
      // art read as chrome under studio lighting instead of showing colour.
      if (material.map && material.metalness >= 0.95) {
        material.metalness = 0.12;
        material.metalnessMap = null;
        material.roughness = Math.min(material.roughness, 0.55);
      }

      material.needsUpdate = true;
    });
  });
}

const sizeMap = {
  sm: { width: 180, height: 240 },
  md: { width: 220, height: 300 },
  lg: { width: 280, height: 380 },
  xl: { width: 340, height: 480 },
  "2xl": { width: 460, height: 620 },
};

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

const CLUSTER_LAYOUTS: Record<
  number,
  { position: [number, number, number]; scaleMul: number; phaseOffset: number }[]
> = {
  5: [
    { position: [0, 0, 0], scaleMul: 1, phaseOffset: 0 },
    { position: [-1.05, 0.42, 0.25], scaleMul: 0.78, phaseOffset: 1.1 },
    { position: [0.95, 0.38, 0.1], scaleMul: 0.82, phaseOffset: 2.3 },
    { position: [-0.62, -0.48, 0.2], scaleMul: 0.72, phaseOffset: 3.5 },
    { position: [0.78, -0.44, 0.28], scaleMul: 0.74, phaseOffset: 4.7 },
  ],
};

interface ModelProps {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
  motionIntensity?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  phaseOffset?: number;
  pointer: MutableRefObject<PointerState>;
  followCursor?: boolean;
}

function AroraModel({
  modelPath,
  scale = 2.2,
  autoRotate = true,
  rotateSpeed = 0.35,
  motionIntensity = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  phaseOffset = 0,
  pointer,
  followCursor = true,
}: ModelProps) {
  const groupRef = useRef<Group>(null);
  const autoRotY = useRef(0);
  const elapsed = useRef(0);
  const { scene } = useGLTF(
    modelPath,
    gltfLoaderOptions.useDraco,
    gltfLoaderOptions.useMeshopt,
    gltfLoaderOptions.extendLoader
  );
  const model = useMemo(() => cloneSceneWithMaterials(scene), [scene]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    elapsed.current += delta;

    if (autoRotate) {
      autoRotY.current += delta * rotateSpeed;
    }

    const [baseTiltX, , baseTiltZ] = rotation;
    const influence = followCursor && pointer.current.active ? 1 : 0;
    const px = pointer.current.x * influence;
    const py = pointer.current.y * influence;
    const motion = motionIntensity;

    const t = elapsed.current + phaseOffset;
    const floatY = Math.sin(t * 1.6) * 0.1 * motion;
    const floatX = Math.cos(t * 1.2) * 0.06 * motion;
    const floatRotX = Math.sin(t * 1.4) * 0.08 * motion;
    const floatRotZ = Math.cos(t * 1.1) * 0.05 * motion;

    const targetRotX = baseTiltX + py * 0.42 * motion + floatRotX;
    const targetRotY = autoRotY.current + px * 0.55 * motion;
    const targetRotZ = baseTiltZ - px * 0.2 * motion + floatRotZ;
    const targetPosX = px * 0.34 * motion + floatX;
    const targetPosY = py * 0.26 * motion + floatY;

    const lerpFactor = 1 - Math.exp(-12 * delta);

    group.rotation.x = MathUtils.lerp(group.rotation.x, targetRotX, lerpFactor);
    group.rotation.y = MathUtils.lerp(group.rotation.y, targetRotY, lerpFactor);
    group.rotation.z = MathUtils.lerp(group.rotation.z, targetRotZ, lerpFactor);
    group.position.x = MathUtils.lerp(group.position.x, targetPosX, lerpFactor);
    group.position.y = MathUtils.lerp(group.position.y, targetPosY, lerpFactor);
  });

  return (
    <group ref={groupRef} position={position}>
      <Center scale={scale}>
        <primitive object={model} />
      </Center>
    </group>
  );
}

function Scene({
  modelPath,
  scale,
  autoRotate,
  rotateSpeed,
  motionIntensity,
  rotation,
  pointer,
  followCursor,
  count = 1,
}: {
  modelPath: string;
  scale?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
  motionIntensity?: number;
  rotation?: [number, number, number];
  pointer: MutableRefObject<PointerState>;
  followCursor?: boolean;
  count?: number;
}) {
  const instances =
    count > 1 && CLUSTER_LAYOUTS[count]
      ? CLUSTER_LAYOUTS[count]
      : [{ position: [0, 0, 0] as [number, number, number], scaleMul: 1, phaseOffset: 0 }];

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />
      <spotLight position={[0, 8, 4]} intensity={0.8} angle={0.4} penumbra={0.5} />
      <Suspense fallback={null}>
        {instances.map((instance, index) => (
          <AroraModel
            key={index}
            modelPath={modelPath}
            scale={(scale ?? 2.2) * instance.scaleMul}
            autoRotate={autoRotate}
            rotateSpeed={rotateSpeed}
            motionIntensity={motionIntensity}
            rotation={rotation}
            position={instance.position}
            phaseOffset={instance.phaseOffset}
            pointer={pointer}
            followCursor={followCursor}
          />
        ))}
        <Environment preset="studio" />
      </Suspense>
    </>
  );
}

export interface ProductModel3DProps {
  modelPath?: string;
  scale?: number;
  size?: keyof typeof sizeMap;
  className?: string;
  autoRotate?: boolean;
  rotateSpeed?: number;
  motionIntensity?: number;
  tilt?: number;
  followCursor?: boolean;
  count?: number;
  cameraDistance?: number;
}

export function ProductModel3D({
  modelPath = DEFAULT_MODEL_PATH,
  scale,
  size = "lg",
  className,
  autoRotate = true,
  rotateSpeed = 0.35,
  motionIntensity = 1,
  tilt = 0,
  followCursor = true,
  count = 1,
  cameraDistance = 4.2,
}: ProductModel3DProps) {
  const dimensions = sizeMap[size];
  const tiltRad = (tilt * Math.PI) / 180;
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!followCursor) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: -(event.clientY - rect.top) / rect.height + 0.5,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointer.current = { x: 0, y: 0, active: false };
  };

  return (
    <div
      className={cn("relative", className)}
      style={{ width: dimensions.width, height: dimensions.height }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        camera={{ position: [0, 0.15, cameraDistance], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene
          modelPath={modelPath}
          scale={scale}
          autoRotate={autoRotate}
          rotateSpeed={rotateSpeed}
          motionIntensity={motionIntensity}
          rotation={[tiltRad, 0, 0]}
          pointer={pointer}
          followCursor={followCursor}
          count={count}
        />
      </Canvas>
    </div>
  );
}
