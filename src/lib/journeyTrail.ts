export const JOURNEY_COLORS = {
  green: "#7AC943",
  yellow: "#F7D547",
  orange: "#FF9800",
  red: "#E53935",
} as const;

export type Breakpoint = "mobile" | "tablet" | "desktop";

export type Waypoint = { x: number; y: number };

/** Normalized waypoints (x/y as 0–1 fractions) weaving around page content. */
export const JOURNEY_WAYPOINTS: Record<Breakpoint, Waypoint[]> = {
  mobile: [
    { x: 0.9, y: 0.03 },
    { x: 0.88, y: 0.1 },
    { x: 0.82, y: 0.18 },
    { x: 0.14, y: 0.28 },
    { x: 0.08, y: 0.38 },
    { x: 0.1, y: 0.48 },
    { x: 0.08, y: 0.58 },
    { x: 0.12, y: 0.68 },
    { x: 0.88, y: 0.76 },
    { x: 0.9, y: 0.84 },
    { x: 0.52, y: 0.92 },
    { x: 0.12, y: 0.98 },
  ],
  tablet: [
    { x: 0.88, y: 0.03 },
    { x: 0.86, y: 0.11 },
    { x: 0.72, y: 0.2 },
    { x: 0.1, y: 0.3 },
    { x: 0.07, y: 0.4 },
    { x: 0.09, y: 0.5 },
    { x: 0.07, y: 0.6 },
    { x: 0.12, y: 0.7 },
    { x: 0.78, y: 0.78 },
    { x: 0.82, y: 0.86 },
    { x: 0.5, y: 0.93 },
    { x: 0.1, y: 0.98 },
  ],
  desktop: [
    { x: 0.86, y: 0.03 },
    { x: 0.84, y: 0.1 },
    { x: 0.7, y: 0.19 },
    { x: 0.08, y: 0.29 },
    { x: 0.06, y: 0.39 },
    { x: 0.08, y: 0.49 },
    { x: 0.06, y: 0.59 },
    { x: 0.1, y: 0.69 },
    { x: 0.74, y: 0.77 },
    { x: 0.78, y: 0.85 },
    { x: 0.5, y: 0.92 },
    { x: 0.1, y: 0.98 },
  ],
};

export function getBreakpoint(width: number): Breakpoint {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function waypointsToSmoothPath(
  waypoints: Waypoint[],
  width: number,
  height: number
): string {
  if (waypoints.length < 2) return "";

  const points = waypoints.map((w) => ({
    x: w.x * width,
    y: w.y * height,
  }));

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

export function samplePathPoints(
  path: SVGPathElement,
  spacing: number
): { x: number; y: number }[] {
  const length = path.getTotalLength();
  if (length <= 0) return [];

  const count = Math.max(2, Math.floor(length / spacing));
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= count; i++) {
    const point = path.getPointAtLength((i / count) * length);
    points.push({ x: point.x, y: point.y });
  }

  return points;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Maps scroll progress (0–1) to green → yellow → orange → red. */
export function getJourneyColor(progress: number): string {
  const t = easeOutCubic(Math.max(0, Math.min(1, progress)));

  if (t <= 1 / 3) {
    return lerpColor(JOURNEY_COLORS.green, JOURNEY_COLORS.yellow, t * 3);
  }
  if (t <= 2 / 3) {
    return lerpColor(
      JOURNEY_COLORS.yellow,
      JOURNEY_COLORS.orange,
      (t - 1 / 3) * 3
    );
  }
  return lerpColor(JOURNEY_COLORS.orange, JOURNEY_COLORS.red, (t - 2 / 3) * 3);
}

export function getDotSpacing(width: number): number {
  if (width < 640) return 26;
  if (width < 1024) return 28;
  return 32;
}

export function getDotRadius(width: number): number {
  if (width < 640) return 3;
  return 3.5;
}
