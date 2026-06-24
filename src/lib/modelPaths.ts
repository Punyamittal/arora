export const MODEL_PATHS = {
  arora: "/models/arora.glb",
  lemon: "/models/lemon.glb",
  mint2: "/models/mint2.glb",
} as const;

/** Hero-critical models — lemon loads lazily below the fold. */
export const CRITICAL_MODEL_PATHS = [MODEL_PATHS.arora, MODEL_PATHS.mint2] as const;
