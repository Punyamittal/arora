import { cn } from "@/lib/utils";

type CanVariant = "classic" | "mint" | "berry";

interface ProductCanProps {
  variant?: CanVariant;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tilt?: number;
}

const variantGradients: Record<CanVariant, string> = {
  classic: "from-[#f7d547] via-[#e8c030] to-[#9acd32]",
  mint: "from-[#c8e86c] via-[#9acd32] to-[#4caf50]",
  berry: "from-[#f8b4d9] via-[#e91e8c] to-[#c2185b]",
};

const variantGlow: Record<CanVariant, string> = {
  classic: "glow-lemon",
  mint: "glow-lime",
  berry: "glow-berry",
};

const sizes = {
  sm: "w-28 h-72",
  md: "w-36 h-96",
  lg: "w-44 h-[28rem]",
  xl: "w-52 h-[32rem]",
};

export function ProductCan({
  variant = "classic",
  className,
  size = "lg",
  tilt = 0,
}: ProductCanProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* Glow behind can */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-3xl opacity-60 scale-75",
          variant === "classic" && "bg-lemon",
          variant === "mint" && "bg-lime",
          variant === "berry" && "bg-berry"
        )}
      />

      {/* Can body */}
      <div
        className={cn(
          "relative can-condensation rounded-[2rem] bg-gradient-to-b shadow-2xl",
          variantGradients[variant],
          variantGlow[variant],
          sizes[size]
        )}
      >
        {/* Top rim */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[88%] h-6 rounded-t-full bg-gradient-to-b from-gray-300 to-gray-400 shadow-inner" />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[82%] h-3 rounded-full bg-gradient-to-b from-gray-200 to-gray-300" />

        {/* Pull tab area */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 opacity-80" />

        {/* Label */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[78%] rounded-2xl bg-white/90 backdrop-blur-sm px-3 py-6 shadow-lg border border-white/60">
          <div className="text-center">
            <p className="font-heading text-[10px] font-bold tracking-[0.2em] text-leaf uppercase">
              Arora
            </p>
            <p className="font-heading text-xl font-bold text-[#1a1a1a] leading-tight mt-1">
              LEMON
            </p>
            <div className="mt-2 mx-auto w-8 h-8 rounded-full bg-gradient-to-br from-lemon to-lime flex items-center justify-center">
              <span className="text-sm">🍋</span>
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 tracking-wider uppercase">
              {variant === "classic" && "Classic"}
              {variant === "mint" && "Mint"}
              {variant === "berry" && "Berry"}
            </p>
          </div>
        </div>

        {/* Bottom curve highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-[2rem] bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

        {/* Side highlight */}
        <div className="absolute top-0 left-3 w-4 h-full bg-gradient-to-r from-white/30 to-transparent rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
