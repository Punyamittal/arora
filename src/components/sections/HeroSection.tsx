"use client";

import { motion } from "framer-motion";
import { smoothEase } from "@/lib/motion";
import { ProductModel3D } from "@/components/shared/ProductModel3D";
import { CitrusSplash } from "@/components/shared/CitrusSplash";
import { MintAccent } from "@/components/shared/MintAccent";

const titleContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.25 },
  },
};

const titleLineContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const letterPop = {
  hidden: { opacity: 0, scale: 0.35, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 520,
      damping: 16,
      mass: 0.55,
    },
  },
};

function PopLine({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span variants={titleLineContainer} className="block">
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${text}-${index}`}
          variants={letterPop}
          className={`inline-block origin-bottom ${className ?? ""}`}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] hero-gradient overflow-x-clip overflow-y-hidden">
      <div className="section-padding mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center gap-8 pt-28 sm:gap-10 sm:pt-32 md:pt-36 lg:flex-row lg:gap-8 lg:pt-40">
        {/* Left content */}
        <motion.div
          className="relative z-10 w-full flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: smoothEase }}
        >
          <MintAccent
            seed="hero-headline"
            className="right-0 top-2 hidden sm:block lg:-right-6 lg:top-6"
          />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: smoothEase }}
            className="inline-block rounded-full border border-leaf/30 bg-leaf/10 px-5 py-2 text-sm font-medium text-leaf"
          >
            100% Natural Refreshment
          </motion.span>

          <motion.h1
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            className="font-heading mt-4 text-[clamp(2.75rem,12vw,6rem)] font-bold leading-[0.95] tracking-tight text-[#1a1a1a] sm:mt-6"
          >
            <PopLine text="ARORA" />
            <PopLine text="LEMON" className="text-gradient-lemon" />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.75, duration: 0.8, ease: smoothEase }}
            className="font-heading mt-3 text-xl font-semibold text-[#1a1a1a]/80 sm:mt-4 sm:text-2xl md:text-3xl"
          >
            Natural Refreshment
            <br />
            In Every Sip
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.95, duration: 0.8, ease: smoothEase }}
            className="mt-4 max-w-md px-2 text-base text-muted-foreground sm:mt-6 sm:px-0 sm:text-lg lg:mx-0 mx-auto"
          >
            Crafted from fresh lemons, natural ingredients, and pure refreshment
            for modern lifestyles.
          </motion.p>
        </motion.div>

        {/* Right — product visual */}
        <motion.div
          className="relative flex w-full max-w-sm flex-1 items-center justify-center sm:max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: smoothEase }}
        >
          {/* Splash behind */}
          <motion.div
            className="absolute scale-75 sm:scale-90 md:scale-100"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <CitrusSplash
              color="yellow"
              size={500}
              className="max-w-[min(100vw,28rem)] opacity-80"
            />
          </motion.div>

          {/* 3D product model */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-full"
          >
            <ProductModel3D size="xl" autoRotate />
            <MintAccent
              seed="hero-arora-mint"
              modelPath="/models/mint2.glb"
              className="right-0 bottom-0 z-20 hidden translate-x-1/4 translate-y-1/4 sm:block md:translate-x-1/3"
              scale={2.2}
            />
          </motion.div>

          {/* Particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-lemon/60 gpu-smooth"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 4) * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:bottom-8 sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-[#1a1a1a]/20 flex items-start justify-center p-1.5">
          <div className="h-2 w-1 rounded-full bg-leaf" />
        </div>
      </motion.div>
    </section>
  );
}
