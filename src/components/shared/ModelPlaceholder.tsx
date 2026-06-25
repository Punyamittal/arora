import { cn } from "@/lib/utils";

export function ModelPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-full w-full animate-pulse rounded-[2rem] bg-lemon/10",
        className
      )}
    />
  );
}
