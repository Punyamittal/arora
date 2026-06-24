"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { ProductModel3DProps } from "./AroraCanModel";

const AroraCanModel = dynamic(
  () => import("./AroraCanModel").then((mod) => mod.ProductModel3D),
  { ssr: false }
);

export function ProductModel3D(props: ProductModel3DProps) {
  const sizeMap = {
    sm: "h-60 w-44",
    md: "h-72 w-52",
    lg: "h-96 w-72",
    xl: "h-[30rem] w-80",
    "2xl": "h-[38rem] w-[28rem]",
  };

  return (
    <div className={cn("relative", sizeMap[props.size ?? "lg"], props.className)}>
      <AroraCanModel {...props} className="h-full w-full" />
    </div>
  );
}
