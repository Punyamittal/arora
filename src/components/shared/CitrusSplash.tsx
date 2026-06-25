import { cn } from "@/lib/utils";

interface CitrusSplashProps {
  className?: string;
  color?: "yellow" | "green" | "white";
  size?: number;
}

export function CitrusSplash({
  className,
  color = "yellow",
  size = 400,
}: CitrusSplashProps) {
  const fillMap = {
    yellow: { main: "#F7D547", light: "#FFF3B0", dark: "#E8C030" },
    green: { main: "#9ACD32", light: "#C8E86C", dark: "#4CAF50" },
    white: { main: "#FFFFFF", light: "#F5F5F5", dark: "#E8E8E8" },
  };
  const c = fillMap[color];

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={cn("pointer-events-none h-auto max-w-full", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id={`splash-grad-${color}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.light} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.main} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {/* Main splash blob */}
      <ellipse cx="200" cy="200" rx="160" ry="140" fill={`url(#splash-grad-${color})`} opacity="0.7" />
      {/* Splash arcs */}
      <path
        d="M80 180 Q60 120 100 80 Q140 60 180 100 Q200 70 240 90 Q280 50 320 100 Q350 140 300 180"
        fill="none"
        stroke={c.main}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M100 220 Q70 280 120 320 Q160 350 200 300 Q240 360 280 320 Q320 280 300 240"
        fill="none"
        stroke={c.dark}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Droplets */}
      {[
        [120, 100],
        [280, 90],
        [90, 280],
        [310, 260],
        [200, 60],
        [60, 200],
        [340, 180],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={6 + (i % 3) * 3}
          fill={c.light}
          opacity={0.7 - i * 0.05}
        />
      ))}
    </svg>
  );
}
