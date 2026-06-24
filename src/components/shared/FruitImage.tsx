import Image from "next/image";
import { cn } from "@/lib/utils";

const ASSETS = {
  lemonHalf:
    "https://images.unsplash.com/photo-1590502593747-42a996133352?w=400&q=80&auto=format&fit=crop",
  lemonSlice:
    "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=300&q=80&auto=format&fit=crop",
  mint:
    "https://images.unsplash.com/photo-1628556270448-4d4e1f2e8e0b?w=300&q=80&auto=format&fit=crop",
  berry:
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80&auto=format&fit=crop",
  wholeLemon:
    "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80&auto=format&fit=crop",
};

interface FruitImageProps {
  type: keyof typeof ASSETS;
  className?: string;
  size?: number;
  alt?: string;
}

export function FruitImage({ type, className, size = 120, alt }: FruitImageProps) {
  return (
    <div
      className={cn("relative drop-shadow-2xl", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={ASSETS[type]}
        alt={alt ?? type}
        fill
        className="object-contain"
        sizes={`${size}px`}
        unoptimized
      />
    </div>
  );
}

export { ASSETS };
