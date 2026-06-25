"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { ProductModel3DProps } from "./AroraCanModel";
import { ModelPlaceholder } from "./ModelPlaceholder";

const AroraCanModel = dynamic(
  () => import("./AroraCanModel").then((mod) => mod.ProductModel3D),
  {
    ssr: false,
    loading: () => <ModelPlaceholder />,
  }
);

const sizeMap = {
  sm: "h-52 w-36 sm:h-60 sm:w-44",
  md: "h-56 w-40 sm:h-64 sm:w-48 md:h-72 md:w-52",
  lg: "h-64 w-44 sm:h-80 sm:w-56 md:h-96 md:w-72",
  xl: "h-[min(20rem,52vh)] w-[min(14rem,72vw)] sm:h-[26rem] sm:w-72 md:h-[30rem] md:w-80",
  "2xl":
    "h-[min(24rem,58vh)] w-full max-w-[18rem] sm:h-[32rem] sm:max-w-[24rem] md:h-[38rem] md:max-w-[28rem]",
};

export function ProductModel3D(props: ProductModel3DProps) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-full shrink-0",
        sizeMap[props.size ?? "lg"],
        props.className
      )}
    >
      <AroraCanModel {...props} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
