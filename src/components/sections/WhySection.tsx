"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { ProductModel3D } from "@/components/shared/ProductModel3D";
import { cn } from "@/lib/utils";

function HandRevealImage({
  className,
  imageClassName,
  isVisible,
}: {
  className?: string;
  imageClassName?: string;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={isVisible ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Image
        src="/hand.png"
        alt="Hand holding Arora Lemon"
        width={560}
        height={690}
        sizes="(min-width: 1024px) 34vw, 90vw"
        className={cn("h-auto object-contain object-left-bottom", imageClassName)}
      />
    </motion.div>
  );
}

const features = [
  {
    title: "Real Lemons",
    description: "Squeezed from sun-ripened citrus for authentic, bright flavour in every drop.",
  },
  {
    title: "Natural Ingredients",
    description: "Only what nature provides — no artificial colours, flavours, or sweeteners.",
  },
  {
    title: "Instant Refreshment",
    description: "Crisp, energising taste that awakens your senses and lifts your mood instantly.",
  },
  {
    title: "No Artificial Preservatives",
    description: "Clean label promise. Pure refreshment you can trust, sip after sip.",
  },
];

export function WhySection() {
  const handTriggerRef = useRef<HTMLDivElement>(null);
  const isHandInView = useInView(handTriggerRef, { once: false, margin: "-80px" });

  return (
    <section
      id="about"
      className="relative overflow-x-clip overflow-y-visible bg-white px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-0 md:px-12 lg:px-20 xl:px-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative pb-8 pt-4 md:pb-12 md:pt-6">
          <div
            aria-hidden
            className="about-diagonal-panel pointer-events-none absolute -left-6 -right-6 inset-y-0 md:-left-12 md:-right-12 lg:-left-20 lg:-right-20"
          />

          <div className="relative z-10 grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionReveal direction="left" className="relative">
              <span className="text-sm font-semibold uppercase tracking-widest text-leaf">
                Why Arora Lemon
              </span>
              <h2 className="font-heading mt-4 text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-tight text-[#1a1a1a]">
                Nature Meets
                <br />
                Refreshment
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
                At ARORA LEMON, we believe refreshment should be as pure as nature
                intended. Every can is crafted with hand-selected lemons, sparkling
                spring water, and a commitment to quality that you can taste from
                the very first sip.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
                Born from a passion for authentic flavour and modern living, our
                beverages deliver the perfect balance of tangy citrus brightness
                and smooth, satisfying refreshment.
              </p>
              <div className="mt-8">
                <MagneticButton variant="green">Discover Our Story</MagneticButton>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" className="flex items-center justify-center px-2 sm:px-0">
              <ProductModel3D
                modelPath="/models/lemon.glb"
                scale={6.5}
                size="2xl"
                className="mx-auto"
                cameraDistance={3.4}
                autoRotate
                rotateSpeed={0.65}
                motionIntensity={1.9}
              />
            </SectionReveal>
          </div>
        </div>

        <div ref={handTriggerRef} className="relative z-10 mt-10 sm:mt-16">
          <div className="flex flex-col gap-5 sm:gap-7 lg:ml-auto lg:max-w-lg">
            {features.map((feature, i) => (
              <SectionReveal key={feature.title} delay={i * 0.1} direction="right">
                <div className="py-1">
                  <h3 className="font-artistic text-2xl font-semibold leading-snug tracking-tight text-[#1a1a1a] sm:text-[1.75rem] md:text-[2rem]">
                    {feature.title}
                  </h3>
                  <p className="font-artistic mt-2 text-base font-normal italic leading-relaxed text-muted-foreground md:text-lg">
                    {feature.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>

      <HandRevealImage
        isVisible={isHandInView}
        className="pointer-events-none absolute bottom-0 left-5 z-20 -ml-6 hidden md:left-6 md:-ml-12 md:block lg:left-8 lg:-ml-20 xl:left-10 xl:-ml-28"
        imageClassName="w-[min(34vw,560px)]"
      />
    </section>
  );
}
