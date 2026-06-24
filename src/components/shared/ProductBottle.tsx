import { cn } from "@/lib/utils";

type BottleVariant = "classic" | "mint" | "berry";

interface ProductBottleProps {
  variant?: BottleVariant;
  className?: string;
}

const liquidColors: Record<BottleVariant, string> = {
  classic: "from-[#f7d547]/80 to-[#e8c030]/60",
  mint: "from-[#9acd32]/80 to-[#4caf50]/60",
  berry: "from-[#f8b4d9]/80 to-[#e91e8c]/60",
};

const capColors: Record<BottleVariant, string> = {
  classic: "bg-gray-300",
  mint: "bg-gray-300",
  berry: "bg-gray-300",
};

export function ProductBottle({ variant = "classic", className }: ProductBottleProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Tag */}
      <div className="absolute -top-2 z-10 w-8 h-10 bg-[#d4a574] rounded-sm shadow-md flex items-center justify-center">
        <span className="text-[6px] font-bold text-white rotate-[-5deg]">AL</span>
      </div>

      {/* Cap */}
      <div
        className={cn(
          "w-10 h-5 rounded-t-lg shadow-md relative z-10",
          capColors[variant]
        )}
      />

      {/* Neck */}
      <div className="w-8 h-4 bg-white/30 border border-white/40 -mt-1 relative z-10" />

      {/* Bottle */}
      <div className="relative w-20 h-44 -mt-1">
        <div className="absolute inset-0 rounded-b-3xl rounded-t-lg border-2 border-white/50 bg-white/10 backdrop-blur-sm overflow-hidden shadow-xl">
          {/* Liquid */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-t",
              liquidColors[variant]
            )}
          />

          {/* Label */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[85%] rounded-xl bg-white/95 px-2 py-3 shadow-md text-center">
            <p className="font-heading text-[7px] font-bold tracking-widest text-leaf">ARORA</p>
            <p className="font-heading text-sm font-bold text-[#1a1a1a]">LEMON</p>
            <div className="w-5 h-5 mx-auto mt-1 rounded-full bg-gradient-to-br from-lemon to-lime flex items-center justify-center text-[8px]">
              🍋
            </div>
          </div>

          {/* Glass reflection */}
          <div className="absolute top-2 left-2 w-2 h-24 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}
